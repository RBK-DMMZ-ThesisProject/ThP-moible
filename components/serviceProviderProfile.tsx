import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StatusBar,
  Modal,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import NavigationService from './NavigationService.js';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import {Formik} from 'formik';
import {connect, Dispatch} from 'react-redux';
import {changeActivityIndicatorState} from '../state/actions';
import {openInbox} from 'react-native-email-link';

import {
  Input,
  Avatar,
  Button,
  Text,
  Image,
  Icon,
  ListItem,
  Card,
  Overlay,
  Rating,
  AirbnbRating,
} from 'react-native-elements';
import HandyHeader from './HandyHeader';
import {Linking} from 'react-native';

export interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  activityIndicatorState: boolean;
  changeActivityIndicatorState: any;
  profileId: string;
  hasProfile: boolean;
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
      dateOfBirth: new Date(),
      ServiceCategory: '',
    },
    token: '',
    reviews: [],
    isVisible: false,
    modalVisible: false,
    isFavorite: false,
    ratingGiven: 0,
    reviewAdded: false,
    errorMsg: '',
    profileId: '',
  };

  constructor(props: Props) {
    super(props);
    this.props.changeActivityIndicatorState(true);
  }

  //@Function: componentDidMount
  //@Description:  fetch initial data of the service provider
  componentDidMount() {
    const userId = this.props.navigation.getParam('userId');
    this.setState({
      profileId: userId,
    });
    // fetch the profile data
    fetchProfileData(this);
    async function fetchProfileData(context: any) {
      context.props.changeActivityIndicatorState(true);
      var SharedPreferences = require('react-native-shared-preferences');
      SharedPreferences.setName('handyInfo');
      SharedPreferences.getItem('handyToken', async function(value: any) {
        if (value !== null) {
          await fetch(
            'https://salty-garden-58258.herokuapp.com/mobileApi/profil',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                serviceproviderid: userId,
                token: value,
              }),
            },
          )
            .then((res: any) => res.json())
            .then((resJson: any) => {
              context.props.changeActivityIndicatorState(false);
              context.setState({
                profile: resJson.profile,
              });
              if (resJson.favs) {
                context.setState({isFavorite: true});
              }
            })
            .catch((error: any) => {
              context.props.changeActivityIndicatorState(false);
              console.error(error);
            });
          context.fetchReviews(context);
        } else {
          await fetch(
            'https://salty-garden-58258.herokuapp.com/mobileApi/profil',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                serviceproviderid: userId,
              }),
            },
          )
            .then((res: any) => res.json())
            .then((resJson: any) => {
              context.props.changeActivityIndicatorState(false);
              context.setState({
                profile: resJson.profile,
              });
            })
            .catch((error: any) => {
              context.props.changeActivityIndicatorState(false);
              console.error(error);
            });
          context.fetchReviews(context);
        }
      });
    }
  }

  componentDidUpdate(prevProps: Props, prevState: any) {
    if (
      prevProps.navigation.getParam('userId') !==
      this.props.navigation.getParam('userId')
    ) {
      const userId = this.props.navigation.getParam('userId');
      fetchProfileData(this);
      this.props.changeActivityIndicatorState(true);
      async function fetchProfileData(context: any) {
        context.props.changeActivityIndicatorState(true);
        var SharedPreferences = require('react-native-shared-preferences');
        SharedPreferences.setName('handyInfo');
        SharedPreferences.getItem('handyToken', async function(value: any) {
          if (value !== null) {
            await fetch(
              'https://salty-garden-58258.herokuapp.com/mobileApi/profil',
              {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  serviceproviderid: userId,
                  token: value,
                }),
              },
            )
              .then((res: any) => res.json())
              .then((resJson: any) => {
                context.props.changeActivityIndicatorState(false);
                context.setState({
                  profile: resJson.profile,
                });
                if (resJson.favs) {
                  context.setState({isFavorite: true});
                }
              })
              .catch((error: any) => {
                context.props.changeActivityIndicatorState(false);
                console.error(error);
              });
            context.fetchReviews(context);
          } else {
            await fetch(
              'https://salty-garden-58258.herokuapp.com/mobileApi/profil',
              {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  serviceproviderid: userId,
                }),
              },
            )
              .then((res: any) => res.json())
              .then((resJson: any) => {
                context.props.changeActivityIndicatorState(false);
                context.setState({
                  profile: resJson.profile,
                });
              })
              .catch((error: any) => {
                context.props.changeActivityIndicatorState(false);
                console.error(error);
              });
            context.fetchReviews(context);
          }
        });
      }
    }
  }

  //@Function: fetchReviews
  //@Description:  fetch the reviews of the service provider
  async fetchReviews(context: any) {
    const userId = this.props.navigation.getParam('userId');
    context.props.changeActivityIndicatorState(true);

    await fetch(
      'https://salty-garden-58258.herokuapp.com/mobileApi/getReviews',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({serviceproviderid: userId}),
      },
    )
      .then((res: any) => res.json())
      .then((resJson: any) => {
        context.props.changeActivityIndicatorState(false);
        context.setState({
          reviews: resJson,
        });
      })
      .catch((error: any) => {
        context.props.changeActivityIndicatorState(false);
        console.error(error);
      });
  }

  //@Function: saveReview
  //@Description:  save a review for the service provider
  saveReview(values: any) {
    if (values.review === '' || this.state.ratingGiven === 0) {
      this.setState({
        errorMsg: 'Please make sure to fill the rating and the review...',
      });
    } else {
      const userId = this.props.navigation.getParam('userId');
      var SharedPreferences = require('react-native-shared-preferences');
      SharedPreferences.setName('handyInfo');
      SharedPreferences.getItem('handyToken', async (value: any) => {
        if (value !== null) {
          this.props.changeActivityIndicatorState(true);

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
                rate: this.state.ratingGiven,
                serviceproviderid: userId,
              }),
            },
          )
            .then((res: any) => {
              return res.json();
            })
            .then((resJson: any) => {
              this.props.changeActivityIndicatorState(false);
              this.setModalVisible(!this.state.modalVisible);
              this.fetchReviews(this);
            })
            .catch((error: any) => {
              this.props.changeActivityIndicatorState(false);
              console.error(error);
            });
        }
      });
    }
  }

  //@function: addFav
  //@Description: add a favorite or remove it
  addFav() {
    const userId = this.props.navigation.getParam('userId');
    var SharedPreferences = require('react-native-shared-preferences');
    SharedPreferences.setName('handyInfo');
    this.props.changeActivityIndicatorState(true);
    SharedPreferences.getItem('handyToken', async (value: any) => {
      if (value !== null) {
        this.props.changeActivityIndicatorState(true);
        if (!this.state.isFavorite) {
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
            .then((res: any) => {
              return res.json();
            })
            .then((resJson: any) => {
              this.props.changeActivityIndicatorState(false);
              this.setState({
                isFavorite: resJson.msg,
              });
            })
            .catch((error: any) => {
              this.props.changeActivityIndicatorState(false);
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
              body: JSON.stringify({serviceproviderid: userId, customerID: x}),
            },
          )
            .then((res: any) => {
              return res.json();
            })
            .then((resJson: any) => {
              this.props.changeActivityIndicatorState(false);
              this.setState({
                isFavorite: resJson.msg,
              });
            })
            .catch((error: any) => {
              this.props.changeActivityIndicatorState(false);
              console.error(error);
            });
        }
      } else {
        this.props.navigation.navigate('SignIn', {
          nextPage: 'ProviderProfile',
          userId: userId,
        });
      }
    });
  }
  //@Function: setModalVisible
  //@Description: open modal for adding review
  setModalVisible(visible: any) {
    const userId = this.props.navigation.getParam('userId');
    var SharedPreferences = require('react-native-shared-preferences');
    SharedPreferences.setName('handyInfo');
    SharedPreferences.getItem('handyToken', (value: any) => {
      if (value === null) {
        NavigationService.navigate('SignIn', {
          nextPage: 'ProviderProfile',
          userId: userId,
        });
      } else {
        this.setState({modalVisible: visible});
      }
    });
  }
  //@Function: isFave
  //@Description: change the color of the favorite star
  isFave() {
    if (this.state.isFavorite) {
      return '#078ca9';
    } else {
      return '#666';
    }
  }

  //@Function: addReview
  //@Description:  adding review
  addReview() {
    return (
      <Overlay
        isVisible={this.state.isVisible}
        onBackdropPress={() => this.setState({isVisible: false})}>
        <Text>Add review</Text>
      </Overlay>
    );
  }

  //@Function: ratingCompleted
  //@Description: set rating state
  ratingCompleted(rating: any) {
    this.setState({rating: rating});
  }

  render() {
    const {navigation} = this.props;
    const {profile, ratingGiven, reviews} = this.state;
    var email = profile.email;
    var dateOfBirth = new Date();
    let age = 0;

    if (profile.dateOfBirth) {
      dateOfBirth = profile.dateOfBirth;
      let yearBirth = parseInt(dateOfBirth.toString().substring(0, 4));
      let currentYear = new Date().getFullYear();
      age = currentYear - yearBirth;
    }

    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{flex: 1}}>
          <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
            <HandyHeader navigation={navigation} title="Profile" />
            {this.props.activityIndicatorState ? (
              <View style={[styles.loading]}>
                <ActivityIndicator size="large" color="#c5df16" />
              </View>
            ) : null}
            <View style={{flex: 3, alignItems: 'center'}}>
              <Avatar
                size="xLarge"
                rounded
                source={{
                  uri: profile.userImg,
                }}
                title="pic"
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#666',
                  marginTop: 10,
                  marginBottom: 10,
                }}>
                {/* {profile.firstName + ' ' + profile.familyName} */}
                {profile.userName}
              </Text>
            </View>
            {this.props.hasProfile &&
            this.props.navigation.getParam('userId') ===
              this.props.profileId ? null : (
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
            )}

            <Card>
              <ListItem
                containerStyle={{marginTop: -15}}
                title="Phone"
                subtitle={profile.userMobileNum}
                leftIcon={{
                  name: 'phone',
                }}
              />
              <ListItem
                containerStyle={{marginTop: -15}}
                title="Email"
                subtitle={profile.email}
                leftIcon={{
                  name: 'email',
                }}
                onPress={() =>
                  Linking.openURL(
                    'mailto:' + email + '?subject=SendMail&body=Description',
                  )
                }
              />
              <ListItem
                containerStyle={{marginTop: -15}}
                title="Age"
                subtitle={age + ''}
                leftIcon={{
                  name: 'book',
                }}
              />
              <ListItem
                containerStyle={{marginTop: -15, marginBottom: -15}}
                title="Service Category"
                subtitle={profile.ServiceCategory}
                leftIcon={{
                  name: 'flag',
                }}
              />
            </Card>
            <Card title="Service Description">
              <View>
                <Image
                  style={{width: 300, height: 300, borderRadius: 8}}
                  resizeMode="cover"
                  source={{uri: profile.userWorkImg[0]}}
                />
              </View>
              <Text style={{marginBottom: 20, marginTop: 20}}>
                {profile.ServiceDescription}
              </Text>
              <Overlay
                isVisible={this.state.isVisible}
                onBackdropPress={() => this.setState({isVisible: false})}>
                <Text>Hello from Overlay!</Text>
              </Overlay>
            </Card>
            <Card title="REVIEWS">
              <View>
                {reviews.map((rev: any, i: number) => {
                  var dateAdded = new Date(
                    rev.review['dataAdded'],
                  ).toDateString();
                  return (
                    <View style={{marginBottom: 20}} key={i}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View style={{}}>
                          <Text style={{color: '#078ca9', fontSize: 15}}>
                            {rev.name}
                          </Text>
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
                      <Text
                        style={{color: '#999', fontSize: 11, paddingLeft: 10}}>
                        {dateAdded}
                      </Text>
                      <Text
                        style={{color: '#333', fontSize: 15, paddingLeft: 10}}>
                        {rev.review['review']}
                      </Text>
                    </View>
                  );
                })}
              </View>
              {this.props.hasProfile &&
              this.props.navigation.getParam('userId') ===
                this.props.profileId ? null : (
                <View style={{alignContent: 'center'}}>
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
              )}
              <Modal
                animationType="slide"
                visible={this.state.modalVisible}
                onRequestClose={() => {
                  Alert.alert('Make sure to send the review or close ...');
                }}>
                <Card title="Give A Review">
                  <View>
                    <Text style={{color: '#F44324', fontSize: 15}}>
                      {this.state.errorMsg}
                    </Text>
                  </View>
                  {this.props.activityIndicatorState ? (
                    <View style={[styles.loading]}>
                      <ActivityIndicator size="large" color="#c5df16" />
                    </View>
                  ) : null}
                  <AirbnbRating
                    count={5}
                    defaultRating={0}
                    onFinishRating={(rating: any) => {
                      this.setState({ratingGiven: rating});
                    }}
                    size={18}
                  />
                  <Formik
                    initialValues={{review: ''}}
                    onSubmit={(values: any) => this.saveReview(values)}>
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
                      this.setState({modalVisible: false});
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

//@Function: mapDispatchToProps
//@Description: pass functions as props of the component
const mapDispatchToProps = (dispatch: Dispatch) => ({
  changeActivityIndicatorState: (state: boolean) => {
    dispatch(changeActivityIndicatorState(state));
  },
});

//@Function: mapStateToProps
//@Description: pass properties as props of the component
const mapStateToProps = (appState: any) => {
  return {
    activityIndicatorState: appState.changeGeneralState.activityIndicatorState,
    hasProfile: appState.changeGeneralState.hasProfile,
    profileId: appState.changeGeneralState.profileId,
  };
};

//@Description: style the activity indicator
const styles = StyleSheet.create({
  loading: {
    position: 'relative',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999999999
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(serviceProviderProfile);
