import express from 'express';
import dotenv from "dotenv";
import pino from 'pino-http';
import cors from 'cors';

dotenv.config();

const PORT = Number(process.env.PORT);

export const setupServer = express();

setupServer.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    }),
  );
setupServer.use((err, req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
    next();
  });
  setupServer.use(express.json());
  setupServer.use(cors());


setupServer.get('/', (req, res) => {
    res.json({
        message: 'Hello world!',
      });
});

setupServer.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
