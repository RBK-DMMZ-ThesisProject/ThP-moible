import React from 'react';
import { View, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import {
  Card,
  ListItem,
  Button,
  Icon,
  Rating,
  Text,
} from 'react-native-elements';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatch } from 'react-redux';
import {
  changeActivityIndicatorState,
} from '../state/actions';
import HandyHeader from './HandyHeader';
// import {connect} from 'react-redux';
// import * as types from '../state/types';
// import {Dispatch} from 'react-redux';
export interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  activityIndicatorState: boolean;
  changeActivityIndicatorState: any;
}
class Favorites extends React.Component<Props, object> {
  state = {
    favorites: [],
  };
  constructor(props) {
    super(props);
    this.props.changeActivityIndicatorState(true);
  }
  componentDidMount() {
    var that = this;
    this.props.changeActivityIndicatorState(true);
    var SharedPreferences = require('react-native-shared-preferences');
    SharedPreferences.setName('handyInfo');
    SharedPreferences.getItem('handyToken', async function (value: any) {
      if (value === null) {
        console.log('no token');
        that.props.navigation.navigate('SignIn');
      } else {
        await fetch('https://salty-garden-58258.herokuapp.com/mobileApi/favorites', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customerID: value }),
        })
          .then(res => res.json())
          .then(resJson => {
            that.props.changeActivityIndicatorState(false);
            that.setState({
              favorites: resJson.favorites,
            });
          })
          .catch(error => {
            that.props.changeActivityIndicatorState(false);
            console.error(error);
          });
      }
    });
  }

  render() {
    const { favorites } = this.state;
    const { navigation } = this.props;
    return (
      <>
        <HandyHeader navigation={navigation} title={'Favorites'} />
        {favorites.map((provider, i) => {
          console.log('prodived id in favs**********', provider)
          return (
            <Card containerStyle={{ padding: 5 }} key={i}>
              <View >
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ProviderProfile', {
                      userId: provider['id'],
                    })
                  }>
                  <ListItem
                    leftAvatar={{
                      title: provider['userName'][0],
                      source: { uri: provider['userImg'] },
                    }}
                    title={provider['userName']}
                    subtitle={provider['ServiceCategory']}
                    chevron></ListItem>
                </TouchableOpacity>
              </View>
            </Card>
          );
        })}
        {this.props.activityIndicatorState ? (
          <View style={[styles.loading]}>
            <ActivityIndicator size="large" color="#c5df16" />
          </View>
        ) : (
            <Text></Text>
          )}
      </>
    );
  }
}
//@Description: pass functions as props of the component
const mapDsipatchToProps = (dispatch: Dispatch) => ({

  changeActivityIndicatorState: (state: boolean) => {
    dispatch(changeActivityIndicatorState(state));
  },
});

//@Description: pass propereties as props of the component
const mapStateToProps = (
  appstate: any,
) => {
  return {

    activityIndicatorState: appstate.changeGeneralState.activityIndicatorState,

  };
};
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
)(Favorites);
