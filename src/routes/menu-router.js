import express from "express";
/* import {upload} from '../middlewares/upload.js'; */
/* import {body} from 'express-validator'; */
import "dotenv/config";
import {
  postItem,
  getItems,
  getTilaus,
  postTilaus,
  putTilaus,
  DeleteTilaus,
  DeleteItem,
  poistaKaikkiAnnokset,
} from "../controllers/menu-controller.js";

import { authenticateToken } from "../middlewares/authentication.js";

const menuRouter = express.Router();

/**
 * @apiDefine all No authentication needed.
 */

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

  /**
   * @api {post} /menu/ Add a new menu item
   * @apiName AddMenuItem
   * @apiGroup Menu
   * @apiPermission authenticated
   *
   * @apiDescription This endpoint allows authenticated users to add a new menu item.
   *
   * @apiHeader {String} Authorization Bearer token for authentication.
   *
   * @apiBody {String} nimi Name of the menu item (required).
   * @apiBody {Number} allerg_id Allergy ID associated with the item (optional).
   * @apiBody {Number} hinta Price of the item (in cents, required).
   * @apiBody {Number} lista_id Menu list ID to which the item belongs (required).
   * @apiBody {String} day_name Day of the week associated with the item (optional).
   *
   * @apiSuccess {String} message Confirmation message.
   * @apiSuccess {Number} id ID of the newly created menu item.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 201 Created
   *     {
   *       "message": "Item added",
   *       "id": 10
   *     }
   *
   * @apiError ValidationError Invalid or missing fields in the request body.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": {
   *         "message": "Invalid or missing fields",
   *         "status": 400
   *       }
   *     }
   *
   * @apiError AuthenticationError Missing or invalid authentication token.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 401 Unauthorized
   *     {
   *       "message": "Unauthorized"
   *     }
   */
  .post(authenticateToken, postItem)

  /**
   * @api {delete} /menu/ Remove all menu items
   * @apiName RemoveAllMenuItems
   * @apiGroup Menu
   * @apiPermission authenticated
   *
   * @apiDescription This endpoint allows authenticated users to delete all menu items from the database. Use with caution as it clears all menu data.
   *
   * @apiHeader {String} Authorization Bearer token for authentication.
   *
   * @apiSuccess {Object} result Confirmation of the deletion operation.
   * @apiSuccess {String} result.message Confirmation message.
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "message": "All items removed successfully"
   *     }
   *
   * @apiError ServiceUnavailable Database error preventing deletion.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 503 Service Unavailable
   *     {
   *       "error": 503,
   *       "message": "DB error"
   *     }
   */
  .delete(poistaKaikkiAnnokset);

menuRouter
  .route("/:id")
  /**
   * @api {delete} /menu/:id Remove a specific menu item
   * @apiName RemoveMenuItem
   * @apiGroup Menu
   * @apiPermission authenticated
   *
   * @apiDescription This endpoint allows authenticated users to delete a specific menu item by its ID.
   *
   * @apiHeader {String} Authorization Bearer token for authentication.
   *
   * @apiParam {Number} id The unique ID of the menu item to delete.
   *
   * @apiSuccess {String} message Confirmation message.
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "message": "Item removed"
   *     }
   *
   * @apiError ItemNotFound The item with the specified ID does not exist.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       "message": "Item not found"
   *     }
   *
   * @apiError ServerError Internal server error.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "message": "Something went wrong: <error details>"
   *     }
   */
  .delete(authenticateToken, DeleteItem);

menuRouter
  .route("/tilaus")
  /**
   * @api {get} /menu/tilaus Fetch all orders
   * @apiName GetTilaus
   * @apiGroup Orders
   * @apiPermission authenticated
   *
   * @apiDescription This endpoint retrieves all orders from the database.
   *
   * @apiHeader {String} Authorization Bearer token for authentication (if required).
   *
   * @apiSuccess {Object[]} orders List of all orders.
   * @apiSuccess {Number} orders.id Order ID.
   * @apiSuccess {String} orders.customer_name Name of the customer who placed the order.
   * @apiSuccess {String} orders.date Date when the order was placed.
   * @apiSuccess {Object[]} orders.items Items included in the order.
   * @apiSuccess {Number} orders.items.id Item ID.
   * @apiSuccess {String} orders.items.name Name of the item.
   * @apiSuccess {Number} orders.items.quantity Quantity of the item.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     [
   *       {
   *         "id": 1,
   *         "customer_name": "John Doe",
   *         "date": "2023-12-10",
   *         "items": [
   *           { "id": 101, "name": "Pizza", "quantity": 2 },
   *           { "id": 102, "name": "Pasta", "quantity": 1 }
   *         ]
   *       },
   *       {
   *         "id": 2,
   *         "customer_name": "Jane Smith",
   *         "date": "2023-12-09",
   *         "items": [
   *           { "id": 103, "name": "Salad", "quantity": 1 }
   *         ]
   *       }
   *     ]
   *
   * @apiError ServiceUnavailable Database error preventing the retrieval of orders.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 503 Service Unavailable
   *     {
   *       "error": 503,
   *       "message": "DB error"
   *     }
   */
  .get(getTilaus)
  /**
   * @api {post} /menu/tilaus Add a new order
   * @apiName PostTilaus
   * @apiGroup Orders
   * @apiPermission authenticated
   *
   * @apiDescription This endpoint allows authenticated users to create a new order. The request body must include all required fields for a valid order.
   *
   * @apiHeader {String} Authorization Bearer token for authentication (if required).
   *
   * @apiBody {String} customer_name Name of the customer placing the order (required).
   * @apiBody {Object[]} items List of items in the order (required).
   * @apiBody {Number} items.id Item ID (required).
   * @apiBody {Number} items.quantity Quantity of the item (required).
   * @apiBody {String} [date] Date of the order in ISO format (optional; default is the current date).
   *
   * @apiSuccess {String} message Confirmation message.
   * @apiSuccess {Number} id ID of the newly created order.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 201 Created
   *     {
   *       "message": "Item added",
   *       "id": 5
   *     }
   *
   * @apiError ValidationError Invalid or missing fields in the request body.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Invalid or missing fields"
   *     }
   *
   * @apiError ServerError Something went wrong during order creation.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "message": "Something went wrong: <error details>"
   *     }
   */
  .post(postTilaus);

menuRouter
  .route("/tilaus/:id")
  /**
   * @api {put} /menu/tilaus/:id Update order details
   * @apiName PutTilaus
   * @apiGroup Orders
   * @apiPermission authenticated
   *
   * @apiDescription This endpoint allows authenticated users to update details of a specific order using its ID.
   *
   * @apiHeader {String} Authorization Bearer token for authentication (if required).
   *
   * @apiParam {Number} id The unique ID of the order to update.
   *
   * @apiBody {String} tila Status of the order (required, e.g., "ready", "pending").
   * @apiBody {String} [noutoaika] Pickup time for the order in ISO format (optional).
   *
   * @apiSuccess {String} message Confirmation message.
   * @apiSuccess {Number} id ID of the updated order.
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "message": "Item updated",
   *       "id": 3
   *     }
   *
   * @apiError ItemNotFound The order with the specified ID does not exist.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       "message": "Item not found"
   *     }
   *
   * @apiError ServerError Something went wrong during the update process.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "message": "Something went wrong: <error details>"
   *     }
   */
  .put(putTilaus)
  /**
   * @api {delete} /menu/tilaus/:id Remove a specific order
   * @apiName DeleteTilaus
   * @apiGroup Orders
   * @apiPermission authenticated
   *
   * @apiDescription This endpoint allows authenticated users to delete a specific order by its ID.
   *
   * @apiHeader {String} Authorization Bearer token for authentication (if required).
   *
   * @apiParam {Number} id The unique ID of the order to delete.
   *
   * @apiSuccess {String} message Confirmation message.
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "message": "Item removed"
   *     }
   *
   * @apiError ItemNotFound The order with the specified ID does not exist.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       "message": "Item not found"
   *     }
   *
   * @apiError ServerError Something went wrong during the deletion process.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "message": "Something went wrong: <error details>"
   *     }
   */
  .delete(DeleteTilaus);

// menuRouter
//   .route("/:id")
//   .get(getItemById)
//   .put(authenticateToken, putItem)
//   .delete(authenticateToken, DeleteItem);

export { menuRouter };
