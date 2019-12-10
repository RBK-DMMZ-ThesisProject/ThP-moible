import React from 'react';
import {
    View,
    Button,
    Text,
    Image,
    StatusBar,
    SafeAreaView,
    StyleSheet,

} from 'react-native';
import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState

} from 'react-navigation';
import HandyHeader from './HandyHeader';
import RNSharedPreferences from 'react-native-android-shared-preferences';
export interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

class HomeScreen extends React.Component<Props, object> {
    handleAddUserProfileBtn = async () => {
        try {
            var sharedPreferences = RNSharedPreferences.getSharedPreferences("userInfo");

            sharedPreferences.getString("handyUserToken", (result: any) => {
                // Should return Karthik here ...
                console.log("Get result :: " + result);
                if (result === '') {
                    this.props.navigation.navigate('SignIn')
                } else {
                    this.props.navigation.navigate('AddProfileScreen')
                }
            });


        } catch{

        }

    }

    render() {
        const { navigation } = this.props;
        return (
            <>

                <StatusBar barStyle="dark-content" />
                <SafeAreaView style={{ flex: 1 }}>
                    <HandyHeader navigation={navigation} title="Home" />
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
                        <Image source={require('./../assets/shaghelohm.png')} style={{ flex: 7, width: 90 + "%", height: 200 }} />
                        <Text style={{ flex: 1, color: "#91cde0", fontFamily: 'Cochin', fontSize: 36, fontWeight: 'bold' }}>Handy</Text>
                        <View style={{ flex: 1 }}>
                            <Button
                                title="Discover"
                                color="#63b8d4"
                                onPress={() => navigation.navigate('Categories')}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Button
                                title="Add User Profile"
                                color="#63b8d4"
                                onPress={this.handleAddUserProfileBtn}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </>
        );
    }
}
export default HomeScreen;
