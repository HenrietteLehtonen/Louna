import {validationResult} from 'express-validator';
import {
  fetchUsers,
  fetchUserById,
  addUser,
  updateUser,
  removeUser,
} from '../models/user-model.js';

const getUsers = async (req, res) => {
  try {
    res.json(await fetchUsers());
  } catch (e) {
    console.error('getItems', e.message);
    res.status(503).json({error: 503, message: 'DB error'});
  }
};
const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  console.log('getUserById', id);
  try {
    const item = await fetchUserById(id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({message: 'User not found'});
    }
  } catch (error) {
    console.error('getUserById', error.message);
    res.status(503).json({error: 503, message: error.message});
  }
};

const postUser = async (req, res, next) => {
  // validation errors can be retrieved from the request object (added by express-validator middleware)
  const errors = validationResult(req);
  // check if any validation errors
  if (!errors.isEmpty()) {
    const error = new Error('Invalid or missing fields');
    error.status = 400;
    return next(error);
  }
  try {
    const newUserId = await addUser(req.body);
    res.json({message: 'new user added', user_id: newUserId});
  } catch (e) {
    console.error('postUser', e.message);
    res.status(503).json({error: 503, message: e.message});
  }
};

const putUser = async (req, res) => {
  console.log('put req body', req.body);
  const {username, password, email} = req.body;
  const newDetails = {
    username,
    password,
    email,
  };
  try {
    const userEdited = await updateUser(
      req.params.id,
      req.user.user_id,
      newDetails,
    );
    if (userEdited === 0) {
      return res.status(404).json({message: 'User not found'});
    } else if (userEdited === 1) {
      return res.status(200).json({message: 'User updated', id: req.params.id});
    } else {
      return res
        .status(401)
        .json({message: 'User does not match', id: req.params.id});
    }
  } catch (error) {
    return res
      .status(500)
      .json({message: 'Something went wrong: ' + error.message});
  }
};

const DeleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const state = await removeUser(id, req.user.user_id);
    if (state === 2) {
      res.status(401).json({message: 'User does not match'});
    } else {
      res.status(200).json({message: 'User removed'});
    }
  } catch (error) {
    return res
      .status(500)
      .json({message: 'Something went wrong: ' + error.message});
  }
};

export {getUsers, getUserById, postUser, putUser, DeleteUser};
