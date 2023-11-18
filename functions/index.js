const functions = require("firebase-functions");
const Replicate = require("replicate");
const fetch = require('cross-fetch');
const cors = require("cors")({origin: true});
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  fetch: fetch
});
const clientId = process.env.CLIENT_ID;
const secretKey = process.env.APP_SECRET;
const paypal = require("@paypal/checkout-server-sdk");
const env = new paypal.core.SandboxEnvironment(clientId, secretKey);
const client = new paypal.core.PayPalHttpClient(env);
let request = new paypal.orders.OrdersCreateRequest();

exports.paypalCreateOrder = functions.https.onCall(async (data, context) => {
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "9.90",
        },
      },
    ],
    application_context: {
      shipping_preference: "NO_SHIPPING",
    },
  });

  const response = await client.execute(request);

  return response.result;
});

exports.paypalHandleOrder = functions.https.onCall(async (data, context) => {
  const orderId = data.order_id ;
  request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});
  const response = await client.execute(request);

  return response.result;
});

exports.scribble = functions.https.onCall(async (data, context) => {
  try {
    const { prompt, saveableFile } = data;
    const response = await replicate.run(
      "jagilley/controlnet-scribble:435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
      {
        input: {
          image: saveableFile,
          prompt: prompt,
          seed: 1,
          eta: 0
        },
      }
    );

    console.log(response)
    const image = response[1];
    
    return { photo: image };
  } catch (error) {
    console.error(error);
    return{
        message: error?.response?.data?.status || "Something went wrong",
      };
  }
});

exports.imgto = functions.https.onCall(async (data, context) => {
  try {
    //const { prompt, urlFile } = data;
    const { urlFile } = data;
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
    
    return { photo: image };
  } catch (error) {
    console.error(error);
    return{
        message: error?.response?.data?.status || "Something went wrong",
      };
  }
});
