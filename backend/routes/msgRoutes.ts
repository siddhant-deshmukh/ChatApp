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
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('skip').optional().isInt({ min: 0 }),
  query('nmsgs').optional().isInt({ min: 0 }),
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