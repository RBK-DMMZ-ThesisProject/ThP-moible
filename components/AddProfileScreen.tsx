import React, {SyntheticEvent} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  Keyboard,
  Picker,
} from 'react-native';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import {Input, Avatar, Button} from 'react-native-elements';
import HandyHeader from './HandyHeader';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import ImagePicker from 'react-native-image-picker';
import {firebase} from '@react-native-firebase/storage';
import categories from './categories';
import {connect} from 'react-redux';
import {Dispatch} from 'react-redux';
import {
  changeStateItem,
  changeStateSignedIn,
  setProfileId,
  changeHasProfileState,
  setUserId,
} from '../state/actions';
import validate from 'validate.js';
import NavigationService from './NavigationService.js';

export interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  hasProfile: boolean;
  changeState: any;
  changeHasProfileState: any;
  changeSignedInState: any;
  setProfileId: any;
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
    birthDate: new Date(),
    showDate: false,
    // for avatar
    avatarSource: null,
    showAvatar: false,
    avatarUri: '',
    avatarFileName: '',
    avatarFbUrl: '',
    avatarError: '',
    // service info
    category: 'Carpenter',
    serverDescription: '',
    // for sample work
    showSampleWorkImg: false,
    sampleWorkImg: null,
    sampleWorkImgUri: '',
    sampleWorkImgFileName: '',
    sampleWorkImgFbUrl: '',
    wsError: '',
    // activity indicator
    saveLoading: false,
    // form validation
    isSubmitted: false,
  };

  componentDidMount() {
    // check if a token exists
    var SharedPreferences = require('react-native-shared-preferences');
    SharedPreferences.setName('handyInfo');
    SharedPreferences.getItem('handyToken', (value: any) => {
      if (value === null) {
        this.props.navigation.navigate('SignIn');
      } else {
        fetch('https://salty-garden-58258.herokuapp.com/mobileApi/getUser', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({customerID: value}),
        })
          .then((res: any) => res.json())
          .then((resJson: any) => {
            var name = resJson[0].userName.split(' ');
            this.setState({
              firstName: name[0],
              familyName: name[1],
              phoneNum: resJson[0].mobileNO,
              email: resJson[0].email,
            });
          })
          .catch((error: any) => {
            console.error(error);
          });
      }
    });
  }

   // @function: setDate
   // @description: Set birth date
  setDate(
    event: SyntheticEvent<Readonly<{timestamp: number}>, Event>,
    birthDate?: Date,
  ) {
    birthDate = birthDate || this.state.birthDate;
    this.setState({
      showDate: false,
      birthDate,
    });
  }

   // @function: uploadPicture
   // @description: Store images in firebase
  async uploadPicture(
    picturePathUri: string,
    fileName: string,
    imgFolder: string,
    type: number,
  ): Promise<void> {
    try {
      var ref = firebase.storage().ref(imgFolder);
      await ref.child(fileName).putFile(picturePathUri);
      var fbUrl = await ref.child(fileName).getDownloadURL();
      switch (type) {
        case 1:
          this.setState({
            avatarFbUrl: fbUrl,
          });
          break;
        case 2:
          this.setState({
            sampleWorkImgFbUrl: fbUrl,
          });
          break;
      }
    } catch (error) {
      console.log(error, JSON.stringify(error, null, 2));
    }
  }

   // @function: showDatePicker
   // @description: Shows the date picker on focus
  showDatePicker() {
    // don't show the keyboard
    Keyboard.dismiss();
    this.setState({
      showDate: true,
    });
  }

   // @function: showImagePicker
   // @description: Show Image picker for selecting the avatar
  showImagePicker() {
    // initial settings
    const options: object = {
      title: 'Select Avatar',
      customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.uri};
        this.setState({
          showAvatar: true,
          avatarSource: source,
          avatarUri: response.uri,
          avatarFileName: response.fileName,
        });
      }
    });
  }

  // @function: showSampleImagePicker
  // @description: Show the sample work image picker.
  showSampleImagePicker = () => {
    // initial settings
    const options: object = {
      title: 'Select Sample Work',
      customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.uri};
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          showSampleWorkImg: true,
          sampleWorkImg: source,
          sampleWorkImgUri: response.uri,
          sampleWorkImgFileName: response.fileName,
        });
      }
    });
  };

  // @function: getUserHasProfile
  // @description:Check user has a profile
  async getUserHasProfile(token: string) {
    var response = await fetch(
      'https://salty-garden-58258.herokuapp.com/mobileApi/hasProfile',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userToken: token}),
      },
    );
    var resJson = await response.json();
    if (resJson.result) {
      this.props.changeHasProfileState(1);
      this.props.setProfileId(resJson.profileId);
    }
  }
  // @function: saveProfile
  // @description: Save profile info to the database
  async saveProfile() {
    if (
      this.state.emailError === '' &&
      this.state.firstNameError === '' &&
      this.state.familyNameError === '' &&
      this.state.phoneNumError === ''
    ) {

      this.setState({
        saveLoading: true,
        isSubmitted: true,
      });

      const {
        avatarUri,
        sampleWorkImgUri,
        avatarFileName,
        sampleWorkImgFileName,
      } = this.state;

      if (avatarUri !== '') {

        await this.uploadPicture(avatarUri, avatarFileName, 'avatars/', 1);

      } else {

        this.setState({
          saveLoading: false,
          isSubmitted: false,
        });
        return;

      }

      if (sampleWorkImgUri !== '') {

        await this.uploadPicture(
          sampleWorkImgUri,
          sampleWorkImgFileName,
          'workSamples/',
          2,
        );

      } else {

        this.setState({
          saveLoading: false,
          isSubmitted: false,
        });
        return;

      }

      if (
        this.state.avatarFbUrl === '' ||
        this.state.sampleWorkImgFbUrl === ''
      ) {

        if (this.state.avatarFbUrl === '') {

          this.setState({
            avatarError: 'Please choose a personal image',
          });

        }

        if (this.state.sampleWorkImgFbUrl === '') {

          this.setState({
            wsError: 'Please choose a work sample image',
          });

        }
      } else {

        var profileData = {
          firstName: this.state.firstName.trim(),
          familyName: this.state.familyName.trim(),
          phoneNum: this.state.phoneNum,
          email: this.state.email.trim(),
          birthDate: this.state.birthDate,
          avatarSource: this.state.avatarFbUrl,
          category: this.state.category,
          serverDescription: this.state.serverDescription.trim(),
          sampleWorkImg: this.state.sampleWorkImgFbUrl,
        };
        // add a new profile to the database
        fetch(
          'https://salty-garden-58258.herokuapp.com/mobileApi/addNewProfile',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
          },
        )
          .then((res:any) => res.json())
          .then((resJson:any) => {

            this.setState({
              saveLoading: false
            });
            // check if the user has a profile through his token if it exists.
            var SharedPreferences = require('react-native-shared-preferences');
            SharedPreferences.setName('handyInfo');
            SharedPreferences.getItem('handyToken', (value: any) => {
              if (value !== null) {
                this.getUserHasProfile(value);
                if (this.props.hasProfile) {
                    this.props.changeState(20, 1); // show  view profile on the menu
                }
              }
            });

            NavigationService.navigate('ProviderProfile', {
              userId: resJson.userId,
            });

          })
          .catch((error:any) => {
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
    const {navigation} = this.props;
    const {
      firstName,
      firstNameError,
      familyName,
      familyNameError,
      phoneNum,
      phoneNumError,
      email,
      emailError,
      birthDate,
      showDate,
      showAvatar,
      showSampleWorkImg,
      isSubmitted,
      saveLoading,
      avatarError,
      wsError,
    } = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{flex: 1}}>
          <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
            <HandyHeader navigation={navigation} title="Add Profile" />
            <Input
              containerStyle={{
                flex: 1,
                alignSelf: 'center',
                justifyContent: 'center',
                width: 350,
              }}
              inputStyle={{
                backgroundColor: '#f2f2f2',
                fontSize: 15,
                borderRadius: 5,
                marginTop: 5,
                color: '#666',
              }}
              label="First Name:"
              labelStyle={{fontSize: 18, marginTop: 5, color: '#666'}}
              onChangeText={(firstName:string) => this.setState({firstName})}
              onBlur={() => {
                this.setState({
                  firstNameError: validate(
                    {firstName: firstName},
                    {
                      firstName: {
                        presence: true,
                        type: 'string',
                        length: {minimum: 1},
                      },
                    },
                    {format: 'flat'},
                  ),
                });
              }}
              placeholder={'Enter your first name...'}
              placeholderTextColor="#999"
              errorMessage={
                Array.isArray(firstNameError)
                  ? firstNameError[0]
                  : firstNameError
              }>
              {firstName}
            </Input>

            <Input
              containerStyle={{
                flex: 1,
                marginTop: 10,
                alignSelf: 'center',
                justifyContent: 'center',
                width: 350,
              }}
              inputStyle={{
                backgroundColor: '#f2f2f2',
                borderRadius: 5,
                fontSize: 15,
                marginTop: 5,
                color: '#666',
              }}
              label="Family Name:"
              labelStyle={{fontSize: 18, marginTop: 5, color: '#666'}}
              onChangeText={(familyName:string) => this.setState({familyName})}
              onBlur={() => {
                this.setState({
                  familyNameError: validate(
                    {familyName: familyName},
                    {
                      familyName: {
                        presence: true,
                        type: 'string',
                        length: {minimum: 1},
                      },
                    },
                    {format: 'flat'},
                  ),
                });
              }}
              placeholder={'Enter your family name...'}
              placeholderTextColor="#999"
              errorMessage={
                Array.isArray(familyNameError)
                  ? familyNameError[0]
                  : familyNameError
              }>
              {familyName}
            </Input>
            <Input
              containerStyle={{
                flex: 1,
                marginTop: 10,
                alignSelf: 'center',
                justifyContent: 'center',
                width: 350,
              }}
              inputStyle={{
                backgroundColor: '#f2f2f2',
                borderRadius: 5,
                fontSize: 15,
                marginTop: 5,
                color: '#666',
              }}
              label="Phone No.:"
              labelStyle={{fontSize: 18, marginTop: 5, color: '#666'}}
              keyboardType="number-pad"
              onChangeText={(phoneNum:any) => this.setState({phoneNum})}
              onBlur={() => {
                this.setState({
                  phoneNumError: validate(
                    {phoneNum: phoneNum},
                    {phoneNum: {presence: true, length: {minimum: 6}}},
                    {format: 'flat'},
                  ),
                });
              }}
              placeholder={'Enter your phone number...'}
              placeholderTextColor="#999"
              errorMessage={
                Array.isArray(phoneNumError) ? phoneNumError[0] : phoneNumError
              }>
              {phoneNum}
            </Input>
            <Input
              containerStyle={{
                flex: 1,
                marginTop: 15,
                alignSelf: 'center',
                justifyContent: 'center',
                width: 350,
              }}
              inputStyle={{
                backgroundColor: '#f2f2f2',
                borderRadius: 5,
                fontSize: 15,
                marginTop: 5,
                color: '#666',
              }}
              label="Email:"
              labelStyle={{fontSize: 18, marginTop: 5, color: '#666'}}
              onChangeText={(email:string) => this.setState({email})}
              onBlur={() => {
                this.setState({
                  emailError: validate(
                    {email: email.trim()},
                    {email: {presence: true, email: true}},
                    {format: 'flat'},
                  ),
                });
              }}
              placeholder={'Enter your email...'}
              placeholderTextColor="#999"
              errorMessage={
                Array.isArray(emailError) ? emailError[0] : emailError
              }>
              {email}
            </Input>
            {/* Begin: date input */}
            <Input
              containerStyle={{
                flex: 1,
                marginTop: 15,
                alignSelf: 'center',
                justifyContent: 'center',
                width: 350,
              }}
              inputStyle={{
                backgroundColor: '#f2f2f2',
                borderRadius: 5,
                fontSize: 15,
                marginTop: 5,
                color: '#666',
              }}
              label="Birth Date:"
              labelStyle={{fontSize: 18, marginTop: 5, color: '#666'}}
              placeholder={'Enter your birthDate...'}
              placeholderTextColor="#999"
              onChangeText={(birthDate:any) => this.setState({birthDate})}
              onFocus={this.showDatePicker}>
              {birthDate.toDateString()}
            </Input>
            {showDate && (
              <RNDateTimePicker
                mode="date"
                value={birthDate}
                onChange={this.setDate}
              />
            )}
            {/* end date input */}
            {/* upload avatar input */}
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: 20,
                width: 350,
              }}>
              <View style={{flex: 2, alignItems: 'flex-start', marginLeft: 10}}>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      marginBottom: 5,
                      fontSize: 18,
                      color: '#666',
                    }}>
                    Upload Avatar:
                  </Text>
                </View>
                <View style={{flex: 2, marginLeft: 10}}>
                  <Button
                    buttonStyle={{
                      backgroundColor: '#F44324',
                      width: 100 + '%',
                    }}
                    titleStyle={{
                      color: '#f2f2f2',
                    }}
                    title="Upload"
                    onPress={this.showImagePicker}></Button>
                </View>
              </View>
              <View style={{flex: 2, alignItems: 'center'}}>
                {!showAvatar && (
                  <Avatar
                    rounded
                    title="SP"
                    titleStyle={{fontSize: 60}}
                    activeOpacity={0.7}
                    containerStyle={{
                      width: 150,
                      height: 150,
                      backgroundColor: '#078ca9',
                    }}
                  />
                )}
                {showAvatar && (
                  <Avatar
                    rounded
                    source={this.state.avatarSource}
                    activeOpacity={0.7}
                    containerStyle={{
                      width: 150,
                      height: 150,
                      backgroundColor: '#078ca9',
                    }}
                  />
                )}
              </View>
            </View>
            <Text
              style={{
                fontSize: 15,
                lineHeight: 20,
                color: 'red',
                textAlign: 'center',
                alignSelf: 'center',
                width: 350,
              }}>
              {avatarError}
            </Text>
            {/* end of upload avatar input */}
            {/* Service Info */}
            <View
              style={{
                flex: 2,
                alignItems: 'flex-start',
                marginLeft: 10,
                marginBottom: 20,
                alignSelf: 'center',
                marginTop: 20,
                width: 350,
              }}>
              <View style={{flex: 1}}>
                <Text style={{fontWeight: 'bold', color: '#666', fontSize: 18}}>
                  Service Category:
                </Text>
              </View>
              <Picker
                selectedValue={this.state.category}
                style={{flex: 2, height: 50, width: 100 + '%'}}
                itemStyle={{
                  backgroundColor: '#999',
                  color: '#078ca9',
                  fontSize: 20,
                }}
                onValueChange={(itemValue: any) =>
                  this.setState({category: itemValue})
                }>
                {categories.map(category => {
                  return (
                    <Picker.Item
                      label={category.name}
                      value={category.name}
                      key={category.id}
                    />
                  );
                })}
              </Picker>
            </View>

            <Input
              containerStyle={{
                flex: 1,
                marginTop: 15,
                alignSelf: 'center',
                justifyContent: 'center',
                width: 350,
              }}
              inputStyle={{
                marginTop: 5,
                backgroundColor: '#f2f2f2',
                borderRadius: 5,
                color: '#666',
                fontSize: 18,
                textAlignVertical: 'top',
              }}
              label="Service Description:"
              labelStyle={{
                fontSize: 18,
                color: '#666',
                textAlignVertical: 'top',
              }}
              onChangeText={(serverDescription:string) =>
                this.setState({serverDescription})
              }
              placeholder={'Enter Service Description...'}
              multiline={true}
              numberOfLines={8}
              placeholderTextColor="#999"
            >
              {this.state.serverDescription}
            </Input>
            {/* sample work image */}
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <View style={{flex: 2, alignItems: 'flex-start', marginLeft: 10}}>
                <View style={{flex: 1}}>
                  <Text
                    style={{fontWeight: 'bold', color: '#666', fontSize: 18}}>
                    Upload Sample Work:
                  </Text>
                </View>
                <View style={{flex: 2, marginLeft: 10}}>
                  <Button
                    buttonStyle={{
                      backgroundColor: '#F44324',
                      width: 100 + '%',
                    }}
                    titleStyle={{
                      color: '#f2f2f2',
                    }}
                    title="Upload"
                    onPress={this.showSampleImagePicker}></Button>
                </View>
              </View>
              <View style={{flex: 2, alignItems: 'center'}}>
                {!showSampleWorkImg && (
                  <Avatar
                    rounded
                    title="SW"
                    titleStyle={{fontSize: 60}}
                    activeOpacity={0.7}
                    containerStyle={{
                      width: 150,
                      height: 150,
                      backgroundColor: '#078ca9',
                    }}
                  />
                )}
                {showSampleWorkImg && (
                  <Avatar
                    rounded
                    source={this.state.sampleWorkImg}
                    activeOpacity={0.7}
                    containerStyle={{
                      width: 150,
                      height: 150,
                      backgroundColor: '#078ca9',
                    }}
                  />
                )}
              </View>
            </View>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 20,
                color: 'red',
                textAlign: 'center',
              }}>
              {wsError}
            </Text>
            {/* End of service Info */}
            <View style={{flex: 1, margin: 10}}>
              <Button
                buttonStyle={{
                  backgroundColor: '#078ca9',
                  flex: 1,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  width: 280,
                }}
                titleStyle={{
                  color: '#f2f2f2',
                }}
                title="Save Profile"
                onPress={() => this.saveProfile()}
                loading={saveLoading}></Button>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
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
});
const mapStateToProps = (appState: any) => ({
  items: appState,
  hasProfile: appState.changeGeneralState.hasProfile,
  profileId: appState.changeGeneralState.profileId,
});

export default connect(mapStateToProps, mapDispatchToProps)(AddProfileScreen);