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
    AsyncStorage
} from 'react-native';
import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState,
} from 'react-navigation';
import { Input, Button, Image } from 'react-native-elements'

import HandyHeader from './HandyHeader';
import { any } from 'prop-types';

export interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
class SignIn extends React.Component<Props, object> {

    state = {
        // personal info
        email: '',
        password: '',
        signInLoading: false
    }

    // @function: signIn  
    // @description:sign in to our application
    // 
    async signIn() {
        // console.log(this.state)
        const { navigation } = this.props;
        this.setState({
            signInLoading: true,
            isSbumitted: true,
        })
        var userData = {
            email: this.state.email,
            password: this.state.password,
        };
        fetch('https://salty-garden-58258.herokuapp.com/mobileApi/signIn', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),

        }).then(res => res.json())
            .then(resJson => {
                console.log('response: ', resJson);
                this.setState({
                    signInLoading: false
                });
                navigation.navigate('AddProfileScreen');
            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    saveLoading: false
                });
                // process erro messages
            });
    }
    render() {
        const { navigation } = this.props;
        const { email, password, signInLoading } = this.state;
        return (
            <>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                        <HandyHeader navigation={navigation} title="Sign In" />
                        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('./../assets/shaghelohm.png')} style={{ flex: 2, width: 200, height: 200 }} />
                        </View>

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
                            label='Password:'
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

                                title="Sign in" onPress={() => this.signIn()} loading={signInLoading}></Button>
                        </View>
                        <Text >You Don't Have an Account?</Text>
                        <View style={{ flex: 1, margin: 10 }}>
                            <Button buttonStyle={{
                                backgroundColor: '#91cde0',
                                width: 100 + "%",
                            }}
                                titleStyle={{
                                    color: '#dff0f6'
                                }}

                                title="Sign up" onPress={() => navigation.navigate('SignUp')} ></Button>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </>
        );
    }
}


export default SignIn;
