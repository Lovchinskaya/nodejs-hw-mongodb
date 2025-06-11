import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import {uploadToCloudinary} from "../utils/uploadToCloud.js"

import { parsePaginationParems } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getAllContactsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationParems(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
    userId: req.user.id,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const {id: userId} = req.user;
  const contact = await getContactById(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

    if (contact.userId.toString() !== req.user.id.toString()) {
    throw createHttpError.NotFound('Student not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res, next) => {

  const result = await uploadToCloudinary(req.file.path);

  console.log(result);
  const contact = await createContact({...req.body, userId: req.user.id});

  if (!contact) {
    throw createHttpError(400, 'перевірте запит');
  }

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { id: userId } = req.user;

  const result = await updateContact(contactId, userId, req.body);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const {id: userId} = req.user;

  const contact = await deleteContact(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).send();
};