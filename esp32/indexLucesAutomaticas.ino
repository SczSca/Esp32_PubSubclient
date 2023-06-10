#include "SensoresActuadores.h"
  #include <DHT.h> // Incluimos librería
  #include "PinesGlobales.h"
  #include <EasyUltrasonic.h>
  #include "MQTT.h"
  #include <PubSubClient.h>
  #include <ArduinoJson.h>
  #include <Arduino.h>
//En metodo leer sensor cambiar la variable que está igual para poder guardar en el atributo
//Crear un nuevo metodo para retornar el valor del sensor
//Crear otro metodo para obtener si el foco está encendido o no
//Yyyy en la transformacion del JSON en data de cada uno de los sensores se debe de mandar a llamar el objeto correspondiente con el metodo getData
SensoresActuadores sensoresActuadoresTemp(pinSensorTemperatura,3, pinRelevadorTemperatura,23.0);
SensoresActuadores sensoresActuadoresSonico(pinSensorSonicoTrigger, 1, pinRelevadorSonico ,50.0);
SensoresActuadores sensoresActuadoresUv(pinSensorUv, 2, pinRelevadorUv, 2.0);
SensoresActuadores sensoresActuadoresMov(pinSensorMovimiento, 1, pinRelevadorMovimiento,0.0);

  void setup() {
    Serial.begin(115200); // Inicializamos comunicación serie
  //COPIADO
    mqtt.setup_WiFi ( );
    mqtt.set_MQTT_server ( );
    mqtt.set_MQTT_callback(callback);
 
    //COPIADO
    sensorTemperatura.begin();

    ultrasonic.attach(pinSensorSonicoTrigger, pinSensorSonicoEcho); // Attaches the ultrasonic sensor on the specified pins on the ultrasonic object

    pinMode(pinRelevadorTemperatura, OUTPUT);
    pinMode(pinRelevadorSonico, OUTPUT);
    pinMode(pinRelevadorUv, OUTPUT);
    pinMode(pinRelevadorMovimiento, OUTPUT);
    
    digitalWrite(pinRelevadorTemperatura,LOW);
    digitalWrite(pinRelevadorSonico, LOW);
    digitalWrite(pinRelevadorUv, LOW);
    digitalWrite(pinRelevadorMovimiento, LOW);

    pinMode(pinSensorSonicoTrigger, OUTPUT); //se define pin como salida
    pinMode(pinSensorSonicoEcho, INPUT);  //se define pin como entrada
    digitalWrite(pinSensorSonicoTrigger, LOW);//Inicializamos el pin con 0
    pinMode(pinSensorUv, OUTPUT);
    pinMode(pinSensorMovimiento, INPUT);//El pin 11 lo asignamos como entrada para la señal del sensor

    for(int i = 0; i > 30; i++) //Utilizamos un for para calibrar el sensor depende del tipo de sensor que utilicemos va a cambiar el tiempo de calibración
    {
    delay(100);
    }
    delay(50);
    
  // Configurar pines como entradas o salidas según corresponda
  }

  void loop() 
  {
    /*Metodo que obtiene la bandera global que indica que modo va a estar manipulando los focos:
        Modo Sensor:
          -En base a los datos del sensor
        Modo Manual:
          -En base a lo que solicite en la pagina web 
    
    */
    sensoresActuadoresTemp.leerSensor();
    sensoresActuadoresSonico.leerSensor();
    sensoresActuadoresUv.leerSensor();
    sensoresActuadoresMov.leerSensor();
    //COPIADO
    delay ( 10 );
    //Enviar los datos de los sensores para que se publiquen en el servidor
    //Recibir paquetes de fuera para que el ESP32 sea capaz de apagar los focos
      StaticJsonDocument<200> jsonDoc;

    // Obtener datos del sensor de temperatura
    jsonDoc["temperatura"]["data"] = sensoresActuadoresTemp.obtenerDatoSensor();
    jsonDoc["temperatura"]["bulb"] = sensoresActuadoresTemp.estadoFoco();

    // Obtener datos del sensor de movimiento
    jsonDoc["movimiento"]["data"] = sensoresActuadoresMov.obtenerDatoSensor();
    jsonDoc["movimiento"]["bulb"] = sensoresActuadoresMov.estadoFoco();

    // Obtener datos del sensor sónico
    jsonDoc["sonico"]["data"] = sensoresActuadoresSonico.obtenerDatoSensor();
    jsonDoc["sonico"]["bulb"] = sensoresActuadoresSonico.estadoFoco();

    // Obtener datos del sensor UV
    jsonDoc["uv"]["data"] = sensoresActuadoresUv.obtenerDatoSensor();
    jsonDoc["uv"]["bulb"] = sensoresActuadoresUv.estadoFoco();

    // Serializar el JSON a una cadena
    char jsonBuffer[200];
    serializeJson(jsonDoc, jsonBuffer);
    const char* jsonString = jsonBuffer;
    Serial.println(jsonString);
    mqtt.reconnect_MQTT ( );

    mqtt.publish_MQTT(jsonString);

  }

void setModoSensores()
{
  sensoresActuadoresTemp.setModoSensores(banderaModoSensor);
  sensoresActuadoresSonico.setModoSensores(banderaModoSensor);
  sensoresActuadoresUv.setModoSensores(banderaModoSensor);
  sensoresActuadoresMov.setModoSensores(banderaModoSensor);
}


void callback(char* topic, byte* message, unsigned int length) {

  Serial.print ( F ( "Ha llegado un mensaje de: " ) );
  Serial.println ( topic );                             /* Topic al cual se está suscrito */
  const size_t capacity = JSON_OBJECT_SIZE(3);  // Cambia el valor 3 según la cantidad de pares clave-valor en tu JSON
  StaticJsonDocument<capacity> doc;
  deserializeJson(doc, message);
  if(doc.containsKey("mode"))
  {
    Serial.println("recibi json con atributo mode");
    const bool mode = (bool)doc["mode"];
    banderaModoSensor = mode;
    Serial.print("Valor de la bandera modo sensor: ");
    Serial.println(banderaModoSensor);
    setModoSensores();

  }else if(doc.containsKey("sensor"))
  {
    const char* sensor = doc["sensor"];
    Serial.println((String)sensor);
    if(doc["sensor"] == "temperatura-sw")
    {
      Serial.println("Entro case temperatura");
      
      sensoresActuadoresTemp.activarRelevadorManual((bool)doc["bulbo"]);

    }else if(doc["sensor"] == "movimiento-sw")
    {
      Serial.print("Entro case movimiento: ");

      sensoresActuadoresMov.activarRelevadorManual((bool)doc["bulbo"]);

    }else if(doc["sensor"] == "uv-sw")
    {
      Serial.print("Entro case UV: ");

      sensoresActuadoresUv.activarRelevadorManual((bool)doc["bulbo"]);

    }else if(doc["sensor"] == "sonico-sw")
    {
      Serial.print("Entro case Sonico: ");

      sensoresActuadoresSonico.activarRelevadorManual((bool)doc["bulbo"]);

    }
  }

  String messageTemp;
  
  for ( int i = 0; i < length; i++ ) {
    //Serial.print((char)message[i]);
    messageTemp += (char)message[i];                    /* El mensaje proviene en bytes por lo que es necesario concatenarlo */
  }

  Serial.write(message, length);
  }