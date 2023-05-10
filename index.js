import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import scribble from './routes/scribble.routes.js';
import txtToImg from './routes/txttoimg.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }))

app.use("/api/v1/txt-to-img", txtToImg);
app.use("/api/v1/scribble", scribble);

app.get('/', (req, res) => {
  res.status(200).json({ message: "Hello from BB" })
})

app.listen(8080, () => console.log('Server has started on port 8080'))