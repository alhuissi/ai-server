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
    //const { prompt, urlFile } = req.body;
    const { urlFile } = req.body;
    const prompt = "a sketch, hand drawn, black and white, white background";
    const response = await replicate.run(
      "alaradirik/t2i-adapter-sdxl-sketch:3a14a915b013decb6ab672115c8bced7c088df86c2ddd0a89433717b9ec7d927",
      {
        input: {
          prompt: prompt,
          negative_prompt: "extra digit, fewer digits, cropped, worst quality, low quality, glitch, deformed, mutated, ugly, disfigured",
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
