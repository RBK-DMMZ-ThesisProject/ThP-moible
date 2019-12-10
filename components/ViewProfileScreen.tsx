import React, { SyntheticEvent, Profiler } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    StatusBar,
    Alert,
    Platform,
    Keyboard,
    Picker,
    ActivityIndicator

} from 'react-native';
import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState,
} from 'react-navigation';
import { Input, Avatar, Button, Text, Image, Divider } from 'react-native-elements'

import HandyHeader from './HandyHeader';
import { any } from 'prop-types';

export interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
class ViewProfileScreen extends React.Component<Props, object> {

    render() {
        const { navigation } = this.props;
        const profile = this.props.navigation.getParam('profile');

        console.log(profile);
        return (
            <>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                        <HandyHeader navigation={navigation} title="Profile" />
                        <View style={{ flex: 3, alignItems: 'center' }}>
                            <Avatar size="xlarge"
                                rounded source={{ uri: profile.avatarSource }} showEditButton />
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#63b8d4' }}>{profile.firstName + " " + profile.familyName}</Text>

                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', marginLeft: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Email:</Text>
                            <Text style={{ fontSize: 18, marginLeft: 5 }}>{profile.email}</Text>
                        </View>
                        <Divider style={{ backgroundColor: '#63b8d4' }} />
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', marginLeft: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Phone No.:</Text>
                            <Text style={{ fontSize: 18, marginLeft: 5 }}>{profile.phoneNum}</Text>
                        </View>
                        <Divider style={{ backgroundColor: '#63b8d4' }} />
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', marginLeft: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Birth Date:</Text>
                            <Text style={{ fontSize: 18, marginLeft: 5 }}>{profile.birthdate.toDateString()}</Text>
                        </View>
                        <Divider style={{ backgroundColor: '#63b8d4' }} />
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', marginLeft: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Service Category:</Text>
                            <Text style={{ fontSize: 18, marginLeft: 5 }}>{profile.category}</Text>
                        </View>
                        <Divider style={{ backgroundColor: '#63b8d4' }} />
                        <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Service Description:</Text>
                            <Text style={{ fontSize: 18 }}>{profile.serverDesription}</Text>
                        </View>
                        <Divider style={{ backgroundColor: '#63b8d4' }} />
                        <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Sample Work: </Text>
                            <Image
                                source={{ uri: profile.sampleWorkImg }}
                                style={{ width: 200, height: 200 }}
                                PlaceholderContent={<ActivityIndicator />}
                            />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </>
        );
    }
}


export default ViewProfileScreen;
