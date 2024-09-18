export interface Answer {
  _id?: string;
  text: string;
  weight: number;
  isCorrect: boolean;
}

export interface Question {
  _id?: string;
  question: string;
  answers: Answer[];
}

export interface Questionnaire {
  _id: string; 
  title: string;
  questions: Question[];
}
