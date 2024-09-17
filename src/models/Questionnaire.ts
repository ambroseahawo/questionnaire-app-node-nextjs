import mongoose, { Document, Schema } from 'mongoose';

interface IAnswer {
  _id: mongoose.Types.ObjectId;
  text: string;
  weight: number;
  isCorrect: boolean;
}

interface IQuestion {
  question: string;
  answers: IAnswer[];
}

export interface IQuestionnaire extends Document {
  title: string;
  questions: IQuestion[];
}

const answerSchema = new Schema<IAnswer>({
  text: { type: String, required: true },
  weight: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
});

const questionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  answers: [answerSchema],
});

const questionnaireSchema = new Schema<IQuestionnaire>({
  title: { type: String, required: true },
  questions: [questionSchema],
});

const Questionnaire = mongoose.model<IQuestionnaire>('Questionnaire', questionnaireSchema);
export default Questionnaire;