import express from "express";
import {
  getUsers,
  getUserById,
  putUser,
  DeleteUser,
} from "../controllers/user-controller.js";

import { authenticateToken } from "../middlewares/authentication.js";

const userRouter = express.Router();

/**
 * @apiDefine all No authentication needed.
 */

userRouter
  .route("/")
  /**
   * @api {get} /users Fetch all users
   * @apiName GetUsers
   * @apiGroup Users
   * @apiPermission authenticated
   *
   * @apiHeader {String} Authorization Bearer token for authentication (if required).
   *
   * @apiSuccess {Object[]} users List of all users.
   * @apiSuccess {Number} users.id User ID.
   * @apiSuccess {String} users.username User's username.
   * @apiSuccess {String} users.email User's email.
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     [
   *       {
   *         "id": 1,
   *         "username": "johndoe",
   *         "email": "johndoe@example.com"
   *       },
   *       {
   *         "id": 2,
   *         "username": "janedoe",
   *         "email": "janedoe@example.com"
   *       }
   *     ]
   *
   * @apiError ServiceUnavailable Database error preventing the retrieval of users.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 503 Service Unavailable
   *     {
   *       "error": 503,
   *       "message": "DB error"
   *     }
   */
  .get(getUsers);

userRouter
  .route("/:id")
  /**
   * @api {get} /users/:id Fetch user by ID
   * @apiName GetUserById
   * @apiGroup Users
   * @apiPermission authenticated
   *
   * @apiHeader {String} Authorization Bearer token for authentication (if required).
   *
   * @apiParam {Number} id The ID of the user.
   *
   * @apiSuccess {Number} id User ID.
   * @apiSuccess {String} username User's username.
   * @apiSuccess {String} email User's email.
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "id": 1,
   *       "username": "johndoe",
   *       "email": "johndoe@example.com"
   *     }
   *
   * @apiError UserNotFound The user with the specified ID does not exist.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       "message": "User not found"
   *     }
   *
   * @apiError ServiceUnavailable Database error preventing the retrieval of the user.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 503 Service Unavailable
   *     {
   *       "error": 503,
   *       "message": "DB error"
   *     }
   */
  .get(getUserById)
  /**
   * @api {put} /users/:id Update user details
   * @apiName PutUser
   * @apiGroup Users
   * @apiPermission authenticated
   *
   * @apiParam {Number} id The ID of the user to update.
   *
   * @apiBody {String} username User's username (optional).
   * @apiBody {String} password User's password (optional).
   * @apiBody {String} email User's email (optional).
   *
   * @apiSuccess {String} message Confirmation message.
   * @apiSuccess {Number} id The ID of the updated user.
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "message": "User updated",
   *       "id": 1
   *     }
   *
   * @apiError UserNotFound The user with the specified ID does not exist.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       "message": "User not found"
   *     }
   *
   * @apiError Unauthorized The user does not match the one who is authenticated.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 401 Unauthorized
   *     {
   *       "message": "User does not match"
   *     }
   *
   * @apiError ServerError Something went wrong during the update process.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "message": "Something went wrong: <error details>"
   *     }
   */
  .put(authenticateToken, putUser)
  /**
   * @api {delete} /users/:id Remove a specific user
   * @apiName DeleteUser
   * @apiGroup Users
   * @apiPermission authenticated
   *
   * @apiParam {Number} id The ID of the user to delete.
   *
   * @apiSuccess {String} message Confirmation message.
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "message": "User removed"
   *     }
   *
   * @apiError UserNotFound The user with the specified ID does not exist.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       "message": "User not found"
   *     }
   *
   * @apiError Unauthorized The user does not match the one who is authenticated.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 401 Unauthorized
   *     {
   *       "message": "User does not match"
   *     }
   *
   * @apiError ServerError Something went wrong during the deletion process.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "message": "Something went wrong: <error details>"
   *     }
   */
  .delete(authenticateToken, DeleteUser);

export { userRouter };
