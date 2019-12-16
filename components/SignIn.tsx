import React, {SyntheticEvent} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert,
  Platform,
  Keyboard,
  AsyncStorage,
} from 'react-native';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import {Input, Button, Image} from 'react-native-elements';

import HandyHeader from './HandyHeader';
import {any} from 'prop-types';
import {connect} from 'react-redux';
import {menuList} from '../state/reducer';
import * as types from '../state/types';
import {Dispatch} from 'react-redux';
import {
  changeStateItem,
  changeStateSignedIn,
  setProfileId,
  changeHasProfileState,
  setUserId,
} from '../state/actions';
import validate from 'validate.js';
export interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  hasProfile: boolean;
  changeState: any;
  changeHasProfileState: any;
  changeSignedInState: any;
  setProfileId: any;
}

class SignIn extends React.Component<Props, object> {
  state = {
    // personal info
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
    signInLoading: false,
    loginError: '',
  };
  // check user has a profile
  async getUserHasProfile(token: string) {
    var response = await fetch(
      'https://salty-garden-58258.herokuapp.com/mobileApi/hasProfile',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userToken: token}),
      },
    );
    var resJson = await response.json();
    if (resJson.result) {
      this.props.changeHasProfileState(1);
      this.props.setProfileId(resJson.profileId);
    }

    // .catch(error => {
    //     console.error(error);
    //     that.props.changeActivityIndicatorState(false);
    // });
  }
  // @function: signIn
  // @description:sign in to our application
  //
  async signIn() {
    console.log(this.state);
    if (
      this.state.emailError === undefined &&
      this.state.passwordError === undefined
    ) {
      const {navigation} = this.props;
      this.setState({
        signInLoading: true,
        isSbumitted: true,
      });
      var userData = {
        email: this.state.email.trim(),
        password: this.state.password.trim(),
      };
      fetch('https://salty-garden-58258.herokuapp.com/auth/adminLogin', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
        .then(res => res.json())
        .then(resJson => {
          if (resJson.token !== undefined) {
            var SharedPreferences = require('react-native-shared-preferences');
            SharedPreferences.setName('handyInfo');
            SharedPreferences.setItem('handyToken', resJson.token);
            this.props.changeSignedInState(1);
            this.getUserHasProfile(resJson.token);
            if (this.props.hasProfile) {
              this.props.changeState(20); // view profile
            }

            navigation.navigate(navigation.getParam('nextPage'));
          } else {
            this.setState({
              loginError: resJson.msg,
              email: '',
              password: '',
              signInLoading: false,
            });
            // check if a user is a service provider to add also 20
          }
        })
        .catch(error => {
          console.error(error);
          this.setState({
            loginError: 'An Erorr Ocurred Try again',
            email: '',
            password: '',
            signInLoading: false,
          });
          // process erro messages
        });
    }
  }
  render() {
    const {navigation} = this.props;
    const {
      email,
      password,
      signInLoading,
      emailError,
      passwordError,
      loginError,
    } = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{flex: 1}}>
          <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
            <HandyHeader navigation={navigation} title="Sign In" />
            <View
              style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={require('./../assets/Handy.png')}
                style={{flex: 2, width: 150, height: 190}}
              />
            </View>

            <Input
              inputStyle={{
                backgroundColor: '#f2f2f2',
                borderRadius: 5,
                color: '#078ca9',
              }}
              label="Email:"
              labelStyle={{fontSize: 20, color: '#078ca9'}}
              onChangeText={email => this.setState({email})}
              keyboardType="email-address"
              onBlur={() => {
                this.setState({
                  emailError: validate(
                    {email: email},
                    {email: {presence: true, email: true}},
                    {format: 'flat'},
                  ),
                });
              }}
              placeholder={'Enter your email...'}
              placeholderTextColor="#999"
              errorMessage={emailError}>
              {email}
            </Input>

            <Input
              inputStyle={{
                backgroundColor: '#f2f2f2',
                borderRadius: 5,
                color: '#078ca9',
              }}
              label="Password:"
              secureTextEntry={true}
              labelStyle={{fontSize: 20, color: '#078ca9'}}
              onChangeText={password => this.setState({password})}
              onBlur={() =>
                this.setState({
                  passwordError: validate(
                    {password: password},
                    {password: {presence: true, length: {minimum: 6}}},
                    {format: 'flat'},
                  ),
                })
              }
              placeholder={'Enter your password...'}
              placeholderTextColor="#999"
              errorMessage={passwordError}>
              {password}
            </Input>

            <Text
              style={{
                fontSize: 16,
                lineHeight: 20,
                color: '#67A443',
                textAlign: 'center',
              }}>
              {' '}
              {loginError}
            </Text>

            <View style={{flex: 1, margin: 10}}>
              <Button
                buttonStyle={{
                  backgroundColor: '#078ca9',
                  width: 100 + '%',
                }}
                titleStyle={{
                  color: '#f2f2f2',
                }}
                title="Sign in"
                onPress={() => this.signIn()}
                loading={signInLoading}></Button>
            </View>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 20,
                color: '#67A443',
                textAlign: 'center',
              }}>
              {' '}
              Don't You Have an Account?
            </Text>
            <View style={{flex: 1, margin: 10}}>
              <Button
                buttonStyle={{
                  backgroundColor: '#078ca9',
                  width: 100 + '%',
                }}
                titleStyle={{
                  color: '#f2f2f2',
                }}
                title="Sign up"
                onPress={() =>
                  navigation.navigate('SignUp', {nextPage: 'AddProfileScreen'})
                }></Button>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}
const mapDipatchToProps = (dispatch: Dispatch) => ({
  changeState: (id: number, state: number) => {
    dispatch(changeStateItem(id, state));
  },
  changeSignedInState: (state: number) => {
    dispatch(changeStateSignedIn(state));
  },
  changeHasProfileState: (state: number) => {
    dispatch(changeHasProfileState(state));
  },
  setUserId: (userId: number) => {
    dispatch(setUserId(userId));
  },
  setProfileId: (profileId: string) => {
    dispatch(setProfileId(profileId));
  },

  // other callbacks go here...
});
const mapStateToProps = (
  appstate: any,
  navigation: NavigationScreenProp<NavigationState, NavigationParams>,
) => ({
  items: appstate,
  hasProfile: appstate.changeGeneralState.hasProfile,
  profileId: appstate.changeGeneralState.profileId,
  navigation: navigation,
});

export default connect(null, mapDipatchToProps)(SignIn);
