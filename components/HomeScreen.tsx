import React from 'react';
import {
  View,
  Button,
  Text,
  Image,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import HandyHeader from './HandyHeader';

import stripe from 'tipsi-stripe';
stripe.setOptions({
  publishableKey: 'pk_test_M0LfaNyjOIqs4RL9bqklDbb500YZpiXM1H',
});
import axios from 'axios';
export interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

class HomeScreen extends React.Component<Props, object> {
  handleAddUserProfileBtn = () => {
    var that = this;
    var SharedPreferences = require('react-native-shared-preferences');
    SharedPreferences.setName('handyInfo');
    SharedPreferences.getItem('handyToken', function (value: any) {
      console.log('our tocken ', value);
      if (value === null) {
        that.props.navigation.navigate('SignIn', {
          nextPage: 'AddProfileScreen',
        });
      } else {
        that.props.navigation.navigate('AddProfileScreen');
      }
    });
  };
  requestPayment = () => {
    return stripe
      .paymentRequestWithCardForm()
      .then((stripeTokenInfo: any) => {
        console.warn('Token created', { stripeTokenInfo });
        const body = {
          amount: 100,
          tokenId: stripeTokenInfo.tokenId,
        };
        const headers = {
          'Content-Type': 'application/json',
        };
        axios
          .post('https://salty-garden-58258.herokuapp.com/payApi/doPayment/', body, { headers })
          .then(({ data }) => {
            Alert.alert('payment has been successful')
          })
          .catch((error: any) => {
            return Promise.reject('Error in making payment', error);
          });
      })
      .catch((error: any) => {
        console.warn('Payment failed', { error });
      });
  };

  render() {
    const { navigation } = this.props;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <HandyHeader navigation={navigation} title="Home" />
          <View
            style={{
              flex: 5,
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <View style={{ flex: 4, alignContent: 'flex-end' }}>
              {/* <Text style={{ fontSize: 50, fontWeight: "bold", color: '#c5df16', padding: 20 }} onPress={() => navigation.navigate('Categories')}>Welcome</Text> */}
              <Image
                source={require('./../assets/Handy.png')}
                style={{
                  marginTop: 70,
                  marginBottom: 30,
                  marginRight: 10,
                  marginLeft: 10,
                }}
              />
            </View>

            {/* <Text
              style={{
                flex: 1,
                color: '#91cde0',
                fontFamily: 'Cochin',
                fontSize: 36,
                fontWeight: 'bold',
              }}>
              Handy
            </Text> */}
            <View style={{ flex: 1, alignContent: 'flex-end' }}>
              <Text
                style={{
                  width: 180,
                  height: 50,
                  fontSize: 18,
                  backgroundColor: '#078ca9',
                  color: '#f2f2f2',
                  borderRadius: 8,
                  textAlign: 'center',
                  textAlignVertical: 'center'
                }}
                onPress={() => navigation.navigate('Categories')}>
                Find A Handyman
              </Text>
              {/* <Button
                title="Find a Handyman"
                color="#63b8d4"
                onPress={() => navigation.navigate('Categories')}

              /> */}
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  width: 150,
                  height: 50,
                  fontSize: 18,
                  backgroundColor: '#078ca9',
                  color: '#f2f2f2',
                  borderRadius: 8,
                  textAlign: 'center',
                  textAlignVertical: 'center'

                }}
                onPress={this.handleAddUserProfileBtn}>
                Add Your Profile
              </Text>

              {/* <Button
                title="Add User Profile"
                color="#63b8d4"
                onPress={this.handleAddUserProfileBtn}
              /> */}
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  width: 90,
                  height: 50,
                  fontSize: 15,
                  backgroundColor: '#F44324',
                  color: '#f2f2f2',
                  borderRadius: 8,
                  textAlign: 'center',
                  textAlignVertical: 'center'
                }}
                onPress={this.requestPayment}>
                Donate
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

export default HomeScreen;
