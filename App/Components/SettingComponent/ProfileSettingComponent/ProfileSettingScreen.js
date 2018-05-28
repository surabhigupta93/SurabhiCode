import React, { Component } from 'react';
import {
    Image,
    StyleSheet,
    View,
    Text,
    Button,
    TouchableOpacity,
    Alert,
    Platform,
    TextInput,
    ScrollView,
    AsyncStorage,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import ProfileSettingScreenStyle from './ProfileSettingScreenStyle';
import { Dropdown } from 'react-native-material-dropdown';
import * as Progress from 'react-native-progress';
import API from '../../../Constants/APIUrls';

var ImagePicker = require('react-native-image-picker');
import ActionSheet from 'react-native-actionsheet';
import { connect } from 'react-redux';
import {
    showLoading,
    showScreenLoading,
    phoneNumberChanged,
    clearUserImageInfo,
    aboutUserChanged,
    firstNameChanged,
    lastNameChanged,
    cityNameChanged,
    stateChanged,
    agencyChanged,
    zipCodeChanged,
    resetState,
    clearUserInfo
} from './UpdateImageAction';

import {
    updateUserImage,
    getUserDetails,
    updateUserDetails,
    getAllAgencyList,
    getAssociateWithAgency,
} from '../../../Action/ActionCreators';

var options = {
    title: 'Select Property Image',
    quality: 1,
    customButtons: [
        { name: 'Syncitt', title: 'Choose Photo' },
    ],
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

const CANCEL_INDEX = 2
const DESTRUCTIVE_INDEX = 3
const actionOptions = ['Upload Photo', 'Take Photo', 'Cancel']
var uploadImagesArray = [];
var responseData = {};
let stateList = [{ value: 'New South Wales' }, { value: 'Australian Capital Territory' }, { value: 'Victoria' },
{ value: 'Queensland' }, { value: 'South Australia' }, { value: 'Western Australia' }, { value: 'Tasmania' },
{ value: 'Northern Territory' }];

class ProfileSettingScreen extends Component {
    constructor() {
        super();
        this.state = {
            userProfileDetails: {},
            countryData: [],
            stateData: [],
            selectedState: '',
            selectedAgency: '',
            selectedAgencyId: '',
            agencyList: [],
            cityData: [],
            zipCodeData: [],
            isEditable: false,
            isDisabled: true,

        };
        this.handlePress = this.handlePress.bind(this)
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onUpdateImageSuccess();
        this.onUserDetailsSuccess();
        this.onAgencyListSuccess();
        this.onAgencyAssociateSuccess();

    }

    componentWillUnmount() {

    }

    componentWillMount() {
        this.setState({ stateData: stateList });
        this.getUserDetails();
        this.callAgencyList();
    }

    prepareAgencyDropdownData(agencyData) {

        var tempArray = agencyData;
        tempArray.map((data, index) => {

            tempArray[index].value = tempArray[index].name;
            tempArray[index].id = tempArray[index]._id;
        })
        //   console.log('preparePropertyOwnerDropdownData list= '+JSON.stringify(tempArray));
        return tempArray;
    }

    onEditClick() {
        this.setState({ isEditable: true });
        this.setState({ isDisabled: false });
    }

    onUserDetailsSuccess() {
        if (this.props.updateUserImageReducer.userDetailsRes != '') {
            console.log('update user details response', JSON.stringify(this.props.updateUserImageReducer.userDetailsRes));

            if (this.props.updateUserImageReducer.userDetailsRes.code == 200) {
                responseData = this.props.updateUserImageReducer.userDetailsRes.data;
                AsyncStorage.setItem('SyncittUserProfileInfo', JSON.stringify(this.props.updateUserImageReducer.userDetailsRes));
                this.setState({ userProfileDetails: this.props.updateUserImageReducer.userDetailsRes });
                this.setState({ countryData: this.prepareCountryDropdownData(responseData.country) });
                //this.setState({ stateData: this.prepareStateDropdownData(responseData.state) });

                // this.setState({ zipCodeData: this.prepareZipcodeDropdownData(.zipCode) });
                this.setState({ selectedState: responseData.state });

                // this.setState({ cityData: this.prepareCityDropdownData(responseData.city) });
                // this.setState({ zipCodeData: this.prepareZipcodeDropdownData(.zipCode) });
                this.setUserData(responseData);
            }
            else {
                alert(this.props.updateUserImageReducer.userDetailsRes.message);
                //alert(this.props.updateUserImageReducer.uploadUserImageRes.message);
            }
            // this.props.resetState();
            this.props.clearUserInfo();
        }
    }

    getUserDetails() {
        AsyncStorage.getItem('SyncittUserInfo').then((value) => {
            if (value) {
                var postdata = {};
                var userData = JSON.parse(value);
                var authToken = userData.token;
                postData = {
                    userId: userData.data._id,
                };
                this.props.showScreenLoading();
                this.props.getUserDetails(authToken, postData);
            }
        }).done();
    }

    callUpdateUserDetails() {

        AsyncStorage.getItem('SyncittUserInfo').then((value) => {
            if (value) {
                var postdata = {};
                var userData = JSON.parse(value);
                var authToken = userData.token;

                postData = {
                    userId: userData.data._id,
                    email: userData.data.email,
                    about_user: this.props.updateUserImageReducer.aboutUser,
                    firstname: this.props.updateUserImageReducer.firstName,
                    lastname: this.props.updateUserImageReducer.lastName,
                    mobile_no: this.props.updateUserImageReducer.phoneNumber,
                    country: userData.data.country,
                    state: this.props.updateUserImageReducer.stateName,
                    city: this.props.updateUserImageReducer.cityName,
                    zipCode: this.props.updateUserImageReducer.zipCode,
                };
                //console.log('postData for update profile', JSON.stringify(postData));
                this.props.showScreenLoading();
                this.setState({ isEditable: false });
                this.setState({ isDisabled: true });
                this.props.updateUserDetails(authToken, postData);
            }
        }).done();
    }


    sendRequest() {
        if (this.state.selectedAgencyId !== undefined) {
            AsyncStorage.getItem('SyncittUserInfo').then((value) => {
                if (value) {
                    var postdata = {};
                    var userData = JSON.parse(value);
                    var authToken = userData.token;
                    postData = {
                        sender_id: userData.data._id,
                        receiver_id: this.state.selectedAgencyId,
                        agencyName: this.state.selectedAgency,
                        userName: userData.data.firstname + ' ' + userData.data.lastname,
                    };

                    console.log('postData for send request', JSON.stringify(postData));
                    this.props.showScreenLoading();
                    this.props.getAssociateWithAgency(authToken, postData);
                }
            }).done();
        } else {
            alert('Please select agency');
        }
    }


    onAgencyAssociateSuccess() {

        if (this.props.updateUserImageReducer.agencyAssociateRes != '') {
            console.log('agency associate response', this.props.updateUserImageReducer.agencyAssociateRes);
            if (this.props.updateUserImageReducer.agencyAssociateRes.code == 200) {

            }
            else {
                alert(this.props.updateUserImageReducer.agencyAssociateRes.message);
            }
            this.props.resetState();
        }
    }



    callAgencyList() {

        AsyncStorage.getItem('SyncittUserInfo').then((value) => {
            if (value) {
                var postdata = {};
                var userData = JSON.parse(value);
                var authToken = userData.token;
                this.props.getAllAgencyList(authToken);
            }
        }).done();
    }


    onAgencyListSuccess() {
        if (this.props.updateUserImageReducer.agencyList != '') {
            //console.log('agency list', JSON.stringify(this.props.updateUserImageReducer.agencyList));

            if (this.props.updateUserImageReducer.agencyList.code == 200) {

                this.setState({ agencyList: this.prepareAgencyDropdownData(this.props.updateUserImageReducer.agencyList.data) });

            }
            else {
                alert(this.props.updateUserImageReducer.agencyList.message);
            }
            this.props.resetState();
        }
    }



    showCamera() {
        // Launch Camera:
        ImagePicker.launchCamera(options, (response) => {

            // console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                response.data = '';
                let source = { uri: response.uri };
                var path = response.uri.replace('file://', '');
                let imagePath = (Platform.OS == 'ios') ? path : response.path;
            }

        });
    }


    showImageLibrary() {
        // Open Image Library:
        ImagePicker.launchImageLibrary(options, (response) => {

            //console.log('selected image res==',JSON.stringify(response));
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {

                let source = { uri: response.uri };
                let imagePath = (Platform.OS == 'ios') ? response.origURL : response.path;
                var imageItem = {
                    'url': source,
                    'path': imagePath,
                    'isSelected': 0
                }
                if (uploadImagesArray.length < 20) {
                    uploadImagesArray.push(imageItem);
                    var imagagesData = {

                        'imageArray': uploadImagesArray
                    }
                    this.setState({ uploadImagesData: imagagesData });
                }
                else {
                    alert(Strings.MAX_IMAGE_LIMIT);
                }

                AsyncStorage.getItem('SyncittUserInfo').then((value) => {
                    if (value) {
                        var userData = JSON.parse(value);
                        var authToken = userData.token;
                        var _id = userData.data._id;
                        this.props.showLoading();
                        console.log('update user image path==', response.uri.replace('file://', '') + ' _id:' + _id);
                        this.props.updateUserImage(authToken, response.uri.replace('file://', ''), _id);
                    }
                }).done();
            }
        });
    }


    onUpdateImageSuccess() {
        if (this.props.updateUserImageReducer.updateUserImageRes != '') {
            if (this.props.updateUserImageReducer.updateUserImageRes.code == 200) {
                console.log('update user image response', this.props.updateUserImageReducer.updateUserImageRes);
                AsyncStorage.setItem('SyncittUserProfileInfo', JSON.stringify(this.props.updateUserImageReducer.updateUserImageRes));
                this.setState({ userProfileDetails: this.props.updateUserImageReducer.updateUserImageRes });
            }
            else {
                //alert('');
            }
            this.props.clearUserImageInfo();
        }
    }

    showActionSheet() {
        this.ActionSheet.show()
    }

    handlePress(i) {
        if (i == 0) {
            this.showImageLibrary();
        }
        else if (i == 1) {
            this.showCamera();
        }
    }

    prepareCountryDropdownData(countryData) {
        var tempArray = [];
        var country = {
            value: countryData
        }
        tempArray.push(country);
        //tempArray[index].id = tempArray[index].property_owner._id;

        console.log('prepareCountryDropdownData list= ' + JSON.stringify(tempArray));
        return tempArray;
    }

    prepareStateDropdownData(stateData) {
        console.log("Statedat>>>>" + stateData);
        var tempArray = [];
        var states = {
            value: stateData
        }
        tempArray.push(states);

        // tempArray[index].id = tempArray[index].property_owner._id;

        console.log('prepareStateDropdownData list= ' + JSON.stringify(tempArray));
        return tempArray;
    }



    prepareCityDropdownData(cityData) {
        var tempArray = [];
        var City = {
            value: cityData
        }
        tempArray.push(City);

        // tempArray[index].id = tempArray[index].property_owner._id;

        console.log('prepareCityDropdownData list= ' + JSON.stringify(tempArray));
        return tempArray;
    }

    prepareZipcodeDropdownData(zipCodeData) {
        var tempArray = [];
        var zipcode = {
            value: zipCodeData
        }
        tempArray.push(zipcode);
        //tempArray[index].id = tempArray[index].property_owner._id;

        console.log('prepareZipcodeDropdownData list= ' + JSON.stringify(tempArray));
        return tempArray;
    }

    onPhoneNumberChange(text) {
        this.props.phoneNumberChanged(text);
    }

    onAboutUserChange(text) {
        this.props.aboutUserChanged(text);
    }

    onFirstNameChange(text) {
        this.props.firstNameChanged(text);
    }
    onLastNameChange(text) {
        this.props.lastNameChanged(text);
    }

    onCityNameChange(text) {
        this.props.cityNameChanged(text);
    }
    onZipCodeChange(text) {
        this.props.zipCodeChanged(text);
    }
    onStateChange(text) {
        // console.log("selected state>>>" + text);
        this.props.stateChanged(text);
    }

    onAgencyChange(text) {
        //console.log("selected agency data>>>" + text);
        this.setState({ selectedAgencyId: this.state.agencyList[this.refs.ref_agency.selectedIndex()].id, selectedAgency: text });
        this.props.agencyChanged(text);
    }


    setUserData(responseData) {
        this.props.aboutUserChanged(responseData.about_user);
        this.props.phoneNumberChanged(responseData.mobile_no);
        this.props.firstNameChanged(responseData.firstname);
        this.props.lastNameChanged(responseData.lastname);
        this.props.cityNameChanged(responseData.city);
        this.props.zipCodeChanged(responseData.zipCode);
        this.props.stateChanged(responseData.state);
    }

    render() {
        var userData = this.state.userProfileDetails ? this.state.userProfileDetails.data : ''
        var userImagePath = this.state.userProfileDetails.data ? this.state.userProfileDetails.data.image ? API.USER_IMAGE_PATH + this.state.userProfileDetails.data.image : '' : '';
        var firstName = userData ? userData.firstname : '';
        var lastName = userData ? userData.lastname : '';
        console.log('userImagePath = ' + userImagePath);
        //console.log('statelist = ' + this.state.stateData);
        return (
            <View style={ProfileSettingScreenStyle.settingContainerStyle}>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={ProfileSettingScreenStyle.scrollViewContainerStyle}>

                    <View style={ProfileSettingScreenStyle.profileTopContainerStyle}>
                        <View style={ProfileSettingScreenStyle.imageContainer}>
                            {
                                userImagePath.includes('undefined') || userImagePath == '' ? <View style={ProfileSettingScreenStyle.emptyUserImageStyle}>
                                    <Text style={CommonStyles.initialTextStyle}>{firstName.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                </View>
                                    :
                                    <Image source={{ uri: userImagePath }} style={ProfileSettingScreenStyle.userImageStyle} />

                            }
                            <TouchableOpacity style={ProfileSettingScreenStyle.editTextContainer} onPress={() => this.showActionSheet()} >
                                <Text style={ProfileSettingScreenStyle.editTextStyle}>{Strings.EDIT}</Text>
                            </TouchableOpacity>
                            {   //23 Nov
                                this.props.updateUserImageReducer.isScreenLoading ?
                                    <View style={CommonStyles.circles}>
                                        <Progress.CircleSnail color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]} />
                                    </View>
                                    : null
                                //
                            }
                        </View>
                        <View style={ProfileSettingScreenStyle.userNameContainerStyle}>
                            {this.state.isEditable ?

                                <View style={{ flexDirection: 'row' }}>
                                    <TextInput style={ProfileSettingScreenStyle.firstnameInputTextStyle}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        underlineColorAndroid='transparent'
                                        returnKeyType='next'
                                        editable={this.state.isEditable}
                                        value={this.props.updateUserImageReducer.firstName}
                                        onChangeText={this.onFirstNameChange.bind(this)} />

                                    <TextInput style={ProfileSettingScreenStyle.firstnameInputTextStyle}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        underlineColorAndroid='transparent'
                                        returnKeyType='next'
                                        editable={this.state.isEditable}
                                        value={this.props.updateUserImageReducer.lastName}
                                        onChangeText={this.onLastNameChange.bind(this)}
                                    />
                                </View>
                                : <Text style={ProfileSettingScreenStyle.userNameTextStyle}>{userData ? userData.firstname + ' ' + userData.lastname : ''}</Text>
                            }
                            {this.state.isEditable ? null :
                                <TouchableOpacity onPress={() => this.onEditClick()} >
                                    <Image source={ImagePath.EDIT_PEN_ICON} style={ProfileSettingScreenStyle.editImageStyle} />
                                </TouchableOpacity>
                            }
                        </View>
                        <Text style={ProfileSettingScreenStyle.emailTextStyle}>{userData ? userData.email : ''}</Text>

                    </View>

                    <View style={ProfileSettingScreenStyle.profileBottomContainerStyle}>
                        <View>
                            <Text style={ProfileSettingScreenStyle.labelStyle}>
                                {Strings.PHONE_NUMBER}
                            </Text>
                            <TextInput style={ProfileSettingScreenStyle.inputTextStyle}
                                autoCapitalize='none'
                                autoCorrect={false}
                                underlineColorAndroid='transparent'
                                returnKeyType='next'
                                keyboardType='phone-pad'
                                maxLength={10}
                                editable={this.state.isEditable}
                                value={this.props.updateUserImageReducer.phoneNumber}
                                onChangeText={this.onPhoneNumberChange.bind(this)} />

                            <Text style={ProfileSettingScreenStyle.labelStyle}>
                                {Strings.COUNTRY}
                            </Text>

                            <Dropdown
                                label=''
                                labelHeight={5}
                                fontSize={14}
                                baseColor={Colors.WHITE}
                                containerStyle={ProfileSettingScreenStyle.dropDownViewStyle}
                                data={this.state.countryData}
                                value={this.state.countryData.length > 0 ? this.state.countryData[0].value : ''}
                            />

                            <Text style={ProfileSettingScreenStyle.labelStyle}>
                                {Strings.STATE}
                            </Text>
                            <Dropdown
                                label=''
                                labelHeight={5}
                                fontSize={14}
                                baseColor={Colors.WHITE}
                                containerStyle={ProfileSettingScreenStyle.dropDownViewStyle}
                                data={this.state.stateData}
                                onChangeText={this.onStateChange.bind(this)}
                                value={this.state.selectedState}

                            />

                            <Text style={ProfileSettingScreenStyle.labelStyle}>
                                {Strings.CITY}
                            </Text>
                            <TextInput style={ProfileSettingScreenStyle.inputTextStyle}
                                autoCapitalize='none'
                                autoCorrect={false}
                                underlineColorAndroid='transparent'
                                returnKeyType='next'
                                keyboardType='number-pad'
                                editable={this.state.isEditable}
                                value={this.props.updateUserImageReducer.cityName}
                                onChangeText={this.onCityNameChange.bind(this)} />

                            <Text style={ProfileSettingScreenStyle.labelStyle}>
                                {Strings.ZIP_CODE}
                            </Text>
                            <TextInput style={ProfileSettingScreenStyle.inputTextStyle}
                                autoCapitalize='none'
                                autoCorrect={false}
                                underlineColorAndroid='transparent'
                                returnKeyType='next'
                                keyboardType='number-pad'
                                maxLength={4}
                                editable={this.state.isEditable}
                                value={this.props.updateUserImageReducer.zipCode}
                                onChangeText={this.onZipCodeChange.bind(this)} />

                            <View style={ProfileSettingScreenStyle.sendContainerViewStyle}>
                                <View style={ProfileSettingScreenStyle.sendContainerStyle}>
                                    <Text style={ProfileSettingScreenStyle.labelStyle}>
                                        {Strings.ASSOCIATE_WITH_AGENCY}
                                    </Text>

                                    <Dropdown
                                        ref='ref_agency'
                                        label=''
                                     
                                        labelHeight={5}
                                        fontSize={14}
                                        baseColor={Colors.WHITE}
                                        containerStyle={ProfileSettingScreenStyle.dropDownViewStyle}
                                        data={this.state.agencyList}
                                        onChangeText={this.onAgencyChange.bind(this)}
                                        value={responseData.agency_id ? responseData.agency_id.name : 'Select agency'}
                                    />
                                </View>
                                
                                {responseData.agency_id ? null
                                    : <TouchableOpacity onPress={() => this.sendRequest()}>
                                        <View style={ProfileSettingScreenStyle.roundedBlueSendButtonStyle}>
                                            <Text style={ProfileSettingScreenStyle.sendRequestTextStyle}>
                                                {Strings.SEND}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                }
                            </View>

                            <Text style={ProfileSettingScreenStyle.labelStyle}>
                                {Strings.ABOUT_OVERVIEW}
                            </Text>
                            <TextInput style={ProfileSettingScreenStyle.inputDescriptionTextStyle}
                                multiline={true}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                editable={this.state.isEditable}
                                value={this.props.updateUserImageReducer.aboutUser}
                                onChangeText={this.onAboutUserChange.bind(this)} />

                            {/* value={userData ? userData.about_user : ''} */}
                        </View>
                    </View>
                    <ActionSheet
                        ref={o => this.ActionSheet = o}
                        options={actionOptions}
                        cancelButtonIndex={CANCEL_INDEX}
                        destructiveButtonIndex={DESTRUCTIVE_INDEX}
                        onPress={this.handlePress}
                    />
                </ScrollView>

                <View style={ProfileSettingScreenStyle.bottomViewStyle} >
                    <TouchableOpacity onPress={() => this.callUpdateUserDetails()} disabled={this.state.isDisabled}>
                        <View style={ProfileSettingScreenStyle.roundedBlueSaveButtonStyle}>
                            <Text style={ProfileSettingScreenStyle.saveButtonTextStyle}>
                                {Strings.SAVE_CHANGES}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {   //23 Nov
                    this.props.updateUserImageReducer.isLoading ?
                        <View style={CommonStyles.circles}>
                            <Progress.CircleSnail color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]} />
                        </View>
                        : null
                    //
                }

            </View>
        );
    }
}

function mapStateToProps(state) {
    //console.log('add property step1 mapStateToProps= ', JSON.stringify(state));
    return {
        updateUserImageReducer: state.updateUserImageReducer
    }
}

export default connect(
    mapStateToProps,
    {
        clearUserImageInfo,
        updateUserImage,
        getUserDetails,
        updateUserDetails,
        showLoading,
        showScreenLoading,
        phoneNumberChanged,
        firstNameChanged,
        lastNameChanged,
        aboutUserChanged,
        resetState,
        cityNameChanged,
        zipCodeChanged,
        stateChanged,
        agencyChanged,
        clearUserInfo,
        getAllAgencyList,
        getAssociateWithAgency
    }

)(ProfileSettingScreen);
