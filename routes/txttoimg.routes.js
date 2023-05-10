import express from "express";
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello" });
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch(
      `https://api.stability.ai/v1/generation/stable-diffusion-v1-5/text-to-image`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
            },
          ],
          cfg_scale: 7,
          clip_guidance_preset: 'FAST_BLUE',
          height: 512,
          width: 512,
          samples: 1,
          steps: 30,
        }),
      }
    )

    const responseJSON = (await response.json())
    const image = responseJSON.artifacts[0].base64;

    fs.writeFile("images/image"+Date.now()+".png", image, 'base64', function (err) {
      if (err) throw err;
      console.log('image saved');
    });
    
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
