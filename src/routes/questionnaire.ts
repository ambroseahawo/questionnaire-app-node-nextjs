import express, { Request, Response } from 'express';
import Questionnaire from "../models/Questionnaire";


const router = express.Router();

// create questionnaire POST
router.post('/create', async (req: Request, res: Response) => {
  try {
    const { title, questions } = req.body

    const newQuestionnaire = new Questionnaire({ title, questions });
    const savedQuestionnaire = await newQuestionnaire.save();
    res.status(201).json(savedQuestionnaire);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// get all questionnaires
router.get('/all', async (req: Request, res: Response) => {
  try {
    const questionnaires = await Questionnaire.find();
    res.status(200).json(questionnaires);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// get questionnaire by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const questionnaire = await Questionnaire.findById(req.params.id);
    if (!questionnaire) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(questionnaire);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// submit answers and return calculated score
router.post('/:id/submit', async (req: Request, res: Response) => {
  try {
    const { answers } = req.body;
    const questionnaire = await Questionnaire.findById(req.params.id);
    if (!questionnaire) return res.status(404).json({ message: 'Not found' });

    let score = 0;
    questionnaire.questions.forEach((question, index) => {
      const selectedAnswerId = answers[index]; // user selected answer id

      // find selected answer from answers list
      const selectedAnswer = question.answers.find(answer => answer._id.toString() === selectedAnswerId);
      if (selectedAnswer) {
        score += selectedAnswer.weight;
      }
    });

    res.status(200).json({ score });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;