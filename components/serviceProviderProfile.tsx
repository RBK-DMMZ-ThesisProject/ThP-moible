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
  publishableKey: 'pk_test_M0LfaNyjOIqs4RL9bqklDbb500YZpiXM1H',
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

  componentDidMount() {
    var that = this;
    const userId = this.props.navigation.getParam('userId');
    var SharedPreferences = require('react-native-shared-preferences');
    SharedPreferences.setName('handyInfo');
    SharedPreferences.getItem('handyToken', function(value: any) {
      if (value === null) {
        console.log('no token from here');
        that.props.navigation.navigate('SignIn');
      } else {
        console.log(value);
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
              that.setState({isfavorite: true});
            }
          })
          .catch(error => {
            console.log('hello from error');
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
  saveReview(values: any) {
    console.log('save reveiwsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsd');
    var SharedPreferences = require('react-native-shared-preferences');
    SharedPreferences.setName('handyInfo');
    var that = this;
    const userId = that.props.navigation.getParam('userId');

    SharedPreferences.getItem('handyToken', async function(value: any) {
      if (value !== null) {
        await fetch(
          'https://salty-garden-58258.herokuapp.com/mobileApi/addReviews',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              review: values.review,
              token: value,
              rate: that.state.ratingGiven,
              serviceproviderid: userId,
            }),
          },
        )
          .then(res => {
            res.json();
          })
          .then(resJson => {
            console.log(resJson);
          })
          .catch(error => {
            console.error(error);
          });
      }
    });
  }
  addFav() {
    var SharedPreferences = require('react-native-shared-preferences');
    SharedPreferences.setName('handyInfo');
    var that = this;
    SharedPreferences.getItem('handyToken', async function(value: any) {
      if (value !== null) {
        const x = value;
        if (!that.state.isfavorite) {
          const userId = that.props.navigation.getParam('userId');
          console.log('user id', userId);
          console.log('token: ', x);
          await fetch(
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
          await fetch(
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
    SharedPreferences.getItem('handyToken', async function(value: any) {
      console.log('our tocken', value);
      if (value !== null) {
        const x = value;
        const userId = that.props.navigation.getParam('userId');
        console.log('user id', userId);
        console.log('token: ', x);
        await fetch(
          'https://salty-garden-58258.herokuapp.com/mobileApi/addHiers',
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
  setModalVisible(visible: any) {
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

  ratingCompleted(rating: any) {
    this.setState({rating: rating});
  }
  render() {
    const {navigation} = this.props;
    const {profile, ratingGiven, reviews} = this.state;
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
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginTop: 15,
                  marginBottom: 15,
                  color: '#078ca9',
                }}>
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
              // image={profile.userWorkImg[0]}
            >
              <Text style={{marginBottom: 20, marginTop: 20}}>
                {profile.ServiceDescription}
              </Text>
              <Overlay
                isVisible={this.state.isVisible}
                onBackdropPress={() => this.setState({isVisible: false})}>
                <Text>Hello from Overlay!</Text>
              </Overlay>

              {/* <Button
                icon={<Icon name="check" color="#ffffff" />}
                buttonStyle={{
                  borderRadius: 10,
                  marginLeft: 0,
                  marginRight: 0,
                  marginBottom: 0,
                  backgroundColor: '#078ca9',
                }}
                title="HIRE NOW"
                onPress={() => {
                  this.hireSP();
                }}
              />
              {/* <Button
                title="Pay"
                color="#078ca9"
                onPress={this.requestPayment}
              /> */}
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
                  backgroundColor: '#078ca9',
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
                <Card title="Give A Review">
                  <AirbnbRating
                    count={5}
                    defaultRating={0}
                    onFinishRating={rating => {
                      this.setState({ratingGiven: rating});
                      console.log('ratingGiven', ratingGiven);
                    }}
                    size={18}

                    // ratingColor={'blue'}
                  />
                  <Formik
                    initialValues={{review: ''}}
                    onSubmit={values => this.saveReview(values)}>
                    {({handleChange, handleBlur, handleSubmit, values}) => (
                      <View style={{marginTop: 20}}>
                        <Text>Please Enter your Review:</Text>
                        <Input
                          onChangeText={handleChange('review')}
                          onBlur={handleBlur('review')}
                          value={values.review}
                          numberOfLines={5}
                          textAlignVertical="top"
                          style={{
                            borderLeftWidth: 1,
                            borderRadius: 5,
                            marginBottom: 20,
                          }}
                          placeholder="here..."
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
                            width: 90,
                            backgroundColor: '#078ca9',
                          }}
                        />
                      </View>
                    )}
                  </Formik>

                  <TouchableHighlight>
                    <Button
                      buttonStyle={{
                        borderRadius: 10,
                        width: 70,
                        backgroundColor: '#078ca9',
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
