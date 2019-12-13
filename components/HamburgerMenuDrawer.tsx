
import React, { Component } from 'react';
import { ScrollView, Text, View, Image } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { menuList } from '../state/reducer';
import * as types from '../state/types';
import NavigationService from './NavigationService.js';
import { Dispatch } from 'react-redux';
import { changeStateItem } from '../state/actions';
import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState

} from 'react-navigation';

export interface Props {
    items: [],
    navigation: NavigationScreenProp<NavigationState, NavigationParams>,
    changeState: any,
    login: number
}

class CustomHamburgerMenuDrawer extends Component<Props> {

    navigateToScreen(page: string, params: object) {
        console.log('naviatione ')
        NavigationService.navigate(page, params);
    }
    logout() {
        // change state login ??????????
        console.log('loging out');
        var SharedPreferences = require('react-native-shared-preferences');
        SharedPreferences.setName("handyInfo");
        SharedPreferences.removeItem("handyToken");
        this.props.changeState(3);
        this.props.changeState(4);
        this.props.changeState(7);
        this.props.changeState(8);
        this.props.changeState(9);
        this.props.changeState(10);
        this.props.changeState(11);
        this.props.changeState(30);
        NavigationService.navigate('Home');

    }
    render() {
        console.log("menu props", this.props);
        console.log("login status", this.props.login);



        return (
            <View style={{ flex: 1, paddingTop: 30 }}>
                <View style={{ height: 80, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                    <Text >Handy</Text>
                </View>
                <ScrollView>
                    <View>
                        {this.props.items.map((item: any) => {
                            if (item.show === 1) {
                                if (item.itemtxt === "Log out") {
                                    return <Text
                                        key={item.id}
                                        style={{ fontSize: 16, lineHeight: 30, textAlign: 'center' }}
                                        onPress={() => this.logout()}
                                    >
                                        {item.itemtxt}
                                    </Text>
                                }
                                var nextPage = (item.itemtxt === 'Sign in' || item.itemtxt === 'Sign Up') ? 'Home' : '';
                                return (
                                    <Text
                                        key={item.id}
                                        style={{ fontSize: 16, lineHeight: 30, textAlign: 'center' }}
                                        onPress={() => this.navigateToScreen(item.toPage, { nextPage: nextPage })}
                                    >
                                        {item.itemtxt}
                                    </Text>
                                )
                            }
                            return;
                        }

                        )}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = (appstate: any, navigation: NavigationScreenProp<NavigationState, NavigationParams>) => {
    // console.log('from state 1', appstate)

    return ({
        items: appstate.menuList,
        login: appstate.changeGeneralState.login,
        navigation: navigation
    })
};
const mapDsipatchToProps = (dispatch: Dispatch) => ({
    changeState: (id: number) => {
        dispatch(changeStateItem(id));
    },
    // other callbacks go here...
});


export default connect(mapStateToProps, mapDsipatchToProps)(CustomHamburgerMenuDrawer);