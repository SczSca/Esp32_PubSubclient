const WebSocket = require('ws');

//se subscribe como subscriptor mqtt 
const wss = new WebSocket.Server({ port: 8080 });

// Almacenar las conexiones de los clientes
const clients = new Set();

wss.on('connection', (ws) => {
  // Agregar nuevo cliente a la lista
  clients.add(ws);

  ws.on('message', (message) => {
    // Enviar el mensaje a todos los clientes conectados
    /**
     * jsonMessage {
     * Buffer: valor,
     * data: [arr de bytes]
     * }
     */
    const jsonMessage = JSON.stringify(message)
    /**se obtiene la data del obj json message, se convierte de bytes a string y ese string se convierte a json
     * jsonData {
     * type: string,
     * name: string,
     * data: string [solo para el type === "message"]
     */
    const jsonData = JSON.parse(String.fromCharCode(...JSON.parse(jsonMessage).data))
    if (jsonData.type === 'message' || jsonData.type === 'login' || jsonData.type === 'exit'){
        broadcast(JSON.stringify(jsonData));
    }else{
        console.error(`Error: Invalid type "${jsonData.type}"`);
    }
    console.log(JSON.parse(String.fromCharCode(...JSON.parse(jsonMessage).data)));
    
  });

  ws.on('close', () => {
    // Eliminar cliente de la lista cuando se desconecta
    clients.delete(ws);
    console.log('Client disconnected');
  });
});

function broadcast(message, isBinary) {
  // Enviar el mensaje a todos los clientes conectados
  clients.forEach((client) => {
    client.send(message, { binary: isBinary});
    
  });
}