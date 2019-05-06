#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <PubSubClient.h>
#include <Ethernet.h>
#include <SimpleDHT.h>

int pinDHT11 = 2;                   // Este es el pin al que se conecta el sensor
SimpleDHT11 dht11;                  // Es el objeto que representa al sensor

const char* ssid = "Vuni";
const char* password =  "hola1234";
const char* mqttServer = "broker.hivemq.com";
const char* mqtt_topic = "bebinski/hp";
const int mqttPort = 1883;   // MQTT PORT

WiFiClient espClient;  // Creación de cliente WIFI
PubSubClient client(espClient); // Creación de cliente MQTT

void setup_wifi() {
  delay(100);
  Serial.print("Conectando a: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  //Inicializador de numero aleatorios, micros,
  //devuelve los microsegundos desde que empezo a funcionar la placa arduino
  randomSeed(micros());
  Serial.println("");
  Serial.println("Coneccion WiFi realizada");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      client.subscribe(mqtt_topic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(6000);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  int valor = 0;
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);
  String pwmValue_str = "";
  Serial.print("Message:");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
    pwmValue_str = pwmValue_str + (char)payload[i];
  }
  Serial.println();
  Serial.println("-----------------------");
  Serial.println(pwmValue_str);
}



void setup() {
  Serial.begin(115200);	  // baudios del dispositivo

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the WiFi network");
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
  while (!client.connected()) {
    Serial.println("Connecting to MQTT...");
    if (client.connect("ESP8266Client")) {
      Serial.println("connected");
    } else {
      Serial.print("failed with state ");
      Serial.print(client.state());
      delay(2000);
    }
  }



  client.subscribe(mqtt_topic);

}


bool activeSensors()
{
  String json = "{\"lux\":";
  int ligthSensor = analogRead(0);
  json += String(ligthSensor);
  json += ",";


  byte temperature = 0;                 // Elementos que almacenarán la indormación entragada por
  byte humidity = 0;                    // el sensor, sin ser procesadas.
  byte data[40] = {0};                  // Arreglo que contiene los datos entregados por el sensor

  if (dht11.read(pinDHT11, &temperature, &humidity, data))
  {
    return false;
  }

  json += "\"temperature\":";
  json += String((int)temperature);
  json += ",";
  json += "\"humidity\":";
  json += String((int)humidity);
  json += ",";
  json += "\"code\":";
  json += "1234";
  json += "}";

  client.publish(mqtt_topic,  (char*) json.c_str() );
  return true;
}


void loop() {
  if (!client.connected()) {
    reconnect();
  }

  client.loop();

  activeSensors();
  delay(2000);


}
