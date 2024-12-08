import { validationResult } from "express-validator";
import {
  fetchMenuItems,
  addMenuItem,
  fetchTilaus,
  addTilaus,
  removeItem,
  fetchPäivänRuokalista,
  removeAll,
} from "../models/menu-model.js";

const getItems = async (req, res) => {
  try {
    res.json(await fetchMenuItems());
  } catch (e) {
    console.error("getItems", e.message);
    res.status(503).json({ error: 503, message: "DB error" });
  }
};

const postItem = async (req, res, next) => {
  const errors = validationResult(req);
  console.log("post req body", req.body);
  if (!errors.isEmpty()) {
    console.log("postMedia errors", errors.array());
    const error = new Error("Invalid or missing fields");
    error.status = 400;
    return next(error);
  }

  // destructure title and description property values from req.body
  /*  const {nimi, allerg_id, hinta, lista_id, day_name} = req.body;

  const newMediaItem = {
    nimi, allerg_id, hinta, lista_id, day_name
  }; */

  try {
    const id = await addMenuItem(req.body);
    res.status(201).json({ message: "Item added", id: id });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Something went wrong: " + error.message });
  }
};

const DeleteItem = async (req, res) => {
  const id = req.params.id;
  try {
    await removeItem(id);
    return res.status(200).json({ message: "Item removed by" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong: " + error.message });
  }
};

// POISTA KAIKKI
const poistaKaikkiAnnokset = async (req, res) => {
  try {
    res.json(await removeAll());
  } catch (e) {
    console.error("Poista kaikki", e.message);
    res.status(503).json({ error: 503, message: "DB error" });
  }
};

// HAE PÄIVÄN RUOKALISTA
const getPäivänRuokalista = async (req, res) => {
  try {
    const day = req.params.day; // Haetaan päivä reitin parametrina (esim. 'Maanantai')

    if (!päivä || typeof päivä !== "string") {
      return res.status(400).json({ error: "Päivä pitää olla merkkijono" });
    }

    const items = await fetchPäivänRuokalista(day); // Kutsutaan modelia

    if (items && items.length > 0) {
      res.json(items);
    } else {
      return res
        .status(404)
        .json({ message: "Ei löytynyt annoksia tälle päivälle" });
    }
  } catch (error) {
    console.error("Virhe haettaessa päivän ruokalistaa", error.message);
    return res.status(503).json({ error: "Tietokantavirhe" });
  }
};

const getTilaus = async (req, res) => {
  try {
    res.json(await fetchTilaus());
  } catch (e) {
    console.error("getItems", e.message);
    res.status(503).json({ error: 503, message: "DB error" });
  }
};

const postTilaus = async (req, res, next) => {
  const errors = validationResult(req);
  console.log("post req body", req.body);
  if (!errors.isEmpty()) {
    console.log("postTilaus errors", errors.array());
    const error = new Error("Invalid or missing fields");
    error.status = 400;
    return next(error);
  }

  try {
    const id = await addTilaus(req.body);
    res.status(201).json({ message: "Item added", id: id });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Something went wrong: " + error.message });
  }
};

export {
  getItems,
  getTilaus,
  postTilaus,
  postItem,
  DeleteItem,
  getPäivänRuokalista,
  poistaKaikkiAnnokset,
};
