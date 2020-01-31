import React from 'react';
import {Header} from 'react-native-elements';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import HamburgerMenu from './HamburgerMenu';

export interface Props {
  title: string;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

const HandyHeader = ({title, navigation}: Props) => {
  return (
    <Header
      containerStyle={{
        height: 50,
        backgroundColor: '#078ca9',
        marginBottom: 10,
        paddingTop: 0,
      }}
      leftComponent={<HamburgerMenu navigation={navigation} />}
      centerComponent={{
        text: title,
        style: {
          color: '#f2f2f2',
          fontWeight: 'bold',
          fontFamily: 'Cochin',
          fontSize: 25,
          backgroundColor: '#078ca9',
        },
      }}
      statusBarProps={{barStyle: 'light-content'}}
    />
  );
};

export default HandyHeader;
