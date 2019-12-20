import React, {Component} from 'react';
import {Text, View, StyleSheet, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import NavigationService from './NavigationService.js';
import {Dispatch} from 'react-redux';
import {
  changeStateItem,
  changeStateSignedIn,
  changeHasProfileState,
  changeActivityIndicatorState,
  setUserId,
  setProfileId,
} from '../state/actions';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import {Divider, Avatar} from 'react-native-elements';
import {stat} from 'fs';
// import {Avatar} from 'react-native-gifted-chat';

export interface Props {
  items: [];
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  changeState: any;
  login: number;
  hasProfile: number;
  profileId: string;
  activityIndicatorState: boolean;
  changeActivityIndicatorState: any;
  changeSignedInState: any;
  changeHasProfileState: any;
  setUserId: any;
  setProfileId: any;
}

class CustomHamburgerMenuDrawer extends Component<Props> {
  // only update chart if the data has changed
  state = {
    userName: '',
  };
  constructor(props: Props) {
    super(props);
    var SharedPreferences = require('react-native-shared-preferences');
    SharedPreferences.setName('handyInfo');
    var that = this;
    SharedPreferences.getItem('handyToken', function(value: any) {
      console.log(value);
      if (value !== null) {
        that.props.changeSignedInState(1);
        // check if the user has profile
        that.props.changeActivityIndicatorState(true);
        // fetch from sever
        that.getUserHasProfile(value);
        that.getUsername(value, that);
      }
    });
  }

  componentDidUpdate(prevProps: Props, prevState: Props) {
    if (
      prevProps.hasProfile !== this.props.hasProfile &&
      this.props.hasProfile === 1
    ) {
      if (!!this.props.hasProfile) {
        this.props.changeState(20, 1);
        this.props.changeState(7, 0);
      }
    }
    if (prevProps.login !== this.props.login) {
      if (!!this.props.login) {
        // check if has profile
        this.props.changeState(3, 0);
        this.props.changeState(4, 0);
        this.props.changeState(8, 1);
        // this.props.changeState(9, 1);
        // this.props.changeState(10, 1);
        this.props.changeState(11, 1);
        this.props.changeState(30, 1);
      }
    }
  }
  async getUsername(value: any, context: any) {
    var response = await fetch(
      'https://salty-garden-58258.herokuapp.com/mobileApi/getUser',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({customerID: value}),
      },
    );
    var resJson = await response.json();
    if (resJson[0].userName) {
      context.setState({userName: resJson[0].userName});
    }
  }

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
    this.props.changeActivityIndicatorState(false);

    // .catch(error => {
    //     console.error(error);
    //     that.props.changeActivityIndicatorState(false);
    // });
  }
  navigateToScreen(page: string, params: object) {
    console.log('hello from view profile', page);

    NavigationService.navigate(page, params);
  }
  logout() {
    // change state login ??????????

    var SharedPreferences = require('react-native-shared-preferences');
    SharedPreferences.setName('handyInfo');
    SharedPreferences.removeItem('handyToken');
    this.props.changeSignedInState(0);
    this.props.changeHasProfileState(0);
    this.props.setProfileId('');
    this.props.changeState(3, 1);
    this.props.changeState(4, 1);
    this.props.changeState(7, 0);
    this.props.changeState(8, 0);
    // this.props.changeState(9, 0);
    // this.props.changeState(10, 0);
    this.props.changeState(11, 0);
    this.props.changeState(20, 0);
    this.props.changeState(30, 0);
    NavigationService.navigate('Home');
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          margin: 0,
          padding: 0,
        }}>
        <View
          style={{
            width: 100 + '%',
            height: 60,
            backgroundColor: '#078ca9',
            padding: 10,
            marginBottom: 10,
          }}>
          <Text style={{fontSize: 24, fontWeight: 'bold', color: '#f2f2f2'}}>
            Handy
          </Text>
        </View>
        <View
          style={{
            width: 100 + '%',
            height: 60,
            padding: 10,
            marginBottom: 10,
          }}>
          {this.state.userName !== '' ? (
            <View style={{flex: 1, flexDirection: 'row', marginLeft: 8}}>
              <Avatar
                size="small"
                rounded
                title={this.state.userName.substring(0, 2)}
                activeOpacity={0.7}
              />
              <Text
                style={{
                  fontSize: 20,
                  textAlignVertical: 'center',
                  marginLeft: 5,
                }}>
                {this.state.userName.split(' ')[0]}
              </Text>
            </View>
          ) : null}
        </View>
        <View style={{height: 500}}>
          {this.props.items.map((item: any, index: number) => {
            console.log('index', index);
            if (item.show === 1) {
              if (item.itemtxt === 'Log out') {
                return (
                  <Text
                    key={index}
                    style={{
                      fontSize: 15,
                      textAlignVertical: 'center',
                      lineHeight: 40,
                      marginLeft: 20,
                      color: '#F44324',
                    }}
                    onPress={() => this.logout()}>
                    {item.itemtxt}
                  </Text>
                );
              }
              if (item.id === 20) {
                return (
                  <View key={index}>
                    <Text
                      key={index}
                      style={{
                        fontSize: 15,
                        textAlignVertical: 'center',
                        lineHeight: 40,
                        marginLeft: 20,
                        color: '#333',
                      }}
                      onPress={() =>
                        this.navigateToScreen(item.toPage, {
                          nextPage: nextPage,
                          userId: this.props.profileId,
                        })
                      }>
                      {item.itemtxt}
                    </Text>
                    <Divider></Divider>
                  </View>
                );
              }
              var nextPage =
                item.itemtxt === 'Sign in' || item.itemtxt === 'Sign Up'
                  ? 'Home'
                  : '';
              return (
                <View key={index}>
                  <Text
                    style={{
                      fontSize: 15,
                      textAlignVertical: 'center',
                      lineHeight: 40,
                      marginLeft: 20,
                      color: '#333',
                    }}
                    onPress={() =>
                      this.navigateToScreen(item.toPage, {nextPage: nextPage})
                    }>
                    {item.itemtxt}
                  </Text>
                  <Divider></Divider>
                </View>
              );
            }
            return;
          })}
        </View>

        {this.props.activityIndicatorState ? (
          <View style={[styles.loading]}>
            <ActivityIndicator size="large" color="#c5df16" />
          </View>
        ) : (
          <Text></Text>
        )}
      </View>
    );
  }
}

//@Description: pass propereties as props of the component
const mapStateToProps = (
  appstate: any,
  navigation: NavigationScreenProp<NavigationState, NavigationParams>,
) => {
  return {
    items: appstate.menuList,
    login: appstate.changeGeneralState.login,
    hasProfile: appstate.changeGeneralState.hasProfile,
    profileId: appstate.changeGeneralState.profileId,
    activityIndicatorState: appstate.changeGeneralState.activityIndicatorState,
    navigation: navigation,
  };
};

//@Description: pass functions as props of the component
const mapDsipatchToProps = (dispatch: Dispatch) => ({
  changeState: (id: number, state: number) => {
    dispatch(changeStateItem(id, state));
  },
  changeSignedInState: (state: number) => {
    dispatch(changeStateSignedIn(state));
  },
  changeHasProfileState: (state: number) => {
    dispatch(changeHasProfileState(state));
  },
  changeActivityIndicatorState: (state: boolean) => {
    dispatch(changeActivityIndicatorState(state));
  },
  setUserId: (userId: number) => {
    dispatch(setUserId(userId));
  },
  setProfileId: (profileId: string) => {
    dispatch(setProfileId(profileId));
  },
});

//@Description: style the activity indicator
const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default connect(
  mapStateToProps,
  mapDsipatchToProps,
)(CustomHamburgerMenuDrawer);
