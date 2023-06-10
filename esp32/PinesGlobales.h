#ifndef PINES_GLOBALES_H
#define PINES_GLOBALES_H
#include "MQTT.h"
#include "SensoresActuadores.h"
#include <EasyUltrasonic.h>
#include <DHT.h>

#define pinSensorTemperatura 19 // Definimos el pin digital donde se conecta el sensor
#define DHTTYPE DHT11 // Dependiendo del tipo de sensor
DHT sensorTemperatura(pinSensorTemperatura, DHTTYPE); // Inicializamos el sensor DHT11
#define pinRelevadorTemperatura 21 

#define pinSensorSonicoTrigger 5
#define pinSensorSonicoEcho 18
#define pinRelevadorSonico 32 //Pin rele 

#define pinSensorUv 33 //declaracion de pines analogo
#define pinRelevadorUv 17

#define pinSensorMovimiento 27
#define pinRelevadorMovimiento 16
int contconexion = 0;
EasyUltrasonic ultrasonic; // Create the ultrasonic object


MQTT mqtt;
long lastMsg = 0;

bool banderaModoSensor = true; // bandera global que indica a los objetos el modo de manipulacion de los focos
#endif