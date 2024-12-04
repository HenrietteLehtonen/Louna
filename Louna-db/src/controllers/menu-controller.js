import { validationResult } from "express-validator";
import {
  fetchMenuItems,
  addMenuItem,
  // fetchMediaItemById,
  updateMediaItem,
  removeItem,
  fetchPäivänRuokalista,
} from "../models/menu-model.js";

const getItems = async (req, res) => {
  try {
    res.json(await fetchMenuItems());
  } catch (e) {
    console.error("getItems", e.message);
    res.status(503).json({ error: 503, message: "DB error" });
  }
};
const getItemById = async (req, res) => {
  const id = parseInt(req.params.id);
  console.log("getItemById", id);
  try {
    const item = await fetchMediaItemById(id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    console.error("getItemById", error.message);
    res.status(503).json({ error: 503, message: error.message });
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

const putItem = async (req, res) => {
  // destructure title and description property values from req.body
  const { title, description } = req.body;
  console.log(title, description);
  const newDetails = {
    title,
    description,
  };
  try {
    const itemsEdited = await updateMediaItem(
      req.params.id,
      req.user.user_id,
      newDetails
    );
    // if no items were edited (id was not found in DB), return 404
    if (itemsEdited === 0) {
      return res.status(404).json({ message: "Item not found" });
    } else if (itemsEdited === 1) {
      return res
        .status(200)
        .json({ message: "Item updated", id: req.params.id });
    } else {
      return res
        .status(401)
        .json({ message: "Not item owner", id: req.params.id });
    }
  } catch (error) {
    return res
      .status(500)
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

export {
  getItems,
  postItem,
  getItemById,
  putItem,
  DeleteItem,
  getPäivänRuokalista,
};
