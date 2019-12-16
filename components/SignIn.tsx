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
import {changeStateItem, changeStateSignedIn} from '../state/actions';

export interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  changeState: any;
  changeSignedInState: any;
}

class SignIn extends React.Component<Props, object> {
  state = {
    // personal info
    email: '',
    password: '',
    signInLoading: false,
  };

  // @function: signIn
  // @description:sign in to our application
  //
  async signIn() {
    console.log(this.state);
    const {navigation} = this.props;
    this.setState({
      signInLoading: true,
      isSbumitted: true,
    });
    var userData = {
      email: this.state.email,
      password: this.state.password,
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
        }
        console.log('responbgigyiugiugise: ', resJson);
        this.setState({
          email: '',
          password: '',
          signInLoading: false,
        });
        // check if a user is a service provider to add also 20
        this.props.changeSignedInState(1);

        // if(this.props.hasProfile()){
        //     this.props.changeState(20); // view profile
        // }

        // this.props.changeState(3);
        // this.props.changeState(4);
        // this.props.changeState(7);
        // this.props.changeState(8);
        // this.props.changeState(9);
        // this.props.changeState(10);
        // this.props.changeState(11);
        // this.props.changeState(30);
        navigation.navigate(navigation.getParam('nextPage'));
      })
      .catch(error => {
        console.error(error);
        this.setState({
          email: '',
          password: '',
          signInLoading: false,
        });
        // process erro messages
      });
  }
  render() {
    const {navigation} = this.props;
    const {email, password, signInLoading} = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{flex: 1}}>
          <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
            <HandyHeader navigation={navigation} title="Sign In" />
            <View
              style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={require('./../assets/shaghelohm.png')}
                style={{flex: 2, width: 200, height: 200}}
              />
            </View>

            <Input
              inputStyle={{
                backgroundColor: '#dff0f6',
                borderRadius: 5,
                color: '#91cde0',
              }}
              label="Email:"
              labelStyle={{fontSize: 20, color: '#91cde0'}}
              onChangeText={email => this.setState({email})}
              placeholder={'Enter your email...'}
              placeholderTextColor="#91cde0">
              {email}
            </Input>

            <Input
              inputStyle={{
                backgroundColor: '#dff0f6',
                borderRadius: 5,
                color: '#91cde0',
              }}
              label="Password:"
              secureTextEntry={true}
              labelStyle={{fontSize: 20, color: '#91cde0'}}
              onChangeText={password => this.setState({password})}
              placeholder={'Enter your password...'}
              placeholderTextColor="#91cde0">
              {password}
            </Input>
            <View style={{flex: 1, margin: 10}}>
              <Button
                buttonStyle={{
                  backgroundColor: '#91cde0',
                  width: 100 + '%',
                }}
                titleStyle={{
                  color: '#dff0f6',
                }}
                title="Sign in"
                onPress={() => this.signIn()}
                loading={signInLoading}></Button>
            </View>
            <Text>You Don't Have an Account?</Text>
            <View style={{flex: 1, margin: 10}}>
              <Button
                buttonStyle={{
                  backgroundColor: '#91cde0',
                  width: 100 + '%',
                }}
                titleStyle={{
                  color: '#dff0f6',
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
  changeState: (id: number) => {
    dispatch(changeStateItem(id));
  },
  changeSignedInState: (state: number) => {
    dispatch(changeStateSignedIn(state));
  },
  // other callbacks go here...
});
const mapStateToProps = (
  state: types.MenuItemsListState,
  navigation: NavigationScreenProp<NavigationState, NavigationParams>,
) => ({
  items: state,
  navigation: navigation,
});

export default connect(null, mapDipatchToProps)(SignIn);
