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
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});