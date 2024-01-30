import auth from '../middleware/auth'
import validate from '../middleware/validate';

import { body, query } from 'express-validator';
import express from 'express'
import { CreateChat, GetUserChats } from '../controllers/chatControllers';
import { GetMsgs, PostMsg } from '../controllers/msgsController';


var router = express.Router();

// to send information about user
router.get('/:chat_id',
  auth,
  query('limit').optional().isInt(),
  query('skip').optional().isInt(),
  validate,
  GetMsgs
);

router.post('/:chat_id',
  auth,
  body('msg').exists().isString().isLength({ max: 200, min: 1 }).trim(),
  validate,
  PostMsg
);



export default router