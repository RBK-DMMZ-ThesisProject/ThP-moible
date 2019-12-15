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
import {View, Button} from 'react-native';
import {Icon} from 'native-base';
import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
// import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from './components/HomeScreen';
import CategoriesScreen from './components/CategoriesScreen';
import ProfilesScreen from './components/ProfilesScreen';
import AddProfileScreen from './components/AddProfileScreen';
import ViewProfileScreen from './components/ViewProfileScreen';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Favorites from './components/Favorites';
import HireHistory from './components/HireHistory';
import {DrawerNavigatorItems} from 'react-navigation-drawer';
import SafeAreaView from 'react-native-safe-area-view';
import {Provider} from 'react-redux';
import store from './state/store';
import CustomHamburgerMenuDrawer from './components/HamburgerMenuDrawer';
import NavigationService from './components/NavigationService';
import serviceProviderProfile from './components/serviceProviderProfile';
import Chatt from './components/chattingApp/chatt';
// const MainNavigator = createStackNavigator({
//   Home: { screen: HomeScreen },
//   Categories: { screen: CategoriesScreen },
//   ProfilesScreen: { screen: ProfilesScreen },
// });
// const App = createAppContainer(MainNavigator);
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
export interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
const Drawer = createDrawerNavigator(
  {
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
      screen: Chatt,
      navigationOptions: {
        title: 'chattScreen',
      },
    },
    SignIn: {
      screen: SignIn,
      navigationOptions: {
        title: 'Sign in',
      },
    },
    SignUp: {
      screen: SignUp,
      navigationOptions: {
        title: 'Sign up',
      },
    },
    CustomHamburgerMenuDrawer: {
      screen: CustomHamburgerMenuDrawer,
      navigationOptions: {
        title: 'Custom menu',
      },
    },
    Favorites: {
      screen: Favorites,
      navigationOptions: {
        title: 'Favorites',
      },
    },
    HireHistory: {
      screen: HireHistory,
      navigationOptions: {
        title: 'HireHistory',
      },
    },
  },

  {
    contentComponent: () => {
      return <CustomHamburgerMenuDrawer />;
    },
  },
);

const AppContainer = createAppContainer(Drawer);
export default class App extends React.Component<Props> {
  render() {
    return (
      <Provider store={store}>
        <AppContainer
          ref={(navigatorRef: any) => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
      </Provider>
    );
  }
}
