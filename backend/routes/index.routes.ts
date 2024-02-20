import dotenv from 'dotenv';
import { body } from 'express-validator';
import express, { NextFunction, Request, Response } from 'express'

import auth from '../middleware/auth'
import validate from '../middleware/validate';
import { UserLogin, UserRegister } from '../controllers/auth.controller';


dotenv.config();
var router = express.Router();

// to send information about user
router.get('/', auth, function (req: Request, res: Response, next: NextFunction) {
  return res.status(200).json({ user: res.user });
});

router.post('/register',
  body('name').exists().isString().isLength({ max: 50, min: 3 }).trim(),
  body('password').exists().isString().isLength({ max: 20, min: 5 }).trim(),
  body('email').exists().isEmail().isLength({ max: 50, min: 3 }).toLowerCase().trim(),
  validate,
  UserRegister
);

router.post('/login',
  body('password').exists().isString().isLength({ max: 20, min: 5 }).trim(),
  body('email').exists().isEmail().isLength({ max: 50, min: 3 }).toLowerCase().trim(),
  validate,
  UserLogin
);


router.get('/logout', async function (req: Request, res: Response, next: NextFunction) {
  try {

    res.cookie("access_token", null) // will set cookie to null

    return res.status(200).json({ msg: 'Sucessfull!' })

  } catch (err) {
    return res.status(500).json({ msg: 'Some internal error occured', err })
  }
})

export default router