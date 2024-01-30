import auth from '../middleware/auth'
import validate from '../middleware/validate';

import { body, query } from 'express-validator';
import express from 'express'
import { CreateChat, GetUserChats } from '../controllers/chatControllers';


var router = express.Router();

// to send information about user
router.get('/',
  auth,
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('skip').optional().isInt({ min: 0 }),
  validate,
  GetUserChats
);

router.post('/',
  auth,
  body('name').exists().isString().isLength({ max: 30, min: 1 }).trim(),
  body('description').exists().isString().isLength({ max: 70, min: 1 }).trim(),
  body('type').exists().isIn(['group', 'personal']),
  validate,
  CreateChat
);



export default router