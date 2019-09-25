/**
 * @format
 * This is the ExampleMaps Registrar for Alice
 */

import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  View,
} from 'react-native';
import {
  createAppContainer,
  createMaterialTopTabNavigator,
  createStackNavigator
} from 'react-navigation';
import OneSignal from 'react-native-onesignal';
import CodePush from "react-native-code-push";
import MapboxGL from '@react-native-mapbox-gl/maps';
import { isIphoneX } from 'react-native-iphone-x-helper'

import env from './env.json';
const {AppRegistry, ...MiniDapps} = require('./src/Apps/AppRegistry'); // AppRegistry is required
import {Settings, Wallet} from './src/AliceSDK/Web3'
import Tokens from './src/AliceCore/Screens/Tokens';
import DappsScreen from './src/AliceCore/Screens/DappsScreen';
import Dashboard from './src/AliceCore/Screens/Dashboard';
import Activity from "./src/AliceCore/Screens/Activity";
import NavigatorService, {navigate} from './src/AliceCore/Utils/navigationWrapper';
import {switchcase} from "./src/AliceCore/Utils";
import {challengedPOI} from "./src/Apps/Foam/utils";

const { height, width } = Dimensions.get('window');
MapboxGL.setAccessToken(env.mapbox);
GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

const AppTabNavigator = createMaterialTopTabNavigator({
  DappsScreen: {
    screen: DappsScreen,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ focused }) => (
        focused ? <Image source={require('./src/AliceCore/Assets/dapps-icon-black.png')} style={{resizeMode: 'contain', width: 40}}/>
          : <Image source={require('./src/AliceCore/Assets/dapps-icon-grey.png')} style={{resizeMode: 'contain', width: 40}}/>
      )
    }
  },
  Tokens: {
    screen: Tokens,
    navigationOptions: {
      tabBarLabel: 'Tokens',
      tabBarIcon: ({ focused }) => (
        focused ? <Image source={require('./src/AliceCore/Assets/tokens-icon-black.png')} style={{resizeMode: 'contain', width: 40}}/>
        : <Image source={require('./src/AliceCore/Assets/tokens-icon-grey.png')} style={{resizeMode: 'contain', width: 40}}/>
      )
    }
  },
  Activity: {
    screen: Activity,
    navigationOptions: {
      tabBarLabel: 'Settings',
      tabBarIcon: ({ focused }) => (
        focused ? <Image source={require('./src/AliceCore/Assets/activity-icon-black.png')} style={{resizeMode: 'contain', width: 40}}/>
          : <Image source={require('./src/AliceCore/Assets/activity-icon-grey.png')} style={{resizeMode: 'contain', width: 40}}/>
      )

    }
  }
}, {
  initialRouteName: 'DappsScreen',
  order: ['DappsScreen', 'Tokens', 'Activity'],
  tabBarPosition: 'bottom',
  animationEnabled: true,
  header: {
    style: {
      elevation: 0,
      shadowOpacity: 0,
    }
  },
  tabBarOptions: {
    showLabel: false,
    backgroundColor: 'white',
    indicatorStyle: {
      backgroundColor: 'transparent',
    },
    labelStyle: {},
    allowFontScaling: true,
    activeTintColor: '#000',
    inactiveTintColor: '#fff',
    style: {
      elevation: 0,
      shadowOpacity: 0,
      backgroundColor: 'transparent',
      borderTopWidth: 0,
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 40,
    },

    showIcon: true
  },
});

const MainApp = createStackNavigator({
  // DappsScreen: { screen: AppTabNavigator },
  DappsScreen: { screen: MiniDapps.ditCraft },
  ...MiniDapps,
}, {
  headerMode: 'none',
});

export const AliceMain = createAppContainer(MainApp);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wallet: '',
      network: '',
      rotation: '',
    };

    OneSignal.init(env.onesignal);
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.configure();
  }

  componentDidMount() {
    // Settings.openBrowser('https://instagram.com');
    this.getOrientation();
    this.getNetwork();
    const aliceEventEmitter = Wallet.aliceEvent()
    aliceEventEmitter.addListener(
      "aliceEvent",
      (event) => {
        console.log('EVENT TRIGGERED: ', event)
        if (event.address) {
          console.log('WALLET INFO: ', event, event.address);
          this.setState({ wallet: event.address});
        }
        if (event.network) {
          const parsedEvent = JSON.parse(event.network);
          console.log('NETWORK CHANGED: ', parsedEvent);
          this.setState({network: parsedEvent.name, networkColor: parsedEvent.color});
        }
        if (event.orientation) {
          console.log('ROTATION CHANGED: ', event, event.orientation);
          this.setState({ orientation: event.orientation});
        }
        if (event.deeplink) {
          console.log('DEEP LINK: ', event, event.deeplink);
          this.handleOpenURL(event.deeplink)
          this.setState({ deeplink: event.deeplink});
        }
      }
    );
  }

  handleOpenURL(event) {
    const route = event.replace(/.*?:\/\//g, '');
    const {dapp, data} = JSON.parse(decodeURIComponent(route.substring(3)));
    navigate(dapp, {data});
  }

  getNetwork = async () => {
    const networkInfo = await Wallet.getNetwork();
    this.setState({network: networkInfo.name, networkColor: networkInfo.color});
  };

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    if (openResult.notification.payload.title === "FOAM") {
      navigate('FoamMap', {poi: challengedPOI});
    }

    if (openResult.notification.payload.title === "E2E") {
      navigate('E2E');
    }
    if (openResult.notification.payload.title === "VotezUp") {
      navigate('BridgeWater');
    }
    if (openResult.notification.payload.title === "CheezeWizards") {
      navigate('CheezeWizards/WizardScreen', {
        notificationChallenge: {
          affinity: 2,
          createdBlockNumber: 5008913,
          eliminatedBlockNumber: null,
          id: "5982",
          initialPower: "70364710415359",
          owner: "0xB45B74aDE7973AD25eC91F64c64aEC07d26F386C",
          power: "70364710415359"
        },
        wizard: {
          affinity: 3,
          createdBlockNumber: 5041333,
          eliminatedBlockNumber: null,
          id: "5994",
          initialPower: "71470282487405",
          owner: "0xA1b02d8c67b0FDCF4E379855868DeB470E169cfB",
          power: "71470282487405"
        }
      });
    }

  }

  onIds(device) {
    console.log('Device info: ', device);
  }

  getOrientation = async () => {
    try {
      console.log('ORIENTATION: ', await Settings.getOrientation());
    } catch(e) {
      console.log(e);
    }

  };

  render() {
    console.log('isiphonex: ', isIphoneX());
    return (
      <View style={{flex: 1}}>
        {this.state.network !== 'Main' && <View style={{ backgroundColor: this.state.networkColor, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, alignSelf: 'center', position: 'absolute', top:0, width:215, height: isIphoneX() ? 35 : 7, zIndex: 9999}}/>}
        <AliceMain
          ref={navigatorRef => {
            NavigatorService.setContainer(navigatorRef);
          }}
        >
        </AliceMain>
      </View>
    );
  }
}




export default CodePush({
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.ON_NEXT_RESUME,
})(App);
