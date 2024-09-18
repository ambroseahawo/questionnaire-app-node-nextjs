import { Questionnaire } from '@/types/questionnaire';
import { deleteQuestionnaire } from '@/utils/api';

interface QuestionnaireListProps {
  questionnaires: Questionnaire[];
  setIsModalOpen: (open: boolean) => void;
  setSelectedQuestionnaire: (questionnaire: Questionnaire | null) => void;
}

export default function QuestionnaireList({ questionnaires, setIsModalOpen, setSelectedQuestionnaire }: QuestionnaireListProps) {
  const handleEditClick = (questionnaire: Questionnaire) => {
    setSelectedQuestionnaire(questionnaire);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    await deleteQuestionnaire(id);
    window.location.reload(); // Refresh to reflect deletion
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {questionnaires.map((q) => (
        <div key={q._id} className="flex justify-between items-center p-4 border rounded-lg">
          <span className="text-lg font-semibold">{q.title}</span>
          <div className="flex space-x-4">
            <button className="btn btn-edit" onClick={() => handleEditClick(q)}>Edit</button>
            <button className="btn btn-delete" onClick={() => handleDeleteClick(q._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
