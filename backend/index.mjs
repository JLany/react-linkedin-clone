import express from 'express';
import { generateUploadURL } from './s3.mjs';
import cors from 'cors';

const app = express();

app.use(cors());

// app.use(express.static(''));

app.get('/api/s3Url', async (req, res) => {
  const url = await generateUploadURL();
  res.send({ url });
});

const PORT = 8080;

app.listen(PORT,
  () => console.log(`Server running on port ${PORT}`)
);
