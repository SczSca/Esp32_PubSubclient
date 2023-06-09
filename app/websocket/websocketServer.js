const WebSocket = require('ws');
const {WS_BROKERID} = require('../config/env/config.js');

//se subscribe como subscriptor mqtt 
const wss = new WebSocket.Server({ port: 8081 });

// Almacenar las conexiones de los clientes
const clients = new Set();

let clientBroker;

wss.on('connection', (ws) => {
  // Agregar nuevo cliente a la lista
  clients.add(ws);
  console.log("Client connected")
  ws.on('message', (message, isBinary) => {
    // Enviar el mensaje a todos los clientes conectados
    /**
     * jsonMessage {
     * Buffer: valor,
     * data: [arr de bytes] ## mensaje del ws cliente recibido
     * }
     */
    const jsonMessage = JSON.stringify(message)
    /**se obtiene la data del obj json message, se convierte de bytes a string y ese string se convierte a json
       jsonData { //json que recibe el broker por mqtt y lo manda a los ws
        target: string,
        temperatura: {
                data: float,
                bulb: bool [0 || 1]
            },
            movimiento: {
                data: float,
                bulb: bool [0 || 1]
            },
            sonico: {
                data: float,
                bulb: bool [0 || 1]
            },
            uv: {
                data: float,
                bulb: bool [0 || 1]
            }
        }

        jsonData { //json que manda el broker al wss para avisarle que el será el cliente ws broker
            broker: string [id del broker]
        }

        jsonData { //json que manda al ws broker para que se lo mande al esp32
            target: string, [clientBroker]
            sensor: string, [temperatura || movimiento || sonico || uv]
            bulb: bool [0 || 1]
        }
     */
    const jsonData = JSON.parse(String.fromCharCode(...JSON.parse(jsonMessage).data));
    // const jsonString = JSON.stringify(jsonData);
    if(jsonData.target === 'clientBroker') {
        sendToClientBroker(JSON.stringify(jsonData), ws);
        broadcastExceptItself(JSON.stringify(jsonData), ws);       
    }else if(jsonData.target === 'broadcast'){
        broadcastExceptBroker(JSON.stringify(jsonData));
    }else if(jsonData.broker == WS_BROKERID){
        clientBroker = ws;
        console.log('Client broker connected');        
    }else{
        console.error(`Error: tipo de mensaje no valido : ${JSON.stringify(jsonData)}`);

    }
  });

  ws.on('close', () => {
    // Eliminar cliente de la lista cuando se desconecta
    const jsonToggleModo = {
        target: 'clientBroker',
        mode: '1'
    }
    const stringToggleModo = JSON.stringify(jsonToggleModo);
    /**
     *  Todos los bulbos se setean en 1 cuando se desconecta el cliente ws
     *  donde bulbo: 1 es apagado y bulbo: 0 es encendido  
     */ 
    const jsonToggleSensorTemp = {
        target: 'clientBroker',
        sensor: 'temperatura-sw',
        bulbo: 1
    }
    const stringToggleSensorTemp = JSON.stringify(jsonToggleSensorTemp);

    const jsonToggleSensorMov = {
        target: 'clientBroker',
        sensor: 'movimiento-sw',
        bulbo: 1
    }
    const stringToggleSensorMov = JSON.stringify(jsonToggleSensorMov);

    const jsonToggleSensorUv = {
        target: 'clientBroker',
        sensor: 'uv-sw',
        bulbo: 1
    }
    const stringToggleSensorUv = JSON.stringify(jsonToggleSensorUv);

    const jsonToggleSensorSonico = {
        target: 'clientBroker',
        sensor: 'sonico-sw',
        bulbo: 1
    }
    const stringToggleSensorSonico = JSON.stringify(jsonToggleSensorSonico);

    const arrStringMessages = [stringToggleModo, stringToggleSensorTemp,
         stringToggleSensorMov, stringToggleSensorUv, stringToggleSensorSonico];
    arrStringMessages.forEach((message) => {
        sendToClientBroker(message, ws);
        broadcastExceptItself(message, ws);
    });
    clients.delete(ws);
    console.log('Client disconnected');
  });
});

function broadcastExceptBroker(message, isBinary) {
  // Enviar el mensaje a todos los clientes conectados excepto el mensajero
  clients.forEach((client) => {
    if(client !== clientBroker && client.readyState == WebSocket.OPEN){
        client.send(message, { binary: isBinary});
    }
    
  });
}
function broadcastExceptItself(message, ws ,  isBinary) {
    // Enviar el mensaje a todos los clientes conectados excepto el mensajero
    clients.forEach((client) => {
      if(client !== clientBroker && client !== ws && client.readyState == WebSocket.OPEN){
          client.send(message, { binary: isBinary});
      }
      
    });
  }

//Función que se encarga de que los clientes ws se comuniquen con el cliente ws broker
function sendToClientBroker(message, ws, isBinary) {
    if(clientBroker && clientBroker.readyState == WebSocket.OPEN){
        clientBroker.send(message, { binary: isBinary});
    }else{ //si no se encuentra el broker conectado, se le manda json al remitente
        const error = {
            type: 'error',
            message: 'Client broker not connected'
        }
        ws.send(JSON.stringify(error));
    }
}