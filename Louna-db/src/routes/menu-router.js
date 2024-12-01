import express from 'express';
/* import {upload} from '../middlewares/upload.js'; */
/* import {body} from 'express-validator'; */
import 'dotenv/config';
import {
  postItem,
  getItemById,
  getItems,
  putItem,
  DeleteItem,
} from '../controllers/menu-controller.js';

import {authenticateToken} from '../middlewares/authentication.js';

const menuRouter = express.Router();
/* 
upload.single('file'),
body('title').trim().isLength({min: 3, max: 50}),
body('description').trim().isLength({max: 255}), */


menuRouter
  .route('/')
  .get(getItems)
  .post(
/*     authenticateToken, */
    postItem,
  );
menuRouter
  .route('/:id')
  .get(getItemById)
  .put(authenticateToken, putItem)
  .delete( DeleteItem);

export {menuRouter};
