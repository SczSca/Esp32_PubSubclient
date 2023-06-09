const dotenv = require('dotenv');
const path = require('path');

// import * as path from 'https://cdnjs.cloudflare.com/ajax/libs/path.js/0.8.4/path.min.js';
// import * as dotenv from 'https://cdn.jsdelivr.net/npm/dotenv@16.0.3/lib/main.min.js';

dotenv.config({
  /**
   * This path is used to configure the environment file that will be used.
   * In production environment, this will be changed by:
   *  path: path.resolve(__dirname, 'production.env')
   */
  path: path.resolve(__dirname, process.env.NODE_ENV + '.env')
});

module.exports ={
    MQTT_PROTOCOL : process.env.MQTT_PROTOCOL,
    MQTT_PORT : process.env.MQTT_PORT,
    MQTT_HOST : process.env.MQTT_HOST,
    MQTT_TOPIC_SUBSCRIBER: process.env.MQTT_TOPIC_SUBSCRIBER,
    MQTT_TOPIC_PUBLISHER: process.env.MQTT_TOPIC_PUBLISHER,
    MQTT_QOS : process.env.MQTT_QOS,
    MQTT_USER : process.env.MQTT_USER,
    MQTT_PASS : process.env.MQTT_PASS,
    WS_BROKERID : process.env.WS_BROKERID
    // NODE_ENV: process.env.NODE_ENV,
    // DB_HOST: process.env.DB_HOST,
    // PORT: process.env.SERVER_PORT,
    // DB_USER: process.env.DB_USER,
    // DB_PASSWORD: process.env.DB_PASSWORD,
    // DB_DATABASE: process.env.DB_DATABASE,
    // J_KEY: process.env.JWT_KEY
}