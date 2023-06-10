#ifndef SENSORES_ACTUADORES_H
#define SENSORES_ACTUADORES_H
#include <DHT.h>
#include "PinesGlobales.h"
#include <EasyUltrasonic.h>


class SensoresActuadores {
public:
  SensoresActuadores(int pinSensor,int tipoSensor, int pinRelevador, int valorCondicional);
  void leerSensor( void );
  void activarRelevadorPorSensores( void );
  void activarRelevadorManual ( bool );
  float obtenerDatoSensor( void );
  bool estadoFoco( void );
  void setModoSensores( bool );

private:
  int pinSensor_;
  int tipoSensor_; //if 1 === digital // if 2 === analogo // if 3 === UVsensor
  int pinRelevador_;
  int valorCondicional_;
  bool relevadorActivado_;
  float valorSensor_;
  bool modoSensores_; //bandera que indica al objeto si manipula focos en base a los sensores o por web
};

SensoresActuadores::SensoresActuadores(int pinSensor, int tipoSensor, int pinRelevador, int valorCondicional): 
pinSensor_(pinSensor), tipoSensor_(tipoSensor), pinRelevador_(pinRelevador), valorCondicional_(valorCondicional), valorSensor_(0.0),
 relevadorActivado_(true), modoSensores_(true)
{
  // Configurar pines como entradas o salidas según corresponda
}
 //SensoresActuadores(PinHumedad,PinRelevadorHumedad,PinLamparaHumedad,26)
 //leertemp if(pinSensor == pinTemperatura )
void SensoresActuadores::leerSensor( void )
{
  switch(tipoSensor_){
    //caso 1 son para los sensores digitales
    case 1:
      //Si el objeto es el sensor Sonico, obtener su valor y almacenarlo en atributo valorSensor_
      if(pinSensor_ == pinSensorSonicoTrigger){
        
        valorSensor_ = ultrasonic.getDistanceCM(); // Read the distance in centimeters
        // Serial.print("Distancia cm: ");
        delay(800);

      }else{
        //Sensor de movimiento
        valorSensor_ = (digitalRead(pinSensor_) == 0.00) ? 1.00 : 0.00; // si no hay movimiento, valor guardado = 1.00, caso contrario 0.00;
        // Serial.print("Valor de movimiento ");
      }
      
      break;
    //sensor UV
    case 2:
      valorSensor_ = analogRead(pinSensor_); 
      //  valorSensor = valorSensor/1024*5/.1;
       valorSensor_ = map(valorSensor_, 0, 1023, 0, 11);
       valorSensor_ = constrain(valorSensor_, 0, 11);
      // Serial.print("valor UV: ");
      delay(800);
      
      break;
    //sensor temperatura
    case 3:
      valorSensor_ = (float)sensorTemperatura.readTemperature();
      if(isnan(valorSensor_)){
        Serial.println("Error obteniendo los datos del sensor DHT11");
        return;        
      }
      // Serial.print("Valor de temperatura C°");
      delay(800);
      break;
    default:
      // Serial.println("Tipo de Sensor no especificado");
      break;
  }
  // Serial.println(valorSensor_);

  activarRelevadorPorSensores();

}


void SensoresActuadores::activarRelevadorPorSensores()
{
  if(modoSensores_ == true)
  {
    if (valorSensor_ <= valorCondicional_) {
      /* 
        En este caso se está utilizando relevador normal conectado con
        -NO (normally open)
        -COM (common)
        digitalWrite(HIGH) == apaga foco
      */
      relevadorActivado_ = false;
    } else {
      relevadorActivado_ = true;
    }
    digitalWrite(pinRelevador_, relevadorActivado_);
  }
  
}

void SensoresActuadores::activarRelevadorManual( bool estadoRelevador ) 
{
  if(modoSensores_ == false)
  {
    relevadorActivado_ = estadoRelevador;
    digitalWrite(pinRelevador_, relevadorActivado_);
  }
}

bool SensoresActuadores::estadoFoco()
{
  return relevadorActivado_;
}


float SensoresActuadores::obtenerDatoSensor()
{
  return valorSensor_;
}

void SensoresActuadores::setModoSensores( bool bandera )
{
  modoSensores_ = bandera;
  relevadorActivado_ = true; //apagar todos los focos para manipulación en pagina web
  digitalWrite(pinRelevador_, relevadorActivado_);

}

#endif