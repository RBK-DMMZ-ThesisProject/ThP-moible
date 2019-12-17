import React from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { Card, ListItem, Button, Icon, Rating } from 'react-native-elements';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import HandyHeader from './HandyHeader';
import NavigationService from './NavigationService.js';


export interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
class ProfilesScreen extends React.Component<Props, object> {
  state = {
    profiles: [],
    rating: 0,
  };

  componentDidMount() {
    const categoryName = this.props.navigation.getParam('categoryName');
    const { profiles } = this.state;
    fetch('https://salty-garden-58258.herokuapp.com/mobileApi/getProfiles', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({ ServiceCategory: categoryName }),
    })
      .then(res => res.json())
      .then(resJson => {
        console.log('response: ', resJson);
        this.setState({
          profiles: resJson.profil,
          rating: resJson.rates,
        });
      })
      .catch(error => {
        console.error(error);
      });
    // fetch('https://salty-garden-58258.herokuapp.com/mobileApi/getRate', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({serviceproviderid: profiles.}),

    // })
    //   .then(res => res.json())
    //   .then(resJson => {
    //     console.log('response: ', resJson);
    //     this.setState({
    //       rating: resJson,
    //     });
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });
  }

  render() {
    const { profiles } = this.state;
    const { navigation } = this.props;
    // const {rating} = this.props;
    const { rating } = this.state;
    const categoryName = this.props.navigation.getParam('categoryName');
    return (
      <>
        <HandyHeader navigation={navigation} title={categoryName} />
        {profiles.map((user: any, i: any) => {
          return (
            <Card containerStyle={{ padding: 5 }} key={i}>

              <View >
                <TouchableOpacity
                  onPress={() =>
                    NavigationService.navigate('ProviderProfile', {
                      userId: user['_id'],
                    })
                  }>
                  <ListItem

                    leftAvatar={{
                      title: "SP",
                      source: { uri: user['userImg'] },
                    }}

                    titleStyle={{ position: "absolute", top: -20, left: -4 }}
                    title={user['userName']}
                    chevron></ListItem>
                </TouchableOpacity>
                <View style={{ position: 'absolute', top: 40, left: 65 }}>
                  <Rating
                    type="custom"
                    ratingColor="#078ca9"
                    ratingBackgroundColor="#078ca9"

                    readonly
                    imageSize={18}
                    startingValue={rating[i]}
                  />
                </View>
              </View>

            </Card>
          );
        })}
      </>
    );
  }
}

export default ProfilesScreen;
