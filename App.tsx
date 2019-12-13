/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import React from 'react';
import {
  View,
  Button,
  Text,
  Image,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {Icon} from 'native-base';
import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
// import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from './components/HomeScreen';
import CategoriesScreen from './components/CategoriesScreen';
import ProfilesScreen from './components/ProfilesScreen';
import AddProfileScreen from './components/AddProfileScreen';
import ViewProfileScreen from './components/ViewProfileScreen';
import serviceProviderProfile from './components/serviceProviderProfile';
import chatt from './components/chattingApp/chatt';
// const MainNavigator = createStackNavigator({
//   Home: { screen: HomeScreen },
//   Categories: { screen: CategoriesScreen },
//   ProfilesScreen: { screen: ProfilesScreen },
// });
// const App = createAppContainer(MainNavigator);

const Drawer = createDrawerNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      title: 'Homepage',
    },
  },
  Categories: {
    screen: CategoriesScreen,
    navigationOptions: {
      title: 'Categories',
    },
  },
  ProfilesScreen: {
    screen: ProfilesScreen,
    navigationOptions: {
      title: 'Profiles',
    },
  },
  AddProfileScreen: {
    screen: AddProfileScreen,
    navigationOptions: {
      title: 'Add Profile',
    },
  },
  ViewProfile: {
    screen: ViewProfileScreen,
    navigationOptions: {
      title: 'Profile',
    },
  },
  ProviderProfile: {
    screen: serviceProviderProfile,
    navigationOptions: {
      title: 'ProviderProfile',
    },
  },
  chattScreen: {
    screen: chatt,
    navigationOptions: {
      title: 'chattScreen',
    },
  },
});
const App = createAppContainer(Drawer);

export default App;
