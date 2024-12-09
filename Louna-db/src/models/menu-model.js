import { error } from "console";
import { querryPool } from "../../../utils/functions.js";

// USE THIS
const fetchMenuItems = async () => {
  const sql = `
  SELECT 
    ruokalista.day_name AS day, 
    json_arrayagg(
        JSON_OBJECT(
            'nimi', annokset.nimi, 
            'hinta', annokset.hinta, 
            'allergeenit', allergeenit.tunniste, 
            'annos_id', annokset.annos_id
          )
        ) AS annokset 
    FROM ruokalista
    INNER JOIN annokset ON ruokalista.lista_id = annokset.lista_id
    INNER JOIN allergeenit ON annokset.allerg_id = allergeenit.allerg_id
    GROUP BY ruokalista.day_name
    ORDER BY FIELD(ruokalista.day_name, 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai')`;

  const [rows] = await querryPool(sql);
  unstringify(rows);
  /*   tietyn data tietokannasta saa esim. komennolla 
      rows[0].annokset[0].annos.hinta 
      jossa rows[0] on päivä ja annokkset[0] on annos numero*/
  return rows;
};

// ru.day_name AS day,
// an.annos_id AS id,
// an.nimi AS nimi,
// al.tunniste AS allergeenit,
// an.hinta AS hinta
// FROM ruokalista ru
// INNER JOIN annokset an ON ru.lista_id = an.lista_id
// INNER JOIN allergeenit al ON an.allerg_id = al.allerg_id
// ORDER BY FIELD(ru.day_name, 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai');

function unstringify(obj) {
  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch (e) {
      void e;
      return obj;
    }
  }
  if (typeof obj === "object" && obj !== null) {
    for (let i in obj) {
      obj[i] = unstringify(obj[i]);
    }
  }
  // Return the processed object
  return obj;
}

// USE THIS
const addMenuItem = async (newItem) => {
  console.log(newItem);
  const sql1 = `INSERT INTO Ruokalista (nimi, day_name) 
  VALUES (?, ?)`;
  const params1 = [newItem.nimi, newItem.day_name];
  const sql2 = `
INSERT INTO Annokset (nimi, allerg_id, hinta, lista_id)
VALUES (?, ?, ?, (SELECT MAX(lista_id) FROM Ruokalista)) `;
  const params2 = [newItem.nimi, newItem.allerg_id, newItem.hinta];
  const result1 = await querryPool(sql1, params1);
  await querryPool(sql2, params2);
  return result1[0].lista_id;
};

// USE THIS
const removeMenuItem = async (id) => {
  /*   const sql1 = 'SELECT user_id, filename FROM MediaItems WHERE media_id = ?';
  const [item_data] = await querryPool(sql1, [id]);
  console.log('user_id:' + user_id, 'owner_id:' + item_data[0].user_id); */

  const sql1 = `SET FOREIGN_KEY_CHECKS = 0;`;
  const sql2 = `DELETE ru, an FROM ruokalista ru JOIN annokset an ON an.lista_id = ru.lista_id WHERE ru.lista_id = ${id};`;
  const sql3 = `SET FOREIGN_KEY_CHECKS = 1;`;

  await querryPool(sql1);
  await querryPool(sql2);
  await querryPool(sql3);
  return;
};

// POISTA KAIKKI
const removeAll = async () => {
  try {
    const sql1 = "SET FOREIGN_KEY_CHECKS = 0";
    const sql2 = "TRUNCATE TABLE Annokset";
    const sql3 = "SET FOREIGN_KEY_CHECKS = 1";

    await querryPool(sql1);
    await querryPool(sql2);
    await querryPool(sql3);
    return { message: "Annokset taulu tyhjennetty" };
  } catch (error) {
    console.error("removeAll", error.message);
    throw new Error("Database error: " + error.message);
  }
};

// HAE LISTA / PÄIVÄ
const fetchPäivänRuokalista = async (päivä) => {
  try {
    // SQL-kysely, joka hakee päivän (päivä = 'Maanantai', 'Tiistai', jne.) annokset
    const query = `
      SELECT 
        ru.day_name AS day, 
        an.annos_id AS id, 
        an.nimi AS nimi, 
        al.tunniste AS allergeenit, 
        an.hinta AS hinta
      FROM Ruokalista ru
      INNER JOIN Annokset an ON ru.lista_id = an.lista_id
      INNER JOIN Allergeenit al ON an.allerg_id = al.allerg_id
      WHERE ru.day_name = ?
      ORDER BY an.annos_id;`;

    // Haetaan tiedot tietokannasta
    const [rows] = await promisePool.query(query, [päivä]);

    return rows; // Palautetaan tulokset
  } catch (error) {
    console.error("Virhe haettaessa ruokalista", error.message);
    throw new Error("Tietokantavirhe");
  }
};

const fetchTilaus = async () => {
  const sql = `SELECT 
  ti.tilaus_id, 
  ti.tila, 
  ti.tilaus_aika, 
  ADDTIME(ti.tilaus_aika, ti.nouto_aika) AS nouto_aika, 
  json_arrayagg(an.nimi) AS nimet, 
  json_arrayagg(ta.määrä) AS määrä FROM tilaukset ti
INNER JOIN tilausannos ta ON ta.tilaus_id = ti.tilaus_id
INNER JOIN annokset an ON ta.annos_id = an.annos_id
GROUP BY ti.tilaus_id
`;
  const [rows] = await querryPool(sql);
  unstringify(rows);
  return rows;
};

const addTilaus = async (newItem) => {
  console.log(newItem);
  const sql1 = `INSERT INTO Tilaukset (user_id, nouto_aika, tila)
    VALUES (?, 4000, "Työn alla");`;
  const params1 = [newItem.user_id];
  const result1 = await querryPool(sql1, params1);
  console.log(newItem.tilaukset);
  for (let i in newItem.tilaukset) {
    console.log(i);
    const sql2 = `
  INSERT INTO Tilausannos (tilaus_id, annos_id, määrä)
      VALUES((SELECT max(tilaus_id) FROM tilaukset),?,?);`;
    let params2 = [newItem.tilaukset[i].annos_id, newItem.tilaukset[i].määrä];
    await querryPool(sql2, params2);
  }
  return result1[0].tilaus_id;
};

const updateTilaus = async (id, newData) => {
  const sql = `UPDATE tilaukset SET tila = ?, nouto_aika = ? WHERE tilaus_id = ?`;
  const params = [newData.tila, newData.noutoaika, id];
  const result = await querryPool(sql, params);
  return result[0].affectedRows;
};

const removeTilaus = async (id) => {
  const sql1 = `DELETE tilausannos FROM tilausannos WHERE tilaus_id = ${id};`;
  const sql2 = `DELETE tilaukset FROM tilaukset WHERE tilaus_id = ${id};`;

  await querryPool(sql1);
  await querryPool(sql2);
  return;
};

export {
  fetchMenuItems,
  fetchTilaus,
  addTilaus,
  updateTilaus,
  removeTilaus,
  addMenuItem,
  removeMenuItem as removeItem,
  fetchPäivänRuokalista,
  removeAll,
};
