import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';


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

export default class LuxScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };




  constructor(props) {
    super(props);

    const client = new Paho.MQTT.Client('broker.hivemq.com', 8000, 'u1');
    client.onConnectionLost = this.onConnectionLost;
    client.onMessageArrived = this.onMessageArrived;
    client.connect({ onSuccess: this.onConnect, useSSL: false });

    this.state = {
      lux: '...',
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
      this.setState({ lux: '...'}) 
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
      this.setState({ lux: json.lux })
    }

    }catch(e)
    {
      console.log("La informacion no es relevante")
    }
  }



 render() 
  {
    return(<Container>
        <Header>
          <Left/>
          <Body>
            <Text fontSize={10}>Luminosidad</Text>
          </Body>
          <Right/>
        </Header>
        <Content>
          { this.state.loading ? this.renderLoading() : this.renderLuxScreen() }
        </Content>
      </Container>)    
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

  renderLuxScreen()
  {
    return(          <Grid style={{ paddingTop: '35%'}}>
            <Row style={{ justifyContent: 'center'}}>
              <Thumbnail large source={{uri: 'https://3.bp.blogspot.com/-AeBFBsdkATk/T_5jjUNvp4I/AAAAAAAAWBw/gp7Z26-wq5k/s1600/estrella++lucero+png+%281%29.png'}} />
            </Row>

            <Row style={{ justifyContent: 'center' }}>
              <Text style={{ fontSize: 60 }}>
                { this.state.lux } lux
              </Text>
            </Row>

            <Row style={{ justifyContent: 'center'}}>
              <Text>
                Lux (lumenes por metro cuadrado) recibidos en la habitacion del sensor.
              </Text>
            </Row>
          </Grid>)
  }



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  LuxScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
