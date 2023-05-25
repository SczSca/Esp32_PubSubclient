
const {subscribeToTopic} = require('../controllers/SubscriberController.js');
const {connectToBroker} = require('../config/use_ws.js');
// import * as subscribeController from '../controllers/SubscriberController.mjs';
// import * as brokerModule from '../config/use_ws.mjs';
// const connectToBroker = brokerModule.connectToBroker;
// connectToBroker();
// window.addEventListener('load', (e) =>{
//     connectToBroker('mqttSubscriber');
//     console.log("load")
//     console.log(1)
//     subscribeToTopic();
//     // subscribeController.subscribeToTopic();
// })
window.onload = (event) => {
    console.log("load")
    connectToBroker('mqttSubscriber');
    console.log(1)
    subscribeToTopic();
}

//p
console.log(2)
