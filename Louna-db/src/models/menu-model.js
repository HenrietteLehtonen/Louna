import {querryPool} from '../../../utils/functions.js';



// USE THIS
const fetchMenuItems = async () => {
  const sql = `SELECT *
FROM annokset
JOIN ruokalista USING (lista_id, nimi) 
JOIN allergeenit USING (allerg_id)`;
  const [rows] = await querryPool(sql);
  return rows;
};



// USE MAYBE
const fetchMenuItemById = async (id) => {
  const sql = `SELECT * FROM annokset an
right JOIN ruokalista ru USING (lista_id) 
JOIN allergeenit al USING (allerg_id)
WHERE ru.lista_id = ?`;
  const [rows] = await querryPool(sql, [id]);
  return rows;
};




// USE THIS
const addMenuItem = async (newItem) => {
  console.log(newItem);
  console.log("what")

  const sql1 =`INSERT INTO Ruokalista (nimi, day_name) 
  VALUES (?, ?)` 
  const params1 = [
    newItem.nimi,
    newItem.day_name
  ]
  console.log("done");
  const sql2 = `
INSERT INTO Annokset (nimi, allerg_id, hinta, lista_id)
VALUES (?, ?, ?, (SELECT MAX(lista_id) FROM Ruokalista)) `;
  const params2 = [
    newItem.nimi, 
    newItem.allerg_id, 
    newItem.hinta
  ];
  console.log("done2");

  const result1 = await querryPool(sql1, params1);
  console.log("done3");
  await querryPool(sql2, params2);
  console.log("done4");
  return result1[0].lista_id;
};





// USE IF TIME
const updateMediaItem = async (id, user_id, updatedItem) => {
  const sql1 = 'SELECT user_id FROM MediaItems WHERE media_id = ?';
  const [item_owner] = await querryPool(sql1, [id]);

  console.log('user_id:' + user_id, 'owner_id:' + item_owner[0].user_id);
  if (user_id != item_owner[0].user_id) {
    console.log('user not item owner');
    return 2;
  }

  const sql2 = `UPDATE MediaItems SET title = ?, description = ? WHERE media_id = ?`;
  const params = [updatedItem.title, updatedItem.description, id];
  const result = await querryPool(sql2, params);
  return result[0].affectedRows;
};



// USE THIS
const removeMenuItem = async (id) => {
/*   const sql1 = 'SELECT user_id, filename FROM MediaItems WHERE media_id = ?';
  const [item_data] = await querryPool(sql1, [id]);
  console.log('user_id:' + user_id, 'owner_id:' + item_data[0].user_id); */

  const sql1 = `SET FOREIGN_KEY_CHECKS = 0;`
  const sql2 = `DELETE ru, an FROM ruokalista ru JOIN annokset an ON an.lista_id = ru.lista_id WHERE ru.lista_id = ${id};`
  const sql3 = `SET FOREIGN_KEY_CHECKS = 1;`;


  await querryPool(sql1);
  await querryPool(sql2);
  await querryPool(sql3);
  return;
};




export {
  fetchMenuItems,
  fetchMenuItemById as fetchMediaItemById,
  addMenuItem,
  updateMediaItem,
  removeMenuItem as removeItem,
};
