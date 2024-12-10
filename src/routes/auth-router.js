import express from "express";
import { getMe, postLogin } from "../controllers/auth-controller.js";
import { authenticateToken } from "../middlewares/authentication.js";
import { body } from "express-validator";
import { postUser } from "../controllers/user-controller.js";

const authRouter = express.Router();

/**
 * @apiDefine all No authentication needed.
 */

authRouter
  .route("/login")
  /**
   * @api {post} /auth/login User login
   * @apiName PostLogin
   * @apiGroup Authentication
   * @apiUse all
   *
   * @apiBody {String} username User's username.
   * @apiBody {String} password User's password.
   *
   * @apiSuccess {String} token JWT authentication token.
   * @apiSuccess {Number} user_id User's ID.
   * @apiSuccess {String} username User's username.
   * @apiSuccess {String} email User's email.
   * @apiSuccess {String} user_level_id User's level or role ID.
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "user_id": 1,
   *       "username": "johndoe",
   *       "email": "johndoe@example.com",
   *       "user_level_id": 2,
   *       "token": "jwt_token_string"
   *     }
   *
   * @apiError InvalidCredentials Invalid username or password.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 401 Unauthorized
   *     {
   *       "error": "Usename or password invalid"
   *     }
   */
  .post(postLogin);

authRouter
  .route("/me")
  /**
   * @api {get} /auth/me Get current user info
   * @apiName GetMe
   * @apiGroup Authentication
   * @apiPermission authenticated
   *
   * @apiHeader {String} Authorization Bearer token.
   *
   * @apiSuccess {Number} user_id User's ID.
   * @apiSuccess {String} username User's username.
   * @apiSuccess {String} email User's email.
   * @apiSuccess {String} user_level_id User's level or role ID.
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "user_id": 1,
   *       "username": "johndoe",
   *       "email": "johndoe@example.com",
   *       "user_level_id": 2
   *     }
   *
   * @apiError Unauthorized The request does not have valid authentication.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 401 Unauthorized
   *     {
   *       "message": "Usename or password invalid"
   *     }
   */
  .get(authenticateToken, getMe);

authRouter
  .route("/register")
  /**
   * @api {post} /auth/register User registration
   * @apiName PostRegister
   * @apiGroup Authentication
   *
   * @apiBody {String} username User's username (must be alphanumeric, 3-20 characters).
   * @apiBody {String} password User's password (must be at least 8 characters).
   * @apiBody {String} email User's email (must be a valid email format).
   *
   * @apiSuccess {String} message Confirmation message.
   * @apiSuccess {Number} user_id ID of the newly created user.
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 201 Created
   *     {
   *       "message": "User registered successfully",
   *       "user_id": 3
   *     }
   *
   * @apiError ValidationError Invalid input fields.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Validation failed"
   *     }
   *
   * @apiError ServerError Internal server error during registration.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 503 Service Unavailable
   *     {
   *       "error": 503,
   *       "message": "DB error"
   *     }
   */
  .post(
    body("username").trim().isAlphanumeric().isLength({ min: 3, max: 20 }),
    body("password").isLength({ min: 8 }),
    body("email").isEmail(),
    postUser
  );

export default authRouter;
