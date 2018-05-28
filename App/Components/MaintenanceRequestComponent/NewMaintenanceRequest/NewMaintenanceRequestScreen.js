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
    AsyncStorage,
    Modal
} from 'react-native';

import {
    addMaintenanceReq,
    uploadMaintenaceImage,
    getWatherList,
    getMaintenancePropertyList,
    getTradersOptionList,
} from "../../../Action/ActionCreators";
import {
    clearUploadedImageRes,
    maintenanceReqDetailChanged,
    maintenanceReqNameChanged,
    propertyNameChanged,
    maintenanceBudgetChanged,
    searchWatcherChanged,
    tradersChanged,
    showLoading,
    resetState,
} from "./NewMaintenanceRequestAction";

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import API from '../../../Constants/APIUrls';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import NewMaintenanceRequestScreenStyle from './NewMaintenanceRequestScreenStyle';
import { Dropdown } from 'react-native-material-dropdown';
import listData from '../../../../data';
var ImagePicker = require('react-native-image-picker');
import DatePicker from 'react-native-datepicker'
import ActionSheet from 'react-native-actionsheet'
import * as Progress from 'react-native-progress';
import Moment from 'moment';
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

var uploadImagesArray = [];
var uploadedImagesPath = []
let contextRef;

class NewMaintenanceRequestScreen extends Component {
    constructor() {
        super();
        this.state = {
            uploadImagesData: {},
            selectedImage: '',
            tradersData:[],
            watcherData:[],
            tradersSearchedData:[],
            watcherSearchedData:[],
            selectedWatcherData:[],
            agencyData:[],
            isTraderListShow:false,
            isSearchWatcherListShow:false,
            selectedPropertyId:'',
            selectedTraderId:'',
            minDate: Moment().format('MMM DD YYYY'),

        };
        this.handlePress = this.handlePress.bind(this)
        contextRef = this;

    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {

        this.onGetAgencySuccess();
        this.onTradersOptionSuccess();
        this.onGetWatcherSuccess();
        this.onUploadImageSuccess();
        this.onAddMaintenanceReqSuccess();
    }

    componentWillUnmount() {

    }

    componentWillMount() {
       this.callGetAgencyProperty();
    }

    closeAddProperty() {

        Actions.popTo('Dashboard');
    }

    callBack() {
        Actions.pop();
    }

  

    onPropertySelectChange(text) {

         this.props.propertyNameChanged(text);
         this.setState({selectedPropertyId:this.state.agencyData[this.refs.ref_property.selectedIndex()].id});

    }
    onBudgetChange(text) {

          this.props.maintenanceBudgetChanged(text);

    }
    onRequestNameChange(text) {

          this.props.maintenanceReqNameChanged(text);

    }
    onReqDetailChange(text) {

         this.props.maintenanceReqDetailChanged(text);

    }


    callGetTradersOptionRequest() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {

                    user_id: userData.data._id,
                }
                this.props.showLoading();
                this.props.getTradersOptionList(authToken, postData);
            }
        }).done();
    }    

    onTradersOptionSuccess(){

       
        if(this.props.newMaintenanceRequestReducer.tradersListResponse!=''){
            console.log('traders success==',JSON.stringify(this.props.newMaintenanceRequestReducer.tradersListResponse));
            if(this.props.newMaintenanceRequestReducer.tradersListResponse.code==200){

                this.setState({tradersData:this.props.newMaintenanceRequestReducer.tradersListResponse.data,tradersSearchedData:this.props.newMaintenanceRequestReducer.tradersListResponse.data});
                this.callGetWatcherList();
            }   
            else{
                alert(this.props.newMaintenanceRequestReducer.tradersListResponse.message);
            }
            this.props.resetState();
        }
      
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
                this.props.getMaintenancePropertyList(authToken, postData);
            }
        }).done();

    }

    onGetAgencySuccess(){

          if(this.props.newMaintenanceRequestReducer.agencyListResponse!=''){

            if(this.props.newMaintenanceRequestReducer.agencyListResponse.code==200){
                console.log('maintenance req=',JSON.stringify(this.props.newMaintenanceRequestReducer.agencyListResponse.data));
                if(this.props.newMaintenanceRequestReducer.agencyListResponse.data.length>0){
                   
                    alert(String.ERROR_CREATE_MAINTENANCE_MESSAGE);
                    Actions.pop();
                }
                else{

                    this.setState({agencyData:this.preparePropertyData(this.props.newMaintenanceRequestReducer.agencyListResponse.data)});            
                    this.callGetTradersOptionRequest();
                }
               

            }   
            else{

                alert(this.props.newMaintenanceRequestReducer.agencyListResponse.message);
            }
            this.props.resetState();
        }
    }

    callGetWatcherList() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                console.log('get wather agency id= ',userData.data.agency_id);
                if(userData.data.agency_id!=undefined&&userData.data.agency_id!=''&&userData.data.agency_id!=null){
                    this.props.showLoading();
                    this.props.getWatherList(authToken, userData.data.agency_id);
                }
               
            }
        }).done();
    }


    onGetWatcherSuccess(){

          if(this.props.newMaintenanceRequestReducer.watcherListResponse!=''){

            if(this.props.newMaintenanceRequestReducer.watcherListResponse.code==200){

                this.setState({watcherData:this.props.newMaintenanceRequestReducer.watcherListResponse.data,watcherSearchedData:this.props.newMaintenanceRequestReducer.watcherListResponse.data});              
            }   
            else{
                
                alert(this.props.newMaintenanceRequestReducer.watcherListResponse.message);
            }
            this.props.resetState();
        }
    }

    callAddMaintenanceReqApi(){
        
         AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                if (value) {
                    var userData = JSON.parse(value);
                    var authToken=userData.token;
                   
                    var postData = {

                        created_by_role:userData.data.role_id,
                        agency_id:userData.data.agency_id,
                        trader_id:this.state.selectedTraderId,
                        property_id:this.state.selectedPropertyId,
                        request_overview: this.props.newMaintenanceRequestReducer.maintenanceRequestName,
                        created_by: userData.data._id,
                        request_detail:this.props.newMaintenanceRequestReducer.reqDetail,
                        budget: parseInt(this.props.newMaintenanceRequestReducer.maintenanceBudget),
                        due_date: Moment(this.state.date).format(),
                        images:uploadedImagesPath,
                        watchersList:[]

                    };       
                    console.log('add mentenaceReq post data== ',JSON.stringify(postData));
                    this.props.showLoading();
                    this.props.addMaintenanceReq(authToken,postData);
                }
            }).done();    
        
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

    onTraderNameChange(text){

        this.props.tradersChanged(text);
        this.setState({isTraderListShow:true});
        this.SearchFilterFunction(text);
    }  
    onWatcherNameChange(text){

        this.props.searchWatcherChanged(text);
        this.setState({isSearchWatcherListShow:true});
        this.SearchWatcherFunction(text);
    }

    showTraderList(){

        if(this.state.isTraderListShow==false){
            this.setState({isTraderListShow:true});
        }
        else{
             this.setState({isTraderListShow:false});
        }
    }   

    showSearchWatcherList(){

        if(this.state.isSearchWatcherListShow==false){
            
            this.setState({isSearchWatcherListShow:true});
        }
        else{

            this.setState({isSearchWatcherListShow:false});
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
                        this.props.showLoading();
                        this.props.uploadMaintenaceImage(authToken, response.uri.replace("file://", ""));
                    }
                }).done();

            }

        });
    }

    onUploadImageSuccess() {

        if (this.props.newMaintenanceRequestReducer.imageUploadRes != '') {
            if (this.props.newMaintenanceRequestReducer.imageUploadRes.code == 200) {
                var imagePath = {
                    path: this.props.newMaintenanceRequestReducer.imageUploadRes.data
                }
                uploadedImagesPath.push(imagePath);
            }
            else {
                alert(this.props.newMaintenanceRequestReducer.imageUploadRes.message);
            }
            this.props.clearUploadedImageRes();
        }
    }

    onAddMaintenanceReqSuccess() {

        if (this.props.newMaintenanceRequestReducer.addPropertyRes != '') {
            if (this.props.newMaintenanceRequestReducer.addPropertyRes.code == 200) {

                Actions.pop();
            }
            else {

                alert(this.props.newMaintenanceRequestReducer.addPropertyRes.message);
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
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.NEW_REQUEST}</Text>
                <TouchableOpacity onPress={() => this.closeAddProperty()} style={CommonStyles.navRightImageView}>
                    <View>
                        <Image source={ImagePath.DRAWER_CROSS_ICON} />
                    </View>
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



    searchRenderItem({ item, index }) {
        console.log('watcher image= ',API.USER_IMAGE_PATH+item.image);
        return (

            <View style={NewMaintenanceRequestScreenStyle.serachListItemContainer} >
                <Image source={{ uri: API.USER_IMAGE_PATH+item.image }} style={NewMaintenanceRequestScreenStyle.searchListItemImageStyle} />
                <Text style={NewMaintenanceRequestScreenStyle.searchListItemTextStyle}>{item.firstname+' '+item.lastname}</Text>
                <Image source={ImagePath.DRAWER_CROSS_ICON} style={NewMaintenanceRequestScreenStyle.searchListItemCloseImageStyle} />
            </View>
        );
    }

    onTraderSelect(item){

        this.showTraderList();
        this.props.tradersChanged(item.name);
        this.setState({selectedTraderId:item._id});

    }
    onWatcherSelect(item){

        this.showSearchWatcherList();
        this.props.searchWatcherChanged('');
        this.state.selectedWatcherData.push(item);
    }

    searchTradersItem({ item, index }) {

        return (

            <TouchableOpacity onPress={ contextRef.onTraderSelect.bind(contextRef,item)}>         
                <Text style={NewMaintenanceRequestScreenStyle.searchTraderListItemTextStyle}>{item.name}</Text>      
            </TouchableOpacity>
        );
    }   

    renderSearchWatcherItem({ item, index }) {

        return (

            <TouchableOpacity onPress={ contextRef.onWatcherSelect.bind(contextRef,item)}>         
                <Text style={NewMaintenanceRequestScreenStyle.searchTraderListItemTextStyle}>{item.firstname+' '+item.lastname}</Text>      
            </TouchableOpacity>
        );
    }

    renderItem({ item, index }) {

        return (
            <TouchableOpacity onPress={() => contextRef.uploadImageListSelection(index)}>
                <View style={NewMaintenanceRequestScreenStyle.uploadImageListItemStyle}>
                    <Image source={item.url} style={NewMaintenanceRequestScreenStyle.uploadPropertyListImageStyle} />
                </View>
                {
                    item.isSelected == 1 ? <View style={NewMaintenanceRequestScreenStyle.selectedImageStyle}>
                        <View style={NewMaintenanceRequestScreenStyle.roundedBlueFeaturedButtonStyle}>
                            <Text style={NewMaintenanceRequestScreenStyle.featuredTextStyle}>
                                {Strings.FEATURED}
                            </Text>
                        </View>
                    </View> : null
                }
            </TouchableOpacity>
        );
    }

    SearchFilterFunction(text){
     
         const newData = this.state.tradersData.filter(function(item){
             const itemData = item.name.toUpperCase()
             const textData = text.toUpperCase()
             return itemData.indexOf(textData) > -1
         })
         this.setState({
             tradersSearchedData: newData,
         })
    }   

    SearchWatcherFunction(text){
     
        
         const newData = this.state.watcherData.filter(function(item){
             console.log('watcher data in search== ',JSON.stringify( item));
             const itemData = item.firstname.toUpperCase()
             const textData = text.toUpperCase()
             return itemData.indexOf(textData) > -1
         })
         this.setState({
             watcherSearchedData: newData,
         })
    }

    render() {

       
        return (
            <View style={NewMaintenanceRequestScreenStyle.mainContainer}>
                {this.navBar()}


                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={NewMaintenanceRequestScreenStyle.scrollViewContainerStyle}>


                    <View style={NewMaintenanceRequestScreenStyle.addPropertyInputContainer}>

                        <Text style={NewMaintenanceRequestScreenStyle.labelStyle}>
                            {Strings.SELECT_PROPERTY}
                        </Text>
                        <Dropdown
                            ref='ref_property'
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            itemTextStyle={NewMaintenanceRequestScreenStyle.dropDownTextStyle}
                            containerStyle={NewMaintenanceRequestScreenStyle.dropDownViewStyle}
                            data={this.state.agencyData}
                            onChangeText={this.onPropertySelectChange.bind(this)}
                            value={this.props.newMaintenanceRequestReducer.propertyName}
                        />
                        <View style={NewMaintenanceRequestScreenStyle.labelContainerStyle}>
                            <Text style={NewMaintenanceRequestScreenStyle.labelStyle}>
                                {Strings.SEARCH_TRADERS}
                            </Text>

                            <Text style={NewMaintenanceRequestScreenStyle.pickSavedTradersLabelStyle}>
                                {Strings.PICK_FROM_SAVED_TRADERS}
                            </Text>
                        </View>

                        <View style={NewMaintenanceRequestScreenStyle.searchViewStyle}>
                            <TextInput
                                autoCapitalize='none'
                                autoCorrect={false}                      
                                placeholder={Strings.SEARCH_TRADERS}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={NewMaintenanceRequestScreenStyle.searchTextInputStyle} 
                                onChangeText={this.onTraderNameChange.bind(this)}
                                value={this.props.newMaintenanceRequestReducer.traderName}
                                onSubmitEditing={(event)=>{this.refs.refReqName.focus();}}
                                />
                            <Image source={ImagePath.SEARCH_ICON} style={NewMaintenanceRequestScreenStyle.searchImageStyle} />
                        </View>
                        {   
                            (this.state.isTraderListShow==true)?
                                
                                    
                                        <FlatList
                                            style={NewMaintenanceRequestScreenStyle.modalContainerStyles}
                                            horizontal={false}
                                            data={this.state.tradersSearchedData}
                                            renderItem={this.searchTradersItem}
                                            extraData={this.state}
                                        />
                                        :null
                        }
                        

                        <Text style={NewMaintenanceRequestScreenStyle.labelStyle}>
                            {Strings.REQUEST_NAME}
                        </Text>
                          <View style={NewMaintenanceRequestScreenStyle.searchViewStyle}>
                                <TextInput
                                    ref='refReqName'
                                    autoCapitalize='none'
                                    autoCorrect={false}                      
                                    underlineColorAndroid={Colors.TRANSPARENT}
                                    style={NewMaintenanceRequestScreenStyle.searchTextInputStyle} 
                                    onChangeText={this.onRequestNameChange.bind(this)}
                                    value={this.props.newMaintenanceRequestReducer.maintenanceRequestName}
                                    onSubmitEditing={(event)=>{this.refs.refBudget.focus();}}
                                    />
                            </View>
                        <Text style={NewMaintenanceRequestScreenStyle.labelStyle}>
                            {Strings.BUDGET_LABEL}
                        </Text>
                            <View style={NewMaintenanceRequestScreenStyle.searchViewStyle}>
                                <TextInput
                                    ref='refBudget'
                                    autoCapitalize='none'
                                    autoCorrect={false}                      
                                    underlineColorAndroid={Colors.TRANSPARENT}
                                    style={NewMaintenanceRequestScreenStyle.searchTextInputStyle} 
                                    onChangeText={this.onBudgetChange.bind(this)}
                                    value={this.props.newMaintenanceRequestReducer.maintenanceBudget}
                                    onSubmitEditing={(event)=>{this.refs.refReqDetail.focus();}}
                                    />
                            </View>

                        <Text style={NewMaintenanceRequestScreenStyle.labelStyle}>
                            {Strings.DUE_DATE}
                        </Text>
                         <View style={NewMaintenanceRequestScreenStyle.searchViewStyle}>
                            <DatePicker
                                style={NewMaintenanceRequestScreenStyle.datePickerStyle}
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
                        <Text style={NewMaintenanceRequestScreenStyle.labelStyle}>
                            {Strings.REQUEST_DETAILS}
                        </Text>
                        <TextInput 
                            ref='refReqDetail'
                            style={NewMaintenanceRequestScreenStyle.inputDescriptionTextStyle}
                            multiline={true}
                            onChangeText={this.onReqDetailChange.bind(this)}
                            value={this.props.newMaintenanceRequestReducer.reqDetail}
                            onSubmitEditing={(event)=>{this.refs.refWatcher.focus();}}
                        />

                        <Text style={NewMaintenanceRequestScreenStyle.labelStyle}>
                            {Strings.TAG_WATCHER_FOR_REQUEST}
                        </Text>

                        <View style={NewMaintenanceRequestScreenStyle.searchViewStyle}>
                            <TextInput
                                ref='refWatcher'
                                placeholder={Strings.SEARCH}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={NewMaintenanceRequestScreenStyle.searchTextInputStyle}
                                onChangeText={this.onWatcherNameChange.bind(this)}
                                value={this.props.newMaintenanceRequestReducer.searchWatcherName}
                                 />
                            <Image source={ImagePath.SEARCH_ICON} style={NewMaintenanceRequestScreenStyle.searchImageStyle} />
                        </View>

                        {   
                            (this.state.isSearchWatcherListShow==true)?
                                
                                    
                                        <FlatList
                                            style={NewMaintenanceRequestScreenStyle.watcherListContainerStyles}
                                            horizontal={false}
                                            data={this.state.watcherSearchedData}
                                            renderItem={this.renderSearchWatcherItem}
                                            extraData={this.state}
                                        />
                                        :null
                        }
                        <FlatList
                            horizontal={false}
                            numColumns={2}
                            data={this.state.selectedWatcherData}
                            renderItem={this.searchRenderItem}
                            extraData={this.state}
                        />
                    </View>

                    <View>

                        <View style={NewMaintenanceRequestScreenStyle.uploadImageListContainerView}>
                            <Text style={NewMaintenanceRequestScreenStyle.maxImageTextStyle}>{Strings.MAX_IMAGE_LIMIT}</Text>
                            {
                                this.state.selectedImage != ''
                                    ?
                                    <Image source={this.state.selectedImage} style={NewMaintenanceRequestScreenStyle.uploadPropertyImageStyle} />
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
                            <TouchableOpacity style={NewMaintenanceRequestScreenStyle.uploadImageButtonStyle} onPress={() => this.showActionSheet()}  >
                                <View >
                                    <Text style={NewMaintenanceRequestScreenStyle.uploadButtonTextStyle}>
                                        {Strings.UPLOAD_IMAGE}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>



                </KeyboardAwareScrollView>
              

              
                <View style={NewMaintenanceRequestScreenStyle.buttonContainerStyle}>

                    <TouchableOpacity onPress={() => this.callAddMaintenanceReqApi()}>
                        <View style={NewMaintenanceRequestScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={NewMaintenanceRequestScreenStyle.proceedButtonTextStyle}>
                                {Strings.SUBMIT_REQUEST}
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


                        this.props.newMaintenanceRequestReducer.isScreenLoading ?
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
    console.log('new request screen mapStateToProps= ', JSON.stringify(state));
    return {
        newMaintenanceRequestReducer: state.newMaintenanceRequestReducer
    }
}

export default connect(
    mapStateToProps,
    {   

        clearUploadedImageRes,
        addMaintenanceReq,
        maintenanceReqDetailChanged,
        maintenanceReqNameChanged,
        propertyNameChanged,
        maintenanceBudgetChanged,
        uploadMaintenaceImage,
        searchWatcherChanged,
        getWatherList,
        tradersChanged,
        getMaintenancePropertyList,
        getTradersOptionList,
        showLoading,
        resetState,
    }

)(NewMaintenanceRequestScreen);


