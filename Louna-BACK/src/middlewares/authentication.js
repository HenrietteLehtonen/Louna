import jwt from 'jsonwebtoken';
import 'dotenv/config';
import {customError} from './error-handler.js';

const authenticateToken = (req, res, next) => {
  console.log('authenticateToken', req.headers);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('token', token);
  if (token == null) {
    return res.sendStatus(401);
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    console.error('authenticateToken', error.message);
    return next(customError('invalid token', 401));
    //res.status(403).send({message: 'invalid token'});
  }
};

export {authenticateToken};
