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
import categories from './categories';
import { connect } from 'react-redux';
import { menuList } from '../state/reducer';
import * as types from '../state/types';
import { Dispatch } from 'react-redux';
import { changeStateItem, changeStateSignedIn, setProfileId, changeHasProfileState, setUserId } from '../state/actions';
import validate from 'validate.js';
import NavigationService from './NavigationService.js';

export interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>,
    hasProfile: boolean,
    changeState: any,
    changeHasProfileState: any,
    changeSignedInState: any,
    setProfileId: any
}
class AddProfileScreen extends React.Component<Props, object> {

    state = {
        // personal info
        firstName: '',
        firstNameError: '',
        familyName: '',
        familyNameError: '',
        phoneNum: '',
        phoneNumError: '',
        email: '',
        emailError: '',
        // for date birth
        birthdate: new Date(),
        showDate: false,
        // for avatar
        avatarSource: null,
        showAvatar: false,
        avatarUri: "",
        avatarFileName: "",
        avartfbUrl: "",
        avatarError: '',
        // service info
        category: 'Carpenter',
        serverDesription: '',
        // for sample work
        showSampleWorkImg: false,
        sampleWorkImg: null,
        sampleWorkImgUri: "",
        sampleWorkImgFileName: "",
        sampleWorkImgfbUrl: "",
        wsError: '',
        // activity indicator
        saveLoading: false,
        // form validation 
        isSbumitted: false


    }

    setDate = (event: SyntheticEvent<Readonly<{ timestamp: number; }>, Event>, birthdate?: Date) => {
        birthdate = birthdate || this.state.birthdate;

        this.setState({
            showDate: false,
            birthdate,
        });
    }
    // store images in firebase
    async uploadPicture(picturePathUri: string, fileName: string, imgfolder: string, type: number): Promise<void> {
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
            switch (type) {
                case 1: this.setState({
                    avartfbUrl: fburl
                }); break;
                case 2: this.setState({
                    sampleWorkImgfbUrl: fburl
                }); break;

            }

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
                    sampleWorkImgUri: response.uri,
                    sampleWorkImgFileName: response.fileName
                });
            }
        });
    }

    // check user has a profile
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
            this.props.setProfileId(resJson.profileId);
        }

        // .catch(error => {
        //     console.error(error);
        //     that.props.changeActivityIndicatorState(false);
        // });

    }
    // @function: saveProfile  
    // @description: Save profile info to the databae
    // 
    async saveProfile() {
        // console.log(this.state)
        if (this.state.emailError === undefined && this.state.firstNameError === undefined && this.state.familyNameError === undefined && this.state.phoneNumError === undefined) {
            this.setState({
                saveLoading: true,
                isSbumitted: true,
            })
            const { avatarUri, sampleWorkImgUri, avatarFileName, sampleWorkImgFileName } = this.state;
            const { navigation } = this.props;

            if (avatarUri !== '') {
                await this.uploadPicture(avatarUri, avatarFileName, 'avatars/', 1);
            } else {
                this.setState({
                    saveLoading: false,
                    isSbumitted: false,
                })
                return;

            }
            if (sampleWorkImgUri !== '') {

                await this.uploadPicture(sampleWorkImgUri, sampleWorkImgFileName, 'workSamples/', 2);
            } else {
                this.setState({
                    saveLoading: false,
                    isSbumitted: false,
                })
                return;
            }
            if (this.state.avartfbUrl === '' || this.state.sampleWorkImgfbUrl === '') {
                if (this.state.avartfbUrl === '') {
                    this.setState({
                        avatarError: 'Please choose a personal image'
                    })
                }
                if (this.state.sampleWorkImgfbUrl === '') {
                    this.setState({
                        wsError: 'Please choose a work sample image'
                    })
                }

            } else {

                var profileData = {
                    firstName: this.state.firstName.trim(),
                    familyName: this.state.familyName.trim(),
                    phoneNum: this.state.phoneNum,
                    email: this.state.email.trim(),
                    birthdate: this.state.birthdate,
                    avatarSource: this.state.avartfbUrl,
                    category: this.state.category,
                    serverDesription: this.state.serverDesription.trim(),
                    sampleWorkImg: this.state.sampleWorkImgfbUrl
                };
                fetch('https://salty-garden-58258.herokuapp.com/mobileApi/addNewProfile', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(profileData),

                }).then(res => res.json())
                    .then(resJson => {
                        console.log('response: ', resJson);
                        this.setState({
                            saveLoading: false
                        });
                        var SharedPreferences = require('react-native-shared-preferences');
                        SharedPreferences.setName("handyInfo");
                        var that = this;
                        SharedPreferences.getItem("handyToken", function (value: any) {
                            console.log(value);
                            if (value !== null) {

                                that.getUserHasProfile(value);
                                if (that.props.hasProfile) {
                                    that.props.changeState(20, 1); // view profile
                                }
                            }
                        });

                        NavigationService.navigate('ViewProfile', { 'profile': profileData });
                    })
                    .catch((error) => {
                        console.error(error);
                        this.setState({
                            saveLoading: false
                        });
                    });
            }
        }
        return;
    }
    render() {
        const { navigation } = this.props;
        const { firstName, firstNameError, familyName, familyNameError, phoneNum, phoneNumError, email, emailError, birthdate, showDate, showAvatar, showSampleWorkImg, isSbumitted, saveLoading, avatarError, wsError } = this.state;
        return (
            <>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                        <HandyHeader navigation={navigation} title="Add Profile" />
                        <Input
                            inputStyle={{ backgroundColor: '#f2f2f2',fontSize:15, borderRadius: 5, marginTop:5,color: "#666" }}
                            label='First Name:'
                            labelStyle={{ fontSize: 20,marginTop:5, color: "#666" }}
                            onChangeText={(firstName) => this.setState({ firstName })}
                            onBlur={() => {
                                this.setState({ firstNameError: validate({ firstName: firstName }, { firstName: { presence: true, type: 'string', length: { minimum: 1 } } }, { format: "flat" }) })
                            }}
                            placeholder={'Enter your first name...'}
                            placeholderTextColor="#999"
                            errorMessage={Array.isArray(firstNameError) ? firstNameError[0] : firstNameError}
                        >{firstName}</Input>
                        {/* {this.validator.message('firstName', firstName, 'required')} */}

                        <Input
                        containerStyle={{marginTop:15}}
                            inputStyle={{ backgroundColor: '#f2f2f2', borderRadius: 5,fontSize:15,marginTop:5, color: "#666"  }}
                            label='Family Name:'
                            labelStyle={{ fontSize: 20, marginTop:5, color: "#666" }}
                            onChangeText={(familyName) => this.setState({ familyName })}
                            onBlur={() => {
                                this.setState({ familyNameError: validate({ familyName: familyName }, { familyName: { presence: true, type: 'string', length: { minimum: 1 } } }, { format: "flat" }) })
                            }}
                            placeholder={'Enter your family name...'}
                            placeholderTextColor="#999"
                            errorMessage={Array.isArray(familyNameError) ? familyNameError[0] : familyNameError}

                        >{familyName}</Input>
                        <Input
                            inputStyle={{ backgroundColor: '#f2f2f2', borderRadius: 5, fontSize:15, marginTop:5,color: "#666" }}
                            label='Phone No.:'
                            labelStyle={{ fontSize: 20, marginTop:5, color: "#666" }}
                            keyboardType="number-pad"
                            onChangeText={(phoneNum) => this.setState({ phoneNum })}
                            onBlur={() => {
                                this.setState({ phoneNumError: validate({ phoneNum: phoneNum }, { phoneNum: { presence: true, length: { minimum: 6 } } }, { format: "flat" }) })
                            }}
                            placeholder={'Enter your phone number...'}
                            placeholderTextColor="#999"
                            errorMessage={Array.isArray(phoneNumError) ? phoneNumError[0] : phoneNumError}

                        >{phoneNum}</Input>
                        <Input
                            inputStyle={{ backgroundColor: '#f2f2f2', borderRadius: 5, fontSize:15, marginTop:5,color: "#666" }}
                            label='Email:'
                            labelStyle={{ fontSize: 20, marginTop:5, color: "#666" }}
                            onChangeText={(email) => this.setState({ email })}
                            onBlur={() => {
                                this.setState({ emailError: validate({ email: email.trim() }, { email: { presence: true, email: true } }, { format: "flat" }) })
                            }}
                            placeholder={'Enter your email...'}
                            placeholderTextColor="#999"
                            errorMessage={Array.isArray(emailError) ? emailError[0] : emailError}
                        >{email}</Input>
                        {/* Begin: date input */}
                        <Input
                            inputStyle={{ backgroundColor: '#f2f2f2', borderRadius: 5,fontSize:15, marginTop:5,color: "#666" }}
                            label='Birth Date:'
                            labelStyle={{ fontSize: 20, marginTop:5, color: "#666" }}
                            placeholder={'Enter your birthDate...'}
                            placeholderTextColor="#999"
                            onChangeText={(birthdate) => this.setState({ birthdate })}
                            onFocus={this.showDatePicker}
                        >{birthdate.toDateString()}</Input>
                        {showDate && <RNDateTimePicker mode="date" value={birthdate} onChange={this.setDate} />}
                        {/* end date input */}
                        {/* upload avatar input */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                            <View style={{ flex: 2, alignItems: 'flex-start', marginLeft: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: 'bold', marginTop:15,marginBottom:5,fontSize:15, color: "#666" }}>Upload Avatar:</Text>
                                </View>
                                <View style={{ flex: 2, marginLeft: 10 }}>
                                    <Button buttonStyle={{
                                        backgroundColor: '#F44324',
                                        width: 100 + "%",

                                    }}
                                        titleStyle={{
                                            color: '#f2f2f2'
                                        }}
                                        title="Upload" onPress={this.showImagePicker} ></Button>
                                </View>
                            </View>
                            <View style={{ flex: 2, alignItems: 'center' }}>
                                {!showAvatar && <Avatar rounded title="SP" titleStyle={{ fontSize: 60 }} activeOpacity={0.7} containerStyle={{ width: 150, height: 150, backgroundColor: '#078ca9' }} />}
                                {showAvatar && <Avatar rounded source={this.state.avatarSource} activeOpacity={0.7} containerStyle={{ width: 150, height: 150, backgroundColor: '#078ca9' }} />}
                            </View>
                        </View>
                        <Text style={{ fontSize: 16, lineHeight: 20, color: 'red', textAlign: 'center' }} > {avatarError}</Text>

                        {/* end of upload avatar input */}
                        {/* Service Info */}
                        <View style={{ flex: 2, alignItems: 'flex-start', marginLeft: 10, marginBottom: 20 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold', color: "#666", fontSize: 18 }}>Service Category:</Text>
                            </View>
                            <Picker
                                selectedValue={this.state.category}
                                style={{ flex: 2, height: 50, width: 100 + "%" }}
                                itemStyle={{ backgroundColor: '#fff', color: '#078ca9', fontSize: 20 }}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ category: itemValue })
                                }>
                                {
                                    categories.map(category => {

                                        return <Picker.Item label={category.name} value={category.name} key={category.id} />
                                    })}


                            </Picker>
                        </View>

                        <Input
                            containerStyle={{ marginBottom: 20 }}
                            inputStyle={{ backgroundColor: '#f2f2f2',marginTop:15 , borderRadius: 5, color: "#666", fontSize:18,textAlignVertical: 'top' }}
                            label='Service Description:'
                            labelStyle={{ fontSize: 18, color: "#666", textAlignVertical: 'top'}}
                            onChangeText={(serverDesription) => this.setState({ serverDesription })}
                            placeholder={'Enter Service Description...'}
                            multiline={true}
                            numberOfLines={8}
                            placeholderTextColor="#999"
                        // errorMessage='Enter your family name'
                        >{this.state.serverDesription}</Input>
                        {/* sample work image */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                            <View style={{ flex: 2, alignItems: 'flex-start', marginLeft: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: 'bold', color: "#666", fontSize: 18 }}>Upload Sample Work:</Text>
                                </View>
                                <View style={{ flex: 2, marginLeft: 10 }}>
                                    <Button buttonStyle={{
                                        backgroundColor: '#F44324',
                                        width: 100 + "%",
                                    }}
                                        titleStyle={{
                                            color: '#f2f2f2'
                                        }}
                                        title="Upload" onPress={this.showSampleImagePicker} ></Button>
                                </View>
                            </View>
                            <View style={{ flex: 2, alignItems: 'center' }}>
                                {!showSampleWorkImg && <Avatar rounded title="SW" titleStyle={{ fontSize: 60 }} activeOpacity={0.7} containerStyle={{ width: 150, height: 150, backgroundColor: '#078ca9' }} />}
                                {showSampleWorkImg && <Avatar rounded source={this.state.sampleWorkImg} activeOpacity={0.7} containerStyle={{ width: 150, height: 150, backgroundColor: '#078ca9' }} />}
                            </View>
                        </View>
                        <Text style={{ fontSize: 16, lineHeight: 20, color: 'red', textAlign: 'center' }} > {wsError}</Text>

                        {/* End of service Info */}
                        <View style={{ flex: 1, margin: 10 }}>
                            <Button buttonStyle={{
                                backgroundColor: '#078ca9',
                                width: 100 + "%",
                            }}
                                titleStyle={{
                                    color: '#f2f2f2'
                                }}
                                title="Save Profile" onPress={() => this.saveProfile()} loading={saveLoading}></Button>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </>
        );
    }
}

const mapDipatchToProps = (dispatch: Dispatch) => ({
    changeState: (id: number, state: number) => {
        dispatch(changeStateItem(id, state));
    },
    changeSignedInState: (state: number) => {
        dispatch(changeStateSignedIn(state));
    },
    changeHasProfileState: (state: number) => {
        dispatch(changeHasProfileState(state));
    },
    setUserId: (userId: number) => {
        dispatch(setUserId(userId));
    },
    setProfileId: (profileId: string) => {
        dispatch(setProfileId(profileId));
    },

    // other callbacks go here...
});
const mapStateToProps = (appstate: any, navigation: NavigationScreenProp<NavigationState, NavigationParams>) => ({
    items: appstate,
    hasProfile: appstate.changeGeneralState.hasProfile,
    profileId: appstate.changeGeneralState.profileId,
    navigation: navigation
});

export default connect(mapStateToProps, mapDipatchToProps)(AddProfileScreen);



// export default AddProfileScreen;
