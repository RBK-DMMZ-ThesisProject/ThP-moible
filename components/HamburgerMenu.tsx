import React from "react";
import { Icon } from "react-native-elements";

import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState

} from 'react-navigation';
import { NavigationActions } from 'react-navigation';

export interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;

}
const HamburgerMenu = ({ navigation }: Props) => {
    return (
        <Icon
            color="#eff7fa"
            name="menu"
            onPress={() => navigation.toggleDrawer()}
        />
    );
};

export default HamburgerMenu;