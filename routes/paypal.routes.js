import "dotenv/config"; // loads variables from .env file
import express from "express";
import * as paypal from "./paypal-api.js";

const app = express();

app.use(express.static("public"));

// parse post params sent in body in json format
app.use(express.json());

const router = express.Router();

router.route("/create-paypal-order").post(async (req, res) => {
  try {
    const order = await paypal.createOrder();
    res.json(order);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.route("/capture-paypal-order").post(async (req, res) => {
  const { orderID } = req.body;
  try {
    const captureData = await paypal.capturePayment(orderID);
    res.json(captureData);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;