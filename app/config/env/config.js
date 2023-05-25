const dotenv = require('dotenv');
const path = require('path');

// import * as path from 'https://cdnjs.cloudflare.com/ajax/libs/path.js/0.8.4/path.min.js';
// import * as dotenv from 'https://cdn.jsdelivr.net/npm/dotenv@16.0.3/lib/main.min.js';

dotenv.config({
  path: path.resolve(__dirname, process.env.NODE_ENV + '.env')
});
const MQTT_PROTOCOL = process.env.MQTT_PROTOCOL;
const MQTT_PORT = process.env.MQTT_PORT;
const MQTT_HOST = process.env.MQTT_HOST;
const MQTT_TOPIC = process.env.MQTT_TOPIC;
const MQTT_QOS = process.env.MQTT_QOS;
module.exports ={
    MQTT_PROTOCOL : process.env.MQTT_PROTOCOL,
    MQTT_PORT : process.env.MQTT_PORT,
    MQTT_HOST : process.env.MQTT_HOST,
    MQTT_TOPIC: process.env.MQTT_TOPIC,
    MQTT_QOS : process.env.MQTT_QOS,
    // NODE_ENV: process.env.NODE_ENV,
    // DB_HOST: process.env.DB_HOST,
    // PORT: process.env.SERVER_PORT,
    // DB_USER: process.env.DB_USER,
    // DB_PASSWORD: process.env.DB_PASSWORD,
    // DB_DATABASE: process.env.DB_DATABASE,
    // J_KEY: process.env.JWT_KEY
}