import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StatusBar,
  Modal,
  TouchableHighlight,
  Alert,
  TextInput,
} from 'react-native';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import {Formik} from 'formik';

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
  Rating,
  AirbnbRating,
} from 'react-native-elements';

import HandyHeader from './HandyHeader';
import {any} from 'prop-types';
import {Linking} from 'react-native';
import stripe from 'tipsi-stripe';
import axios from 'axios';
import {throwStatement} from '@babel/types';
import Favorites from './Favorites';
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
    modalVisible: false,
    isfavorite: false,
    ratingGiven: 0,
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
    const userId = this.props.navigation.getParam('userId');
    var SharedPreferences = require('react-native-shared-preferences');
    SharedPreferences.setName('handyInfo');
    SharedPreferences.getItem('handyToken', function(value: any) {
      if (value === undefined) {
        console.log('no token from here');
        that.props.navigation.navigate('SignIn');
      } else {
        that.setState({
          token: value,
        });
        fetch('https://salty-garden-58258.herokuapp.com/mobileApi/profil', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            serviceproviderid: userId,
            token: that.state.token,
          }),
        })
          .then(res => res.json())
          .then(resJson => {
            console.log('response from server', resJson);
            that.setState({
              profile: resJson.profile,
            });
            if (resJson.favs) {
              for (var i = 0; i < resJson.favs.length; i++) {
                if (resJson.favs[i].serviceProviderID === resJson.profile._id) {
                  that.setState({isfavorite: true});
                }
              }
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
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

  addFav() {
    var SharedPreferences = require('react-native-shared-preferences');
    SharedPreferences.setName('handyInfo');
    var that = this;
    SharedPreferences.getItem('handyToken', function(value: any) {
      if (value !== null) {
        const x = value;
        if (!that.state.isfavorite) {
          const userId = that.props.navigation.getParam('userId');
          console.log('user id', userId);
          console.log('token: ', x);
          fetch(
            'https://salty-garden-58258.herokuapp.com/mobileApi/addfavorite',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({serviceproviderid: userId, customerID: x}),
            },
          )
            .then(res => {
              res.json();
            })
            .then(resJson => {
              that.setState({
                isfavorite: true,
              });
            })
            .catch(error => {
              console.error(error);
            });
        } else {
          const userId = that.props.navigation.getParam('userId');
          console.log('user id', userId);
          console.log('token: ', x);
          fetch(
            'https://salty-garden-58258.herokuapp.com/mobileApi/deletefavorite',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({serviceproviderid: userId, customerID: x}),
            },
          )
            .then(res => {
              res.json();
            })
            .then(resJson => {
              that.setState({
                isfavorite: false,
              });
            })
            .catch(error => {
              console.error(error);
            });
        }
      }
    });
  }
  hireSP() {
    var SharedPreferences = require('react-native-shared-preferences');
    SharedPreferences.setName('handyInfo');
    var that = this;
    SharedPreferences.getItem('handyToken', function(value: any) {
      if (value !== null) {
        const x = value;
        const userId = that.props.navigation.getParam('userId');
        console.log('user id', userId);
        console.log('token: ', x);
        fetch('https://salty-garden-58258.herokuapp.com/mobileApi/addHiers', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({serviceproviderid: userId, customerID: x}),
        })
          .then(res => {
            res.json();
          })
          .then(resJson => {
            console.log('Hired');
            that.setState({
              isVisible: true,
            });
          })
          .catch(error => {
            console.error(error);
          });
      }
    });
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  isFave() {
    if (this.state.isfavorite) {
      return '#00aced';
    } else {
      return '#666';
    }
  }
  addReview() {
    return (
      <Overlay
        isVisible={this.state.isVisiblereview}
        onBackdropPress={() => this.setState({isVisiblereview: false})}>
        <Text>Add review</Text>
      </Overlay>
    );
  }

  ratingCompleted(rating) {
    console.log('Rating is: ' + rating);
    this.setState({rating: rating});
  }
  render() {
    const {navigation} = this.props;
    const {profile, ratingGiven, reviews} = this.state;

    console.log('hello agina');
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
              <Icon
                raised
                color={this.isFave()}
                name="star"
                onPress={() => this.addFav()}
              />
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
              <Button
                icon={<Icon name="check" color="#ffffff" />}
                buttonStyle={{
                  borderRadius: 10,
                  marginLeft: 0,
                  marginRight: 0,
                  marginBottom: 0,
                  backgroundColor: '#63b8d4',
                }}
                title="ADD REVIEW"
                onPress={() => {
                  this.setModalVisible(true);
                }}
              />

              <Modal
                animationType="slide"
                visible={this.state.modalVisible}
                onRequestClose={() => {
                  Alert.alert('send your review or close it please');
                }}>
                <Card>
                  <Formik
                    initialValues={{review: '', name: ''}}
                    onSubmit={values => console.log(values)}>
                    {({handleChange, handleBlur, handleSubmit, values}) => (
                      <View>
                        <Input
                          onChangeText={handleChange('review')}
                          onBlur={handleBlur('review')}
                          value={values.review}
                        />
                        <Divider></Divider>
                        <Input
                          onChangeText={handleChange('name')}
                          onBlur={handleBlur('name')}
                          value={values.name}
                        />
                        <Button
                          icon={
                            <Icon
                              name="sc-telegram"
                              type="evilicon"
                              color="#ffffff"
                            />
                          }
                          onPress={handleSubmit}
                          title="SEND"
                          buttonStyle={{
                            borderRadius: 10,
                            marginLeft: 25,
                            marginRight: 25,
                            marginBottom: 25,
                            marginTop: 25,
                            backgroundColor: '#63b8d4',
                          }}
                        />
                      </View>
                    )}
                  </Formik>
                  <AirbnbRating
                    count={5}
                    reviews={['Terrible', 'Bad', 'Meh', 'OK', 'Good']}
                    defaultRating={5}
                    onFinishRating={rating => {
                      this.setState({ratingGiven: rating});
                      console.log('ratingGiven', ratingGiven);
                    }}
                    size={25}
                    // ratingColor={'blue'}
                  />

                  <TouchableHighlight>
                    <Button
                      buttonStyle={{
                        borderRadius: 10,
                        marginLeft: 25,
                        marginRight: 25,
                        marginBottom: 25,
                        marginTop: 25,
                        backgroundColor: '#63b8d4',
                      }}
                      title="CLOSE"
                      onPress={() => {
                        this.setModalVisible(!this.state.modalVisible);
                      }}
                    />
                  </TouchableHighlight>
                </Card>
              </Modal>
            </Card>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}
export default serviceProviderProfile;
