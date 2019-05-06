import React from 'react';
import { ExpoConfigView } from '@expo/samples';


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


export default class HumidityScreen extends React.Component {
	  static navigationOptions = {
	    header: null,
	  };


  constructor(props) {
    super(props);

    const client = new Paho.MQTT.Client('broker.hivemq.com', 8000, 'u3');
    client.onConnectionLost = this.onConnectionLost;
    client.onMessageArrived = this.onMessageArrived;
    client.connect({ onSuccess: this.onConnect, useSSL: false });

    this.state = {
      humidity: '...',
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
	    this.setState({ humidity: '...'})	
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
			this.setState({ humidity: json.humidity })
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


	renderHumidityScreen()
	{
		return(
          <Grid style={{ paddingTop: '35%'}}>
            <Row style={{ justifyContent: 'center'}}>
              <Thumbnail large source={{uri: 'https://image.flaticon.com/icons/png/512/1178/1178312.png'}} />
            </Row>

            <Row style={{ justifyContent: 'center' }}>
              <Text style={{ fontSize: 60 }}>
                {this.state.humidity} %
              </Text>
            </Row>

            <Row style={{ justifyContent: 'center'}}>
              <Text>
                Porcentaje de humedad relativa en el aire en la habitacion del sensor.
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
            <Text fontSize={10}>Humedad</Text>
          </Body>
          <Right/>
        </Header>
        <Content>
          { this.state.loading ? this.renderLoading() : this.renderHumidityScreen() }
        </Content>
      </Container>)  	 
  }
}
