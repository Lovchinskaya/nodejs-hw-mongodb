import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserController,
  logoutUserController,
  refreshSessionuserController,
  registerUserController,
  requestResetPasswordController
} from '../controllers/auth.js';
import { 
  loginUserSchema, 
  registerUserSchema, 
  requestResetPasswordSchema
   } from '../validation/auth.js';

const router = express.Router();

const jsonParser = express.json();

router.post(
  '/register',
  jsonParser,
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  jsonParser,
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/logout', 
  ctrlWrapper(logoutUserController));

router.post('/refresh', 
  ctrlWrapper(refreshSessionuserController));

router.post("/request-reset-password", 
  jsonParser, validateBody(requestResetPasswordSchema), 
  ctrlWrapper(requestResetPasswordController));

export default router;