import React, { Component } from 'react';
import { connect } from 'react-redux';
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
    FlatList,
    AsyncStorage
} from 'react-native';

import {
    getAgencyProperty,
    updateBannerImage,
    getPropertyList,
    getLoggedInUserProfile,
    getUserReviewsList,
} from "../../Action/ActionCreators";

import {

    showLoading,
    resetState,
} from "./ProfileAction";

import API from '../../Constants/APIUrls';
import { Actions } from 'react-native-router-flux';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import ProfileScreenStyle from './ProfileScreenStyle';
import listData from '../../../data';
import CommonStyles from '../../CommonStyle/CommonStyle';
import OverviewScreen from './OverviewScreen';
import ReviewAndRatingScreen from './ReviewAndRatingScreen';
import StarRating from 'react-native-star-rating';
var ImagePicker = require('react-native-image-picker');
import ActionSheet from 'react-native-actionsheet';
import * as Progress from 'react-native-progress';
let ref;
var bannerImage = '';
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

class ProfileScreen extends Component {
    constructor() {
        super();
        ref = this;
        this.state = {
            isTabSelected: 1,
            starCount: 0,
            profileData: {},
            propertyListData: [],
            userReviewData: {},
            updateBanner: false,
            roleName:''
        };

        this.handlePress = this.handlePress.bind(this)
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onGetProfileSuccess();
        this.onPropertyListSuccess();
        this.onGetUserRatingSuccess();
        this.onUploadBannerSuccess();
        this.onGetAgencyPropertySuccess();
    }

    componentWillUnmount() {

    }

    componentWillMount() {
        this.getRoleName();
        this.callGetUserProfile();
        this.callGetUserRating();
    }




    closeNotifications() {

        Actions.popTo('Dashboard');
    }

    onAllTabClick() {

        this.setState({ isTabSelected: 1 });
    }
    onActiveTabClick() {

        this.setState({ isTabSelected: 2 });
    }
    onRequestedByTenentTabClick() {

        this.setState({ isTabSelected: 3 });
    }
    onStarRatingPress(rating) {

        this.setState({
            starCount: rating
        });
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
                        this.props.updateBannerImage(authToken, response.uri.replace('file://', ''), _id);
                    }
                }).done();
            }
        });
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

    getRoleName() {

        AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
            if (value) {
                console.log('user name == ', value);
                this.setState({ roleName: value });

            }
        }).done();
    }




    callGetUserProfile() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {

                    userId: userData.data._id,
                }
                this.props.showLoading();
                this.props.getLoggedInUserProfile(authToken, postData);
            }
        }).done();

    }

    callGetUserRating() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                console.log("**************postdata*****");
                console.log('Log', authToken + userData.data._id);
                this.props.showLoading();
                this.props.getUserReviewsList(authToken, userData.data._id);
            }
        }).done();

    }

    onUploadBannerSuccess() {

        if (this.props.profileReducer.updateBannerImgRes != '') {
            if (this.props.profileReducer.updateBannerImgRes.code == 200) {
                console.log('banner upload success =', JSON.stringify(this.props.profileReducer.updateBannerImgRes));
                var resData = this.props.profileReducer.updateBannerImgRes.data;
                bannerImage = resData.bannerImage ? API.USER_IMAGE_PATH + resData.bannerImage : '';
                console.log('bannerImage path =', bannerImage);
                this.setState({ updateBanner: true });
            }
            else {
                alert(this.props.profileReducer.updateBannerImgRes.message);
            }
            this.props.resetState();
        }
    }
    onGetUserRatingSuccess() {

        if (this.props.profileReducer.userReviewRes != '') {
            if (this.props.profileReducer.userReviewRes.code == 200) {
                console.log("Review data>>>>" + JSON.stringify(this.props.profileReducer.userReviewRes));
                this.setState({ userReviewData: this.props.profileReducer.userReviewRes });
            }
            else {
                // alert(this.props.profileReducer.userReviewRes.message);
            }
            this.props.resetState();
        }
    }

    onGetProfileSuccess() {
        if (this.props.profileReducer.userProfileRes != '') {
            if (this.props.profileReducer.userProfileRes.code == 200) {
                console.log("Profile data>>>>>" + JSON.stringify(this.props.profileReducer.userProfileRes.data));
                this.setState({ profileData: this.props.profileReducer.userProfileRes.data });
                if( this.state.roleName == Strings.USER_ROLE_AGENCY_OWNER ){
                    this.callGetAgencyProperty();
                }
                else{
                    this.callGetProperty();
                }
                
               
            }
            else {
                alert(this.props.profileReducer.userProfileRes.message);
            }
            this.props.resetState();
        }
    }

    callGetProperty() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    agency_id: userData.data.agency_id,
                    request_by_role: userData.data.role_id,
                    user_id: userData.data._id,
                }
                this.props.showLoading();
                //console.log('get property post data==', JSON.stringify(postData));
                this.props.getPropertyList(authToken, postData);
            }
        }).done();
    }
    callGetAgencyProperty() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    agency_id: userData.data.agency_id,
                    user_id: userData.data._id,
                }
                this.props.showLoading();
                //console.log('get property post data==', JSON.stringify(postData));
                this.props.getAgencyProperty(authToken, postData);
            }
        }).done();
    }

    onPropertyListSuccess() {

        if (this.props.homeScreenReducer.propertyListResponse != '') {

            if (this.props.homeScreenReducer.propertyListResponse.code == 200) {
                console.log('property data== ', JSON.stringify(this.props.homeScreenReducer.propertyListResponse));
                this.setState({ propertyListData: this.props.homeScreenReducer.propertyListResponse.data });
            }
            else {

                alert(this.props.homeScreenReducer.propertyListResponse.message);
            }
            this.props.resetState();
        }
    }

    onGetAgencyPropertySuccess() {

        if (this.props.profileReducer.agencyPropertyRes != '') {

            if (this.props.profileReducer.agencyPropertyRes.code == 200) {
                console.log('property data== ', JSON.stringify(this.props.profileReducer.agencyPropertyRes));
                this.setState({ propertyListData: this.props.profileReducer.agencyPropertyRes.data });
            }
            else {

                alert(this.props.profileReducer.agencyPropertyRes.message);
            }
            this.props.resetState();
        }
    }

    callSendMessageScreen() {

        Actions.MessageToTraderScreen({ userFirstName: this.state.profileData.firstname, userLastName: this.state.profileData.lastname, receiverId: this.state.profileData._id });
    }


    renderImageItem(item, index) {
        return (
            <Image source={{ uri: item.url }} style={ProfileScreenStyle.userListImageStyle} />
        );
    }

    callPropertyDetailsScreen(id) {

        Actions.PropertiesDetailsScreen({ propertyId: id });
    }


    renderItem({ item, index }) {
        
        var propertyImagePath = item.image ? (item.image.length > 0 ? API.PROPERTY_IMAGE_PATH + item.image[0].path : '') : '';
        var userImage = item.owned_by ? (item.owned_by.image ? API.USER_IMAGE_PATH + item.owned_by.image : '') : '';
        var number_of_bedroom = item.number_bedroom ? item.number_bedroom : 0;
        var number_of_bathroom = item.number_of_bathroom ? item.number_of_bathroom : 0;
        var number_of_parking = item.number_of_parking ? item.number_of_parking : 0;

        return (
            <View style={ProfileScreenStyle.listMainContainerStyle}>

                <TouchableOpacity onPress={ref.callPropertyDetailsScreen.bind(ref, item._id)} >
                    <View style={ProfileScreenStyle.propertyImageViewStyle}>
                        {
                            propertyImagePath != '' ?
                                <Image source={{ uri: propertyImagePath }} style={ProfileScreenStyle.propertyImageStyle} />
                                : <View style={ProfileScreenStyle.emptyPropertyImageContainer} />
                        }

                        <Image source={ImagePath.HEART} style={ProfileScreenStyle.likeImageViewStyle} />
                    </View>
                    <View style={ProfileScreenStyle.propertyTitleViewStyle}>
                        <Text numberOfLines={2} style={ProfileScreenStyle.propertyTitleTextStyle}>{item.address}</Text>
                    </View>
                    <View style={ProfileScreenStyle.propetySubTitleViewStyle}>
                        <Text numberOfLines={2} style={ProfileScreenStyle.propertySubTitleTextStyle}>{item.description}</Text>
                    </View>
                </TouchableOpacity>

                <View style={ProfileScreenStyle.imageListMainContainerStyle}>
                    <View>

                        {   
                            userImage != '' ?
                            <Image source={{ uri: userImage }} style={ProfileScreenStyle.userImageStyle} />
                            :
                            <Image source={ImagePath.USER_DEFAULT} style={ProfileScreenStyle.userImageStyle} />
                        }

                    </View>

                    {/*<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                            <View style={ProfileScreenStyle.imageListContainerStyle}>
                                                {
                                                    listData.map((data, index) => {
                                                        
                                                        return ref.renderImageItem(data, index);
                                                    })
                                                }
                                            </View>
                                        </ScrollView>*/}

                </View>

                <View style={ProfileScreenStyle.propertyInfoContainerViewStyle}>

                    <View style={ProfileScreenStyle.propertyBedroomViewContainer}>
                        <Image source={ImagePath.BEDROOM_ICON} />
                        <Text style={ProfileScreenStyle.propertyValueTextStyle}>{number_of_bedroom}</Text>
                    </View>

                    <View style={ProfileScreenStyle.propertyWashrooViewContainer}>
                        <Image source={ImagePath.BATHROOM_ICON} />
                        <Text style={ProfileScreenStyle.propertyValueTextStyle}>{number_of_bathroom}</Text>
                    </View>

                    <View style={ProfileScreenStyle.propertyWashrooViewContainer}>
                        <Image source={ImagePath.GARAGE_ICON} />
                        <Text style={ProfileScreenStyle.propertyValueTextStyle}>{number_of_parking}</Text>
                    </View>

                   

                </View>
            </View>
        );
    }


    navBar() {
        return (
            <View style={ProfileScreenStyle.profileHeaderContainer}>

                <TouchableOpacity onPress={() => this.closeNotifications()} style={{ marginLeft: 20 }}>
                    <Image source={null} />
                </TouchableOpacity>

                <TouchableOpacity style={ProfileScreenStyle.roundedBlueButtonStyle} onPress={() => this.showActionSheet()}>
                    <View >
                        <Text style={ProfileScreenStyle.blueButtonTextStyle}>
                            {Strings.EDIT}
                        </Text>
                    </View>
                </TouchableOpacity>

            </View>
        );
    }

    render() {

        var userImagePath = this.state.profileData.image ? API.USER_IMAGE_PATH + this.state.profileData.image : '';
        if (bannerImage == '') {
            bannerImage = this.state.profileData.bannerImage ? API.USER_IMAGE_PATH + this.state.profileData.bannerImage : '';
        }

        var firstName = this.state.profileData.firstname ? this.state.profileData.firstname : '';
        var lastName = this.state.profileData.lastname ? this.state.profileData.lastname : '';
        var averagerate = this.state.userReviewData.data ? (this.state.userReviewData.data.length > 0 ? this.state.userReviewData.data : 0) : 0;
        var totalreviews = this.state.userReviewData.total_review ? this.state.userReviewData.total_review : 0;
        console.log('bannerImage path in render=', bannerImage);
        return (

            <ScrollView contentContainerStyle={{ paddingBottom: 70, backgroundColor: Colors.SETTING_SCREEN_BG_COLOR }}>
                <View style={ProfileScreenStyle.profileContainer}>
                    <View style={ProfileScreenStyle.topCoverImageContainer}>

                        {
                            bannerImage != '' ?
                                <Image source={{ uri: bannerImage }} style={ProfileScreenStyle.topCoverImageContainer} />
                                : <View style={ProfileScreenStyle.topCoverImageContainer} />
                        }

                        {this.navBar()}

                    </View>



                    <View style={ProfileScreenStyle.bottomCoverImageContainer}>
                        <Image source={ImagePath.PROFILE_BG} style={ProfileScreenStyle.bottomCoverImageContainer} />
                    </View>



                    <View style={ProfileScreenStyle.profileDataContainer}>
                        <View style={ProfileScreenStyle.profileNameAndReviewContainer}>

                            {
                                userImagePath != '' ? <Image source={{ uri: userImagePath }} style={ProfileScreenStyle.profileImageStyle} />
                                    :
                                    <View style={CommonStyles.emptyUserImageStyle}>
                                        <Text style={CommonStyles.initialTextStyle}>{firstName.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                    </View>
                            }



                            <Text style={ProfileScreenStyle.userNameTextStyle}>{this.state.profileData.firstname + ' ' + this.state.profileData.lastname}</Text>
                            <StarRating
                                disabled={true}
                                maxStars={5}
                                starSize={20}
                                starStyle={{ paddingRight: 2, paddingLeft: 2, marginTop: 8 }}
                                emptyStarColor={Colors.EMPTY_STAR_COLOR}
                                starColor={Colors.STAR_COLOR}
                                rating={averagerate}
                                selectedStar={(rating) => ref.onStarRatingPress(rating)}
                            />
                            <Text style={ProfileScreenStyle.userReviewtextStyle}>{averagerate + ' ' + 'from' + ' ' + totalreviews + ' ' + 'reviews'}</Text>
                            {/*<TouchableOpacity style={ProfileScreenStyle.contactAgentView} onPress={this.callSendMessageScreen.bind(this)}>
                                                            <View >
                                                                <Text style={ProfileScreenStyle.buttonTextStyle}>Contact agent</Text>
                                                            </View>
                                                        </TouchableOpacity>*/}
                        </View>
                        <View style={ProfileScreenStyle.userInfoContainerStyle}>
                            <View style={ProfileScreenStyle.userInfoTextContainerStyle}>
                                <Text style={ProfileScreenStyle.labelTextStyle}>Location</Text>
                                <Text style={ProfileScreenStyle.infoTextStyle}>{this.state.profileData.address}</Text>
                            </View>
                            <View style={ProfileScreenStyle.userInfoTextContainerStyle}>
                                <Text style={ProfileScreenStyle.labelTextStyle}>Phone number</Text>
                                <Text style={ProfileScreenStyle.infoTextStyle}>{this.state.profileData.mobile_no}</Text>
                            </View>
                            <View style={ProfileScreenStyle.userInfoTextContainerStyle}>
                                <Text style={ProfileScreenStyle.labelTextStyle}>Email address</Text>
                                <Text style={ProfileScreenStyle.infoTextStyle}>{this.state.profileData.email}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={ProfileScreenStyle.profileImageContainer}>
                        <View style={ProfileScreenStyle.statusViewStyle} />
                    </View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={ProfileScreenStyle.tabContainerScrollViewStyle}>
                        <View style={ProfileScreenStyle.tabContainerStyle}>

                            <TouchableOpacity onPress={() => this.onAllTabClick()} >
                                <View >
                                    <View style={ProfileScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 1) ? ProfileScreenStyle.tabLabelTextStyle : ProfileScreenStyle.tabLabelDiselectTextStyle}>{Strings.PROPERTIES}</Text>
                                    </View>
                                    {this.state.isTabSelected == 1 ? <View style={ProfileScreenStyle.tabIndicatorStyle}></View> : <View style={ProfileScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onActiveTabClick()}>
                                <View>
                                    <View style={ProfileScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 2) ? ProfileScreenStyle.tabLabelTextStyle : ProfileScreenStyle.tabLabelDiselectTextStyle}>{Strings.OVERVIEW}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 2) ? <View style={ProfileScreenStyle.tabIndicatorStyle}></View> : <View style={ProfileScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onRequestedByTenentTabClick()}>
                                <View>
                                    <View style={ProfileScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 3) ? ProfileScreenStyle.tabLabelTextStyle : ProfileScreenStyle.tabLabelDiselectTextStyle}>{Strings.REVIEWS_AND_RATINGS}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 3) ? <View style={ProfileScreenStyle.tabIndicatorStyle}></View> : <View style={ProfileScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>
                        </View>
                        <ActionSheet
                            ref={o => this.ActionSheet = o}
                            options={actionOptions}
                            cancelButtonIndex={CANCEL_INDEX}
                            destructiveButtonIndex={DESTRUCTIVE_INDEX}
                            onPress={this.handlePress}
                        />
                    </ScrollView>
                    {(this.state.isTabSelected == 1) ?

                        this.state.propertyListData.length > 0
                            ?
                            <FlatList
                                data={this.state.propertyListData}
                                renderItem={this.renderItem}
                                extraData={this.state}
                            />
                            : <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ fontSize: 20, textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>{Strings.PROPERTY_NOT_FOUND}</Text>
                            </View>


                        : null}
                    {(this.state.isTabSelected == 2) ?
                        <OverviewScreen overviewData={this.state.profileData} />
                        : null}
                    {(this.state.isTabSelected == 3) ?
                        <ReviewAndRatingScreen />
                        : null}
                </View>
                {   //23 Nov
                    this.props.profileReducer.isScreenLoading ?
                        <View style={CommonStyles.circles}>
                            <Progress.CircleSnail color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]} />
                        </View>
                        : null
                    //
                }

            </ScrollView>
        );
    }
}

function mapStateToProps(state) {
    console.log('user profile mapStateToProps= ', JSON.stringify(state));
    return {
        profileReducer: state.profileReducer,
        homeScreenReducer: state.homeScreenReducer
    }
}

export default connect(
    mapStateToProps,
    {
        getAgencyProperty,
        updateBannerImage,
        getPropertyList,
        getLoggedInUserProfile,
        showLoading,
        resetState,
        getUserReviewsList,
    }

)(ProfileScreen);

