import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Card, ListItem, Button, Icon, Rating} from 'react-native-elements';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import HandyHeader from './HandyHeader';
import serviceProviderProfile from './serviceProviderProfile';
export interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
class ProfilesScreen extends React.Component<Props, object> {
  state = {
    profiles: [],
  };

  componentDidMount() {
    const categoryName = this.props.navigation.getParam('categoryName');
    console.log('categoryNameeeeeeeeeee', categoryName);
    fetch('https://salty-garden-58258.herokuapp.com/mobileApi/getProfiles', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({categoryName: categoryName}),
    })
      .then(res => res.json())
      .then(resJson => {
        console.log('response: ', resJson);
        this.setState({
          profiles: resJson,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
  render() {
    const {profiles} = this.state;
    const {navigation} = this.props;
    const {rating} = this.props;

    const categoryName = this.props.navigation.getParam('categoryName');
    return (
      <>
        <HandyHeader navigation={navigation} title={categoryName} />
        <Card containerStyle={{padding: 5}}>
          {profiles.map((user, i) => {
            return (
              <View key={i}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ProviderProfile')}>
                  <ListItem
                    leftAvatar={{
                      title: user['userName'][0],
                      source: {uri: user['userImg']},
                    }}
                    title={user['userName']}
                    chevron></ListItem>
                </TouchableOpacity>
                <View style={{alignItems: 'flex-start'}}>
                  <Rating
                    type="custom"
                    ratingColor="#63b8d4"
                    ratingBackgroundColor="#eff7fa"
                    readonly
                    imageSize={20}
                    startingValue={rating}
                  />
                </View>
              </View>
            );
          })}
        </Card>
      </>
    );
  }
}

export default ProfilesScreen;
