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
    FlatList,
    AsyncStorage,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import UserImageScreenStyle from './UserImageScreenStyle';
import listData from '../../../../data';
import * as Progress from 'react-native-progress';
var ImagePicker = require('react-native-image-picker');
import ActionSheet from 'react-native-actionsheet';
import { connect } from 'react-redux';
import API from '../../../Constants/APIUrls';
import {
    showLoading,
    resetState
} from "./UserImageAction";

import {
    uploadUserImage,
    getUserImage
} from "../../../Action/ActionCreators";


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
var uploadedImagesPath = []
let contextRef;

class UserImageScreen extends Component {
    constructor() {
        super();
        this.state = {
            uploadImagesData: {},
            selectedImage: '',
            imageArray: [],
        };
        this.handlePress = this.handlePress.bind(this)
        contextRef = this;
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onUploadImageSuccess();
        //  this.getUserDetails();

    }

    componentWillUnmount() {

    }

    componentWillMount() {
        this.getUserDetails();
    }


    getUserDetails() {
        AsyncStorage.getItem("SyncittUserProfileInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                this.setState({ imageArray: userData.data.images });
                if (this.state.imageArray.length > 0) {
                    this.uploadImageListSelection(0);
                }

            }
        }).done();
    }


    onUploadImageSuccess() {
        if (this.props.userImageReducer.uploadUserImageRes != '') {
            if (this.props.userImageReducer.uploadUserImageRes.code == 200) {
                // var imagePath = {
                //    path: this.props.userImageReducer.uploadUserImageRes.data
                //}
                // uploadedImagesPath.push(imagePath);
                AsyncStorage.setItem("SyncittUserProfileInfo", JSON.stringify(this.props.userImageReducer.uploadUserImageRes));
                this.getUserDetails();
            }
            else {
                alert(this.props.userImageReducer.uploadUserImageRes.message);
            }
            this.props.resetState();
        }
    }

    onUserImageSuccess() {
        if (this.props.userImageReducer.uploadUserImageRes != '') {
            if (this.props.userImageReducer.uploadUserImageRes.code == 200) {
                console.log('user image data == ', JSON.stringify(this.props.userImageReducer.propertyListResponse));
            }
            else {
                alert(this.props.userImageReducer.uploadUserImageRes.message);
            }
            this.props.resetState();
        }
    }


    getUserImage() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var postdata = {};
                var userData = JSON.parse(value);
                var authToken = userData.token;
                postData = {
                    userId: userData.data._id,
                };
                this.props.showLoading();
                this.props.getUserImage(authToken, postData);
            }
        }).done();
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
                var path = response.uri.replace("file://", "");
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


                AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                    if (value) {
                        var userData = JSON.parse(value);
                        var authToken = userData.token;
                        var _id = userData.data._id;
                        this.props.showLoading();
                        console.log('image path==', response.uri.replace("file://", "") + ' _id:' + _id);
                        this.props.uploadUserImage(authToken, response.uri.replace("file://", ""), _id);
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

    uploadImageListSelection(index) {
        // console.log('selectedimage== ', index);
        // console.log('selectedimage== ', JSON.stringify(this.state.uploadImagesData.imageArray[index].url));
        this.setState({ selectedImage: this.state.imageArray[index].url });
        var tempData = this.state.imageArray;
        var tempArray = this.state.imageArray;
        tempArray.map((data, position) => {

            if (index == position) {

                if (tempArray[index].isSelected == 0) {
                    tempArray[index].isSelected = 1;
                }
            }
            else {
                tempArray[position].isSelected = 0;
            }
        })
        tempData.imageArray = tempArray;
        this.setState({ uploadImagesData: tempData });

    }


    renderItem({ item, index }) {
        console.log('item.url', item.url);
        var userImagePath = item.url ? API.USER_IMAGE_PATH + item.url : '';

        return (
            <TouchableOpacity onPress={contextRef.uploadImageListSelection.bind(contextRef, index)}>
                <View style={UserImageScreenStyle.uploadImageListItemStyle}>
                    <Image source={{ uri: userImagePath }} style={UserImageScreenStyle.uploadPropertyListImageStyle} />
                </View>
                {
                    item.isSelected == 1 ? <View style={UserImageScreenStyle.selectedImageStyle}>
                    </View> : null
                }
            </TouchableOpacity>
        );
    }

    render() {

        var selectedImagePath = this.state.selectedImage ? API.USER_IMAGE_PATH + this.state.selectedImage : '';

        return (
            <ScrollView contentContainerStyle={UserImageScreenStyle.settingContainerStyle}>
               
                    <View style={UserImageScreenStyle.uploadImageListContainerView}>
                        {/*<Text style={UserImageScreenStyle.maxImageTextStyle}></Text>*/}
                        {
                            this.state.selectedImage != ''
                                ?
                                <Image source={{ uri: selectedImagePath }} style={UserImageScreenStyle.uploadPropertyImageStyle} />
                                :
                                null
                        }
                        <View style={{ marginTop: 10 }}>
                            {
                                this.state.imageArray ?
                                    <FlatList
                                        horizontal={true}
                                        data={this.state.imageArray}
                                        renderItem={this.renderItem}
                                        extraData={this.state}
                                    /> : null
                            }

                        </View>
                        <TouchableOpacity style={UserImageScreenStyle.uploadImageButtonStyle} onPress={() => this.showActionSheet()}  >
                            <View>
                                <Text style={UserImageScreenStyle.uploadButtonTextStyle}>
                                    {Strings.UPLOAD_IMAGE}
                                </Text>
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
                {
                    this.props.userImageReducer.isScreenLoading ?
                        <View style={CommonStyles.circles}>
                            <Progress.CircleSnail color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]} />
                        </View>
                        : null
                }
            </ScrollView>

        );
    }
}

function mapStateToProps(state) {
    console.log('add property step1 mapStateToProps= ', JSON.stringify(state));
    return {
        userImageReducer: state.userImageReducer
    }
}

export default connect(
    mapStateToProps,
    {
        uploadUserImage,
        getUserImage,
        showLoading,
        resetState,
       
    }

)(UserImageScreen);
