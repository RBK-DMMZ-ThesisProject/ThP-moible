import React, { SyntheticEvent } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Alert,
    Platform,
    Keyboard,

} from 'react-native';
import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState,
} from 'react-navigation';
import { Input, Button, Image } from 'react-native-elements'
import HandyHeader from './HandyHeader';
import { any } from 'prop-types';
import { connect } from 'react-redux';
import * as types from '../state/types';
import { Dispatch } from 'react-redux';
import { changeStateItem, changeStateSignedIn } from '../state/actions';

export interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    changeState: any,
    changeSignedInState: any
}
class SignUp extends React.Component<Props, object> {

    state = {
        // personal info
        userName: '',
        email: '',
        password: '',
        mobileNO: null,
        signUpLoading: false
    }

    // @function: saveProfile  
    // @description: Save profile info to the databae
    // 
    async signUp() {
        // console.log(this.state)
        const { navigation } = this.props;
        this.setState({
            signUpLoading: true,
            isSbumitted: true,
        })
        var userData = {
            userName: this.state.userName,
            email: this.state.email,
            mobileNO: this.state.mobileNO,
            password: this.state.password,
        };
        fetch('https://salty-garden-58258.herokuapp.com/auth/userSignUp', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),

        }).then(res => res.json())
            .then((resJson) => {
                console.log('response: ', resJson);
                if (resJson.token !== undefined) {
                    var SharedPreferences = require('react-native-shared-preferences');
                    SharedPreferences.setName("handyInfo");
                    SharedPreferences.setItem("handyToken", resJson.token);
                }
                this.setState({
                    userName: '',
                    email: '',
                    password: '',
                    mobileNO: null,
                    signUpLoading: false
                });
                console.log('change state of add profile');
                this.props.changeSignedInState(1);

                // this.props.changeState(3); //remove
                // this.props.changeState(4);// remove
                // this.props.changeState(7);
                // this.props.changeState(8);
                // this.props.changeState(9);
                // this.props.changeState(10);
                // this.props.changeState(11);
                // this.props.changeState(30);

                navigation.navigate(navigation.getParam('nextPage'));

            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    userName: '',
                    email: '',
                    password: '',
                    mobileNO: null,
                    signUpLoading: false
                });
                // process erro messages
            });
    }
    render() {
        const { navigation } = this.props;
        const { userName, email, password, mobileNO, signUpLoading } = this.state;
        return (
            <>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                        <HandyHeader navigation={navigation} title="Sign Up" />
                        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('./../assets/shaghelohm.png')} style={{ flex: 2, width: 200, height: 200 }} />
                        </View>
                        <Input
                            inputStyle={{ backgroundColor: '#dff0f6', borderRadius: 5, color: "#91cde0" }}
                            label='Name:'
                            labelStyle={{ fontSize: 20, color: "#91cde0" }}
                            onChangeText={(userName) => this.setState({ userName })}
                            placeholder={'Enter your Name...'}
                            placeholderTextColor="#91cde0"
                        >{userName}</Input>
                        <Input
                            inputStyle={{ backgroundColor: '#dff0f6', borderRadius: 5, color: "#91cde0" }}
                            label='Email:'
                            labelStyle={{ fontSize: 20, color: "#91cde0" }}
                            onChangeText={(email) => this.setState({ email })}
                            placeholder={'Enter your email...'}
                            placeholderTextColor="#91cde0"
                        >{email}</Input>
                        <Input
                            inputStyle={{ backgroundColor: '#dff0f6', borderRadius: 5, color: "#91cde0" }}
                            label='Mobile No.:'
                            keyboardType="number-pad"
                            labelStyle={{ fontSize: 20, color: "#91cde0" }}
                            onChangeText={(mobileNO) => this.setState({ mobileNO })}
                            placeholder={'Enter your Mobile NO...'}
                            placeholderTextColor="#91cde0"
                        >{mobileNO}</Input>
                        <Input
                            inputStyle={{ backgroundColor: '#dff0f6', borderRadius: 5, color: "#91cde0" }}
                            label='Password:'
                            secureTextEntry={true}
                            labelStyle={{ fontSize: 20, color: "#91cde0" }}
                            onChangeText={(password) => this.setState({ password })}
                            placeholder={'Enter your password...'}
                            placeholderTextColor="#91cde0"
                        >{password}</Input>

                        <View style={{ flex: 1, margin: 10 }}>
                            <Button buttonStyle={{
                                backgroundColor: '#91cde0',
                                width: 100 + "%",
                            }}
                                titleStyle={{
                                    color: '#dff0f6'
                                }}

                                title="Sign up" onPress={() => this.signUp()} loading={signUpLoading}></Button>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </>
        );
    }
}

const mapDipatchToProps = (dispatch: Dispatch) => ({
    changeState: (id: number) => {
        console.log('item to hange : ' + id);
        dispatch(changeStateItem(id));
    },
    changeSignedInState: (state: number) => {
        dispatch(changeStateSignedIn(state));
    }
    // other callbacks go here...
});
const mapStateToProps = (state: types.MenuItemsListState, navigation: NavigationScreenProp<NavigationState, NavigationParams>) => ({
    items: state,
    navigation: navigation
});

export default connect(null, mapDipatchToProps)(SignUp);
