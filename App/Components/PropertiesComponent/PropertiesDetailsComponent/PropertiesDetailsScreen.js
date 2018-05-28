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
    AsyncStorage,
    Modal,
    Dimensions
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import PropertiesDetailsScreenStyle from './PropertiesDetailsScreenStyle';
import listData from '../../../../data';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import { CardView } from '../../CommonComponent/CardView';
import Moment from 'moment';
import {
    getUserReviewsList,
    getMaintenaceHistory,
    getAgreementOfProperty,
    getTenanciesHistory,
    getPropertyDetail,
} from "../../../Action/ActionCreators";
import {

    showLoading,
    resetState,
} from "./PropertyDetailAction";
import API from '../../../Constants/APIUrls';
import StarRating from 'react-native-star-rating';

import MapView from 'react-native-maps';
let ref;
const window = Dimensions.get('window');

class PropertiesDetailsScreen extends Component {
    constructor() {
        super();
        ref = this;
        this.state = {
                propertyDetailData:{},
                propertyAgreementData:'',
                tenanciesListData:[],
                maintenanceHistoryData:[],
                starCount: 3.5, 
                isShowMore:false,
                isShowPopup:false,
                isShowMoreAmenities:false,
                userReviewData: {},
               
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {

        this.onGetPropertySuccess();
        this.onGetTenanciesHistorySuccess();
        this.onGetPropertyAgreementSuccess();
        this.onGetMaintenaceHistorySuccess();
        this.onGetUserRatingSuccess();
    }

    componentWillUnmount() {

    } 

    componentWillMount() {

        this.callGetPropertyDetail();
        this.callGetPropertyAgreement();
        this.callGetMaintenanceHistory();
    }

    CallBack() {

        Actions.pop();
    }

   
    callGetUserRating(userId) {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                console.log("**************postdata*****");
                console.log('Log', authToken +'=== '+ userId);
                this.props.showLoading();
                this.props.getUserReviewsList(authToken, userId);
            }
        }).done();

    }

    onGetUserRatingSuccess() {

        if (this.props.propertyDetailReducer.userReviewRes != '') {
            if (this.props.propertyDetailReducer.userReviewRes.code == 200) {
                console.log("Review data property detail>>>>" + JSON.stringify(this.props.propertyDetailReducer.userReviewRes));
                this.setState({ userReviewData: this.props.propertyDetailReducer.userReviewRes });
                this.callGetTenanciesHistory();
            }
            else {
                // alert(this.props.profileReducer.userReviewRes.message);
            }
            this.props.resetState();
        }
    }


    callGetPropertyDetail(){

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                   
                    propertyId: this.props.propertyId,
                }
                this.props.showLoading();
                this.props.getPropertyDetail(authToken, postData);
            }
        }).done();

   

    }

    callGetMaintenanceHistory(){

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                this.props.showLoading();
                this.props.getMaintenaceHistory(authToken, this.props.propertyId);
            }
        }).done();
    }

    onGetMaintenaceHistorySuccess(){

        if(this.props.propertyDetailReducer.maintenanceHistoryRes!=''){

            if(this.props.propertyDetailReducer.maintenanceHistoryRes.code==200){
                
                this.setState({maintenanceHistoryData:this.props.propertyDetailReducer.maintenanceHistoryRes.data});
               
            }
            else{
                
                alert(this.props.propertyDetailReducer.maintenanceHistoryRes.message);
            }
            this.props.resetState();
        }
    }

    callGetPropertyAgreement(){

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                this.props.showLoading();
                this.props.getAgreementOfProperty(authToken, this.props.propertyId);
            }
        }).done();
    }

    onGetPropertyAgreementSuccess(){

        if(this.props.propertyDetailReducer.propertyAgreementRes!=''&&this.props.propertyDetailReducer.propertyAgreementRes!=null){

            if(this.props.propertyDetailReducer.propertyAgreementRes.code==200){
                
                if(this.props.propertyDetailReducer.propertyAgreementRes.data!=null){
                    this.setState({propertyAgreementData:this.props.propertyDetailReducer.propertyAgreementRes.data});
                }
                
            }
            else{
                
                alert(this.props.propertyDetailReducer.propertyAgreementRes.message);
            }
            this.props.resetState();
        }
    }


    callGetTenanciesHistory(){

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                this.props.showLoading();
                this.props.getTenanciesHistory(authToken, this.props.propertyId);
            }
        }).done();
    }

    onGetTenanciesHistorySuccess(){

        if(this.props.propertyDetailReducer.tenanciesHistoryRes!=''){

            if(this.props.propertyDetailReducer.tenanciesHistoryRes.code==200){
                
                this.setState({tenanciesListData:this.props.propertyDetailReducer.tenanciesHistoryRes.data});
            }
            else{
                
                alert(this.props.propertyDetailReducer.tenanciesHistoryRes.message);
            }
            this.props.resetState();
        }
    }

    onGetPropertySuccess(){

        if(this.props.propertyDetailReducer.propertyDetailResponse!=''){

            if(this.props.propertyDetailReducer.propertyDetailResponse.code==200){
                
                this.setState({propertyDetailData:this.props.propertyDetailReducer.propertyDetailResponse});
                
                var proertyRes=this.props.propertyDetailReducer.propertyDetailResponse.data;
                console.log('property detail in success= ',JSON.stringify(proertyRes));
                this.callGetUserRating(proertyRes[0].created_by._id);
               
            }
            else{
                
                alert(this.props.propertyDetailReducer.propertyDetailResponse.message);
            }
            this.props.resetState();
        }
    }

    renderImageItem(item, index) {

        return (
            <Image source={{ uri: item.url }} style={PropertiesDetailsScreenStyle.userListImageStyle} />
        );
    }



    amenitiesRenderItem({ item, index }) {

        if(ref.state.isShowMoreAmenities == true){
            if(item.is_checked){
                return(
                    <View style={PropertiesDetailsScreenStyle.amentiesListItemContainer}>
                    
                        <Image source={ImagePath.AMENITIES_CHECK_ICON} />
                        <Text style={PropertiesDetailsScreenStyle.amenitiesTextStyle}>{item.amenity_name}</Text>
                    
                    </View>
                );
            }
            else{

                return(null);
            }
          
        }
        else{
           
            if(index<5){
                if(item.is_checked){
                    return(
                        <View style={PropertiesDetailsScreenStyle.amentiesListItemContainer}>
                        
                            <Image source={ImagePath.AMENITIES_CHECK_ICON} />
                            <Text style={PropertiesDetailsScreenStyle.amenitiesTextStyle}>{item.amenity_name}</Text>
                        
                        </View>
                    );
                }else{
                    return(null);
                }
            }
            else{
                return(null);
            }
            
        }

        
    }

    tenanciesHistoryRenderItem({ item, index }) {

        return (

            <View>
                <CardView>

                    <View style={PropertiesDetailsScreenStyle.dateContainerStyle}>
                        <Image source={ImagePath.DATE_ICON} style={PropertiesDetailsScreenStyle.dateImageStyle} />
                        <Text style={PropertiesDetailsScreenStyle.dateTextStyle}>
                            {Moment(item.case_validity).format(Strings.DATE_FORMATE)}
                        </Text>
                    </View>

                    <View style={PropertiesDetailsScreenStyle.tenantsTitleViewStyle}>
                        <Text style={PropertiesDetailsScreenStyle.tenantsTitleTextStyle}>{(item.property_id?item.property_id.address:'')+' : '+'Agreement #'+item.agreement_id}</Text>
                    </View>
                    <View style={PropertiesDetailsScreenStyle.tenantsSubTitleViewStyle}>
                        <Text style={PropertiesDetailsScreenStyle.tenantsSubTitleTextStyle}>{item.address_service_notice1}</Text>
                    </View>

                    <View style={PropertiesDetailsScreenStyle.imageListMainContainerStyle}>
                        <View>
                            <Image source={ImagePath.USER_DEFAULT} style={PropertiesDetailsScreenStyle.apartmentUserImageStyle} />
                        </View>

                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={PropertiesDetailsScreenStyle.imageListContainerStyle}>
                                {
                                    listData.map((data, index) => {
                                        return ref.renderImageItem(data, index);
                                    })
                                }
                            </View>
                        </ScrollView>

                    </View>

                    <View style={PropertiesDetailsScreenStyle.tenantsInfoContainerViewStyle}>

                        <View style={PropertiesDetailsScreenStyle.propertyBedroomViewContainer}>
                            <Image source={ImagePath.DOLLAR_ICON} />
                            <Text style={PropertiesDetailsScreenStyle.propertyValueTextStyle}>{item.rent_price}</Text>
                        </View>
                        <View style={PropertiesDetailsScreenStyle.propertyWashrooViewContainer}>
                            <Image source={ImagePath.CALENDAR_ICON} />
                            <Text style={PropertiesDetailsScreenStyle.propertyValueTextStyle}>{Moment(item.tenancy_start_date).format(Strings.DATE_FORMATE)}</Text>
                        </View>
                        <View style={PropertiesDetailsScreenStyle.propertyWashrooViewContainer}>
                            <Image source={ImagePath.SEARCH_ICON} />
                            <Text style={PropertiesDetailsScreenStyle.propertyValueTextStyle}>{item.terms} times</Text>
                        </View>

                    </View>

                </CardView>
            </View>
        );
    }


    maintenanceHistoryRenderItem({ item, index }) {

        var userImage=item.created_by?(item.created_by.image?API.USER_IMAGE_PATH+item.created_by.image:''):'';
        return (
            <View style={PropertiesDetailsScreenStyle.maintenanceHistoryListContainerStyle}>
                <CardView>
                    <View style={PropertiesDetailsScreenStyle.propertiesTitleContainerStyle}>
                        <View style={PropertiesDetailsScreenStyle.propertyRatingContainerStyle}>

                            <View style={PropertiesDetailsScreenStyle.userImageContainerStyle}>
                                {
                                    userImage!=''?
                                    <Image source={{uri:userImage}} style={PropertiesDetailsScreenStyle.userImageStyle} />
                                    :
                                    <Image source={ImagePath.USER_DEFAULT} style={PropertiesDetailsScreenStyle.userImageStyle} />
                                }
                            </View>

                            <View>
                                <Text style={PropertiesDetailsScreenStyle.maintenanceHistoryListTitleTextStyle}>{item.request_overview}</Text>
                                <View style={PropertiesDetailsScreenStyle.maintenanceHistoryListInfoContainerStyle}>
                                    <Image source={ImagePath.PROPERTY_ID_ICON} style={PropertiesDetailsScreenStyle.propertyIdImageStyle} />
                                    <Text style={PropertiesDetailsScreenStyle.propertyIdTextStyle}>Property Id : {item.request_id}</Text>
                                </View>
                                <View style={PropertiesDetailsScreenStyle.maintenanceHistoryListInfoContainerStyle}>
                                    <Image source={ImagePath.HASHTAG_ICON} style={PropertiesDetailsScreenStyle.propertyIdImageStyle} />
                                    <Text style={PropertiesDetailsScreenStyle.propertyIdTextStyle}>{item.created_by?item.created_by.firstname+' '+item.created_by.lastname:''}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                </CardView>
            </View>
        );
    }



    navBar() {

        return (
            <View style={PropertiesDetailsScreenStyle.profileHeaderContainer}>
                <TouchableOpacity onPress={() => this.CallBack()} style={{ marginLeft: 20 }}>
                    <View>
                        <Image source={ImagePath.BACK_WHITE} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    showHidePropertyDetailText(){

        if(this.state.isShowMore==false){
            
            this.setState({isShowMore:true});
        }
        else{
            
            this.setState({isShowMore:false});
        }
        
    }

    showHideAmenities(){
        // if(this.state.isShowMoreAmenities==false){
        //     this.setState({isShowMoreAmenities:true});
        // }
        // else{
        //     this.setState({isShowMoreAmenities:false});
        // }

        this.setState({isShowMoreAmenities:!this.state.isShowMoreAmenities});
    }

    callSendMessageScreen() {
        var userData=this.state.propertyDetailData.data?this.state.propertyDetailData.data[0].created_by:{};
        Actions.MessageToTraderScreen({userFirstName:userData.firstname,userLastName:userData.lastname,receiverId:userData._id});
    }

    showPopup(){

        if(this.state.isShowPopup==false){
            
            this.setState({isShowPopup:true});
        }
        else{

            this.setState({isShowPopup:false});
        }

    }
    
    onEditPropertyClick() {

        this.setState({isShowPopup:false});
        console.log("Property detail surabhi"+JSON.stringify(this.state.propertyDetailData));
        Actions.EditPropertyScreenStepOne({ propertyData: this.state.propertyDetailData });
    }

    render() {
        
        var images=this.state.propertyDetailData.data?(this.state.propertyDetailData.data.length>0?this.state.propertyDetailData.data[0].image:[]):[];
        var propertyImage   =  images.length > 0 ? API.PROPERTY_IMAGE_PATH + images[0].path : '';
        var propertyDesc    =  this.state.propertyDetailData.data?(this.state.propertyDetailData.data.length>0?this.state.propertyDetailData.data[0].description:''):'';
        var amenitiesData   =  this.state.propertyDetailData.data?(this.state.propertyDetailData.data.length>0?this.state.propertyDetailData.data[0].amenities:[]):[];  
        var isTownHouse     =  this.state.propertyDetailData.data?this.state.propertyDetailData.data[0].isTownHouse:false;
        var latitudeVal     =  this.state.propertyDetailData.data?this.state.propertyDetailData.data[0].latitude:0.0;
        var longitudeVal    =  this.state.propertyDetailData.data?this.state.propertyDetailData.data[0].longitude:0.0;
        var averagerate     = this.state.userReviewData.data ?  this.state.userReviewData.data : 0;
        var totalreviews    = this.state.userReviewData.total_review ? this.state.userReviewData.total_review : 0;
        var userData        =  this.state.propertyDetailData.data?this.state.propertyDetailData.data[0].created_by:{};
        var propertyIds     =  this.state.propertyDetailData.data?this.state.propertyDetailData.data[0].property_id:'';
        var userImg         =  userData.image?API.USER_IMAGE_PATH+userData.image:'';
        var firstName       =  userData.firstname?userData.firstname:'';
        var lastName        =  userData.lastname?userData.lastname:'';
        console.log('lat long= ',latitudeVal+' '+longitudeVal); 
        console.log('amenitiesdat'+JSON.stringify(amenitiesData));   
        return (
            <View>
                <ScrollView>
                    <View style={PropertiesDetailsScreenStyle.profileContainer}>
                        <View style={PropertiesDetailsScreenStyle.topCoverImageContainer}>
                            <Image source={{uri:propertyImage}} style={PropertiesDetailsScreenStyle.topCoverImageContainer} />
                            {this.navBar()}
                        </View>

                        <View style={PropertiesDetailsScreenStyle.propertiesTitleContainerStyle}>
                            <Text style={PropertiesDetailsScreenStyle.propertyTitleTextStyle}>
                            {this.state.propertyDetailData.data?(this.state.propertyDetailData.data.length>0?this.state.propertyDetailData.data[0].address:''):''}</Text>
                            <View style={PropertiesDetailsScreenStyle.propertyIdContainerStyle}>
                                <View style={PropertiesDetailsScreenStyle.propertyInofoContainerStyle}>
                                    <Image source={ImagePath.PROPERTY_ID_ICON} style={PropertiesDetailsScreenStyle.propertyIdImageStyle} />
                                    <Text style={PropertiesDetailsScreenStyle.propertyIdTextStyle}>Property Id : {propertyIds}</Text>
                                </View>
                                <View style={PropertiesDetailsScreenStyle.propertyInofoContainerStyle}>
                                    <Image source={ImagePath.USE_USER_ICON} style={PropertiesDetailsScreenStyle.propertyIdImageStyle} />
                                    <Text style={PropertiesDetailsScreenStyle.propertyIdTextStyle}>{this.state.propertyDetailData.data?(this.state.propertyDetailData.data.length>0?this.state.propertyDetailData.data[0].created_by.firstname +' '+this.state.propertyDetailData.data[0].created_by.lastname:''):''}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={PropertiesDetailsScreenStyle.propertyInfoContainerStyle}>
                            <View style={PropertiesDetailsScreenStyle.propertyInforRowContainerStyle}>
                                <Image source={ImagePath.MAP_MARKER}  />
                                <Text style={PropertiesDetailsScreenStyle.propertyInfoTextstyle}>
                                {this.state.propertyDetailData.data?this.state.propertyDetailData.data[0].address:''}</Text>
                            </View>
                            <View style={PropertiesDetailsScreenStyle.propertyInforRowContainerStyle}>
                                <Image source={ImagePath.BEDROOM_ICON} style={PropertiesDetailsScreenStyle.propertyImageStyle} />
                                <Text style={PropertiesDetailsScreenStyle.propertyInfoTextstyle}>{this.state.propertyDetailData.data?this.state.propertyDetailData.data[0].number_bedroom : 0 } Bedrooms</Text>
                            </View>
                            <View style={PropertiesDetailsScreenStyle.propertyInforRowContainerStyle}>
                                <Image source={ImagePath.BATHROOM_ICON} style={PropertiesDetailsScreenStyle.propertyImageStyle} />
                                <Text style={PropertiesDetailsScreenStyle.propertyInfoTextstyle}>{this.state.propertyDetailData.data?this.state.propertyDetailData.data[0].number_of_bathroom : 0 } Bathrooms</Text>
                            </View>
                            <View style={PropertiesDetailsScreenStyle.propertyInforRowContainerStyle}>
                                <Image source={ImagePath.GARAGE_ICON} style={PropertiesDetailsScreenStyle.propertyImageStyle} />
                                <Text style={PropertiesDetailsScreenStyle.propertyInfoTextstyle}>{this.state.propertyDetailData.data?this.state.propertyDetailData.data[0].number_of_parking : 0 } Carports</Text>
                            </View>
                            <View style={PropertiesDetailsScreenStyle.propertyInforRowContainerStyle}>
                                <Image source={ImagePath.BATHROOM_ICON} style={PropertiesDetailsScreenStyle.propertyImageStyle} />
                                <Text style={PropertiesDetailsScreenStyle.propertyInfoTextstyle}>{this.state.propertyDetailData.data?this.state.propertyDetailData.data[0].property_type:''}</Text>
                            </View>
                        </View>

                        <View style={PropertiesDetailsScreenStyle.propertiesTitleContainerStyle}>
                            <View style={PropertiesDetailsScreenStyle.propertyRatingContainerStyle}>
                                <View>
                                    <Text style={PropertiesDetailsScreenStyle.propertyTitleTextStyle}>{firstName+' '+lastName}</Text>
                                    <View style={{flexDirection:'row'}}>
                                    <StarRating
                                        disabled={true}
                                        maxStars={5}
                                        starSize={20}
                                        starStyle={{paddingRight:4,marginTop:8}}
                                        emptyStarColor={Colors.EMPTY_STAR_COLOR}
                                        starColor={Colors.STAR_COLOR}
                                        rating={averagerate}
                                       
                                    />
                                    </View>
                                    <Text style={PropertiesDetailsScreenStyle.propertyIdTextStyle}>{averagerate + ' ' + 'from' + ' ' + totalreviews + ' ' + 'reviews'}</Text>
                                </View>
                                <View style={PropertiesDetailsScreenStyle.userImageContainerStyle}>
                                    {
                                        userImg != '' ? <Image source={{uri:userImg}} style={PropertiesDetailsScreenStyle.userImageStyle} />
                                        :
                                        <View style={PropertiesDetailsScreenStyle.emptyUserListImageStyle}>
                                            <Text style={PropertiesDetailsScreenStyle.initialTextStyle}>{(firstName!=''?firstName.charAt(0).toUpperCase():'')+ ' ' + (lastName!=''?lastName.charAt(0).toUpperCase():'')}</Text>
                                        </View>
                                    }
                                    
                                    <View style={PropertiesDetailsScreenStyle.userStausView} />
                                </View>
                            </View>
                        </View>


                        <View style={PropertiesDetailsScreenStyle.optionViewContainer}>

                            <TouchableOpacity onPress={this.showPopup.bind(this)}>
                                <View style={PropertiesDetailsScreenStyle.optionViewStyle} >
                                    <Image source={ImagePath.THREE_DOTS_ICON} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        {
                            (this.state.isShowPopup)?

                                
                                    <Modal transparent >
                                        <TouchableOpacity onPress={this.showPopup.bind(this)} style={PropertiesDetailsScreenStyle.modalContainer}>
                                            <View style={{flex:1, justifyContent: 'center',
                                                alignItems: 'center'}}>
                                                <View style={PropertiesDetailsScreenStyle.modalContainerStyles}>
                                                    <TouchableOpacity onPress={() => this.onEditPropertyClick()} style={{marginTop:10,marginBottom:20}}>
                    
                                                        <View style={PropertiesDetailsScreenStyle.roundedBlueEditPropertyButtonStyle}>
                                                            <Text style={PropertiesDetailsScreenStyle.editPropertyButtonTextStyle}>
                                                                {Strings.EDIT_PROPERTY}
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    {
                                                        /*<TouchableOpacity >
                                                            <View style={PropertiesDetailsScreenStyle.roundedTransparentButtonStyle}>
                                                                <Text style={PropertiesDetailsScreenStyle.editPropertyButtonSkyBlueTextStyle}>
                                                                    {Strings.UPLOAD_DOCUMENTS}
                                                                </Text>
                                                            </View>
                                                        </TouchableOpacity>*/
                                                    }
                                                    {
                                                        /*<TouchableOpacity style={{marginBottom:20}}>
                                                            <View style={PropertiesDetailsScreenStyle.roundedTransparentButtonStyle}>
                                                                <Text style={PropertiesDetailsScreenStyle.editPropertyButtonSkyBlueTextStyle}>
                                                                    {Strings.GENERATE_REPORTS}
                                                                </Text>
                                                            </View>
                                                        </TouchableOpacity>*/
                                                    }   
                                                    
                                                   

                                                </View>
                                            </View>
                                        </TouchableOpacity>   
                                    </Modal>
                                           
                               
                            :null
                        }
                        {
                            console.log('agreement data==',JSON.stringify(this.state.propertyAgreementData))
                        }
                        {

                            this.state.propertyAgreementData!=''?
                            <View>
                                <CardView>

                                    <View style={PropertiesDetailsScreenStyle.dateContainerStyle}>
                                        <Image source={ImagePath.DATE_ICON} style={PropertiesDetailsScreenStyle.dateImageStyle} />
                                        <Text style={PropertiesDetailsScreenStyle.dateTextStyle}>
                                            {Moment(this.state.propertyAgreementData.case_validity).format(Strings.DATE_FORMATE)}
                    
                                    </Text>
                                    </View>

                                    <View style={PropertiesDetailsScreenStyle.tenantsTitleViewStyle}>
                                        <Text style={PropertiesDetailsScreenStyle.tenantsTitleTextStyle}>{(this.state.propertyAgreementData.property_id?this.state.propertyAgreementData.property_id.address:'')+' : '+'Agreement #'+this.state.propertyAgreementData.agreement_id}</Text>
                                    </View>
                                    <View style={PropertiesDetailsScreenStyle.tenantsSubTitleViewStyle}>
                                        <Text style={PropertiesDetailsScreenStyle.tenantsSubTitleTextStyle}>{this.state.propertyAgreementData.address_service_notice1}</Text>
                                    </View>

                                    <View style={PropertiesDetailsScreenStyle.imageListMainContainerStyle}>
                                        <View>
                                            <Image source={ImagePath.USER_DEFAULT} style={PropertiesDetailsScreenStyle.apartmentUserImageStyle} />
                                        </View>

                                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                            <View style={PropertiesDetailsScreenStyle.imageListContainerStyle}>
                                                {
                                                    listData.map((data, index) => {

                                                        return ref.renderImageItem(data, index);
                                                    })
                                                }
                                            </View>
                                        </ScrollView>

                                    </View>

                                    <View style={PropertiesDetailsScreenStyle.tenantsInfoContainerViewStyle}>

                                        <View style={PropertiesDetailsScreenStyle.propertyBedroomViewContainer}>
                                            <Image source={ImagePath.DOLLAR_ICON} />
                                            <Text style={PropertiesDetailsScreenStyle.propertyValueTextStyle}>{this.state.propertyAgreementData.rent_price}</Text>
                                        </View>
                                        <View style={PropertiesDetailsScreenStyle.propertyWashrooViewContainer}>
                                            <Image source={ImagePath.CALENDAR_ICON} />
                                            <Text style={PropertiesDetailsScreenStyle.propertyValueTextStyle}>{Moment(this.state.propertyAgreementData.tenancy_start_date).format(Strings.DATE_FORMATE)}</Text>
                                        </View>
                                        <View style={PropertiesDetailsScreenStyle.propertyWashrooViewContainer}>
                                            <Image source={ImagePath.SEARCH_ICON} />
                                            <Text style={PropertiesDetailsScreenStyle.propertyValueTextStyle}>{this.state.propertyAgreementData.terms} times</Text>
                                        </View>

                                    </View>

                                </CardView>
                            </View>:null

                        }
                        
                        <View>
                            <CardView>
                                <Text style={PropertiesDetailsScreenStyle.amentiesTitleTextStyle}>Aminities</Text>

                                <FlatList
                                    data={amenitiesData}
                                    renderItem={this.amenitiesRenderItem}
                                    extraData={this.state}
                                />
                                {
                                    amenitiesData.length<=5?null:
                                    <TouchableOpacity onPress={this.showHideAmenities.bind(this)}>
                                        <Text style={PropertiesDetailsScreenStyle.loadMoreAmenitiesTextStyle}>
                                            {(this.state.isShowMoreAmenities==false)?'Show more':'Show less'}
                                        </Text>
                                    </TouchableOpacity>
                                }
                                <Text style={PropertiesDetailsScreenStyle.loadMoreAmenitiesTextStyle}></Text>
                            </CardView>
                        </View>

                        <View>
                            <CardView>
                                <Text style={PropertiesDetailsScreenStyle.amentiesTitleTextStyle}>About this property</Text>
                                <Text numberOfLines={(this.state.isShowMore==false)?6:null} style={PropertiesDetailsScreenStyle.aboutPropertyDetailTextStyle}>{propertyDesc}</Text>
                                <TouchableOpacity onPress={this.showHidePropertyDetailText.bind(this)}>
                                    <Text style={PropertiesDetailsScreenStyle.loadMoreAmenitiesTextStyle}>
                                        {propertyDesc.length>150?(this.state.isShowMore==false)?'Show more':'Show less':null}
                                    </Text>
                                </TouchableOpacity>
                            </CardView>
                        </View>

                        <View style={{backgroundColor:Colors.WHITE ,width:window.width}}>
                             <Text style={[PropertiesDetailsScreenStyle.amentiesTitleTextStyle,{paddingBottom:20}]}>Map and location</Text>
                        </View>
                        
                        <View style={{width:window.width,height:window.height*0.4}}>
                               
                                {
                                    latitudeVal!=0&&longitudeVal!=0?
                                    <MapView
                                        style={{position: 'absolute', top: 20, bottom: 20, left: 0, right: 0, width: window.width, height: window.height*0.4}}
                                        initialRegion={{
                                            latitude: latitudeVal,
                                            longitude: longitudeVal,
                                            latitudeDelta: 0.4,
                                            longitudeDelta: 0.4,
                                        }}
                                    >
                                    </MapView>:null
                                }
                                

                        </View>
                      


                        <View style={{marginTop:20}}>
                            <CardView>
                                <Text style={PropertiesDetailsScreenStyle.amentiesTitleTextStyle}>History of tenancies</Text>

                                <FlatList
                                    data={this.state.tenanciesListData}
                                    renderItem={this.tenanciesHistoryRenderItem}
                                    extraData={this.state}
                                />
                            </CardView>
                        </View>


                        <View>
                            <CardView>
                                <Text style={PropertiesDetailsScreenStyle.amentiesTitleTextStyle}>History of maintenance</Text>

                                <FlatList contentContainerStyle={PropertiesDetailsScreenStyle.maintenanceHistoryListStyle}                           
                                    data={this.state.maintenanceHistoryData}
                                    renderItem={this.maintenanceHistoryRenderItem}
                                    extraData={this.state}
                                />
                            </CardView>
                        </View>

                    </View>
                </ScrollView >
                <View style={PropertiesDetailsScreenStyle.buttonContainerStyle}>
                    <TouchableOpacity onPress={this.callSendMessageScreen.bind(this)}>
                        <View style={PropertiesDetailsScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={PropertiesDetailsScreenStyle.proceedButtonTextStyle}>
                                {Strings.CONTACT_AGENT}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity >
                        <View style={PropertiesDetailsScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={PropertiesDetailsScreenStyle.proceedButtonTextStyle}>
                                {Strings.APPLY_WITH_YOUR_SYNCPROFILE}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    console.log('property detail mapStateToProps= ', JSON.stringify(state));
    return {
        propertyDetailReducer: state.propertyDetailReducer
    }
}

export default connect(
    mapStateToProps,
    {   
        getUserReviewsList,
        getMaintenaceHistory,
        getAgreementOfProperty,
        getPropertyDetail,
        showLoading,
        resetState,
        getTenanciesHistory
    }

)(PropertiesDetailsScreen);


