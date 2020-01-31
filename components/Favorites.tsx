import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {Card, ListItem, Text} from 'react-native-elements';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import {connect} from 'react-redux';
import {Dispatch} from 'react-redux';
import {changeActivityIndicatorState} from '../state/actions';
import HandyHeader from './HandyHeader';

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
    this.props.changeActivityIndicatorState(true);

    var SharedPreferences = require('react-native-shared-preferences');
    SharedPreferences.setName('handyInfo');
    SharedPreferences.getItem('handyToken', async (value: any) => {
      if (value === null) {
        this.props.navigation.navigate('SignIn');
      } else {
        // fetch favorites from database
        await fetch(
          'https://salty-garden-58258.herokuapp.com/mobileApi/favorites',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({customerID: value}),
          },
        )
          .then((res: any) => res.json())
          .then((resJson: any) => {
            this.props.changeActivityIndicatorState(false);
            this.setState({
              favorites: resJson.favorites,
            });
          })
          .catch((error: any) => {
            this.props.changeActivityIndicatorState(false);
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
        {favorites.map((provider, i) => {
          return (
            <Card containerStyle={{padding: 5}} key={i}>
              <View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ProviderProfile', {
                      userId: provider['id'],
                    })
                  }>
                  <ListItem
                    leftAvatar={{
                      title: provider['userName'][0],
                      source: {uri: provider['userImg']},
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

//@function: mapDispatchToProps
//@Description: Pass functions as props of the component
const mapDispatchToProps = (dispatch: Dispatch) => ({
  changeActivityIndicatorState: (state: boolean) => {
    dispatch(changeActivityIndicatorState(state));
  },
});

//@function: mapStateToProps
//@Description: Pass properties as props of the component
const mapStateToProps = (appState: any) => {
  return {
    activityIndicatorState: appState.changeGeneralState.activityIndicatorState,
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

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);
