import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import {Card, ListItem, Button, Icon, Rating} from 'react-native-elements';
import {connect} from 'react-redux';
import {Dispatch} from 'react-redux';
import {changeActivityIndicatorState} from '../state/actions';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import HandyHeader from './HandyHeader';
import NavigationService from './NavigationService.js';

export interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  activityIndicatorState: boolean;
  changeActivityIndicatorState: any;
}

class ProfilesScreen extends React.Component<Props, object> {
  state = {
    profiles: [],
    rating: [],
  };
  constructor(props) {
    super(props);
    this.props.changeActivityIndicatorState(true);
  }

  componentDidMount() {
    const categoryName = this.props.navigation.getParam('categoryName');
    const {profiles} = this.state;
    this.props.changeActivityIndicatorState(true);
    fetch('https://salty-garden-58258.herokuapp.com/mobileApi/getProfiles', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({ServiceCategory: categoryName}),
    })
      .then((res:any) => res.json())
      .then((resJson:any) => {
        this.setState({
          profiles: resJson.profil,
          rating: resJson.rates,
        });
        this.props.changeActivityIndicatorState(false);
      })
      .catch((error:any) => {
        console.error(error);
        this.props.changeActivityIndicatorState(false);
      });
  }

  render() {

    const {navigation} = this.props;
    const {rating, profiles} = this.state;
    const categoryName = navigation.getParam('categoryName');

    return (
      <>
        <HandyHeader navigation={navigation} title={categoryName} />
        {profiles.map((user: any, i: any) => {
          return (
            <Card containerStyle={{padding: 5}} key={i}>
              <View>
                <TouchableOpacity
                  onPress={() =>
                    NavigationService.navigate('ProviderProfile', {
                      userId: user['_id'],
                    })
                  }>
                  <ListItem
                    leftAvatar={{
                      title: 'SP',
                      source: {uri: user['userImg']},
                    }}
                    titleStyle={{position: 'absolute', top: -20, left: -4}}
                    title={user['userName']}
                    chevron></ListItem>
                </TouchableOpacity>
                <View style={{position: 'absolute', top: 40, left: 65}}>
                  <Rating
                    type="custom"
                    ratingColor="#078ca9"
                    ratingBackgroundColor="#f2f2f2"
                    readonly
                    imageSize={18}
                    startingValue={rating[i]}
                  />
                </View>
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
//@description: pass functions as props of the component
const mapDispatchToProps = (dispatch: Dispatch) => ({
  changeActivityIndicatorState: (state: boolean) => {
    dispatch(changeActivityIndicatorState(state));
  },
});

//@function: mapStateToProps
//@Description: pass properties as props of the component
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
export default connect(mapStateToProps, mapDispatchToProps)(ProfilesScreen);
