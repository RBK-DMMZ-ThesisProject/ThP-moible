import React from 'react';
import {SafeAreaView, ScrollView, View, StatusBar} from 'react-native';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import {
  Input,
  Avatar,
  Button,
  Text,
  Image,
  Divider,
  Icon,
  ListItem,
  Card,
  Overlay,
} from 'react-native-elements';

import HandyHeader from './HandyHeader';
import {any} from 'prop-types';
import {Linking} from 'react-native';
import stripe from 'tipsi-stripe';
import axios from 'axios';
stripe.setOptions({
  publishableKey: 'pk_test_u7t7CW4JRlx90adyZxR5lgTv000buXI4XF',
});
export interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

class serviceProviderProfile extends React.Component<Props, object> {
  state = {
    profile: {},
    token: '',
    reviews: [],
    isVisible: false,
  };
  requestPayment = () => {
    return stripe
      .paymentRequestWithCardForm()
      .then((stripeTokenInfo: any) => {
        console.warn('Token created', {stripeTokenInfo});
        const body = {
          amount: 100,
          tokenId: stripeTokenInfo.tokenId,
        };
        const headers = {
          'Content-Type': 'application/json',
        };
        axios
          .post('http://localhost:5000/api/doPayment', body, {headers})
          .then(({data}) => {
            return data;
          })
          .catch(error => {
            return Promise.reject('Error in making payment', error);
          });
      })
      .catch((error: any) => {
        console.warn('Payment failed', {error});
      });
  };
  componentDidMount() {
    var that = this;
    var SharedPreferences = require('react-native-shared-preferences');
    SharedPreferences.setName('handyInfo');
    SharedPreferences.getItem('handyToken', function(value: any) {
      if (value === undefined) {
        console.log('no token');
        that.props.navigation.navigate('SignIn');
      } else {
        that.setState({
          token: value,
        });
      }
    });
    const userId = this.props.navigation.getParam('userId');
    console.log('userId : ', userId);
    fetch('https://salty-garden-58258.herokuapp.com/mobileApi/profil', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id: userId}),
    })
      .then(res => res.json())
      .then(resJson => {
        this.setState({
          profile: resJson[0],
        });
      })
      .catch(error => {
        console.error(error);
      });
    fetch('https://salty-garden-58258.herokuapp.com/mobileApi/getReviews', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({serviceproviderid: userId}),
    })
      .then(res => res.json())
      .then(resJson => {
        this.setState({
          reviews: resJson,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
  hireSP() {
    const {token} = this.state;
    const userId = this.props.navigation.getParam('userId');
    console.log('user id', userId);
    console.log('token: ', token);
    fetch('https://salty-garden-58258.herokuapp.com/mobileApi/addHiers', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({serviceproviderid: userId, customerID: token}),
    })
      .then(res => {
        res.json();
      })
      .then(resJson => {
        console.log('Hired');
        this.setState({
          isVisible: true,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
  render() {
    const {navigation} = this.props;
    const {profile} = this.state;
    const {reviews} = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{flex: 1}}>
          <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
            <HandyHeader navigation={navigation} title="Profile" />
            <View style={{flex: 3, alignItems: 'center'}}>
              <Avatar
                size="xlarge"
                rounded
                source={{
                  uri: profile.userImg,
                }}
                title="pic"
              />
              <Text
                style={{fontSize: 20, fontWeight: 'bold', color: '#63b8d4'}}>
                {/* {profile.firstName + ' ' + profile.familyName} */}
                {profile.userName}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              <Icon
                raised
                name="phone"
                color="#00aced"
                onPress={() => {
                  Linking.openURL(`tel:${profile.userMobileNum}`);
                }}
              />

              <Icon
                raised
                name="message"
                color="#00aced"
                onPress={() => navigation.navigate('chattScreen')}
              />
              <Icon raised color="#00aced" name="star" />
            </View>

            {/* <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginLeft: 10,
              }}> */}
            <Card>
              <ListItem
                title="Phone"
                subtitle={profile.userMobileNum}
                leftIcon={{
                  name: 'phone',
                }}
              />
              <ListItem
                title="Email"
                subtitle={profile.email}
                leftIcon={{
                  name: 'email',
                }}
              />
              <ListItem
                title="Birth Date"
                subtitle={profile.dateOfBirth}
                leftIcon={{
                  name: 'book',
                }}
              />
              <ListItem
                title="Service Category"
                subtitle={profile.ServiceCategory}
                leftIcon={{
                  name: 'flag',
                }}
              />
            </Card>
            <Card
              title="Service Description"
              image={require('./../assets/shaghelohm.png')}>
              <Text style={{marginBottom: 20, marginTop: 20}}>
                {profile.ServiceDescription}
              </Text>
              <Overlay
                isVisible={this.state.isVisible}
                onBackdropPress={() => this.setState({isVisible: false})}>
                <Text>Hello from Overlay!</Text>
              </Overlay>

              <Button
                icon={<Icon name="check" color="#ffffff" />}
                buttonStyle={{
                  borderRadius: 10,
                  marginLeft: 0,
                  marginRight: 0,
                  marginBottom: 0,
                  backgroundColor: '#63b8d4',
                }}
                title="HIRE NOW"
                onPress={() => {
                  this.hireSP();
                }}
              />
              <Button
                title="Pay"
                color="#63b8d4"
                onPress={this.requestPayment}
              />
            </Card>
            <Card title="REVIEWS">
              <View>
                {reviews.map((l, i) => (
                  <ListItem
                    key={i}
                    title={l['review']}
                    subtitle={l['dataAdded']}
                    bottomDivider
                  />
                ))}
              </View>
            </Card>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

export default serviceProviderProfile;
