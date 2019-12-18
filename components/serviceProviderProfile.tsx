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
import { Formik } from 'formik';

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
import { any } from 'prop-types';
import { Linking } from 'react-native';
import stripe from 'tipsi-stripe';
import axios from 'axios';
import { throwStatement } from '@babel/types';
import Favorites from './Favorites';
import { Context } from 'jest-runtime/build/types';
stripe.setOptions({
  publishableKey: 'pk_test_M0LfaNyjOIqs4RL9bqklDbb500YZpiXM1H',
});
export interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

class serviceProviderProfile extends React.Component<Props, object> {
  state = {
    profile: {
      userImg: 'SP',
      userName: '',
      userMobileNum: '',
      ServiceDescription: '',
      email: '',
      userWorkImg: ['WS'],
      dateOfBirth: '',
      ServiceCategory: ''

    },
    token: '',
    reviews: [],
    isVisible: false,
    modalVisible: false,
    isfavorite: false,
    ratingGiven: 0,
    reviewAdded: false,
    errorMsg: '',
  };

  componentDidMount() {
    const userId = this.props.navigation.getParam('userId');
    fetchProfileData(this);
    async function fetchProfileData(context: Object) {
      var SharedPreferences = require('react-native-shared-preferences');
      SharedPreferences.setName('handyInfo');

      SharedPreferences.getItem('handyToken', async function (value: any) {
        if (value !== null) {
          await fetch('https://salty-garden-58258.herokuapp.com/mobileApi/profil', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              serviceproviderid: userId,
              token: value,
            }),
          })
            .then(res => res.json())
            .then(resJson => {
              console.log('response from server', resJson);
              context.setState({
                profile: resJson.profile,
              });
              if (resJson.favs) {
                context.setState({ isfavorite: true });
              }
            })
            .catch(error => {
              console.log('hello from error')
              console.error(error);
            });
          context.fetchReviews(context);

        } else {
          await fetch('https://salty-garden-58258.herokuapp.com/mobileApi/profil', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              serviceproviderid: userId,
            }),
          })
            .then(res => res.json())
            .then(resJson => {
              console.log('response from server', resJson);
              context.setState({
                profile: resJson.profile,
              });

            })
            .catch(error => {
              console.log('hello from error')
              console.error(error);
            });
          context.fetchReviews(context);

        }
      });
    }

  }
  async fetchReviews(context: object) {
    const userId = this.props.navigation.getParam('userId');
    console.log('helooooooooooooooo', userId);
    await fetch('https://salty-garden-58258.herokuapp.com/mobileApi/getReviews', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ serviceproviderid: userId }),
    })
      .then(res => res.json())
      .then(resJson => {
        console.log('helow after fetching reveis', resJson);
        context.setState({
          reviews: resJson,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
  saveReview(values: any) {
    if (values.review === '' || this.state.ratingGiven === 0) {
      this.setState({
        errorMsg: 'Please make sure to fill the rating and the review...'
      })
    } else {
      var SharedPreferences = require('react-native-shared-preferences');
      SharedPreferences.setName('handyInfo');
      var that = this;
      const userId = that.props.navigation.getParam('userId');

      SharedPreferences.getItem('handyToken', async function (value: any) {
        if (value !== null) {
          console.log('save reveiwsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsd', { review: values.review, token: value, rate: that.state.ratingGiven, serviceproviderid: userId });

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
              return res.json();
            })
            .then(resJson => {
              console.log('reveis response', resJson);
              that.setModalVisible(!that.state.modalVisible);
              that.fetchReviews(that);
            })
            .catch(error => {
              console.error(error);
            });
        }
      });
    }
  }
  addFav() {
    const userId = this.props.navigation.getParam('userId');
    console.log('userId::::::', userId);
    var SharedPreferences = require('react-native-shared-preferences');
    SharedPreferences.setName('handyInfo');
    var that = this;
    SharedPreferences.getItem('handyToken', async function (value: any) {
      if (value !== null) {
        const x = value;
        console.log(value);
        if (!that.state.isfavorite) {
          await fetch(
            'https://salty-garden-58258.herokuapp.com/mobileApi/addfavorite',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ serviceproviderid: userId, customerID: x }),
            },
          )
            .then(res => {
              console.log('**************************', res)

              return res.json();

            })
            .then(resJson => {
              console.log('**************************', resJson)

              that.setState({
                isfavorite: resJson.msg,
              });
            })
            .catch(error => {
              console.error(error);
            });
        } else {

          await fetch(
            'https://salty-garden-58258.herokuapp.com/mobileApi/deletefavorite',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ serviceproviderid: userId, customerID: x }),
            },
          )
            .then(res => {
              console.log('**************************', res)
              return res.json();

            })
            .then(resJson => {
              console.log('**************************', resJson)
              that.setState({
                isfavorite: resJson.msg,
              });
            })
            .catch(error => {
              console.error(error);
            });
        }
      } else {
        that.props.navigation.navigate('SignIn', {
          nextPage: 'ProviderProfile',
          userId: userId,
        });
      }

    });
  }
  hireSP() {
    var SharedPreferences = require('react-native-shared-preferences');
    SharedPreferences.setName('handyInfo');
    var that = this;
    SharedPreferences.getItem('handyToken', async function (value: any) {
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
            body: JSON.stringify({ serviceproviderid: userId, customerID: x }),
          },
        )
          .then(res => {
            return res.json();
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
    this.setState({ modalVisible: visible });
  }
  isFave() {
    if (this.state.isfavorite) {
      return '#078ca9';
    } else {
      return '#666';
    }
  }
  addReview() {
    return (
      <Overlay
        isVisible={this.state.isVisible}
        onBackdropPress={() => this.setState({ isVisible: false })}>
        <Text>Add review</Text>
      </Overlay>
    );
  }

  ratingCompleted(rating: any) {
    this.setState({ rating: rating });
  }
  render() {
    const { navigation } = this.props;
    const { profile, ratingGiven, reviews } = this.state;
    const dateOfBirth = (new Date(profile.dateOfBirth)).toDateString();
    console.log('profile', profile.userWorkImg[0]);
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
            <HandyHeader navigation={navigation} title="Profile" />
            <View style={{ flex: 3, alignItems: 'center' }}>
              <Avatar
                size="xlarge"
                rounded
                source={{
                  uri: profile.userImg,
                }}
                title="pic"
              />
              <Text
                style={{ fontSize: 18, fontWeight: 'bold', color: '#666', marginTop: 10, marginBottom: 10 }}>
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
                color="#078ca9"
                onPress={() => {
                  Linking.openURL(`tel:${profile.userMobileNum}`);
                }}
              />

              <Icon
                raised
                name="message"
                color="#078ca9"
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
                containerStyle={{ marginTop: -15 }}
                title="Phone"
                subtitle={profile.userMobileNum}
                leftIcon={{
                  name: 'phone',
                }}
              />
              <ListItem
                containerStyle={{ marginTop: -15 }}
                title="Email"
                subtitle={profile.email}
                leftIcon={{
                  name: 'email',
                }}
              />
              <ListItem
                containerStyle={{ marginTop: -15 }}
                title="Birth Date"
                subtitle={dateOfBirth}
                leftIcon={{
                  name: 'book',
                }}
              />
              <ListItem
                containerStyle={{ marginTop: -15, marginBottom: -15 }}
                title="Service Category"
                subtitle={profile.ServiceCategory}
                leftIcon={{
                  name: 'flag',
                }}
              />
            </Card>
            <Card
              title="Service Description"

            >
              <View>
                <Image
                  style={{ width: 300, height: 300, borderRadius: 8 }}
                  resizeMode="cover"
                  source={{ uri: profile.userWorkImg[0] }}
                />
              </View>
              <Text style={{ marginBottom: 20, marginTop: 20 }}>
                {profile.ServiceDescription}
              </Text>
              <Overlay
                isVisible={this.state.isVisible}
                onBackdropPress={() => this.setState({ isVisible: false })}>
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
                {reviews.map((rev, i) => {
                  console.log('rev***********', rev);
                  var dateAdded = (new Date(rev.review['dataAdded'])).toDateString();
                  return (

                    <View style={{ marginBottom: 20 }}>

                      <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-between' }}>
                        <View style={{}}>

                          <Text style={{ color: '#078ca9', fontSize: 15 }}>{rev.name}</Text>
                        </View>
                        <View style={{}}>
                          <Rating
                            type="custom"
                            ratingColor="#078ca9"
                            ratingBackgroundColor="#f2f2f2"
                            readonly
                            imageSize={18}
                            startingValue={rev.review['rate']}
                          />
                        </View>
                      </View>
                      <Text style={{ color: '#999', fontSize: 11, paddingLeft: 10 }}>{dateAdded}</Text>
                      <Text
                        style={{ color: '#333', fontSize: 15, paddingLeft: 10 }}
                      >{rev.review['review']}</Text>
                    </View>
                  );
                })}
              </View>

              <View style={{ alignContent: 'center' }}>
                <Button
                  icon={<Icon name="check" color="#f2f2f2" />}
                  buttonStyle={{
                    borderRadius: 8,
                    marginLeft: 0,
                    marginRight: 0,
                    marginBottom: 0,
                    marginTop: 20,
                    width: 150,
                    alignSelf: 'center',
                    backgroundColor: '#078ca9',
                  }}
                  title="ADD REVIEW"
                  onPress={() => {
                    this.setModalVisible(true);
                  }}
                />
              </View>


              <Modal
                animationType="slide"
                visible={this.state.modalVisible}
                onRequestClose={() => {
                  Alert.alert('Make sure to send the review or close ...');
                }}>
                <Card title="Give A Review">
                  <View><Text style={{ color: '#F44324', fontSize: 15 }}>{this.state.errorMsg}</Text></View>
                  <AirbnbRating
                    count={5}
                    defaultRating={0}
                    onFinishRating={rating => {
                      this.setState({ ratingGiven: rating });
                      console.log('ratingGiven', ratingGiven);
                    }}
                    size={18}

                  // ratingColor={'blue'}
                  />
                  <Formik
                    initialValues={{ review: '' }}
                    onSubmit={values => this.saveReview(values)}>
                    {({ handleChange, handleBlur, handleSubmit, values }) => (
                      <View style={{ marginTop: 20 }}>
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
                            marginTop: 20,
                            marginLeft: 10,
                            backgroundColor: '#078ca9',
                          }}
                        />
                      </View>
                    )}
                  </Formik>


                  <Button
                    buttonStyle={{
                      position: 'absolute',
                      top: -40,
                      left: 220,
                      borderRadius: 10,
                      width: 70,
                      backgroundColor: '#078ca9',
                    }}
                    title="CLOSE"
                    onPress={() => {
                      this.setState({ modalVisible: false });

                    }}
                  />

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
