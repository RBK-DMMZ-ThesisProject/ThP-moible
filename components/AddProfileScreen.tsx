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
    Picker

} from 'react-native';
import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState,
} from 'react-navigation';
import { Input, Avatar, Button } from 'react-native-elements'

import HandyHeader from './HandyHeader';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import ImagePicker from 'react-native-image-picker';
import storage, { firebase } from '@react-native-firebase/storage';
import { any } from 'prop-types';

export interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
class AddProfileScreen extends React.Component<Props, object> {
    state = {
        // personal info
        firstName: '',
        familyName: '',
        phoneNum: '',
        email: '',
        // for date birth
        birthdate: new Date(),
        showDate: false,
        // for avatar
        avatarSource: null,
        showAvatar: false,
        avatarUri: "",
        avatarFileName: "",
        avartfbUrl: "",
        // service info
        category: 'Carpenter',
        serverDesription: '',
        // for sample work
        showSampleWorkImg: false,
        sampleWorkImg: null,
        sampleWorkImgFileName: "",
        sampleWorkImgfbUrl: "",
        saveLoading: false

    }

    setDate = (event: SyntheticEvent<Readonly<{ timestamp: number; }>, Event>, birthdate?: Date) => {
        birthdate = birthdate || this.state.birthdate;

        this.setState({
            showDate: false,
            birthdate,
        });
    }
    // store images in firebase
    async uploadPicture(picturePathUri: string, fileName: string, imgfolder: string): Promise<void> {
        console.log(`PATH: ${picturePathUri}`);
        try {
            var ref = firebase
                .storage()
                .ref(imgfolder);
            await ref
                .child(fileName).putFile(
                    picturePathUri,
                );
            var fburl = await ref.child(fileName).getDownloadURL();
            console.log(fburl);
            this.setState({
                avartfbUrl: await ref.child(fileName).getDownloadURL()
            })
        } catch (error) {
            console.log(error, JSON.stringify(error, null, 2));
        }
    }
    // shows the date picker on focus 
    showDatePicker = () => {
        // don't show the keyboard
        Keyboard.dismiss()
        this.setState({
            showDate: true,
        });
    }
    //show Image picker 
    showImagePicker = () => {
        // initial settings 
        const options: object = {
            title: 'Select Avatar',
            customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.showImagePicker(options, (response) => {
            // console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    showAvatar: true,
                    avatarSource: source,
                    avatarUri: response.uri,
                    avatarFileName: response.fileName,
                });
            }
        });

    }
    showSampleImagePicker = () => {
        // initial settings 
        const options: object = {
            title: 'Select Sample Work',
            customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };
                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                    showSampleWorkImg: true,
                    sampleWorkImg: source,
                    sampleWorkImgfbUrl: response.uri,
                    sampleWorkImgFileName: response.fileName
                });
            }
        });
    }
    // @function: saveProfile  
    // @description: Save profile info to the databae
    // 
    async saveProfile() {
        // console.log(this.state)
        const { avatarUri, sampleWorkImgfbUrl, avatarFileName, sampleWorkImgFileName } = this.state;

        this.setState({
            saveLoading: true
        })
        await this.uploadPicture(avatarUri, avatarFileName, 'avatars/');
        await this.uploadPicture(sampleWorkImgfbUrl, sampleWorkImgFileName, 'workSamples/');

        fetch('https://salty-garden-58258.herokuapp.com/mobileApi/addNewProfile', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: this.state.firstName,
                familyName: this.state.familyName,
                phoneNum: this.state.phoneNum,
                email: this.state.email,
                birthdate: this.state.birthdate,
                avatarSource: this.state.avartfbUrl,
                category: this.state.category,
                serverDesription: this.state.serverDesription,
                sampleWorkImg: this.state.sampleWorkImgfbUrl
            }),

        }).then(res => res.json())
            .then(resJson => {
                console.log('response: ', resJson);
                this.setState({
                    saveLoading: false
                });
            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    saveLoading: false
                });
            });
    }
    render() {
        const { navigation } = this.props;
        const { firstName, familyName, phoneNum, email, birthdate, showDate, showAvatar, showSampleWorkImg, saveLoading } = this.state;
        return (
            <>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                        <HandyHeader navigation={navigation} title="Add Profile" />
                        <Input
                            inputStyle={{ backgroundColor: '#dff0f6', borderRadius: 5, color: "#91cde0" }}
                            label='First Name:'
                            labelStyle={{ fontSize: 20, color: "#91cde0" }}
                            onChangeText={(firstName) => this.setState({ firstName })}
                            placeholder={'Enter your first name...'}
                            placeholderTextColor="#91cde0"
                        // errorMessage='Enter your first name'
                        >{firstName}</Input>
                        <Input
                            inputStyle={{ backgroundColor: '#dff0f6', borderRadius: 5, color: "#91cde0" }}
                            label='Family Name:'
                            labelStyle={{ fontSize: 20, color: "#91cde0" }}
                            onChangeText={(familyName) => this.setState({ familyName })}
                            placeholder={'Enter your family name...'}
                            placeholderTextColor="#91cde0"
                        // errorMessage='Enter your family name'

                        >{familyName}</Input>
                        <Input
                            inputStyle={{ backgroundColor: '#dff0f6', borderRadius: 5, color: "#91cde0" }}
                            label='Phone No.:'
                            labelStyle={{ fontSize: 20, color: "#91cde0" }}
                            onChangeText={(phoneNum) => this.setState({ phoneNum })}
                            placeholder={'Enter your phone number...'}
                            placeholderTextColor="#91cde0"
                        // errorMessage='Enter your family name'

                        >{phoneNum}</Input>
                        <Input
                            inputStyle={{ backgroundColor: '#dff0f6', borderRadius: 5, color: "#91cde0" }}
                            label='Email:'
                            labelStyle={{ fontSize: 20, color: "#91cde0" }}
                            onChangeText={(email) => this.setState({ email })}
                            placeholder={'Enter your email...'}
                            placeholderTextColor="#91cde0"
                        // errorMessage='Enter your family name'
                        >{email}</Input>
                        {/* Begin: date input */}
                        <Input
                            inputStyle={{ backgroundColor: '#dff0f6', borderRadius: 5, color: "#91cde0" }}
                            label='Birth Date:'
                            labelStyle={{ fontSize: 20, color: "#91cde0" }}
                            placeholder={'Enter your birthDate...'}
                            placeholderTextColor="#91cde0"
                            onChangeText={(birthdate) => this.setState({ birthdate })}
                            onFocus={this.showDatePicker}
                        >{birthdate.toDateString()}</Input>
                        {showDate && <RNDateTimePicker mode="date" value={birthdate} onChange={this.setDate} />}
                        {/* end date input */}
                        {/* upload avatar input */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                            <View style={{ flex: 2, alignItems: 'flex-start', marginLeft: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: 'bold', color: "#91cde0", fontSize: 22 }}>Upload Avatar:</Text>
                                </View>
                                <View style={{ flex: 2, marginLeft: 10 }}>
                                    <Button buttonStyle={{
                                        backgroundColor: '#91cde0',
                                        width: 100 + "%",
                                    }}
                                        titleStyle={{
                                            color: '#dff0f6'
                                        }}
                                        title="Upload" onPress={this.showImagePicker} ></Button>
                                </View>
                            </View>
                            <View style={{ flex: 2, alignItems: 'center' }}>
                                {!showAvatar && <Avatar rounded title="SP" titleStyle={{ fontSize: 60 }} activeOpacity={0.7} containerStyle={{ width: 150, height: 150, backgroundColor: '#91cde0' }} />}
                                {showAvatar && <Avatar rounded source={this.state.avatarSource} activeOpacity={0.7} containerStyle={{ width: 150, height: 150, backgroundColor: '#91cde0' }} />}
                            </View>
                        </View>
                        {/* end of upload avatar input */}
                        {/* Service Info */}
                        <View style={{ flex: 2, alignItems: 'flex-start', marginLeft: 10, marginBottom: 20 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold', color: "#91cde0", fontSize: 22 }}>Service Category:</Text>
                            </View>
                            <Picker
                                selectedValue={this.state.category}
                                style={{ flex: 2, height: 50, width: 100 + "%" }}
                                itemStyle={{ backgroundColor: '#fff', color: '#91cde0', fontSize: 20 }}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ category: itemValue })
                                }>
                                <Picker.Item label="Carpenter" value="Carpenter" />
                                <Picker.Item label="Builder" value="Builder" />
                            </Picker>
                        </View>

                        <Input
                            containerStyle={{ marginBottom: 20 }}
                            inputStyle={{ backgroundColor: '#dff0f6', borderRadius: 5, color: "#91cde0", textAlignVertical: 'top' }}
                            label='Service Description:'
                            labelStyle={{ fontSize: 20, color: "#91cde0", textAlignVertical: 'top' }}
                            onChangeText={(serverDesription) => this.setState({ serverDesription })}
                            placeholder={'Enter Service Description...'}
                            multiline={true}
                            numberOfLines={8}
                            placeholderTextColor="#91cde0"
                        // errorMessage='Enter your family name'
                        >{this.state.serverDesription}</Input>
                        {/* sample work image */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                            <View style={{ flex: 2, alignItems: 'flex-start', marginLeft: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: 'bold', color: "#91cde0", fontSize: 22 }}>Upload Sample Work:</Text>
                                </View>
                                <View style={{ flex: 2, marginLeft: 10 }}>
                                    <Button buttonStyle={{
                                        backgroundColor: '#91cde0',
                                        width: 100 + "%",
                                    }}
                                        titleStyle={{
                                            color: '#dff0f6'
                                        }}
                                        title="Upload" onPress={this.showSampleImagePicker} ></Button>
                                </View>
                            </View>
                            <View style={{ flex: 2, alignItems: 'center' }}>
                                {!showSampleWorkImg && <Avatar rounded title="SW" titleStyle={{ fontSize: 60 }} activeOpacity={0.7} containerStyle={{ width: 150, height: 150, backgroundColor: '#91cde0' }} />}
                                {showSampleWorkImg && <Avatar rounded source={this.state.sampleWorkImg} activeOpacity={0.7} containerStyle={{ width: 150, height: 150, backgroundColor: '#91cde0' }} />}
                            </View>
                        </View>

                        {/* End of service Info */}
                        <View style={{ flex: 1, margin: 10 }}>
                            <Button buttonStyle={{
                                backgroundColor: '#91cde0',
                                width: 100 + "%",
                            }}
                                titleStyle={{
                                    color: '#dff0f6'
                                }}
                                title="Save Profile" onPress={() => this.saveProfile()} loading={saveLoading}></Button>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </>
        );
    }
}


export default AddProfileScreen;
