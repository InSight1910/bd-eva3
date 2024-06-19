const { PubSub } = require('@google-cloud/pubsub');
const { Storage } = require('@google-cloud/storage');
const axios = require('axios');

const pubSubClient = new PubSub();
const storageClient = new Storage();

const BUCKET_NAME = 'eva2-vfji';
const SUBSCRIPTION_NAME = 'eva3-sub'; 

exports.processPubSubMessage = async (message, context) => {
  try {
    const data = Buffer.from(message.data, 'base64').toString();
    const attributes = message.attributes;

    console.log('Mensaje:');
    console.log(`Data: ${data}`);

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    const fileName = `diario/${year}/${month}/${day}/${data}.json`;

    const response = await axios.get(`https://www.red.cl/restservice_v2/rest/conocerecorrido?codsint=${data}`);
    const responseData = response.data;

    // Save the message data to Cloud Storage as a JSON file
    const file = storageClient.bucket(BUCKET_NAME).file(fileName);
    await file.save(JSON.stringify({ responseData }), {
      contentType: 'application/json',
    });

    console.log(`Mensaje guardado como ${fileName}`);

  } catch (error) {
    console.error("Error en pull: " + error);
  }
};
