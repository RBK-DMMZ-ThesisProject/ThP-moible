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
  Button
} from 'react-native';
import { Icon } from 'native-base';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
// import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from './components/HomeScreen';
import CategoriesScreen from './components/CategoriesScreen';
import ProfilesScreen from './components/ProfilesScreen';
import AddProfileScreen from './components/AddProfileScreen';
import ViewProfileScreen from './components/ViewProfileScreen';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import RNSharedPreferences from 'react-native-android-shared-preferences';
import { DrawerNavigatorItems } from 'react-navigation-drawer'
import SafeAreaView from 'react-native-safe-area-view'

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
  },

},
  {
    contentComponent: (props) => (
      <View style={{ flex: 1 }}>
        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
          <DrawerNavigatorItems {...props} />
          <Button title="Logout" onPress={() => logout()} />
        </SafeAreaView>
      </View>
    ),
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle'
  });
const logout = () => {
  var sharedPreferences = RNSharedPreferences.getSharedPreferences("userInfo");
  sharedPreferences.clear()
}
const App = createAppContainer(Drawer);

export default App;
