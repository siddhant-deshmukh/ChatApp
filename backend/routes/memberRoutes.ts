import auth from '../middleware/auth'
import validate from '../middleware/validate';

import { body, query } from 'express-validator';
import express from 'express'
import { CreateChat, GetUserChats } from '../controllers/chatControllers';
import { AddMember, GetMembers } from '../controllers/memberControllers';
import mongoose from 'mongoose';


var router = express.Router();

// to send information about user
router.get('/:chat_id',
  auth,
  query('limit').optional().isInt(),
  query('skip').optional().isInt(),
  validate,
  GetMembers
);

router.post('/:chat_id',
  auth,
  body('email')
    .exists().isEmail(),
    // .custom(value => mongoose.isValidObjectId(value))
    // .withMessage("Invalid user_id"),
  validate,
  AddMember
);



export default router