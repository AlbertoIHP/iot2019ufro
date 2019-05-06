import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

import { Toast, Spinner, Title, Col, Row, Grid, Right, Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';


import init from 'react_native_mqtt';
import { AsyncStorage } from 'react-native';

  init({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    reconnect: true,
    sync : {
    }
  });
export default class TemperatureScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };







  constructor(props) {
    super(props);

    const client = new Paho.MQTT.Client('broker.hivemq.com', 8000, 'u2');
    client.onConnectionLost = this.onConnectionLost;
    client.onMessageArrived = this.onMessageArrived;
    client.connect({ onSuccess: this.onConnect, useSSL: false });

    this.state = {
      temperature: '...',
      client,
      loading: true,
      showError: false
    };
  }

  onConnectionLost = (responseObject) => 
  {
    if (responseObject.errorCode !== 0) 
    {
      console.log("onConnectionLost:"+responseObject.errorMessage);
      Toast.show({ text: 'Conexion perdida',   buttonText: 'Ok' })
      this.setState({ temperature: '...'}) 
    }
  }

    onConnect = () => 
  {
      const { client } = this.state;
      client.subscribe('bebinski/hp');
      console.log("Conectado al broker")
      Toast.show({ text: 'Conexion establecida',   buttonText: 'Ok' })
      this.setState({loading: false})
  }

  onMessageArrived = (message) => 
  {

    try{

    let json = JSON.parse(message.payloadString)

    if( json.code == '1234' )
    {
      console.log("Registro autenticado nuevo")
      console.log("Codigo es",json)
      this.setState({ temperature: json.temperature })
    }

    }catch(e)
    {
      console.log("La informacion no es relevante")
    }
  }





  renderLoading()
  {
    return(<Grid style={{ paddingTop: '35%'}}>
            <Row style={{ justifyContent: 'center'}}>
              <Spinner color='green' />
            </Row>
            <Row style={{ justifyContent: 'center'}}>
              <Text>
                Conectando al broker...
              </Text>
            </Row>
          </Grid>)
  }


  renderTempScreen()
  {
    return(
          <Grid style={{ paddingTop: '35%'}}>
            <Row style={{ justifyContent: 'center'}}>
              <Thumbnail large source={{uri: 'http://www.climayoreo.com/sites/default/files/styles/large/public/radiacion_01.png?itok=Y-NTftXN'}} />
            </Row>

            <Row style={{ justifyContent: 'center' }}>
              <Text style={{ fontSize: 60 }}>
                { this.state.temperature } ºC
              </Text>
            </Row>

            <Row style={{ justifyContent: 'center'}}>
              <Text>
                Grados celcius en la habitacion del sensor
              </Text>
            </Row>
          </Grid>
      )
  }


  render() 
  {
    return(<Container>
        <Header>
          <Left/>
          <Body>
            <Text fontSize={10}>Temperatura</Text>
          </Body>
          <Right/>
        </Header>
        <Content>
          { this.state.loading ? this.renderLoading() : this.renderTempScreen() }
        </Content>
      </Container>)    
  }




}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
