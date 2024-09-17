import bodyParser from "body-parser"
import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import mongoose from "mongoose"

import questionnaireRoutes from './routes/questionnaire'

const app = express();
const PORT = process.env.PORT || 5000;
const MONGOOSE_DB_URL = process.env.MONGOOSE_DB_URL as string;

if (!MONGOOSE_DB_URL) {
  throw new Error('MONGOOSE_DB_URL environment variable is not set.');
}

mongoose.connect(MONGOOSE_DB_URL)
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
  });

app.use(cors());
app.use(bodyParser.json());
app.use('/api/questionnaires',questionnaireRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})