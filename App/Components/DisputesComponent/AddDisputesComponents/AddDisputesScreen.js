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
    Picker,
    FlatList,
    AsyncStorage
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import AddDisputesScreenStyle from './AddDisputesScreenStyle';
import { Dropdown } from 'react-native-material-dropdown';
import listData from '../../../../data';
var ImagePicker = require('react-native-image-picker');
import ActionSheet from 'react-native-actionsheet'

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

let spinerData = [{
    value: '1',
}, { value: '2', }, { value: '3', }, { value: '4', }, {
    value: '5',
}, { value: '6', }, { value: '7', }, { value: '8', }, {
    value: '9',
}, { value: '10', }, { value: '11', }, { value: '12', }, {
    value: '13',
}, { value: '14', }, { value: '15', }, { value: '16', }, {
    value: '17',
}, { value: '18', }, { value: '19', }, {
    value: '20',
}



];

var uploadImagesArray = [];
var uploadedImagesPath = []
let contextRef;
class AddDisputesScreen extends Component {
    constructor() {
        super();
        this.state = {
            uploadImagesData: {},
            selectedImage: '',

        };
        this.handlePress = this.handlePress.bind(this)
        contextRef = this;

    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        // this.onUploadImageSuccess();
        // this.onSavePropertySuccess();
    }

    componentWillUnmount() {

    }

    closeAddProperty() {

        Actions.popTo('Dashboard');
    }

    callBack() {
        Actions.pop();
    }

    callProceedToStepThree() {
        //  Actions.AddPropertyScreenStepThree({ uploadedImages: uploadedImagesPath });
    }

    onNoOfBedroomChange(text) {

        // this.props.numberOfBedroomChanged(text);

    }
    onNoOfCarPortChange(text) {

        //  this.props.numberOfCarNoChanged(text);

    }
    onNoOfBathroomChange(text) {

        //  this.props.numberOfBathroomChanged(text);

    }
    onFloorAreaChange(text) {

        // this.props.numberOfFloorAreaChanged(text);

    }
    onLotAreaChange(text) {

        // this.props.numberOfLotAreaChanged(text);

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

                if (uploadImagesArray.length == 1) {
                    this.uploadImageListSelection(0);
                }
                AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                    if (value) {
                        var userData = JSON.parse(value);
                        var authToken = userData.token;
                        //this.props.showLoading();
                        console.log('image path==', response.uri.replace("file://", ""));
                        this.props.uploadImage(authToken, response.uri.replace("file://", ""));
                    }
                }).done();



            }

        });
    }

    onUploadImageSuccess() {
        if (this.props.addPropertyReducer.uploadPropertyImageRes != '') {
            if (this.props.addPropertyReducer.uploadPropertyImageRes.code == 200) {
                var imagePath = {
                    path: this.props.addPropertyReducer.uploadPropertyImageRes.data
                }
                uploadedImagesPath.push(imagePath);
            }
            else {
                alert(this.props.addPropertyReducer.uploadPropertyImageRes.message);
            }
            this.props.clearUploadPropertyImageRes();
        }
    }

    onSavePropertySuccess() {
        if (this.props.addPropertyReducer.savePropertyResponse != '') {
            if (this.props.addPropertyReducer.savePropertyResponse.code == 200) {
                Actions.popTo('Dashboard');
            }
            else {
                alert(this.props.addPropertyReducer.savePropertyResponse.message);
            }
            this.props.resetState();
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

    navBar() {
        return (
            <View >

                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.DISPUTES}</Text>
                <TouchableOpacity onPress={() => this.closeAddProperty()} style={CommonStyles.navRightImageView}>
                    <Image source={ImagePath.DRAWER_CROSS_ICON} />
                </TouchableOpacity>

            </View>
        );
    }

    uploadImageListSelection(index) {
        console.log('selectedimage== ', index);
        console.log('selectedimage== ', JSON.stringify(this.state.uploadImagesData.imageArray[index].url));
        this.setState({ selectedImage: this.state.uploadImagesData.imageArray[index].url });
        var tempData = this.state.uploadImagesData;
        var tempArray = this.state.uploadImagesData.imageArray;
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

        return (
            <TouchableOpacity onPress={() => contextRef.uploadImageListSelection(index)}>
                <View style={AddDisputesScreenStyle.uploadImageListItemStyle}>
                    <Image source={item.url} style={AddDisputesScreenStyle.uploadPropertyListImageStyle} />
                </View>
                {
                    item.isSelected == 1 ? <View style={AddDisputesScreenStyle.selectedImageStyle}>
                        <View style={AddDisputesScreenStyle.roundedBlueFeaturedButtonStyle}>
                            <Text style={AddDisputesScreenStyle.featuredTextStyle}>
                                {Strings.FEATURED}
                            </Text>
                        </View>
                    </View> : null
                }
            </TouchableOpacity>
        );
    }

    render() {

        return (
            <View style={AddDisputesScreenStyle.mainContainer}>
                {this.navBar()}


                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={AddDisputesScreenStyle.scrollViewContainerStyle}>


                    <View style={AddDisputesScreenStyle.addPropertyInputContainer}>
                        <View style={AddDisputesScreenStyle.rentalCaseNumberLabelContainerStyle}>
                            <Text style={AddDisputesScreenStyle.labelStyle}>
                                {Strings.RENTAL_CASE_NUMBER}
                            </Text>
                            <Text style={AddDisputesScreenStyle.labelStyle}>
                                102
                            </Text>
                        </View>

                        <Text style={AddDisputesScreenStyle.labelStyle}>
                            {Strings.SELECT_PROPERTY}
                        </Text>
                        <Dropdown
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            itemTextStyle={AddDisputesScreenStyle.dropDownTextStyle}
                            containerStyle={AddDisputesScreenStyle.dropDownViewStyle}

                            data={spinerData}
                            onChangeText={this.onNoOfBedroomChange.bind(this)}

                        />
                        <View style={AddDisputesScreenStyle.labelContainerStyle}>
                            <Text style={AddDisputesScreenStyle.labelStyle}>
                                {Strings.ADD_TENANT}
                            </Text>
                        </View>

                        <View style={AddDisputesScreenStyle.searchViewStyle}>
                            <TextInput
                                placeholder={Strings.SEARCH_TENANT}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={AddDisputesScreenStyle.searchTextInputStyle} />
                            <Image source={ImagePath.SEARCH_ICON} style={AddDisputesScreenStyle.searchImageStyle} />
                        </View>

                        <Text style={AddDisputesScreenStyle.labelStyle}>
                            {Strings.PROPERTY_OWNER}
                        </Text>
                        <Dropdown
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            itemTextStyle={AddDisputesScreenStyle.dropDownTextStyle}
                            containerStyle={AddDisputesScreenStyle.dropDownViewStyle}
                            data={spinerData}
                            onChangeText={this.onNoOfBathroomChange.bind(this)}
                        />

                        <Text style={AddDisputesScreenStyle.labelStyle}>
                            {Strings.TENANCY_START_DATE}
                        </Text>
                        <Dropdown
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            itemTextStyle={AddDisputesScreenStyle.dropDownTextStyle}
                            containerStyle={AddDisputesScreenStyle.dropDownViewStyle}
                            data={spinerData}
                            onChangeText={this.onFloorAreaChange.bind(this)}
                        />

                        <Text style={AddDisputesScreenStyle.labelStyle}>
                            {Strings.PROPERTIES}
                        </Text>
                        <View style={AddDisputesScreenStyle.labelContainerStyle}>
                            <Dropdown
                                label=''
                                labelHeight={5}
                                fontSize={14}
                                baseColor={Colors.WHITE}
                                itemTextStyle={AddDisputesScreenStyle.dropDownTextStyle}
                                containerStyle={AddDisputesScreenStyle.propertyDropDownViewStyle}
                                data={spinerData}
                                onChangeText={this.onLotAreaChange.bind(this)}

                            />
                            <Dropdown
                                label=''
                                labelHeight={5}
                                fontSize={14}
                                baseColor={Colors.WHITE}
                                itemTextStyle={AddDisputesScreenStyle.dropDownTextStyle}
                                containerStyle={AddDisputesScreenStyle.propertyDropDownViewStyle}
                                data={spinerData}
                                onChangeText={this.onLotAreaChange.bind(this)}

                            />
                        </View>

                        <Text style={AddDisputesScreenStyle.labelStyle}>
                            {Strings.MODE_OF_PAYMENT}
                        </Text>
                        <Dropdown
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            itemTextStyle={AddDisputesScreenStyle.dropDownTextStyle}
                            containerStyle={AddDisputesScreenStyle.dropDownViewStyle}
                            data={spinerData}
                            onChangeText={this.onFloorAreaChange.bind(this)}
                        />

                        <Text style={AddDisputesScreenStyle.labelStyle}>
                            {Strings.RENTAL_CASE_VALIDITY}
                        </Text>
                        <Dropdown
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            itemTextStyle={AddDisputesScreenStyle.dropDownTextStyle}
                            containerStyle={AddDisputesScreenStyle.dropDownViewStyle}
                            data={spinerData}
                            onChangeText={this.onFloorAreaChange.bind(this)}
                        />

                        <Text style={AddDisputesScreenStyle.labelStyle}>
                            {Strings.AGREEMENT_DETAILS}
                        </Text>
                        <TextInput style={AddDisputesScreenStyle.inputDescriptionTextStyle}
                            multiline={true}
                            underlineColorAndroid={Colors.TRANSPARENT}
                        />

                    </View>

                    <View>

                        <View style={AddDisputesScreenStyle.uploadImageListContainerView}>
                            <Text style={AddDisputesScreenStyle.maxImageTextStyle}>{Strings.MAX_IMAGE_LIMIT}</Text>
                            {
                                this.state.selectedImage != ''
                                    ?
                                    <Image source={this.state.selectedImage} style={AddDisputesScreenStyle.uploadPropertyImageStyle} />
                                    :
                                    null
                            }
                            <View style={{ marginTop: 10 }}>
                                {
                                    this.state.uploadImagesData.imageArray ?
                                        <FlatList
                                            horizontal={true}
                                            data={this.state.uploadImagesData.imageArray}
                                            renderItem={this.renderItem}
                                            extraData={this.state}
                                        /> : null
                                }

                            </View>
                            <TouchableOpacity style={AddDisputesScreenStyle.uploadImageButtonStyle} onPress={() => this.showActionSheet()}  >
                                <View >
                                    <Text style={AddDisputesScreenStyle.uploadButtonTextStyle}>
                                        {Strings.UPLOAD_IMAGE}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>



                </ScrollView>
                <View style={AddDisputesScreenStyle.buttonContainerStyle}>
                    <TouchableOpacity onPress={() => this.callSaveAsDraft()}>
                        <View style={AddDisputesScreenStyle.roundedTransparentDraftButtonStyle}>
                            <Text style={AddDisputesScreenStyle.draftButtonTextStyle}>
                                {Strings.SAVE_AS_DRAFT}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.callProceedToStepThree()}>
                        <View style={AddDisputesScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={AddDisputesScreenStyle.proceedButtonTextStyle}>
                                {Strings.SAVE}
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
            </View >
        );
    }
}

export default AddDisputesScreen;

