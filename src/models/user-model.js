import { querryPool } from "../../utils/functions.js";

// käytä ehkä
const fetchUsers = async () => {
  const sql = "SELECT * FROM käyttäjät";
  const [rows] = await querryPool(sql);
  return rows;
};

// ehkä
const fetchUserById = async (id) => {
  const sql = "SELECT * FROM käyttäjät WHERE user_id = ?";
  const [rows] = await querryPool(sql, [id]);
  return rows;
};

// ehkä
const fetchUserByUsernameAndPassword = async (username, password) => {
  const sql =
    "SELECT user_id, username, email, user_level_id, created_at FROM käyttäjät WHERE username = ? AND password = ?";
  const [rows] = await querryPool(sql, [username, password]);
  return rows[0];
};

// Käytä
const addUser = async (newUser) => {
  console.log(newUser);
  const sql = `INSERT INTO users
                  (username, password, email, user_level_id)
                  VALUES (?, ?, ?, ?)`;
  const params = [newUser.username, newUser.password, newUser.email, 2];
  const result = await querryPool(sql, params);
  return result[0].insertId;
};

// Käytä jos aikaa
const updateUser = async (id, user_id, updatedUser) => {
  console.log(id, user_id);
  if (id != user_id) {
    return 2;
  }
  const sql = `UPDATE users SET username = ?, password = ?, email = ? 
    WHERE user_id = ?`;
  const params = [
    updatedUser.username,
    updatedUser.password,
    updatedUser.email,
    id,
  ];
  const result = await querryPool(sql, params);
  return result[0].affectedRows;
};

//Käytä
const removeUser = async (id, user_id) => {
  if (id != user_id) {
    return 2;
  }
  const sql = `DELETE FROM users WHERE user_id = ${id}`;
  const result = await querryPool(sql);
  return result;
};

export {
  fetchUsers,
  fetchUserById,
  fetchUserByUsernameAndPassword,
  addUser,
  updateUser,
  removeUser,
};
