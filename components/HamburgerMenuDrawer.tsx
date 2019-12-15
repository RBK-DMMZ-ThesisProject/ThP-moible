
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
    changeSignedInState: any,
    changeHasProfileState: any
}

class CustomHamburgerMenuDrawer extends Component<Props> {

    // only update chart if the data has changed
    constructor(props: Props) {
        super(props);
        var SharedPreferences = require('react-native-shared-preferences');
        SharedPreferences.setName("handyInfo");
        var that = this;
        SharedPreferences.getItem("handyToken", function (value: any) {
            if (value !== null) {
                that.props.changeSignedInState(1);
                // check if the user has profile
                that.props.changeActivityIndicatorState(true);
                // fetch from sever
                that.getUserHasProfile(value);
            }
        });


    }
    componentDidUpdate(prevProps: Props, prevState: Props) {
        if (prevProps.hasProfile !== this.props.hasProfile && this.props.hasProfile === 1) {
            if (!!this.props.hasProfile) {
                this.props.changeState(20, 1);
                this.props.changeState(7, 0);
            }
        }
        if (prevProps.login !== this.props.login) {
            if (!!this.props.login) {
                // check if has profile
                this.props.changeState(3, 0);
                this.props.changeState(4, 0);

                this.props.changeState(8, 1);
                this.props.changeState(9, 1);
                this.props.changeState(10, 1);
                this.props.changeState(11, 1);
                this.props.changeState(30, 1);
            }
        }
    }
    async getUserHasProfile(token: string) {
        var response = await fetch('https://salty-garden-58258.herokuapp.com/mobileApi/hasProfile', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userToken: token }),
        });
        var resJson = await response.json()
        if (resJson.result) {
            this.props.changeHasProfileState(1);
        }
        this.props.changeActivityIndicatorState(false);

        // .catch(error => {
        //     console.error(error);
        //     that.props.changeActivityIndicatorState(false);
        // });

    }
    navigateToScreen(page: string, params: object) {

        NavigationService.navigate(page, params);
    }
    logout() {
        // change state login ??????????

        var SharedPreferences = require('react-native-shared-preferences');
        SharedPreferences.setName("handyInfo");
        SharedPreferences.removeItem("handyToken");
        this.props.changeSignedInState(0);

        this.props.changeState(3, 1);
        this.props.changeState(4, 1);
        this.props.changeState(7, 0);
        this.props.changeState(8, 0);
        this.props.changeState(9, 0);
        this.props.changeState(10, 0);
        this.props.changeState(11, 0);
        this.props.changeState(30, 0);
        NavigationService.navigate('Home');

    }
    render() {

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
                </View> : <Text></Text>)}
            </View>
        );
    }
}

const mapStateToProps = (appstate: any, navigation: NavigationScreenProp<NavigationState, NavigationParams>) => {
    console.log('from state 1', appstate)

    return ({
        items: appstate.menuList,
        login: appstate.changeGeneralState.login,
        hasProfile: appstate.changeGeneralState.hasProfile,
        activityIndicatorState: appstate.changeGeneralState.activityIndicatorState,
        navigation: navigation
    })
};
const mapDsipatchToProps = (dispatch: Dispatch) => ({
    changeState: (id: number, state: number) => {
        dispatch(changeStateItem(id, state));
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