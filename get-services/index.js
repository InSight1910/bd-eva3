const { PubSub } = require('@google-cloud/pubsub');
const axios = require('axios');

const pubSubClient = new PubSub();

const TOPIC_NAME = 'eva3';
const API_URL = 'https://www.red.cl/restservice_v2/rest/getservicios/all';

exports.fetchDataAndPublish = async (req, res) => {
  try {
    const response = await axios.get(API_URL);
    const data = response.data;
    console.log("data: " + data)

    data.forEach(async recorrido => {
      const dataBuffer = Buffer.from(recorrido);
      await pubSubClient.topic(TOPIC_NAME).publish(dataBuffer);
    })
    console.log("send to topic")

    res.status(200).send('Recorridos publicados en topico');
  } catch (error) {
    console.error('Error obteniendo datos. Error: ', error);
    res.status(500).send('Error');
  }
};
