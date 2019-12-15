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

} from 'react-native';
import { Icon } from 'native-base';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from './components/HomeScreen';
import CategoriesScreen from './components/CategoriesScreen';
import ProfilesScreen from './components/ProfilesScreen';
import AddProfileScreen from './components/AddProfileScreen';
import ViewProfileScreen from './components/ViewProfileScreen';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { DrawerNavigatorItems } from 'react-navigation-drawer';
import SafeAreaView from 'react-native-safe-area-view';
import { Provider } from 'react-redux';
import store from './state/store';
import CustomHamburgerMenuDrawer from './components/HamburgerMenuDrawer';
import NavigationService from './components/NavigationService';
import serviceProviderProfile from './components/serviceProviderProfile'

// const MainNavigator = createStackNavigator({
//   Home: { screen: HomeScreen },
//   Categories: { screen: CategoriesScreen },
//   ProfilesScreen: { screen: ProfilesScreen },
// });
// const App = createAppContainer(MainNavigator);
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState

} from 'react-navigation';
export interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
export const MainStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      title: 'Homepage',

    }
  },
  Categories: {
    screen: CategoriesScreen,
    navigationOptions: {
      title: 'Categories'
    }
  },
  ProfilesScreen: {
    screen: ProfilesScreen,
    navigationOptions: {
      title: 'Profiles'
    }
  },
  AddProfileScreen: {
    screen: AddProfileScreen,
    navigationOptions: {
      title: 'Add Profile'
    }
  },
  ViewProfile: {
    screen: ViewProfileScreen,
    navigationOptions: {
      title: 'Profile'
    }
  },
  ProviderProfile: {
    screen: serviceProviderProfile,
    navigationOptions: {
      title: 'Profile'
    }
  },
  SignIn: {
    screen: SignIn,
    navigationOptions: {
      title: 'Sign in'
    }
  },
  SignUp: {
    screen: SignUp,
    navigationOptions: {
      title: 'Sign up'
    }
  }
}, { headerMode: 'none' });

export const Drawer = createDrawerNavigator({
  // Home: {
  //   screen: HomeScreen,
  //   navigationOptions: {
  //     title: 'Homepage',

  //   }
  // },
  // Categories: {
  //   screen: CategoriesScreen,
  //   navigationOptions: {
  //     title: 'Categories'
  //   }
  // },
  // ProfilesScreen: {
  //   screen: ProfilesScreen,
  //   navigationOptions: {
  //     title: 'Profiles'
  //   }
  // },
  // AddProfileScreen: {
  //   screen: AddProfileScreen,
  //   navigationOptions: {
  //     title: 'Add Profile'
  //   }
  // },
  // ViewProfile: {
  //   screen: ViewProfileScreen,
  //   navigationOptions: {
  //     title: 'Profile'
  //   }
  // },
  // ProviderProfile: {
  //   screen: serviceProviderProfile,
  //   navigationOptions: {
  //     title: 'Profile'
  //   }
  // },
  // SignIn: {
  //   screen: SignIn,
  //   navigationOptions: {
  //     title: 'Sign in'
  //   }
  // },
  // SignUp: {
  //   screen: SignUp,
  //   navigationOptions: {
  //     title: 'Sign up'
  //   }
  // },
  MainStack: {
    screen: MainStack
  },
  CustomHamburgerMenuDrawer: {
    screen: CustomHamburgerMenuDrawer,
    navigationOptions: {
      title: 'Custom menu'
    }
  }
},

  {
    contentComponent: () => {
      return <CustomHamburgerMenuDrawer />
    },
    drawerWidth: 170,
    navigationOptions: {
      gestureEnabled: true,
    }

  });
export const AppStack = createAppContainer(Drawer);

// In Your App.js

// const AppContainer = createAppContainer(Drawer);
export default class App extends React.Component<Props> {
  render() {
    return (<Provider store={store}>
      <AppStack ref={(navigatorRef: any) => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }} />

    </Provider>);
  }
}

