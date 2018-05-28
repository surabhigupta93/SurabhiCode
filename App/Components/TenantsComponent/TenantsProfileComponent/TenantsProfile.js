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
    getAgreementForTenantProfile,
    addUserToFav,
    getTenantProfile,
} from "../../../Action/ActionCreators";
import {

    showLoading,
    resetState,
} from "../TenantScreenAction";

import { Actions } from 'react-native-router-flux';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import TenantsProfileStyle from './TenantsProfileStyle';
import listData from '../../../../data';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import { CardView } from '../../CommonComponent/CardView';
import StarRating from 'react-native-star-rating';
import { Dropdown } from 'react-native-material-dropdown';
import ReviewAndRatingScreen from '../../ProfileComponent/ReviewAndRatingScreen';
import API from '../../../Constants/APIUrls';
import Moment from 'moment';
let ref;

class TenantsProfile extends Component {
    constructor() {
        super();
        ref = this;
        this.state = {
            starCount: 0,
            profileData: {},
            tenantId: '',
            agreementData:{},
            averageRate: 0,
            totalreviews: 0
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onGetProfileSuccess();
        this.onGetTenantAgreementSuccess();
    }

    componentWillUnmount() {

    }

    componentWillMount() {

        this.setState({ tenantId: this.props.user_id });
        this.setState({ averageRate: this.props.averageRating });
        this.setState({ totalreviews: this.props.totalReviewLengthrating });
        this.callGetTenantProfile();
      
    }

    closeNotifications() {
        Actions.popTo('Dashboard');
    }


    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }

    callSendMessageScreen() {

        Actions.MessageToTraderScreen({ userFirstName: this.state.profileData.firstname, userLastName: this.state.profileData.lastname, receiverId: this.state.profileData._id });
    }

    renderImageItem(item, index) {
        return (
            <Image source={{ uri: item.url }} style={TenantsProfileStyle.userListImageStyle} />
        );
    }

    callAddAsFav(favStatus) {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData ={
                    fav_by: userData.data._id, 
                    fav_to: this.props.user_id,
                    fav_status: favStatus
                }
                this.props.showLoading();
                this.props.addUserToFav(authToken, postData);
            }
        }).done();

    }

    callGetTenantAgreements() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                this.props.showLoading();
                console.log('get tenant agreement= ',this.props.user_id);
                this.props.getAgreementForTenantProfile(authToken, this.props.user_id);
            }
        }).done();

    }
    onGetTenantAgreementSuccess() {
        if (this.props.tenantScreenReducer.tenantAgreementRes != '') {
            if (this.props.tenantScreenReducer.tenantAgreementRes.code == 200) {
                
                this.setState({ agreementData: this.props.tenantScreenReducer.tenantAgreementRes.data.length>0?this.props.tenantScreenReducer.tenantAgreementRes.data[0]:{} });
               
            }
            else {
                alert(this.props.tenantScreenReducer.tenantAgreementRes.message);
            }
            this.props.resetState();
        }
    }
    
    callGetTenantProfile() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {

                    userId: this.props.user_id,
                }
                this.props.showLoading();
                this.props.getTenantProfile(authToken, postData);
            }
        }).done();

    }

    onGetProfileSuccess() {
        if (this.props.tenantScreenReducer.tenantProfileRes != '') {
            if (this.props.tenantScreenReducer.tenantProfileRes.code == 200) {
                console.log("Tenants data>>>>" + JSON.stringify(this.props.tenantScreenReducer.tenantProfileRes.data));
                this.setState({ profileData: this.props.tenantScreenReducer.tenantProfileRes.data });
                this.callGetTenantAgreements();
            }
            else {
                alert(this.props.tenantScreenReducer.tenantProfileRes.message);
            }
            this.props.resetState();
        }
    }
    callAddFavUserClick(favStatus){
       
        this.callAddAsFav(favStatus);
    }

    navBar() {
        var is_fav=1;
        return (
            <View style={TenantsProfileStyle.profileHeaderContainer}>

                <TouchableOpacity onPress={() => this.closeNotifications()} style={{ marginLeft: 20 }}>
                    <Image source={ImagePath.BACK_WHITE} />
                </TouchableOpacity>

                {/*<TouchableOpacity style={{ marginRight: 20 }} onPress={()=>this.callAddFavUserClick(1)}>
                    <Image source={(is_fav == 2) ? ImagePath.HEART : ImagePath.BLUE_HEART} />
                 </TouchableOpacity>*/}
            </View>
        );
    }

    render() {
        let data = [{
            value: 'Tenant reviews',
        }];
        var userImagePath = this.state.profileData.image ? API.USER_IMAGE_PATH + this.state.profileData.image : ''
        var bannerImage = this.state.profileData.bannerImage ? API.USER_IMAGE_PATH + this.state.profileData.bannerImage : '';
        var firstName = this.state.profileData.firstname ? this.state.profileData.firstname : '';
        var lastName = this.state.profileData.lastname ? this.state.profileData.lastname : '';
        var averageRate = this.state.averageRate ? this.state.averageRate : 0;
        var totalreviews = this.state.totalreviews ? this.state.totalreviews : 0;

        return (
            <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>
                <View style={TenantsProfileStyle.profileContainer}>
                    <View style={TenantsProfileStyle.topCoverImageContainer}>
                        {
                            bannerImage != '' ?
                                <Image source={{ uri: bannerImage }} style={TenantsProfileStyle.topCoverImageContainer} />
                                : <View style={TenantsProfileStyle.topCoverImageContainer} />
                        }

                        {this.navBar()}

                    </View>

                    <View style={TenantsProfileStyle.bottomCoverImageContainer}>
                        <Image source={ImagePath.HEADER_BG} style={TenantsProfileStyle.bottomCoverImageContainer} />
                    </View>
                    <View style={TenantsProfileStyle.profileDataContainer}>
                        <View style={TenantsProfileStyle.profileNameAndReviewContainer}>

                            {
                                userImagePath != '' ? <Image source={{ uri: userImagePath }} style={TenantsProfileStyle.profileImageStyle} />
                                    :
                                    <View style={CommonStyles.emptyUserImageStyle}>
                                        <Text style={CommonStyles.initialTextStyle}>{firstName.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                    </View>
                            }

                            <Text style={TenantsProfileStyle.userNameTextStyle}>{this.state.profileData.firstname + ' ' + this.state.profileData.lastname}</Text>
                            <StarRating
                                disabled={true}
                                maxStars={5}
                                starSize={20}
                                starStyle={{ paddingRight: 2, paddingLeft: 2, marginTop: 8 }}
                                emptyStarColor={Colors.EMPTY_STAR_COLOR}
                                starColor={Colors.STAR_COLOR}
                                rating={ref.state.averageRate}
                                selectedStar={(rating) => ref.onStarRatingPress(rating)}
                            />
                            <Text style={TenantsProfileStyle.userReviewtextStyle}>{averageRate + ' ' + 'from' + ' ' + totalreviews + ' ' + 'reviews'}</Text>
                            <TouchableOpacity style={TenantsProfileStyle.contactAgentView} onPress={this.callSendMessageScreen.bind(this)}>
                                <View >
                                    <Text style={TenantsProfileStyle.buttonTextStyle}>Send message</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={TenantsProfileStyle.userInfoContainerStyle}>
                            <View style={TenantsProfileStyle.userInfoTextContainerStyle}>
                                <Text style={TenantsProfileStyle.labelTextStyle}>Location</Text>
                                <Text style={TenantsProfileStyle.infoTextStyle}>{this.state.profileData.address}</Text>
                            </View>
                            <View style={TenantsProfileStyle.userInfoTextContainerStyle}>
                                <Text style={TenantsProfileStyle.labelTextStyle}>Phone number</Text>
                                <Text style={TenantsProfileStyle.infoTextStyle}>{this.state.profileData.mobile_no}</Text>
                            </View>
                            <View style={TenantsProfileStyle.userInfoTextContainerStyle}>
                                <Text style={TenantsProfileStyle.labelTextStyle}>Email address</Text>
                                <Text style={TenantsProfileStyle.infoTextStyle}>{this.state.profileData.email}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={TenantsProfileStyle.profileImageContainer}>
                        <View style={TenantsProfileStyle.statusViewStyle} />
                    </View>
                  
                    {
                        JSON.stringify(this.state.agreementData)!='{}'?
                        <View>
                        <CardView>


                            <View style={TenantsProfileStyle.dateContainerStyle}>
                                <Image source={ImagePath.DATE_ICON} style={TenantsProfileStyle.dateImageStyle} />
                                <Text style={TenantsProfileStyle.dateTextStyle}>
                                    {Moment(this.state.agreementData.case_validity).format(Strings.DATE_FORMATE)}
                                </Text>
                            </View>

                            <View style={TenantsProfileStyle.tenantsTitleViewStyle}>
                                <Text style={TenantsProfileStyle.tenantsTitleTextStyle}>{this.state.agreementData.address_service_notice1} : #{this.state.agreementData.agreement_id}</Text>
                            </View>
                            <View style={TenantsProfileStyle.tenantsSubTitleViewStyle}>
                                <Text style={TenantsProfileStyle.tenantsSubTitleTextStyle}>{this.state.agreementData.address_service_notice1}</Text>
                            </View>

                            <View style={TenantsProfileStyle.imageListMainContainerStyle}>
                                <View>
                                    <Image source={ImagePath.USER_DEFAULT} style={TenantsProfileStyle.userImageStyle} />
                                </View>

                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                    <View style={TenantsProfileStyle.imageListContainerStyle}>
                                        {
                                            listData.map((data, index) => {
                                                return ref.renderImageItem(data, index);
                                            })
                                        }
                                    </View>
                                </ScrollView>

                            </View>

                            <View style={TenantsProfileStyle.tenantsInfoContainerViewStyle}>

                                <View style={TenantsProfileStyle.propertyBedroomViewContainer}>
                                    <Image source={ImagePath.DOLLAR_ICON} />
                                    <Text style={TenantsProfileStyle.propertyValueTextStyle}>{this.state.agreementData.rent_price}</Text>
                                </View>
                                <View style={TenantsProfileStyle.propertyWashrooViewContainer}>
                                    <Image source={ImagePath.CALENDAR_ICON} />
                                    <Text style={TenantsProfileStyle.propertyValueTextStyle}>{Moment(this.state.agreementData.tenancy_start_date).format(Strings.DATE_FORMATE)}</Text>
                                </View>
                                <View style={TenantsProfileStyle.propertyWashrooViewContainer}>
                                    <Image source={ImagePath.SEARCH_GRAY} />
                                    <Text style={TenantsProfileStyle.propertyValueTextStyle}>{this.state.agreementData.rental_period} times</Text>
                                </View>

                            </View>

                        </CardView>
                    </View>:null
                    }
                  
                </View>

                {
                    console.log('this.props.user_id=', this.state.tenantId)
                }
                {
                    <ReviewAndRatingScreen reviewToId={this.state.tenantId} isFrom={'TenantProfile'}/>
                }

            </ScrollView>
        );
    }
}

function mapStateToProps(state) {
    console.log('tenant profile mapStateToProps= ', JSON.stringify(state));
    return {
        tenantScreenReducer: state.tenantScreenReducer
    }
}

export default connect(
    mapStateToProps,
    {
        getAgreementForTenantProfile,
        addUserToFav,
        getTenantProfile,
        showLoading,
        resetState,
    }

)(TenantsProfile);

