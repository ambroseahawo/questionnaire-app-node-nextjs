"use client";

import Spinner from '@/components/Spinner'; // Spinner for the loading state
import { Answer, Question, Questionnaire } from '@/types/questionnaire'; // Ensure the correct path for your types
import { getQuestionnaire, submitAnswers } from '@/utils/api'; // Import the API functions
import { useParams } from 'next/navigation'; // Use useParams for dynamic routing
import React, { useEffect, useState } from 'react';

// Interface for tracking selected answers
interface SelectedAnswers {
  [questionId: string]: string; // Question ID as key, Answer ID as value
}

const QuestionnaireFillingPage: React.FC = () => {
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null); // Store questionnaire data
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({}); // Store selected answers
  const [submitted, setSubmitted] = useState<boolean>(false); // Track if the form is submitted
  const [score, setScore] = useState<number | null>(null); // Store the score after submission

  // Get the questionnaire ID from the URL
  const { id } = useParams(); // Use the parameter name as defined in the route

  // Fetch the questionnaire data dynamically using the getQuestionnaire API
  useEffect(() => {
    if (!id) return; // Exit if there's no ID

    const fetchQuestionnaire = async () => {
      try {
        const data: Questionnaire = await getQuestionnaire(id as string); // Fetch questionnaire data using the ID
        setQuestionnaire(data); // Set the fetched questionnaire data
      } catch (error) {
        console.error('Error fetching questionnaire:', error);
      } finally {
        setLoading(false); // Stop the loading spinner
      }
    };

    fetchQuestionnaire();
  }, [id]);

  // Handle change of selected answer
  const handleAnswerChange = (questionId: string, answerId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId, // Update the selected answer for the corresponding question
    }));
  };

  // Handle form submission using the submitAnswers API
  const handleSubmit = async () => {
    // Ensure all questions have been answered before submitting
    if (questionnaire && Object.keys(selectedAnswers).length !== questionnaire.questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setSubmitted(true); // Disable further changes once submitted

    try {
      if (questionnaire) {
        // Transform selected answers to an array of answer IDs
        const answerIds = Object.values(selectedAnswers);

        // Submit the answer IDs
        const response = await submitAnswers(id as string, answerIds); // Pass the questionnaire ID and answer IDs array
        setScore(response.score); // Set the score from the API response
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <Spinner />
    </div>
  ); // Show loading spinner centered while fetching data

  if (!questionnaire) return <p>Error loading questionnaire</p>; // Error state if questionnaire fails to load

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center">{questionnaire.title}</h1>
      <form className="max-w-xl mx-auto mt-4">
        {questionnaire.questions.map((q: Question) => (
          <div key={q._id} className="mb-4">
            <h2 className="text-lg mb-2">{q.question}</h2>
            <div className="space-y-2">
              {q.answers.map((answer: Answer) => (
                <label key={answer._id} className="block">
                  <input
                    type="radio"
                    name={q._id}
                    value={answer._id}
                    disabled={submitted} // Disable input after submitting
                    checked={selectedAnswers[q._id || ''] === answer._id}
                    onChange={() => handleAnswerChange(q._id || '', answer._id || '')}
                    className="mr-2"
                  />
                  {answer.text}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleSubmit}
          className={`bg-blue-500 text-white py-2 px-4 rounded ${submitted ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={submitted} // Disable button after submitting
        >
          Submit
        </button>
      </form>

      {/* Display the score immediately after the questionnaire */}
      {score !== null && (
        <div className="mt-6 text-center">
          <h2 className="text-xl">Your Score: {score}</h2>
        </div>
      )}
    </div>
  );
};

export default QuestionnaireFillingPage;
