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
    updateAgreement,
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
    clearAgencyData,

} from "./EditAgreementAction";


import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import EditAgreementScreenStyle from './EditAgreementScreenStyle';

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
var PropertyData={};
var MaintenanceData=[];
class EditAgreementScreen extends Component {
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
            paymentModeVal:'',
            errorMsg:'',
            errorOnTextField:'',
            agreementDetail:[],

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
        this.onUpdateAgreementSuccess();
        this.onUploadImageSuccess(); 
    }

    componentWillUnmount() {

    }

    componentWillMount() {
        
        this.callGetAgencyProperty();
        this.setState({agreementDetail:this.props.agreementData});
      
    }

    setAgreementData(){
        
            {
                this.state.agreementDetail.length>0
                ?
                PropertyData=this.state.agreementDetail[0].propertyData?this.state.agreementDetail[0].propertyData:{}
                :{}
            }

            {
                this.state.agreementDetail.length>0
                ?
                MaintenanceData=this.state.agreementDetail[1].maintenanceData?this.state.agreementDetail[1].maintenanceData:{}
                :{}
            }
            console.log("agreementData>>>>> "+JSON.stringify(PropertyData));
            this.props.propertyNameChanged(PropertyData.property_id.address);
            this.setState({selectedPropertyId:PropertyData.property_id._id});
            this.callGetPropertyOwner(PropertyData.property_id._id);
            this.callGetTenantsList(PropertyData.property_id._id);
            this.pushTenantsData(PropertyData.tenants);
            this.setState({rentAmount:PropertyData.rent_price.toString()});
            this.prepareUploadedImageData(PropertyData.images);
            if(PropertyData.terms==1){
                 this.setState({paymentModeVal:'Monthly'});
            }
            else{
                 this.setState({paymentModeVal:'Yearly'});
            }          
            this.setState({date:Moment(PropertyData.tenancy_start_date).format(Strings.DATE_FORMATE)});
            this.setState({rentalValidityDate:Moment(PropertyData.case_validity).format(Strings.DATE_FORMATE)});


    }


    closeAddProperty() {

        Actions.pop();
    }

  
  
    callGetAgencyProperty() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {

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

          if(this.props.editAgreementReducer.agencyListResponse!=''){

            if(this.props.editAgreementReducer.agencyListResponse.code==200){

                this.setState({agencyData:this.preparePropertyData(this.props.editAgreementReducer.agencyListResponse.data)});          
                this.setAgreementData();   
            }   
            else{

                alert(this.props.editAgreementReducer.agencyListResponse.message);
            }
            this.props.clearAgencyData();
          
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
    pushTenantsData(tenantsData){
        
       
        var tempArray = [];
        tenantsData.map((data, index) => {

            this.state.selectedTenantsData.push(tenantsData[index].users_id);
            var tempData={
                _id:tenantsData[index].users_id._id
            }
            tenantsArray.push(tempData);
        
        })


    }

    prepareUploadedImageData(imagesData){

        imagesData.map((data, index) => {

                var imageItem = {
                    'url':  imagesData[index].path,
                    'path': imagesData[index].path,
                    'isSelected': 0
                }
              
                uploadImagesArray.push(imageItem);
                var imagagesData = {

                        'imageArray' : uploadImagesArray
                }
                this.setState({ uploadImagesData: imagagesData });
              
        })
       
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

        if(this.props.editAgreementReducer.tenantsListResponse!=''){

            if(this.props.editAgreementReducer.tenantsListResponse.code==200){

                this.setState({tenantsData:this.props.editAgreementReducer.tenantsListResponse.data,tenantsSearchedData:this.props.editAgreementReducer.tenantsListResponse.data});              
            }   
            else{
                
                alert(this.props.editAgreementReducer.tenantsListResponse.message);
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

        if(this.props.editAgreementReducer.ownerListResponse!=''){

            if(this.props.editAgreementReducer.ownerListResponse.code==200){
                console.log('owner data=== ',JSON.stringify(this.props.editAgreementReducer.ownerListResponse));
                this.setState({ownerData:this.prepareOwnerData(this.props.editAgreementReducer.ownerListResponse.data)});          
               
            }   
            else{

                alert(this.props.editAgreementReducer.ownerListResponse.message);
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
            console.log('prepareOwnerData iff= '+PropertyData.owner_id);
            console.log('prepareOwnerData iff= '+ownerInfo._id);
           if(PropertyData.owner_id==ownerInfo._id){

                this.props.propertyOwnerChanged(ownerInfo.firstname+' '+ownerInfo.lastname);
                this.setState({selectedOwnerId:ownerInfo._id});
           }
           tempArray.push(tempData); 
        
        })
        console.log('prepareOwnerData list= '+JSON.stringify(tempArray));
        return tempArray;      
    }


    callAddAgreementApi(isSaveAsDraft){

        if (this.props.editAgreementReducer.propertyName == 'Select Property') {

            this.setState({ errorMsg: Strings.ERROR_SELECT_PROPERTY });
            this.setState({ errorOnTextField: 0 });
        }
        else{

            AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                
                if (value) {
                    var userData    =   JSON.parse(value);
                    var authToken   =   userData.token;               
                    var postData = {
                        agreement_id:PropertyData._id,
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
                    this.props.updateAgreement(authToken,postData);
                }

            }).done();    
        }
        
      
        
    }


    onUpdateAgreementSuccess(){

        if(this.props.editAgreementReducer.updateAgreementRes!=''){

            if(this.props.editAgreementReducer.updateAgreementRes.code==200){

                Actions.pop();
                uploadImagesArray = [];
                uploadedImagesPath = [];
                tenantsArray=[];
            }   
            else{

                alert(this.props.editAgreementReducer.updateAgreementRes.message);
            }
            this.props.resetState();
        }
    }

    onPropertySelectChange(text) {

         this.props.propertyNameChanged(text);
         this.setState({selectedPropertyId:this.state.agencyData[this.refs.ref_property.selectedIndex()].id});
         this.callGetPropertyOwner(this.state.agencyData[this.refs.ref_property.selectedIndex()].id);
         this.callGetTenantsList(this.state.agencyData[this.refs.ref_property.selectedIndex()].id);
    }
    onPropertyOwnerChange(text) {

         this.props.propertyOwnerChanged(text);
         this.setState({selectedOwnerId:this.state.ownerData[this.refs.ref_owner.selectedIndex()].id});
       
    }

    onTenantsNameChange(text){

        this.props.searchTenantsChanged(text);
        this.setState({isSearchTenantsListShow:true});
        this.SearchTenantsFunction(text);
    }

    onRentChange(text){

        this.setState({rentAmount:text});
    }
    onModeOfPaymentChange(text){

        this.setState({paymentModeVal:text});
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
        this.state.selectedTenantsData.push(item.invited_to);
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

                        'imageArray' : uploadImagesArray
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

        if (this.props.editAgreementReducer.uploadedImageRes != '') {
            if (this.props.editAgreementReducer.uploadedImageRes.code == 200) {
                var imagePath = {
                    path: this.props.editAgreementReducer.uploadedImageRes.data
                }
                uploadedImagesPath.push(imagePath);
            }
            else { 

                alert(this.props.editAgreementReducer.uploadedImageRes.message);
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
        var path = API.AGREEMENT_PATH + item.path;
        return (
            <TouchableOpacity onPress={() => contextRef.uploadImageListSelection(index)}>
                <View style={EditAgreementScreenStyle.uploadImageListItemStyle}>
                    <Image source={{uri:path}} style={EditAgreementScreenStyle.uploadPropertyListImageStyle} />
                </View>
                {
                    item.isSelected == 1 ? <View style={EditAgreementScreenStyle.selectedImageStyle}>
                        <View style={EditAgreementScreenStyle.roundedBlueFeaturedButtonStyle}>
                            <Text style={EditAgreementScreenStyle.featuredTextStyle}>
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
                <Text style={EditAgreementScreenStyle.searchTraderListItemTextStyle}>{item.invited_to.firstname+' '+item.invited_to.lastname}</Text>      
            </TouchableOpacity>
        );
    }

    searchRenderItem({ item, index }) {
       
        return (

            <View style={EditAgreementScreenStyle.serachListItemContainer} >
                
                <Text style={EditAgreementScreenStyle.searchListItemTextStyle}>{item.firstname+' '+item.lastname}</Text>
                <Image source={ImagePath.DRAWER_CROSS_ICON} style={EditAgreementScreenStyle.searchListItemCloseImageStyle} />
            
            </View>
        );
    }

    render() {

        return (
            <View style={EditAgreementScreenStyle.mainContainer}>
                {this.navBar()}


                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={EditAgreementScreenStyle.scrollViewContainerStyle}>


                    <View style={EditAgreementScreenStyle.addPropertyInputContainer}>
                      
                         <View style={EditAgreementScreenStyle.labelContainerStyle}>
                            <Text style={EditAgreementScreenStyle.labelStyle}>
                                {Strings.SELECT_PROPERTY}
                            </Text>
                        </View>
                   
                        <Dropdown
                            ref='ref_property'
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            itemTextStyle={EditAgreementScreenStyle.dropDownTextStyle}
                            containerStyle={EditAgreementScreenStyle.dropDownViewStyle}
                            data={this.state.agencyData}
                            onChangeText={this.onPropertySelectChange.bind(this)}
                            value={this.props.editAgreementReducer.propertyName}
                        />

                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 0 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }

                        <View style={EditAgreementScreenStyle.labelContainerStyle}>
                            <Text style={EditAgreementScreenStyle.labelStyle}>
                                {Strings.ADD_TENANT}
                            </Text>
                        </View>

                        <View style={EditAgreementScreenStyle.searchViewStyle}>
                            <TextInput
                                placeholder={Strings.SEARCH_TENANT}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={EditAgreementScreenStyle.searchTextInputStyle}
                                onChangeText={this.onTenantsNameChange.bind(this)}
                                value={this.props.editAgreementReducer.tenantSearch}
                                 />
                            <Image source={ImagePath.SEARCH_ICON} style={EditAgreementScreenStyle.searchImageStyle} />
                        </View>

                        {   
                            (this.state.isSearchTenantsListShow==true)?
                                                                    
                                <FlatList
                                    style={EditAgreementScreenStyle.tenantsListContainerStyles}
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

                        <Text style={EditAgreementScreenStyle.labelStyle}>
                            {Strings.PROPERTY_OWNER}
                        </Text>
                        
                        <Dropdown
                            ref='ref_owner'
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            itemTextStyle={EditAgreementScreenStyle.dropDownTextStyle}
                            containerStyle={EditAgreementScreenStyle.dropDownViewStyle}
                            data={this.state.ownerData}
                            onChangeText={this.onPropertyOwnerChange.bind(this)}
                            value={this.props.editAgreementReducer.ownerName}
                           
                        />
                        <View style={EditAgreementScreenStyle.labelContainerStyle}>
                            <Text style={EditAgreementScreenStyle.labelStyle}>
                                {Strings.TENANCY_START_DATE}
                            </Text>
                        </View>
                        <View style={EditAgreementScreenStyle.searchViewStyle}>
                            <DatePicker
                                style={EditAgreementScreenStyle.datePickerStyle}
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

                        <Text style={EditAgreementScreenStyle.labelStyle}>
                            {Strings.RENT}
                        </Text>

                        <View style={EditAgreementScreenStyle.searchViewStyle}>
                                <TextInput
                                    placeholder={''}
                                    underlineColorAndroid={Colors.TRANSPARENT}
                                    style={EditAgreementScreenStyle.searchTextInputStyle}
                                    onChangeText={this.onRentChange.bind(this)}
                                    value={this.state.rentAmount}
                                />
                            
                        </View>                      

                        <Text style={EditAgreementScreenStyle.labelStyle}>
                            {Strings.MODE_OF_PAYMENT}
                        </Text>
                        <Dropdown
                            ref='ref_payment_mode'
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            itemTextStyle={EditAgreementScreenStyle.dropDownTextStyle}
                            containerStyle={EditAgreementScreenStyle.dropDownViewStyle}
                            data={spinerData}
                            onChangeText={this.onModeOfPaymentChange.bind(this)}
                            value={this.state.paymentModeVal}
                        />
                        <View style={EditAgreementScreenStyle.labelContainerStyle}>
                            <Text style={EditAgreementScreenStyle.labelStyle}>
                                {Strings.RENTAL_CASE_VALIDITY}
                            </Text>
                        </View>
                        <View style={EditAgreementScreenStyle.searchViewStyle}>
                            <DatePicker
                                style={EditAgreementScreenStyle.datePickerStyle}
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
                        <Text style={EditAgreementScreenStyle.labelStyle}>
                            {Strings.AGREEMENT_DETAILS}
                        </Text>
                        <TextInput style={EditAgreementScreenStyle.inputDescriptionTextStyle}
                            multiline={true}
                            editable={false}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            value={Strings.DUMMY_TEXT}
                        />

                    </View>

                    <View>

                        <View style={EditAgreementScreenStyle.uploadImageListContainerView}>
                            <Text style={EditAgreementScreenStyle.maxImageTextStyle}>{Strings.MAX_IMAGE_LIMIT}</Text>
                            {
                                    this.state.selectedImage != ''
                                    ?
                                    <Image source={{uri:API.AGREEMENT_PATH+this.state.selectedImage}} style={EditAgreementScreenStyle.uploadPropertyImageStyle} />
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
                            <TouchableOpacity style={EditAgreementScreenStyle.uploadImageButtonStyle} onPress={() => this.showActionSheet()}  >
                                <View >
                                    <Text style={EditAgreementScreenStyle.uploadButtonTextStyle}>
                                        {Strings.UPLOAD_IMAGE}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>



                </ScrollView>
                <View style={EditAgreementScreenStyle.buttonContainerStyle}>
                    {
                        /*<TouchableOpacity onPress={() => this.callAddAgreementApi(true)}>
                            <View style={EditAgreementScreenStyle.roundedTransparentDraftButtonStyle}>
                                <Text style={EditAgreementScreenStyle.draftButtonTextStyle}>
                                    {Strings.SAVE_AS_DRAFT}
                                </Text>
                            </View>
                        </TouchableOpacity>*/
                    }
                    <TouchableOpacity onPress={() => this.callAddAgreementApi(false)}>
                        <View style={EditAgreementScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={EditAgreementScreenStyle.proceedButtonTextStyle}>
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


                        this.props.editAgreementReducer.isScreenLoading ?
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
    console.log('editAgreementReducer mapStateToProps= ', JSON.stringify(state));
    return {

        editAgreementReducer: state.editAgreementReducer
    }
}

export default connect(
    mapStateToProps,
    {   
        clearUploadAgreementImageRes,
        updateAgreement,
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
        uploadAgreementImage,
        clearAgencyData
    }

)(EditAgreementScreen);


