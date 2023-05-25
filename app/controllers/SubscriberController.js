//conexión ya establecida al mosquitto
const {mqttClient} = require('../config/use_ws.js');
// import { mqttClient } from '../config/use_ws.js';
//variables de entorno
const {MQTT_TOPIC, MQTT_QOS} = require('../config/env/config.js');
// import {MQTT_TOPIC, MQTT_QOS} from '../config/env/config.js';

const subscribeToTopic = () => {

    // subscribe topic
    // https://github.com/mqttjs/MQTT.js#mqttclientsubscribetopictopic-arraytopic-object-options-callback
    mqttClient.subscribe(MQTT_TOPIC, { MQTT_QOS }, (error) => {
    if (error) {
        console.log('subscribe error:', error)
        return
    }
    console.log(`${protocol}: Subscribe to topic '${MQTT_TOPIC}'`)
})
}

module.exports = {
    subscribeToTopic,
}