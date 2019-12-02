import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    StatusBar,
    Alert,
} from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState,
} from 'react-navigation';
import HandyHeader from './HandyHeader';

export interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
class ProfilesScreen extends React.Component<Props, object> {


    render() {
        const { navigation } = this.props;

        return (
            <>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView style={{ flex: 1 }}>

                    <ScrollView style={{ flex: 1, backgroundColor: '#91cde0' }}>
                        <HandyHeader navigation={navigation} title="Profiles" />

                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {categories.map(category => {
                                    return (
                                        <View key={category.id} style={{ width: 33 + "%" }}>
                                            <Card
                                                containerStyle={{ paddingTop: 2, backgroundColor: "#eff7fa" }}
                                                imageStyle={{ width: 70, height: 70 }}
                                                image={category.img}>
                                                <Button
                                                    titleStyle={{ fontSize: 12 }}
                                                    buttonStyle={{ backgroundColor: '#91cde0', borderRadius: 5, marginLeft: 0, marginRight: 0, marginBottom: 0, padding: 0 }}
                                                    title={category.name}
                                                    onPress={() => Alert.alert('hello')} />
                                            </Card>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </>
        );
    }
}


const styles = StyleSheet.create({
    baseText: {
        fontFamily: 'Cochin',
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
    }
});

const categories = [
    {
        id: 1,
        name: 'Carpenters',
        img: require('./../assets/carpenters.jpg')
    },

    {
        id: 3,
        name: 'Plumming',
        img: require('./../assets/shaghelohm.png')
    },
    {
        id: 5,
        name: 'Drivers',
        img: require('./../assets/shaghelohm.png')
    },
    {
        id: 4,
        name: 'Moving Services',
        img: require('./../assets/shaghelohm.png')
    },
    {
        id: 2,
        name: 'Electrical maintanance',
        img: require('./../assets/shaghelohm.png')
    },
    {
        id: 10,
        name: 'Security Services',
        img: require('./../assets/shaghelohm.png')
    },

    {
        id: 6,
        name: 'Painers',
        img: require('./../assets/shaghelohm.png')
    },
    {
        id: 7,
        name: 'Gardeners',
        img: require('./../assets/shaghelohm.png')
    },
    {
        id: 8,
        name: 'Nurses',
        img: require('./../assets/shaghelohm.png')
    },
    {
        id: 9,
        name: 'Babysitters',
        img: require('./../assets/shaghelohm.png')
    },

    {
        id: 11,
        name: 'Carpenters',
        img: require('./../assets/shaghelohm.png')
    },
    {
        id: 12,
        name: 'Tutoers',
        img: require('./../assets/shaghelohm.png')
    },
    {
        id: 13,
        name: 'Blacksmiths',
        img: require('./../assets/shaghelohm.png')
    },
    {
        id: 14,
        name: 'Builders',
        img: require('./../assets/shaghelohm.png')
    },
    {
        id: 15,
        name: 'Aluminum Services',
        img: require('./../assets/shaghelohm.png')
    },
    {
        id: 16,
        name: 'Satellite Services',
        img: require('./../assets/shaghelohm.png')
    },
    {
        id: 17,
        name: 'Cooking Services',
        img: require('./../assets/shaghelohm.png')
    },
    {
        id: 18,
        name: 'General Services',
        img: require('./../assets/shaghelohm.png')
    }

]

export default ProfilesScreen;
