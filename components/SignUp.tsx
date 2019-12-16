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
import validate from 'validate.js';

export interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    changeState: any,
    changeSignedInState: any
}
class SignUp extends React.Component<Props, object> {

    state = {
        // personal info
        userName: '',
        userNameError: '',
        email: '',
        emailError: '',
        password: '',
        passwordError: '',
        mobileNO: null,
        mobileNOError: '',
        loginError: '',
        signUpLoading: false
    }

    // @function: saveProfile  
    // @description: Save profile info to the databae
    // 
    async signUp() {
        if (this.state.emailError === undefined && this.state.passwordError === undefined && this.state.userNameError === undefined && this.state.mobileNOError === undefined) {
            // console.log(this.state)
            const { navigation } = this.props;
            this.setState({
                signUpLoading: true,
                isSbumitted: true,
            })
            var userData = {
                userName: this.state.userName.trim(),
                email: this.state.email.trim(),
                mobileNO: this.state.mobileNO,
                password: this.state.password.trim(),
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
                    else {
                        this.setState({
                            loginError: resJson.msg,
                            userName: '',
                            email: '',
                            password: '',
                            mobileNO: null,
                            signUpLoading: false
                        });
                        this.props.changeSignedInState(1);
                        navigation.navigate(navigation.getParam('nextPage'));
                    }


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
    }
    render() {
        console.log(this.state);
        const { navigation } = this.props;
        const { userName, userNameError, email, emailError, password, passwordError, mobileNO, mobileNOError, signUpLoading } = this.state;
        return (
            <>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                        <HandyHeader navigation={navigation} title="Sign Up" />
                        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('./../assets/Handy.png')} style={{ flex: 2, width: 150, height: 190 }} />
                        </View>
                        <Input
                            inputStyle={{ backgroundColor: '#f2f2f2', borderRadius: 5, color: "#078ca9" }}
                            label='Name:'
                            labelStyle={{ fontSize: 20, color: "#078ca9" }}
                            onBlur={() => {
                                this.setState({ userNameError: validate({ userName: userName }, { userName: { presence: true, type: 'string', length: { minimum: 6 } } }, { format: "flat" }) })
                            }}
                            onChangeText={(userName) => this.setState({ userName })}
                            placeholder={'Enter your Name...'}
                            errorMessage={userNameError}
                            placeholderTextColor="#999"
                        >{userName}</Input>
                        <Input
                            inputStyle={{ backgroundColor: '#f2f2f2', borderRadius: 5, color: "#078ca9" }}
                            label='Email:'
                            labelStyle={{ fontSize: 20, color: "#078ca9" }}
                            onChangeText={(email) => this.setState({ email })}
                            onBlur={() => {
                                this.setState({ emailError: validate({ email: email }, { email: { presence: true, email: true } }, { format: "flat" }) })
                            }}
                            placeholder={'Enter your email...'}
                            errorMessage={emailError}
                            placeholderTextColor="#999"
                        >{email}</Input>
                        <Input
                            inputStyle={{ backgroundColor: '#f2f2f2', borderRadius: 5, color: "#078ca9" }}
                            label='Mobile No.:'
                            keyboardType="number-pad"
                            labelStyle={{ fontSize: 20, color: "#078ca9" }}
                            onChangeText={(mobileNO) => this.setState({ mobileNO })}
                            onBlur={() => {
                                this.setState({ mobileNOError: validate({ mobileNO: mobileNO }, { mobileNO: { presence: true, length: { minimum: 6 } } }, { format: "flat" }) })
                            }}
                            placeholder={'Enter your Mobile NO...'}
                            placeholderTextColor="#999"
                            errorMessage={mobileNOError}
                        >{mobileNO}</Input>
                        <Input
                            inputStyle={{ backgroundColor: '#f2f2f2', borderRadius: 5, color: "#078ca9" }}
                            label='Password:'
                            secureTextEntry={true}
                            labelStyle={{ fontSize: 20, color: "#078ca9" }}
                            onBlur={() => {
                                this.setState({ passwordError: validate({ password: password }, { password: { presence: true, length: { minimum: 6 } } }, { format: "flat" }) })
                            }}
                            onChangeText={(password) => this.setState({ password })}
                            placeholder={'Enter your password...'}
                            errorMessage={passwordError}
                            placeholderTextColor="#999"
                        >{password}</Input>

                        <View style={{ flex: 1, margin: 10 }}>
                            <Button buttonStyle={{
                                backgroundColor: '#078ca9',
                                width: 100 + "%",
                            }}
                                titleStyle={{
                                    color: '#f2f2f2'
                                }}

                                title="Sign up" onPress={() => this.signUp()} loading={signUpLoading} loadingStyle={{ borderColor: "#67A443" }}></Button>
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
