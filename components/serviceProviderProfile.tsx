import React, {SyntheticEvent, Profiler} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  TouchableOpacity,
  Alert,
  Platform,
  Keyboard,
  Picker,
  ActivityIndicator,
} from 'react-native';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import {
  Input,
  Avatar,
  Button,
  Text,
  Image,
  Divider,
  Icon,
  ListItem,
  Card,
} from 'react-native-elements';

import HandyHeader from './HandyHeader';
import {any} from 'prop-types';

export interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

class serviceProviderProfile extends React.Component<Props, object> {
  state = {
    profile: {},
  };
  componentDidMount() {
    const userId = this.props.navigation.getParam('userId');
    console.log('userId : ', userId);
    fetch('https://salty-garden-58258.herokuapp.com/mobileApi/profil', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id: userId}),
    })
      .then(res => res.json())
      .then(resJson => {
        console.log('response: ', resJson);
        this.setState({
          profile: resJson[0],
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
  render() {
    const {navigation} = this.props;
    const {profile} = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{flex: 1}}>
          <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
            <HandyHeader navigation={navigation} title="Profile" />
            <View style={{flex: 3, alignItems: 'center'}}>
              <Avatar
                size="xlarge"
                rounded
                source={{
                  uri: profile.userImg,
                }}
                title="MD"
              />
              <Text
                style={{fontSize: 20, fontWeight: 'bold', color: '#63b8d4'}}>
                {/* {profile.firstName + ' ' + profile.familyName} */}
                {profile.userName}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              <Icon raised name="phone" color="#00aced" />
              <Icon raised name="message" color="#00aced" />
              <Icon raised name="star" color="#00aced" />
            </View>

            {/* <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginLeft: 10,
              }}> */}
            <Card>
              <ListItem
                title="Phone"
                subtitle={profile.userMobileNum}
                leftIcon={{
                  name: 'phone',
                }}
              />
              <ListItem
                title="Email"
                subtitle={profile.email}
                leftIcon={{
                  name: 'email',
                }}
              />
              <ListItem
                title="Birth Date"
                subtitle={profile.dateOfBirth}
                leftIcon={{
                  name: 'book',
                }}
              />
              <ListItem
                title="Service Category"
                subtitle={profile.ServiceCategory}
                leftIcon={{
                  name: 'flag',
                }}
              />
            </Card>
            <Card
              title="Service Description"
              image={require('./../assets/shaghelohm.png')}>
              <Text style={{marginBottom: 20, marginTop: 20}}>
                {profile.ServiceDescription}
              </Text>
              <Button
                icon={<Icon name="check" color="#ffffff" />}
                buttonStyle={{
                  borderRadius: 10,
                  marginLeft: 0,
                  marginRight: 0,
                  marginBottom: 0,
                  backgroundColor: '#63b8d4',
                }}
                title="HIRE NOW"
              />
            </Card>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

export default serviceProviderProfile;
