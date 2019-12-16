import React from 'react';
import {View, TouchableOpacity, Alert} from 'react-native';
import {Card, ListItem, Button, Icon, Rating} from 'react-native-elements';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import HandyHeader from './HandyHeader';
// import {connect} from 'react-redux';
// import * as types from '../state/types';
// import {Dispatch} from 'react-redux';
export interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
class Favorites extends React.Component<Props, object> {
  state = {
    favorites: [],
  };
  componentDidMount() {
    var that = this;
    var SharedPreferences = require('react-native-shared-preferences');
    SharedPreferences.setName('handyInfo');
    SharedPreferences.getItem('handyToken', function(value: any) {
      if (value === null) {
        console.log('no token');
        that.props.navigation.navigate('SignIn');
      } else {
        fetch('https://salty-garden-58258.herokuapp.com/mobileApi/favorites', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({customerID: value}),
        })
          .then(res => res.json())
          .then(resJson => {
            console.log('hjbyigvbytigiytgi7: ', resJson);
            that.setState({
              favorites: resJson,
            });
          })
          .catch(error => {
            console.error(error);
          });
      }
    });
  }

  render() {
    const {favorites} = this.state;
    const {navigation} = this.props;
    return (
      <>
        <HandyHeader navigation={navigation} title={'Favorites'} />
        <Card containerStyle={{padding: 5}}>
          {console.log('favorites', favorites)}
          {favorites.map((provider, i) => {
            return (
              <View key={i}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ProviderProfile', {
                      userId: provider['_id'],
                    })
                  }>
                  <ListItem
                    leftAvatar={{
                      title: provider['userName'][0],
                      source: {uri: provider['userImg']},
                    }}
                    title={provider['userName']}
                    chevron></ListItem>
                </TouchableOpacity>
              </View>
            );
          })}
        </Card>
      </>
    );
  }
}

export default Favorites;
