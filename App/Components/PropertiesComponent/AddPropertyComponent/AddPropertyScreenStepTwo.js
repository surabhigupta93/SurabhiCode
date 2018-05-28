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

import {
  
  showLoading,
  resetState,
  numberOfBedroomChanged,
  numberOfCarNoChanged,
  numberOfBathroomChanged,
  numberOfFloorAreaChanged,
  numberOfLotAreaChanged,
  clearUploadPropertyImageRes

} from "./AddPropertyAction";

import {
    savePropertyAsDraft,
    uploadImage,
} from "../../../Action/ActionCreators";


import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import AddPropertyScreenStyle from './AddPropertyScreenStyle';
import { Dropdown } from 'react-native-material-dropdown';
import listData from '../../../../data';
var ImagePicker = require('react-native-image-picker');
import ActionSheet from 'react-native-actionsheet'
import * as Progress from 'react-native-progress';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
            value: '1',}, {value: '2',}, { value: '3',}, {value: '4',}, {
            value: '5',}, {value: '6',}, {value: '7',}, {value: '8',}, {
            value: '9',}, {value: '10',}, {value: '11',}, {value: '12',}, {
            value: '13',}, {value: '14',}, {value: '15',}, {value: '16',}, {
            value: '17',}, {value: '18',}, {value: '19',}, {value: '20',
         }];

var uploadImagesArray=[];  
var uploadedImagesPath=[]     
let contextRef; 
class AddPropertyScreenStepTwo extends Component {
    constructor() {
        super();
        this.state = {
            uploadImagesData:{},
            selectedImage:'',
            errorMsg: '',
            errorOnTextField: '',
          
        };
        this.handlePress = this.handlePress.bind(this)
        contextRef=this;

    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onUploadImageSuccess();
        this.onSavePropertySuccess();
    }

    componentWillUnmount() {
        this.setState({uploadImagesData:{}});
    }

    closeAddProperty() {

        Actions.popTo('Dashboard');
    }

    callBack() {
        Actions.pop();
    }

    callProceedToStepThree() {


        if(this.props.addPropertyReducer.propertyBedroomNo=='Select number of bedroom'){
            
            this.setState({ errorMsg: Strings.EMPTY_PROPERTY_BEDROOM_ERROR });
            this.setState({ errorOnTextField: 0 });
        } 
        else if(this.props.addPropertyReducer.propertyCarNo=='Select number of car port'){

            this.setState({ errorMsg: Strings.EMPTY_PROPERTY_CARPORT_ERROR });
            this.setState({ errorOnTextField: 1 });
        }  
        else if(this.props.addPropertyReducer.propertyBathroomNo=='Select number of bathroom'){

            this.setState({ errorMsg: Strings.EMPTY_PROPERTY_BATHROOM_ERROR });
            this.setState({ errorOnTextField: 2 });
        } 
        else if(this.props.addPropertyReducer.propertyFloorArea==''){

            this.setState({ errorMsg: Strings.EMPTY_PROPERTY_FLOOR_AREA_ERROR });
            this.setState({ errorOnTextField: 3 });
        }
        else if(this.props.addPropertyReducer.propertyLotArea==''){

            this.setState({ errorMsg: Strings.EMPTY_PROPERTY_LOT_AREA_ERROR });
            this.setState({ errorOnTextField: 4 });
        }
        else{

           Actions.AddPropertyScreenStepThree({uploadedImages:uploadedImagesPath}); 
        }

        
    }

    onNoOfBedroomChange(text){

        this.props.numberOfBedroomChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }
    onNoOfCarPortChange(text){

        this.props.numberOfCarNoChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }
    onNoOfBathroomChange(text){

        this.props.numberOfBathroomChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }
    onFloorAreaChange(text){

        this.props.numberOfFloorAreaChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }
    onLotAreaChange(text){

        this.props.numberOfLotAreaChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
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
                var imageItem={
                    'url':source,
                    'path':imagePath,
                    'isSelected':0
                 }
                 if(uploadImagesArray.length<20){
                     uploadImagesArray.push(imageItem);
                     var imagagesData={

                        'imageArray':uploadImagesArray
                     }
                     this.setState({uploadImagesData:imagagesData});
                 }
                 else{
                    alert(Strings.MAX_IMAGE_LIMIT);
                 }

                 if(uploadImagesArray.length==1){
                     this.uploadImageListSelection(0);
                 }
                 AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                    if (value) {
                        var userData = JSON.parse(value);
                        var authToken=userData.token;
                        this.props.showLoading();
                        console.log('image path==',response.uri.replace("file://", ""));
                        this.props.uploadImage(authToken,response.uri.replace("file://", ""));
                    }
                }).done();
               
               

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
                 var imageItem={
                    'url':source,
                    'path':imagePath,
                    'isSelected':0
                 }
                 if(uploadImagesArray.length<20){
                     uploadImagesArray.push(imageItem);
                     var imagagesData={

                        'imageArray':uploadImagesArray
                     }
                     this.setState({uploadImagesData:imagagesData});
                 }
                 else{
                    alert(Strings.MAX_IMAGE_LIMIT);
                 }

                 if(uploadImagesArray.length==1){
                     this.uploadImageListSelection(0);
                 }
                 AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                    if (value) {
                        var userData = JSON.parse(value);
                        var authToken=userData.token;
                        this.props.showLoading();
                        console.log('image path==',response.uri.replace("file://", ""));
                        this.props.uploadImage(authToken,response.uri.replace("file://", ""));
                    }
                }).done();
               
               
                 
            }

        });
    }

    onUploadImageSuccess(){

        if(this.props.addPropertyReducer.uploadPropertyImageRes!=''){
            if(this.props.addPropertyReducer.uploadPropertyImageRes.code==200){
                var imagePath={
                    path:this.props.addPropertyReducer.uploadPropertyImageRes.data
                }
                uploadedImagesPath.push(imagePath);
            }
            else{
                alert(this.props.addPropertyReducer.uploadPropertyImageRes.message);
            }
            this.props.clearUploadPropertyImageRes();
        }
    }

    onSavePropertySuccess(){

        if(this.props.addPropertyReducer.savePropertyResponse!=''){
            if(this.props.addPropertyReducer.savePropertyResponse.code==200){
                 Actions.popTo('Dashboard');
            }
            else{
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
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.NAV_ADD_NEW_PROPERTY_TITLE}</Text>
                <TouchableOpacity onPress={() => this.callBack()} style={CommonStyles.navBackRightImageView}>

                    <View >
                        <Image source={ImagePath.HEADER_BACK} />
                    </View>

                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.closeAddProperty()} style={CommonStyles.navRightImageView}>
                    <View >
                        <Image source={ImagePath.DRAWER_CROSS_ICON} />
                    </View>
                </TouchableOpacity>

            </View>
        );
    }
    
    uploadImageListSelection(index){
        console.log('selectedimage== ',index);
        console.log('selectedimage== ',JSON.stringify(this.state.uploadImagesData.imageArray[index].url));
        this.setState({selectedImage:this.state.uploadImagesData.imageArray[index].url});
        var tempData=this.state.uploadImagesData;
        var tempArray=this.state.uploadImagesData.imageArray;
        tempArray.map((data, position) => {

            if(index==position){

               if(tempArray[index].isSelected==0){
                 tempArray[index].isSelected = 1;
               }
              
            }
            else{
                 tempArray[position].isSelected  = 0;
            }
           
           
        })
        tempData.imageArray=tempArray;
        this.setState({uploadImagesData:tempData});
        
    }

    callSavePropertyApi() {

            

            AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                if (value) {
                    var userData = JSON.parse(value);
                    var authToken=userData.token;
                    console.log('user data ==',value);
                    addPropertyData = {

                        property_name:this.props.addPropertyReducer.propertyName,
                        country:this.props.addPropertyReducer.propertyCountry,
                        property_type: this.props.addPropertyReducer.propertyType,
                        created_by: userData.data._id,
                        owned_by:this.props.addPropertyReducer.propertyOwnerId,
                        address: this.props.addPropertyReducer.propertyAddress,
                        description: this.props.addPropertyReducer.propertyDes,
                        number_of_bathroom: parseInt(this.props.addPropertyReducer.propertyBathroomNo),
                        number_of_parking: parseInt(this.props.addPropertyReducer.propertyCarNo),
                        floor_area:parseInt(this.props.addPropertyReducer.propertyFloorArea) ,
                        lot_erea:parseInt(this.props.addPropertyReducer.propertyLotArea ) ,
                        other_amenity: '',
                        number_bedroom: parseInt(this.props.addPropertyReducer.propertyBedroomNo),
                       
                    };       
                    this.props.showLoading();
                    this.props.savePropertyAsDraft(authToken,addPropertyData);
                }
            }).done();    
          
      

    }
    callSaveAsDraft(){
        this.callSavePropertyApi();
    }


    renderItem({ item, index }) {
       
        return(
            <TouchableOpacity onPress={()=>contextRef.uploadImageListSelection(index)}>
               <View style={AddPropertyScreenStyle.uploadImageListItemStyle}>
                    <Image source={item.url} style={AddPropertyScreenStyle.uploadPropertyListImageStyle} />
               </View>
               {
                    item.isSelected==1?<View style={AddPropertyScreenStyle.selectedImageStyle}>
                     <View style={AddPropertyScreenStyle.roundedBlueFeaturedButtonStyle}>
                            <Text style={AddPropertyScreenStyle.featuredTextStyle}>
                                {Strings.FEATURED}
                            </Text>
                     </View>
                    </View>:null
               }
            </TouchableOpacity>   
            );
    }

    render() {

        return (
            <View style={{ flex: 1 }}>
                {this.navBar()}

               
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={AddPropertyScreenStyle.scrollViewContainerStyle}>
                    <View style={AddPropertyScreenStyle.headerContainer}>
                        <View style={AddPropertyScreenStyle.dotContainer}>
                            <View style={AddPropertyScreenStyle.blueDotStyle} />
                            <View style={AddPropertyScreenStyle.blueDotStyle} />
                            <View style={AddPropertyScreenStyle.greyDotStyle} />
                            <View style={AddPropertyScreenStyle.greyDotStyle} />
                        </View>

                    
                    </View>

                    <View style={AddPropertyScreenStyle.addPropertyInputContainer}>

                        <Text style={AddPropertyScreenStyle.labelStyle}>
                            {Strings.NUMBER_OF_BEDROOMS}
                        </Text>
                        <Dropdown
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            itemTextStyle={AddPropertyScreenStyle.dropDownTextStyle}
                            containerStyle={AddPropertyScreenStyle.dropDownViewStyle}

                            data={spinerData}
                            onChangeText={this.onNoOfBedroomChange.bind(this)}
                            value={this.props.addPropertyReducer.propertyBedroomNo}
                        />

                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 0 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }

                        <Text style={AddPropertyScreenStyle.labelStyle}>
                            {Strings.NUMBER_OF_CAR_PORT}
                        </Text>
                         <Dropdown
                         label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                             itemTextStyle={AddPropertyScreenStyle.dropDownTextStyle}
                            containerStyle={AddPropertyScreenStyle.dropDownViewStyle}
                            data={spinerData}
                            onChangeText={this.onNoOfCarPortChange.bind(this)}
                            value={this.props.addPropertyReducer.propertyCarNo}
                        />

                           {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 1 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }

                        <Text style={AddPropertyScreenStyle.labelStyle}>
                            {Strings.NUMBER_OF_BATHROOMS}
                        </Text>
                         <Dropdown
                         label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                             itemTextStyle={AddPropertyScreenStyle.dropDownTextStyle}
                            containerStyle={AddPropertyScreenStyle.dropDownViewStyle}
                            data={spinerData}
                            onChangeText={this.onNoOfBathroomChange.bind(this)}
                            value={this.props.addPropertyReducer.propertyBathroomNo}
                        />

                           {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 2 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }

                        <Text style={AddPropertyScreenStyle.labelStyle}>
                            {Strings.FLOOR_AREA}
                        </Text>

                        <TextInput style={AddPropertyScreenStyle.inputTextStyle}
                                autoCapitalize='none'
                                autoCorrect={false}
                                underlineColorAndroid='transparent'                          
                                maxLength = {6}
                                keyboardType='number-pad'
                                returnKeyType='done'
                                onChangeText={this.onFloorAreaChange.bind(this)}
                                value={this.props.addPropertyReducer.propertyFloorArea}
                                onSubmitEditing={(event)=>{this.refs.refLotArea.focus();}}
                        />
                      

                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 3 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }
                        <Text style={AddPropertyScreenStyle.labelStyle}>
                            {Strings.LOT_AREA}
                        </Text>

                        <TextInput style={AddPropertyScreenStyle.inputTextStyle}
                                ref='refLotArea'
                                autoCapitalize='none'
                                autoCorrect={false}
                                underlineColorAndroid='transparent'
                                keyboardType='number-pad'
                                returnKeyType='done'
                                maxLength = {6}
                                onChangeText={this.onLotAreaChange.bind(this)}
                                value={this.props.addPropertyReducer.propertyLotArea}
                        />
                      
                       
                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 4 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }
                    </View>

                    <View>
                     
                        <View style={AddPropertyScreenStyle.uploadImageListContainerView}>
                            <Text style={AddPropertyScreenStyle.maxImageTextStyle}>{Strings.MAX_IMAGE_LIMIT}</Text>
                            {
                                this.state.selectedImage!=''
                                ?
                                <Image source={ this.state.selectedImage } style={AddPropertyScreenStyle.uploadPropertyImageStyle} />
                                :
                                null
                            }
                           <View style={{marginTop:10}}>
                                {
                                    this.state.uploadImagesData.imageArray?   
                                    <FlatList 
                                        horizontal={true}
                                        data={this.state.uploadImagesData.imageArray}
                                        renderItem={this.renderItem}
                                        extraData={this.state}
                                    />:null
                                }
                             
                            </View>
                            <TouchableOpacity style={AddPropertyScreenStyle.uploadImageButtonStyle} onPress={() => this.showActionSheet()}  >
                                <View >
                                    <Text style={AddPropertyScreenStyle.uploadButtonTextStyle}>
                                        {Strings.UPLOAD_IMAGE}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>



                </KeyboardAwareScrollView>
                <View style={AddPropertyScreenStyle.buttonContainerStyle}>
                    <TouchableOpacity onPress={() => this.callSaveAsDraft()}>
                        <View style={AddPropertyScreenStyle.roundedTransparentDraftButtonStyle}>
                            <Text style={AddPropertyScreenStyle.draftButtonTextStyle}>
                                {Strings.SAVE_AS_DRAFT}
                            </Text>
                        </View>
                   </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.callProceedToStepThree()}>
                        <View style={AddPropertyScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={AddPropertyScreenStyle.proceedButtonTextStyle}>
                                {Strings.PROCEED}
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
                          
                    this.props.addPropertyReducer.isScreenLoading ?
                    <View style={CommonStyles.circles}>
                        <Progress.CircleSnail color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]} />
                    </View>
                    : null
                  
                }
            </View>
        );
    }
}
function mapStateToProps(state) {
    console.log('add property step1 mapStateToProps= ', JSON.stringify(state));
    return {
        addPropertyReducer: state.addPropertyReducer
    }
}

export default connect(
    mapStateToProps,
    {
        showLoading,
        resetState,
        savePropertyAsDraft,
        uploadImage,
        numberOfBedroomChanged,
        numberOfCarNoChanged,
        numberOfBathroomChanged,
        numberOfFloorAreaChanged,
        numberOfLotAreaChanged,
        clearUploadPropertyImageRes
    }

)(AddPropertyScreenStepTwo)

