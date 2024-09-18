import { Questionnaire } from '@/types/questionnaire';
import React, { useEffect, useState } from 'react';

interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionnaire?: Questionnaire;
  onSave: (questionnaire: Questionnaire) => void;
}

const QuestionnaireModal: React.FC<QuestionnaireModalProps> = ({ isOpen, onClose, questionnaire, onSave }) => {
  const [formData, setFormData] = useState<Questionnaire>({
    _id: '', 
    title: '',
    questions: [],
  });

  useEffect(() => {
    if (questionnaire) {
      setFormData(questionnaire);
    } else {
      setFormData({ _id: '', title: '', questions: [] });
    }
  }, [questionnaire]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trim() })); // Trim title on change
  };

  const handleQuestionChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [name]: value.trim(), // Trim question on change
    };
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleAnswerChange = (questionIndex: number, answerIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const updatedQuestions = [...formData.questions];
    const updatedAnswers = [...updatedQuestions[questionIndex].answers];

    const newValue = name === 'weight' ? (value === '' ? '' : Number(value)) : value.trim(); // Trim text values

    updatedAnswers[answerIndex] = {
      ...updatedAnswers[answerIndex],
      [name]: type === 'checkbox' ? checked : newValue,
    };

    if (name === 'isCorrect' && checked) {
      updatedAnswers.forEach((answer, idx) => {
        if (idx !== answerIndex) {
          answer.isCorrect = false;
        }
      });
    }

    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      answers: updatedAnswers,
    };

    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleAddQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          _id: '',
          question: '',
          answers: [
            { _id: '', text: '', weight: 0, isCorrect: false },
            { _id: '', text: '', weight: 0, isCorrect: false },
            { _id: '', text: '', weight: 0, isCorrect: false },
          ],
        },
      ],
    }));
  };

  const handleRemoveQuestion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleAnswerBlur = (questionIndex: number, answerIndex: number) => {
    const updatedQuestions = [...formData.questions];
    const updatedAnswers = updatedQuestions[questionIndex].answers;

    const currentAnswer = updatedAnswers[answerIndex].text.trim(); // Trim spaces

    if (currentAnswer && updatedAnswers.some((a, idx) => a.text.trim() === currentAnswer && idx !== answerIndex)) {
      alert('Each answer must have a unique text value.');
      updatedAnswers[answerIndex].text = ''; // Clear the duplicate input
    }

    updatedQuestions[questionIndex].answers = updatedAnswers;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleQuestionBlur = (index: number) => {
    const updatedQuestions = [...formData.questions];
    const currentQuestion = updatedQuestions[index].question.trim().toLowerCase(); // Trim spaces

    if (currentQuestion && updatedQuestions.some((q, idx) => q.question.trim().toLowerCase() === currentQuestion && idx !== index)) {
      alert('Each question must have a unique title.');
      updatedQuestions[index].question = ''; // Clear the duplicate input
    }

    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleSaveClick = () => {
    const isValid = formData.questions.every((q) =>
      q.question.trim() &&
      q.answers.every(a => a.text.trim() && !isNaN(a.weight)) && // Trim answer text
      new Set(q.answers.map(a => a.text.trim())).size === q.answers.length && // Ensure unique text
      new Set(q.answers.map(a => a.weight)).size === q.answers.length && // Ensure unique weight
      q.answers.filter(a => a.isCorrect).length === 1 // Ensure only one correct answer
    );

    const uniqueQuestions = new Set(formData.questions.map(q => q.question.trim().toLowerCase())).size === formData.questions.length;

    if (formData.title.trim() && formData.questions.length > 0 && isValid && uniqueQuestions) {
      onSave({
        ...formData,
        title: formData.title.trim(), // Trim title on save
        questions: formData.questions.map(q => ({
          ...q,
          question: q.question.trim(), // Trim question on save
          answers: q.answers.map(a => ({
            ...a,
            text: a.text.trim(), // Trim answer text on save
          })),
        })),
      });
    } else {
      alert('Please ensure all fields are filled correctly, including unique question titles and answer texts and weights, and exactly one correct answer per question.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg overflow-y-auto" style={{ maxHeight: '90vh' }}>
        <h2 className="text-xl font-bold mb-4">{questionnaire ? 'Edit Questionnaire' : 'Create Questionnaire'}</h2>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        {formData.questions.map((q, questionIndex) => (
          <div key={q._id || questionIndex} className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block" htmlFor={`question-${questionIndex}`}>Question {questionIndex + 1}</label>
              <button
                type="button"
                onClick={() => handleRemoveQuestion(questionIndex)}
                className="text-red-500 hover:text-red-700"
              >
                Remove Question
              </button>
            </div>
            <input
              type="text"
              name="question"
              id={`question-${questionIndex}`}
              value={q.question}
              onChange={(e) => handleQuestionChange(questionIndex, e)}
              onBlur={() => handleQuestionBlur(questionIndex)} // Uniqueness check on blur
              className="border p-2 w-full mb-2"
            />
            {q.answers.map((a, answerIndex) => (
              <div key={a._id || answerIndex} className="flex mb-2 items-center">
                <input
                  type="text"
                  name="text"
                  value={a.text}
                  onChange={(e) => handleAnswerChange(questionIndex, answerIndex, e)}
                  onBlur={() => handleAnswerBlur(questionIndex, answerIndex)} // Uniqueness check on blur
                  placeholder={`Answer ${answerIndex + 1}`}
                  className="border p-2 w-full mr-2"
                />
                <input
                  type="number"
                  name="weight"
                  value={a.weight}
                  onChange={(e) => handleAnswerChange(questionIndex, answerIndex, e)}
                  placeholder="Weight"
                  className="border p-2 w-24 mr-2"
                />
                <input
                  type="checkbox"
                  name="isCorrect"
                  checked={a.isCorrect}
                  onChange={(e) => handleAnswerChange(questionIndex, answerIndex, e)}
                  className="mr-2"
                />
                <label htmlFor={`isCorrect-${answerIndex}`}>Correct</label>
              </div>
            ))}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddQuestion}
          className="bg-blue-500 text-white py-1 px-2 rounded mt-2"
        >
          Add Question
        </button>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handleSaveClick}
            className="bg-green-500 text-white py-2 px-4 rounded mr-2"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireModal;
