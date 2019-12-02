import React from "react";
import { Header } from "react-native-elements";
import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState

} from 'react-navigation';
import HamburgerMenu from "./HamburgerMenu";
export interface Props {
    title: string
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;

}
const HandyHeader = ({ title, navigation }: Props) => {
    return (
        <Header
            containerStyle={{ height: 50, backgroundColor: '#63b8d4', marginBottom: 10, paddingTop: 0 }}

            leftComponent={<HamburgerMenu navigation={navigation} />}
            centerComponent={{
                text: title,
                style: { color: "#eff7fa", fontWeight: "bold", fontFamily: 'Cochin', fontSize: 30, backgroundColor: '#63b8d4' }
            }}
            statusBarProps={{ barStyle: "light-content" }}

        />
    );
};

export default HandyHeader;