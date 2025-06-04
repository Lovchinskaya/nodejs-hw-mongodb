import createHttpError from 'http-errors';
import { UserCollection } from '../models/user.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { SessionCollection } from '../models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';

export const registerUser = async (payload) => {
  console.log('Payload in registerUser:', payload);

  const user = await UserCollection.findOne({ email: payload.email });

  if (user !== null) {
    throw createHttpError.Conflict('Email in use');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  const registerUser = await UserCollection.create(payload);
  return registerUser;
};

export const loginUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });

  if (user === null)
    throw createHttpError.Unauthorized('Email or password is incorrect');

  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (isEqual !== true)
    throw createHttpError.Unauthorized('Email or password is incorrect');

  await SessionCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};

export const refreshUsersSession = async (sessionId, refreshToken) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (session === null) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};