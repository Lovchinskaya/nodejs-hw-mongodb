import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
 
  phoneNumber: Joi.string()
    .pattern(/^[\d+\-\s]+$/)
    .min(3)
    .max(16)
    .required(),
   
  email: Joi.string().email().min(3).max(40).required(),
 
  isFavourite: Joi.boolean().default(false),
 
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
   
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
 
  phoneNumber: Joi.string().min(3).max(16),
  
  email: Joi.string().email(),
 
  isFavourite: Joi.boolean(),
  
  contactType: Joi.string().valid('work', 'home', 'personal'),
  
});