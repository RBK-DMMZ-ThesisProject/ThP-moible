
import React, { Component } from 'react';
import {
    ScrollView, Text, View, Image, StyleSheet,
    ActivityIndicator
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { menuList } from '../state/reducer';
import * as types from '../state/types';
import NavigationService from './NavigationService.js';
import { Dispatch } from 'react-redux';
import { changeStateItem, changeStateSignedIn, changeHasProfileState, changeActivityIndicatorState } from '../state/actions';
import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState

} from 'react-navigation';

export interface Props {
    items: [],
    navigation: NavigationScreenProp<NavigationState, NavigationParams>,
    changeState: any,
    login: number,
    hasProfile: number,
    activityIndicatorState: boolean,
    changeActivityIndicatorState: any,
    changeSignedInState: any
}

class CustomHamburgerMenuDrawer extends Component<Props> {

    // only update chart if the data has changed
    constructor(props: Props) {
        super(props);
        var SharedPreferences = require('react-native-shared-preferences');
        SharedPreferences.setName("handyInfo");
        var that = this;
        SharedPreferences.getItem("handyToken", function (value: any) {
            console.log("token from menu: ", value);
            if (value !== null) {
                that.props.changeSignedInState(1);
                // check if the user has profile
                changeActivityIndicatorState(true);
                // fetch from sever
                fetch('https://salty-garden-58258.herokuapp.com/mobileApi/hasProfile', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userToken: value }),
                })
                    .then(res => res.json())
                    .then(resJson => {
                        console.log('response: ', resJson);
                        if (resJson.result) {
                            changeHasProfileState(1);
                        }
                        changeActivityIndicatorState(false);
                    })
                    .catch(error => {
                        console.error(error);
                        changeActivityIndicatorState(false);
                    });


            }
        });


    }
    componentDidUpdate(prevProps: Props, prevState: Props) {
        if (prevProps.hasProfile !== this.props.hasProfile) {
            this.props.changeState(20);
        }
        if (prevProps.login !== this.props.login) {
            console.log('prev', prevProps.login);
            console.log('now', this.props.login);
            if (!!this.props.login) {
                // check if has profile
                this.props.changeState(3);
                this.props.changeState(4);
                this.props.changeState(7);
                this.props.changeState(8);
                this.props.changeState(9);
                this.props.changeState(10);
                this.props.changeState(11);
                this.props.changeState(30);
            }
        }
    }
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
        this.props.changeSignedInState(0);

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
            <View style={{ flex: 1, paddingTop: 30, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                <View style={{ height: 20, backgroundColor: 'white', marginLeft: 10, marginBottom: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#63b8d4' }} >Handy</Text>
                </View>
                <ScrollView style={{ flex: 8, }}>
                    <View>
                        {this.props.items.map((item: any) => {
                            if (item.show === 1) {
                                if (item.itemtxt === "Log out") {
                                    return <Text
                                        key={item.id}
                                        style={{ fontSize: 16, lineHeight: 30, marginLeft: 20 }}
                                        onPress={() => this.logout()}
                                    >
                                        {item.itemtxt}
                                    </Text>
                                }
                                var nextPage = (item.itemtxt === 'Sign in' || item.itemtxt === 'Sign Up') ? 'Home' : '';
                                return (
                                    <Text
                                        key={item.id}
                                        style={{ fontSize: 16, lineHeight: 30, marginLeft: 20 }}
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
                {(this.props.activityIndicatorState ? <View style={[styles.loading]}>
                    <ActivityIndicator size="large" color="#c5df16" />
                </View> : '')}
            </View>
        );
    }
}

const mapStateToProps = (appstate: any, navigation: NavigationScreenProp<NavigationState, NavigationParams>) => {
    console.log('from state 1', appstate)

    return ({
        items: appstate.menuList,
        login: appstate.changeGeneralState.login,
        activityIndicatorState: appstate.changeGeneralState.activityIndicatorState,
        navigation: navigation
    })
};
const mapDsipatchToProps = (dispatch: Dispatch) => ({
    changeState: (id: number) => {
        dispatch(changeStateItem(id));
    },
    changeSignedInState: (state: number) => {
        dispatch(changeStateSignedIn(state));
    },
    changeHasProfileState: (state: number) => {
        dispatch(changeHasProfileState(state));
    },
    changeActivityIndicatorState: (state: boolean) => {
        dispatch(changeActivityIndicatorState(state));
    }
    // other callbacks go here...
});
const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
});


export default connect(mapStateToProps, mapDsipatchToProps)(CustomHamburgerMenuDrawer);