import express, { Request, Response } from 'express';
import Questionnaire from "../models/Questionnaire";


const router = express.Router();

// create questionnaire POST
router.post('/create', async (req: Request, res: Response) => {
  try {
    const { title, questions } = req.body;

    // Clean up empty _id fields
    const cleanedQuestions = questions.map((q: any) => ({
      ...q,
      _id: q._id ? q._id : undefined,
      answers: q.answers.map((a: any) => ({
        ...a,
        _id: a._id ? a._id : undefined,
      }))
    }));

    const newQuestionnaire = new Questionnaire({ title, questions: cleanedQuestions });
    await newQuestionnaire.save();
    res.status(201).json(newQuestionnaire);
  } catch (error) {
    console.log(((error as Error).message))
    res.status(500).json({ error: (error as Error).message });
  }
});



// get all questionnaires
router.get('/all', async (req: Request, res: Response) => {
  try {
    const questionnaires = await Questionnaire.find().sort({ createdAt: -1 });
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

router.put('/:id/update', async (req: Request, res: Response) => {
  try {
    const { title, questions } = req.body;

    // Find existing questionnaire by ID
    const existingQuestionnaire = await Questionnaire.findById(req.params.id);
    if (!existingQuestionnaire) return res.status(404).json({ message: 'Not found' });

    // Clean up empty _id fields
    const cleanedQuestions = questions.map((q: any) => ({
      ...q,
      _id: q._id ? q._id : undefined,
      answers: q.answers.map((a: any) => ({
        ...a,
        _id: a._id ? a._id : undefined,
      }))
    }));

    // Update fields
    existingQuestionnaire.title = title;
    existingQuestionnaire.questions = cleanedQuestions;

    // Save updated questionnaire
    await existingQuestionnaire.save();
    res.status(200).json(existingQuestionnaire);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});


// Delete questionnaire
router.delete('/:id/delete', async (req: Request, res: Response) => {
  try {
    const result = await Questionnaire.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Questionnaire deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// submit answers and return calculated score
router.post('/:id/submit', async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const { answers } = req.body;
    const questionnaire = await Questionnaire.findById(req.params.id);
    if (!questionnaire) return res.status(404).json({ message: 'Not found' });

    let score = 0;
    questionnaire.questions.forEach((question, index) => {
      const selectedAnswerId = answers[index]; // user selected answer id

      // find selected answer from answers list
      const selectedAnswer = question.answers.find(answer => answer._id?.toString() === selectedAnswerId);
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