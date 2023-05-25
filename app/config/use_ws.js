// const fs = require('fs') ver si está madre tiene una función o q pedo
const mqtt = require('mqtt');
const {MQTT_PROTOCOL, MQTT_PORT, MQTT_HOST} = require('./env/config.js');
//"../../node_modules/mqtt/types/index.d.ts"
// import * as mqtt from 'https://unpkg.com/mqtt/dist/mqtt.min.js';

// import { MQTT_PROTOCOL, MQTT_PORT, MQTT_HOST } from './env/config.mjs';

const connectOptions = {
  protocol: MQTT_PROTOCOL,
  port: MQTT_PORT,
  host: MQTT_HOST,
}
/**
 * Funcion que permite la conexión al mosquitto broker
 * params:
 *   mqttClientType: nombre del cliente que se conecta al broker (string) [se especifica si es publicador o subscriptor]
 * Se guarda la conexión al broker en variable "mqttClient" para uso en metodos de los clientes subscriptor y publicador
*/
let mqttClient;
const connectToBroker = (mqttClientType) =>{  
  const clientId = mqttClientType + Math.random().toString(16).substring(2, 8)
  const options = {
    clientId,
    clean: true,
    connectTimeout: 4000,
    /**
     * Por defecto, el mosquitto broker no necesita de credenciales de usuario para la conexión
     */
    // username: 'user_test', 
    // password: 'password_test',
    reconnectPeriod: 1000,
    // para más detalles y opciones para la conexion, repositorio git: https://github.com/mqttjs/MQTT.js#mqttclientstreambuilder-options
  }
  
  const { protocol, host, port } = connectOptions
  /**
   * Si el protocolo es "mqtt", connectUrl = "mqtt://host:port" donde el puerto puede ser elegido como 1883 o el que se adapte mejor a su proyecto
   * Si el protocolo es "mqtts", connectUrl = "mqtts://host:port" donde el puerto puede ser elegido como 8883 o el que se adapte mejor a su proyecto
   * Si el protocolo es "ws", connectUrl = "ws://host:port/mqtt" donde el puerto puede ser elegido como 8083 o el que se adapte mejor a su proyecto
   * Si el protocolo es "wss", connectUrl = "wss://host:port/mqtt" donde el puerto puede ser elegido como 8084 o el que se adapte mejor a su proyecto
   *
   * para más detalles acerca del "mqtt.connect()" (metodo y opciones),
   * repositorio git: https://github.com/mqttjs/MQTT.js#mqttconnecturl-options
   */
  let connectUrl = `${protocol}://${host}:${port}`
  if (['ws', 'wss'].includes(protocol)) {
    // mqtt: MQTT-WebSocket uniformly uses /path as the connection path,
    // which should be specified when connecting, and the path used on EMQX is /mqtt.
    connectUrl += '/mqtt'
  }
  
  mqttClient = mqtt.connect(connectUrl, options)
  
  // https://github.com/mqttjs/MQTT.js#event-connect
  mqttClient.on('connect', () => {
    console.log(`${protocol}: Connected \n mqttClient:  ${clientId}`);
  
  })
  
  // https://github.com/mqttjs/MQTT.js#event-reconnect
  mqttClient.on('reconnect', (error) => {
    console.log(`Reconnecting(${protocol}):`, error)
  })
  
  // https://github.com/mqttjs/MQTT.js#event-error
  mqttClient.on('error', (error) => {
    console.log(`Cannot connect(${protocol}):`, error)
  })
  
  // https://github.com/mqttjs/MQTT.js#event-message
  mqttClient.on('message', (topic, payload) => {
    console.log('Received Message:', topic, payload.toString())
  })
}

module.exports ={
  connectToBroker,
  mqttClient
}