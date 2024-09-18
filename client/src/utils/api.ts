// Handles API requests for creating, updating, deleting, and fetching questionnaires.
import { Questionnaire } from '@/types/questionnaire';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
const BASE_URL = `${BACKEND_URL}/api/questionnaires`;

// Define the type for submitAnswers response
interface SubmitAnswersResponse {
  score: number;
}

// Helper function to extract error message
const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const errorMsg = error.response?.data?.error || 'An unexpected error occurred';
    if (errorMsg.includes('title_1 dup key')) {
      return 'Questionnaire title already exists';
    }
    return errorMsg;
  }
  return 'An unexpected error occurred';
};


export const getQuestionnaires = async (): Promise<Questionnaire[]> => {
  try {
    const response = await axios.get<Questionnaire[]>(`${BASE_URL}/all`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getQuestionnaire = async (id: string): Promise<Questionnaire> => {
  try {
    const response = await axios.get<Questionnaire>(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createQuestionnaire = async (data: Omit<Questionnaire, '_id'>): Promise<Questionnaire> => {
  try {
    const response = await axios.post<Questionnaire>(`${BASE_URL}/create`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.log(error)
    throw new Error(getErrorMessage(error));
  }
};

export const updateQuestionnaire = async (id: string, data: Omit<Questionnaire, '_id'>): Promise<Questionnaire> => {
  try {
    const response = await axios.put<Questionnaire>(`${BASE_URL}/${id}/update`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteQuestionnaire = async (id: string): Promise<void> => {
  try {
    await axios.delete<void>(`${BASE_URL}/${id}/delete`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const submitAnswers = async (id: string, answerIds: string[]): Promise<SubmitAnswersResponse> => {
  try {
    const response = await axios.post<SubmitAnswersResponse>(`${BASE_URL}/${id}/submit`, { answers: answerIds }, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
