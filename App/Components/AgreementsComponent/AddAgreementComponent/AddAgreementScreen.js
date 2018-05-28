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

    uploadAgreementImage,
    addAgreement,
    getAgreementPropertyTenantsList,
    getAgreementPropertyOwnerList,
    getPropertyOwnerList,
    getAgreementPropertyList,

} from "../../../Action/ActionCreators";

import {
    clearUploadAgreementImageRes,
    searchTenantsChanged,
    clearTenantsData,
    clearOwnerData,
    propertyOwnerChanged,
    propertyNameChanged,
    showLoading,
    resetState,

} from "./AddAgreementAction";


import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import AddAgreementScreenStyle from './AddAgreementScreenStyle';
import { Dropdown } from 'react-native-material-dropdown';
import listData from '../../../../data';
var ImagePicker = require('react-native-image-picker');
import ActionSheet from 'react-native-actionsheet'
import API from '../../../Constants/APIUrls';
import DatePicker from 'react-native-datepicker'
import Moment from 'moment';
import * as Progress from 'react-native-progress';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';

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

const CANCEL_INDEX = 3
const DESTRUCTIVE_INDEX = 4
const actionOptions = ['Upload Photo', 'Take Photo', 'Document','Cancel'];
let spinerData = [{value: 'Monthly'}, { value: 'Yearly' }];

var uploadImagesArray = [];
var uploadedImagesPath = [];
var tenantsArray=[];
let contextRef;
class AddAgreementScreen extends Component {
    constructor() {
        super();
        this.state = {
            uploadImagesData: {},
            selectedImage: '',
            selectedPropertyId:'',
            selectedOwnerId:'',
            tenantsData:[],
            tenantsSearchedData:[],
            agencyData:[],
            ownerData:[],
            selectedTenantsData:[],
            isSearchTenantsListShow:false,
            minDate: Moment().format('MMM DD YYYY'),
            rentAmount:'',
            paymentMode:0,
            errorMsg:'',
            errorOnTextField:''

        };
        this.handlePress = this.handlePress.bind(this)
        contextRef = this;

    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {

        this.onGetAgencySuccess();
        this.onGetPropertyOwnerSuccess();
        this.onGetTenantsSuccess();
        this.onAddAgreementSuccess();
        this.onUploadImageSuccess(); 
    }

    componentWillUnmount() {

    }

    componentWillMount() {
        
       this.callGetAgencyProperty();
    }


    closeAddProperty() {

        Actions.popTo('Dashboard');
    }

  
  
    callGetAgencyProperty() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    
                    agency_id: userData.data.agency_id,
                    request_by_id: userData.data._id,
                    request_by_role: userData.data.role_id,
                }
                console.log('post req == ',JSON.stringify(postData));
                this.props.showLoading();
                this.props.getAgreementPropertyList(authToken, postData);
            }
        }).done();
    }

    onGetAgencySuccess(){

          if(this.props.addAgreementReducer.agencyListResponse!=''){

            if(this.props.addAgreementReducer.agencyListResponse.code==200){

                this.setState({agencyData:this.preparePropertyData(this.props.addAgreementReducer.agencyListResponse.data)});          
               
            }   
            else{

                alert(this.props.addAgreementReducer.agencyListResponse.message);
            }
            this.props.resetState();
        }
    }

    preparePropertyData(propertyList){
        var tempArray = [];
        propertyList.map((data, index) => {

           var tempData={

                value   : propertyList[index].address,
                id      : propertyList[index]._id
           }
           tempArray.push(tempData); 
        
        })
        console.log('preparePropertyData list= '+JSON.stringify(tempArray));
        return tempArray;      
    }


    callGetTenantsList(propertyId) {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                console.log('post req == ',propertyId);
                this.props.showLoading();
                this.props.getAgreementPropertyTenantsList(authToken, propertyId);
            }
        }).done();
    }

    onGetTenantsSuccess(){

        if(this.props.addAgreementReducer.tenantsListResponse!=''){

            if(this.props.addAgreementReducer.tenantsListResponse.code==200){

                this.setState({tenantsData:this.props.addAgreementReducer.tenantsListResponse.data,tenantsSearchedData:this.props.addAgreementReducer.tenantsListResponse.data});              
            }   
            else{
                
                alert(this.props.addAgreementReducer.tenantsListResponse.message);
            }
            this.props.clearTenantsData();
        }
    }


   callGetPropertyOwner(propertyId) {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                console.log('post req == ',propertyId);
                this.props.showLoading();
                this.props.getAgreementPropertyOwnerList(authToken, propertyId);
            }
        }).done();
    }

    onGetPropertyOwnerSuccess(){

        if(this.props.addAgreementReducer.ownerListResponse!=''){

            if(this.props.addAgreementReducer.ownerListResponse.code==200){

                this.setState({ownerData:this.prepareOwnerData(this.props.addAgreementReducer.ownerListResponse.data)});          
               
            }   
            else{

                alert(this.props.addAgreementReducer.ownerListResponse.message);
            }
            this.props.clearOwnerData();
        }
    }

    prepareOwnerData(ownerList){

        var tempArray = [];
        ownerList.map((data, index) => {
           var ownerInfo=ownerList[index].owned_by;
           var tempData={

                value   : ownerInfo.firstname+' '+ownerInfo.lastname,
                id      : ownerInfo._id
           }
           tempArray.push(tempData); 
        
        })
        console.log('prepareOwnerData list= '+JSON.stringify(tempArray));
        return tempArray;      
    }


    callAddAgreementApi(isSaveAsDraft){

        if (this.props.addAgreementReducer.propertyName == 'Select Property') {

            this.setState({ errorMsg: Strings.ERROR_SELECT_PROPERTY });
            this.setState({ errorOnTextField: 0 });
        }
        else{

            AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                if (value) {
                    var userData    =   JSON.parse(value);
                    var authToken   =   userData.token;               
                    var postData = {

                        created_by: userData.data._id,
                        property_id:this.state.selectedPropertyId,
                        owner_id:this.state.selectedOwnerId,
                        agency_id:userData.data.agency_id,                     
                        created_by_role:userData.data.role_id,                       
                        case_validity:this.state.rentalValidityDate,
                        tenancy_start_date:this.state.date,
                        rent_price:parseInt(this.state.rentAmount),
                        rental_period:this.state.paymentMode,
                        save_as_draft:isSaveAsDraft,
                        tenants:tenantsArray,
                        images:uploadedImagesPath,
                        
                    };       
                    console.log('callAddAgreementApi post data==',JSON.stringify(postData));
                    this.props.showLoading();
                    this.props.addAgreement(authToken,postData);
                }
            }).done();    
        }
        
      
        
    }


    onAddAgreementSuccess(){

        if(this.props.addAgreementReducer.addAgreementRes!=''){

            if(this.props.addAgreementReducer.addAgreementRes.code==200){

                Actions.pop();
                uploadImagesArray = [];
                uploadedImagesPath = [];
                tenantsArray=[];
            }   
            else{

                alert(this.props.addAgreementReducer.addAgreementRes.message);
            }
            this.props.resetState();
        }
    }

    onPropertySelectChange(text) {

         this.props.propertyNameChanged(text);
         this.setState({selectedPropertyId:this.state.agencyData[this.refs.ref_property.selectedIndex()].id});
         this.callGetPropertyOwner(this.state.agencyData[this.refs.ref_property.selectedIndex()].id);
         this.callGetTenantsList(this.state.agencyData[this.refs.ref_property.selectedIndex()].id);
         this.setState({tenantsSearchedData:[]}) ;
         this.setState({selectedTenantsData:[]}) ;
        
    }
    onPropertyOwnerChange(text) {

         this.props.propertyOwnerChanged(text);
         this.setState({selectedOwnerId:this.state.ownerData[this.refs.ref_owner.selectedIndex()].id});
       
    }

    onTenantsNameChange(text){

        this.props.searchTenantsChanged(text);
        if(text!=''){
            this.setState({isSearchTenantsListShow:true});
        }
        else{
            this.setState({isSearchTenantsListShow:false});
        }
        
        this.SearchTenantsFunction(text);
    }

    onRentChange(text){
        this.setState({rentAmount:text});
    }
    onModeOfPaymentChange(text){
        if(text='Monthly'){
            
            this.setState({paymentMode:0});
        }
        else{

            this.setState({paymentMode:1});
        }
      
    }

    onTenantsSelect(item){

        this.showSearchTenantsList();
        this.props.searchTenantsChanged('');
        this.state.selectedTenantsData.push(item);
        var tempData={
            _id:item.invited_to._id
        }
        tenantsArray.push(tempData);
    }


    showSearchTenantsList(){

        if(this.state.isSearchTenantsListShow==false){
            
            this.setState({isSearchTenantsListShow:true});
        }
        else{

            this.setState({isSearchTenantsListShow:false});
        }
    } 


    SearchTenantsFunction(text){
     
        
         const newData = this.state.tenantsData.filter(function(item){
       
             const itemData = item.invited_to.firstname.toUpperCase();     
             const textData = text.toUpperCase()
             return itemData.indexOf(textData) > -1
         })
         this.setState({
             tenantsSearchedData: newData,
         })
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
                        this.props.showLoading();
                        console.log('image path==', response.uri.replace("file://", ""));
                        this.props.uploadAgreementImage(authToken, response.uri.replace("file://", ""),response.fileName,'image/jpeg');
                    }
                }).done();



            }

        });
    }

    onUploadImageSuccess() {

        if (this.props.addAgreementReducer.uploadedImageRes != '') {
            if (this.props.addAgreementReducer.uploadedImageRes.code == 200) {
                var imagePath = {
                    path: this.props.addAgreementReducer.uploadedImageRes.data
                }
                uploadedImagesPath.push(imagePath);
            }
            else {

                alert(this.props.addAgreementReducer.uploadedImageRes.message);
            }
            this.props.clearUploadAgreementImageRes();
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
        else if (i == 2) {
            this.openFileChooser()  ;
        }
    }

    openFileChooser() {
        // iPhone/Android
        DocumentPicker.show({
            filetype: [DocumentPickerUtil.allFiles()],
        }, (error, res) => {
            // Android
            console.log(
                res.uri,
                res.type, // mime type
                res.fileName,
                res.fileSize
            );
            AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                if (value) {
                    var userData = JSON.parse(value);
                    var authToken = userData.token;

                    //this.props.showLoading();
                    console.log('image path==', res.uri.replace("file://", ""));
                    this.props.showLoading();
                    this.props.uploadAgreementImage(authToken, response.uri.replace("file://", ""),res.fileName,res.type);
                   // this.props.uploadMyFileDoc(authToken, res.uri.replace("file://", ""), userData.data._id, res.type, res.fileName);
                }
            }).done();

        });
    }

    navBar() {
        return (
            <View >

                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.AGREEMENTS}</Text>
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
                <View style={AddAgreementScreenStyle.uploadImageListItemStyle}>
                    <Image source={item.url} style={AddAgreementScreenStyle.uploadPropertyListImageStyle} />
                </View>
                {
                    item.isSelected == 1 ? <View style={AddAgreementScreenStyle.selectedImageStyle}>
                        <View style={AddAgreementScreenStyle.roundedBlueFeaturedButtonStyle}>
                            <Text style={AddAgreementScreenStyle.featuredTextStyle}>
                                {Strings.FEATURED}
                            </Text>
                        </View>
                    </View> : null
                }
            </TouchableOpacity>
        );
    }

    renderSearchTenantsItem({ item, index }) {

        return (

            <TouchableOpacity onPress={ contextRef.onTenantsSelect.bind(contextRef,item)}>         
                <Text style={AddAgreementScreenStyle.searchTraderListItemTextStyle}>{item.invited_to.firstname+' '+item.invited_to.lastname}</Text>      
            </TouchableOpacity>
        );
    }

    searchRenderItem({ item, index }) {
       
        return (

            <View style={AddAgreementScreenStyle.serachListItemContainer} >
                
                <Text style={AddAgreementScreenStyle.searchListItemTextStyle}>{item.invited_to.firstname+' '+item.invited_to.lastname}</Text>
                <Image source={ImagePath.DRAWER_CROSS_ICON} style={AddAgreementScreenStyle.searchListItemCloseImageStyle} />
            
            </View>
        );
    }



    render() {

        return (
            <View style={AddAgreementScreenStyle.mainContainer}>
                {this.navBar()}


                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={AddAgreementScreenStyle.scrollViewContainerStyle}>


                    <View style={AddAgreementScreenStyle.addPropertyInputContainer}>
                      
                         <View style={AddAgreementScreenStyle.labelContainerStyle}>
                            <Text style={AddAgreementScreenStyle.labelStyle}>
                                {Strings.SELECT_PROPERTY}
                            </Text>
                        </View>
                   
                        <Dropdown
                            ref='ref_property'
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            itemTextStyle={AddAgreementScreenStyle.dropDownTextStyle}
                            containerStyle={AddAgreementScreenStyle.dropDownViewStyle}
                            data={this.state.agencyData}
                            onChangeText={this.onPropertySelectChange.bind(this)}
                            value={this.props.addAgreementReducer.propertyName}
                        />

                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 0 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }

                        <View style={AddAgreementScreenStyle.labelContainerStyle}>
                            <Text style={AddAgreementScreenStyle.labelStyle}>
                                {Strings.ADD_TENANT}
                            </Text>
                        </View>

                        <View style={AddAgreementScreenStyle.searchViewStyle}>
                            <TextInput
                                placeholder={Strings.SEARCH_TENANT}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={AddAgreementScreenStyle.searchTextInputStyle}
                                onChangeText={this.onTenantsNameChange.bind(this)}
                                value={this.props.addAgreementReducer.tenantSearch}
                                 />
                            <Image source={ImagePath.SEARCH_ICON} style={AddAgreementScreenStyle.searchImageStyle} />
                        </View>

                        {   
                            (this.state.isSearchTenantsListShow==true)?
                                                                    
                                <FlatList
                                    style={AddAgreementScreenStyle.tenantsListContainerStyles}
                                    horizontal={false}
                                    data={this.state.tenantsSearchedData}
                                    renderItem={this.renderSearchTenantsItem}
                                    extraData={this.state}
                                />
                                :null
                        }
                        <FlatList
                            horizontal={false}
                            numColumns={2}
                            data={this.state.selectedTenantsData}
                            renderItem={this.searchRenderItem}
                            extraData={this.state}
                        />

                        <Text style={AddAgreementScreenStyle.labelStyle}>
                            {Strings.PROPERTY_OWNER}
                        </Text>
                        
                        <Dropdown
                            ref='ref_owner'
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            itemTextStyle={AddAgreementScreenStyle.dropDownTextStyle}
                            containerStyle={AddAgreementScreenStyle.dropDownViewStyle}
                            data={this.state.ownerData}
                            onChangeText={this.onPropertyOwnerChange.bind(this)}
                            value={this.props.addAgreementReducer.ownerName}
                           
                        />
                        <View style={AddAgreementScreenStyle.labelContainerStyle}>
                            <Text style={AddAgreementScreenStyle.labelStyle}>
                                {Strings.TENANCY_START_DATE}
                            </Text>
                        </View>
                        <View style={AddAgreementScreenStyle.searchViewStyle}>
                            <DatePicker
                                style={AddAgreementScreenStyle.datePickerStyle}
                                date={this.state.date}
                                mode="date"
                                placeholder="select date"
                                format='MMM DD YYYY'
                                minDate={this.state.minDate}                         
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                  dateIcon: {
                                    position: 'absolute',
                                    right: 0,
                                    top: 4,
                                    marginLeft: 0
                                  },
                                  dateInput: {
                                    marginLeft: 0,
                                    position: 'absolute',
                                    left: 5,
                                    borderBottomWidth: 0,
                                    borderLeftWidth: 0,
                                    borderTopWidth: 0,
                                    borderRightWidth: 0,
                                  }
                                  // ... You can check the source to find the other keys. 
                                }}
                                onDateChange={(date) => {this.setState({date: date})}}
                              />
                        </View>

                        <Text style={AddAgreementScreenStyle.labelStyle}>
                            {Strings.RENT}
                        </Text>

                        <View style={AddAgreementScreenStyle.searchViewStyle}>
                                <TextInput
                                    placeholder={''}
                                    underlineColorAndroid={Colors.TRANSPARENT}
                                    style={AddAgreementScreenStyle.searchTextInputStyle}
                                    onChangeText={this.onRentChange.bind(this)}
                                    value={this.state.rentAmount}
                                />
                            
                        </View>                      

                        <Text style={AddAgreementScreenStyle.labelStyle}>
                            {Strings.MODE_OF_PAYMENT}
                        </Text>
                        <Dropdown
                            ref='ref_payment_mode'
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            itemTextStyle={AddAgreementScreenStyle.dropDownTextStyle}
                            containerStyle={AddAgreementScreenStyle.dropDownViewStyle}
                            data={spinerData}
                            onChangeText={this.onModeOfPaymentChange.bind(this)}
                            value={this.state.paymentMode}
                        />
                        <View style={AddAgreementScreenStyle.labelContainerStyle}>
                            <Text style={AddAgreementScreenStyle.labelStyle}>
                                {Strings.RENTAL_CASE_VALIDITY}
                            </Text>
                        </View>
                        <View style={AddAgreementScreenStyle.searchViewStyle}>
                            <DatePicker
                                style={AddAgreementScreenStyle.datePickerStyle}
                                date={this.state.rentalValidityDate}
                                mode="date"
                                placeholder="select date"
                                format='MMM DD YYYY'
                                minDate={this.state.minDate}                         
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                  dateIcon: {
                                    position: 'absolute',
                                    right: 0,
                                    top: 4,
                                    marginLeft: 0
                                  },
                                  dateInput: {
                                    marginLeft: 0,
                                    position: 'absolute',
                                    left: 5,
                                    borderBottomWidth: 0,
                                    borderLeftWidth: 0,
                                    borderTopWidth: 0,
                                    borderRightWidth: 0,
                                  }
                                  // ... You can check the source to find the other keys. 
                                }}
                                onDateChange={(date) => {this.setState({rentalValidityDate: date})}}
                              />
                        </View>
                        <Text style={AddAgreementScreenStyle.labelStyle}>
                            {Strings.AGREEMENT_DETAILS}
                        </Text>
                        <TextInput style={AddAgreementScreenStyle.inputDescriptionTextStyle}
                            multiline={true}
                            editable={false}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            value={Strings.DUMMY_TEXT}
                        />

                    </View>

                    <View>

                        <View style={AddAgreementScreenStyle.uploadImageListContainerView}>
                            <Text style={AddAgreementScreenStyle.maxImageTextStyle}>{Strings.MAX_IMAGE_LIMIT}</Text>
                            {
                                    this.state.selectedImage != ''
                                    ?
                                    <Image source={this.state.selectedImage} style={AddAgreementScreenStyle.uploadPropertyImageStyle} />
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
                            <TouchableOpacity style={AddAgreementScreenStyle.uploadImageButtonStyle} onPress={() => this.showActionSheet()}  >
                                <View >
                                    <Text style={AddAgreementScreenStyle.uploadButtonTextStyle}>
                                        {Strings.UPLOAD_IMAGE}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>



                </ScrollView>
                <View style={AddAgreementScreenStyle.buttonContainerStyle}>
                    <TouchableOpacity onPress={() => this.callAddAgreementApi(true)}>
                        <View style={AddAgreementScreenStyle.roundedTransparentDraftButtonStyle}>
                            <Text style={AddAgreementScreenStyle.draftButtonTextStyle}>
                                {Strings.SAVE_AS_DRAFT}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.callAddAgreementApi(false)}>
                        <View style={AddAgreementScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={AddAgreementScreenStyle.proceedButtonTextStyle}>
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

                {


                        this.props.addAgreementReducer.isScreenLoading ?
                            <View style={CommonStyles.circles}>
                                <Progress.CircleSnail color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]} />
                            </View>
                            : null

                }


            </View >
        );
    }
}

function mapStateToProps(state) {
    console.log('addAgreementReducer mapStateToProps= ', JSON.stringify(state));
    return {

        addAgreementReducer: state.addAgreementReducer
    }
}

export default connect(
    mapStateToProps,
    {   
        clearUploadAgreementImageRes,
        addAgreement,
        searchTenantsChanged,
        getAgreementPropertyTenantsList,
        propertyOwnerChanged,
        getAgreementPropertyOwnerList,
        getPropertyOwnerList,
        propertyNameChanged,
        getAgreementPropertyList,
        showLoading,
        resetState,
        clearOwnerData,
        clearTenantsData,
        uploadAgreementImage
    }

)(AddAgreementScreen);


