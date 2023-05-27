const {connectToBroker} = require('../config/use_ws.js');

/**
 * Cliente websocket mensajero que mandara los datos mqtt a todos los demás clientes websocket
 */

connectToBroker('mqttSubscriber');
