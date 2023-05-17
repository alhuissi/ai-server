import express from "express";
import fetch from 'node-fetch';
//globalThis.fetch = fetch
//import * as fs from 'fs';
import * as dotenv from "dotenv";
import Replicate from "replicate";

dotenv.config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const router = express.Router();

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello" });
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt, urlFile } = req.body;
    const response = await replicate.run(
      "jagilley/controlnet:8ebda4c70b3ea2a2bf86e44595afb562a2cdf85525c620f1671a78113c9f325b",
      {
        input: {
          prompt: prompt,
          image: urlFile,
          seed: 1,
          eta: 0
        }
      }
    );

    console.log(response)
    const image = response[1];

    /*
    fs.writeFile("images/image"+Date.now()+".png", image, 'base64', function (err) {
      if (err) throw err;
      console.log('image saved');
    });
    */
    
    res.status(200).json({ photo: image });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: error?.response?.data?.status || "Something went wrong",
      });
  }
});

export default router;
