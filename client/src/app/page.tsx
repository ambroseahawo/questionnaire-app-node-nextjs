'use client';

import QuestionnaireModal from '@/components/Modal';
import Navbar from '@/components/Navbar';
import Spinner from '@/components/Spinner';
import Toast from '@/components/Toast';
import { Questionnaire } from '@/types/questionnaire';
import { createQuestionnaire, deleteQuestionnaire, getQuestionnaires, updateQuestionnaire } from '@/utils/api';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const HomePage: React.FC = () => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [modalState, setModalState] = useState<{ isOpen: boolean; mode: 'create' | 'edit'; questionnaire?: Questionnaire }>({
    isOpen: false,
    mode: 'create',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  const defaultQuestionnaire: Questionnaire = {
    _id: '',
    title: '',
    questions: [
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
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getQuestionnaires();
        console.log(data)
        setQuestionnaires(data);
      } catch (error) {
        console.error('Error fetching questionnaires:', error);
        setToast({ message: 'Failed to fetch questionnaires', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleModalOpen = (mode: 'create' | 'edit', questionnaire?: Questionnaire) => {
    if (mode === 'create') {
      setModalState({ isOpen: true, mode, questionnaire: defaultQuestionnaire });
    } else {
      setModalState({ isOpen: true, mode, questionnaire });
    }
  };

  const handleModalClose = () => {
    setModalState({ isOpen: false, mode: 'create' });
  };

  const handleSave = async (questionnaire: Questionnaire) => {
    try {
      let response: Questionnaire;

      if (modalState.mode === 'create') {
        const cleanedQuestionnaire = {
          title: questionnaire.title,
          questions: questionnaire.questions.map((q) => ({
            question: q.question,
            answers: q.answers.map((a) => ({
              text: a.text,
              weight: a.weight,
              isCorrect: a.isCorrect,
            })),
          })),
        };

        response = await createQuestionnaire(cleanedQuestionnaire);
        setQuestionnaires((prev) => [response, ...prev]);
        setToast({ message: 'Questionnaire created successfully!', type: 'success' });
      } else if (modalState.mode === 'edit') {
        const cleanedQuestionnaire = {
          title: questionnaire.title,
          questions: questionnaire.questions.map((q) => ({
            _id: q._id,
            question: q.question,
            answers: q.answers.map((a) => ({
              _id: a._id,
              text: a.text,
              weight: a.weight,
              isCorrect: a.isCorrect,
            })),
          })),
        };

        response = await updateQuestionnaire(questionnaire._id, cleanedQuestionnaire);
        setQuestionnaires((prev) => prev.map((q) => (q._id === response._id ? response : q)));
        setToast({ message: 'Questionnaire updated successfully!', type: 'success' });
      }

      handleModalClose();
    } catch (error) {
      console.log((error as Error)?.message);
      setToast({ message: (error as Error)?.message || 'Failed to save questionnaire', type: 'error' });
    }
  };

  const handleQuestionnaireClick = (id: string) => {
    router.push(`/questionnaires/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteQuestionnaire(id);
      setQuestionnaires((prev) => prev.filter((q) => q._id !== id));
      setToast({ message: 'Questionnaire deleted successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: (error as Error)?.message || 'Failed to delete questionnaire', type: 'error' });
    }
  };

  return (
    <div>
      <Navbar />
      <main className="pt-16 p-4">
        {modalState.isOpen && (
          <QuestionnaireModal
            isOpen={modalState.isOpen}
            onClose={handleModalClose}
            questionnaire={modalState.questionnaire}
            onSave={handleSave}
          />
        )}
        <button
          onClick={() => handleModalOpen('create')}
          className="bg-blue-500 text-white py-2 px-4 rounded mb-4 text-sm md:text-base"
        >
          Create
        </button>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : questionnaires.length === 0 ? (
          <p>No questionnaires available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Title</th>
                  <th className="py-2 px-4 border-b text-left text-center hidden sm:table-cell">Questions</th>
                  <th className="py-2 px-4 border-b text-left text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questionnaires.map((q) => (
                  <tr key={q._id} className="border-b">
                    <td className="py-2 px-4">
                      <a
                        href={`/questionnaires/${q._id}`}
                        className="text-blue-600 underline cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          handleQuestionnaireClick(q._id);
                        }}
                      >
                        {q.title}
                      </a>
                    </td>
                    <td className="py-2 px-4 text-center hidden sm:table-cell">{q.questions.length}</td>
                    <td className="py-2 px-4 flex space-x-2 justify-end">
                      <button
                        onClick={() => handleModalOpen('edit', q)}
                        className="text-yellow-500 hover:text-yellow-600"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(q._id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default HomePage;
