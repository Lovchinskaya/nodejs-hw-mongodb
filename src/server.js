import dotenv from "dotenv";
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
// import { getEnvVar } from './utils/getEnvVar.js';
import contactsRouter from './routers/contacts.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
// import { getAllContacts, getContactById } from './contacts/contacts.js';

dotenv.config();

const PORT = Number(process.env.PORT);

export const setupServer = async () => {
 const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.send('Server is work');
  });

  app.use(contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

};

  // try{
  //   const app = express();
  //   app.use(
  //       pino({
  //         transport: {
  //           target: "pino-pretty",
  //         },
  //       }),
  //     );
  //     app.get('/contacts', async (req, res) => {
  //   try {
  //     const contacts = await getAllContacts();
  //     res.status(200).json({
  //       status: 200,
  //       message: 'Successfully found contacts!',
  //       data: contacts,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // });
  //      app.get('/contacts/:contactId', async (req, res, next) => {
  //   try {
  //     const { contactId } = req.params.id;
  //     const contact = await getContactById(contactId);

  //     if (!contact) {
  //       res.status(404).json({ message: 'Contact not found' });
  //       return;
  //     }

  //     res.status(200).json({
  //       status: 200,
  //       message: `Successfully found contact with id ${contactId}!`,
  //       data: contact,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // });
  //   app.use((err, req, res, next) => {
  //       res.status(404).json({
  //         message: 'Not found',
  //       });
  //       next();
  //     });
  //     app.use(express.json());
  //     app.use(cors());


  //     app.get('/', (req, res) => {
  //       res.json({
  //           message: 'Hello world!',
  //         });
  //   });

  //   app.listen(PORT, () => {
  //     console.log(`Server is running on ${PORT}`);
  //   });
  // } catch (error){
  //   console.log(error);
  // };