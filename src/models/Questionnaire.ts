import mongoose, { Document, Schema } from 'mongoose';

interface IAnswer {
  _id?: mongoose.Types.ObjectId;
  text: string;
  weight: number;
  isCorrect: boolean;
}

interface IQuestion {
  _id?: Schema.Types.ObjectId;
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
  title: { type: String, required: true, unique: true },
  questions: [questionSchema],
},{ timestamps: true });

// Validation middleware
questionnaireSchema.pre('save', async function (next) {
  try {
    const title = this.title.toLowerCase();

    // Check for title uniqueness
    const existingQuestionnaire = await mongoose.model('Questionnaire').findOne({ title });
    if (existingQuestionnaire && existingQuestionnaire._id.toString() !== this._id.toString()) {
      return next(new Error('A questionnaire with this title already exists.'));
    }

    // Check for unique questions (case-insensitive)
    const questions = this.questions;
    const questionTexts = questions.map(q => q.question.toLowerCase());
    if (new Set(questionTexts).size !== questions.length) {
      return next(new Error('Questions must be unique.'));
    }

    // Check for unique answers within each question (case-insensitive)
    for (const question of questions) {
      const answers = question.answers;
      const answerTexts = answers.map(a => a.text.toLowerCase());
      if (new Set(answerTexts).size !== answers.length) {
        return next(new Error('Answers within a question must be unique.'));
      }
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

const Questionnaire = mongoose.model<IQuestionnaire>('Questionnaire', questionnaireSchema);
export default Questionnaire;