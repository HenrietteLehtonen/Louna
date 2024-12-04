import express from "express";
/* import {upload} from '../middlewares/upload.js'; */
/* import {body} from 'express-validator'; */
import "dotenv/config";
import {
  postItem,
  getItemById,
  getItems,
  putItem,
  DeleteItem,
} from "../controllers/menu-controller.js";

import { authenticateToken } from "../middlewares/authentication.js";

const menuRouter = express.Router();
/* 
upload.single('file'),
body('title').trim().isLength({min: 3, max: 50}),
body('description').trim().isLength({max: 255}), */

menuRouter
  .route("/")
  /**
   * @api {get} /menu/ Get all menu items
   * @apiName GetMenuItems
   * @apiGroup Menu
   * @apiUse all
   *
   * @apiSuccess {Object[]} menu List of menu items.
   * @apiSuccess {String} menu.day Day of the week.
   * @apiSuccess {Number} menu.id Item ID.
   * @apiSuccess {String} menu.nimi Name of the menu item.
   * @apiSuccess {String} menu.allergeenit Allergens present in the item.
   * @apiSuccess {Number} menu.hinta Price of the item (in cents).
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     [
   *       {
   *         "day": "Maanantai",
   *         "id": 1,
   *         "nimi": "peruna",
   *         "allergeenit": "G",
   *         "hinta": 300
   *       },
   *       {
   *         "day": "Tiistai",
   *         "id": 3,
   *         "nimi": "pasta",
   *         "allergeenit": "G",
   *         "hinta": 500
   *       }
   *     ]
   *
   * @apiError UnauthorizedError User name or password invalid.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 403 Forbidden
   *     {
   *       "error": {
   *         "message": "username/password invalid",
   *         "status": 403
   *       }
   *     }
   */
  .get(getItems)
  .post(authenticateToken, postItem);

menuRouter
  .route("/:id")
  .get(getItemById)
  .put(authenticateToken, putItem)
  .delete(authenticateToken, DeleteItem);

export { menuRouter };
