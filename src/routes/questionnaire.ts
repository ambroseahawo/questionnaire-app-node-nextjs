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