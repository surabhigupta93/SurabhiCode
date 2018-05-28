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
    getPropertyList,
    getTradersProfile,
} from "../../../Action/ActionCreators";

import {

    showLoading,
    resetState,
} from "../AgentsScreenAction";


import { Actions } from 'react-native-router-flux';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import AgentProfileScreenStyle from './AgentProfileScreenStyle';
import listData from '../../../../data';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import AgentOverviewScreen from './AgentOverviewScreen';
import AgentReviewAndRatingScreen from './AgentReviewAndRatingScreen';
import API from '../../../Constants/APIUrls';
import StarRating from 'react-native-star-rating';
let ref;


class TradersProfileScreen extends Component {
    constructor() {
        super();
        ref = this;
        this.state = {
            starCount: 0,
            isTabSelected: 1,
            tradersId: '',
            profileData: {},
            averageRate: 0,
            totalreviews: 0,
            propertyListData: [],
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onGetProfileSuccess();
        this.onPropertyListSuccess();
    }

    componentWillUnmount() {

    }
    componentWillMount() {
        this.setState({ tradersId: this.props.user_id });
        this.setState({ averageRate: this.props.averageRating });
        this.setState({ totalreviews: this.props.totalReviewLengthrating });
        this.callGetTradersProfile();
        this.callGetProperty();
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

    onPropertyListSuccess() {

        if (this.props.homeScreenReducer.propertyListResponse != '') {
            if (this.props.homeScreenReducer.propertyListResponse.code == 200) {
                console.log('property data list on tenant profile ', JSON.stringify(this.props.homeScreenReducer.propertyListResponse));
                this.setState({ propertyListData: this.props.homeScreenReducer.propertyListResponse.data });
            }
            else {

                alert(this.props.homeScreenReducer.propertyListResponse.message);
            }
            this.props.resetState();
        }
    }

    closeNotifications() {
        Actions.popTo('Dashboard');
    }

    onOverviewTabClick() {

        this.setState({ isTabSelected: 1 });
        this.callGetProperty();
    }
    onJobHistoryTabClick() {

        this.setState({ isTabSelected: 2 });
    }
    onReviewAndRatingsTabClick() {

        this.setState({ isTabSelected: 3 });
    }

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }
    renderImageItem(item, index) {
        return (
            <Image source={{ uri: item.url }} style={AgentProfileScreenStyle.userListImageStyle} />
        );
    }


    callSendMessageScreen() {

        Actions.MessageToTraderScreen({ userFirstName: this.state.profileData.firstname, userLastName: this.state.profileData.lastname, receiverId: this.state.profileData._id });
    }

    callGetTradersProfile() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {

                    userId: this.props.user_id,
                }
                this.props.showLoading();
                this.props.getTradersProfile(authToken, postData);
            }
        }).done();

    }

    onGetProfileSuccess() {
        if (this.props.tradersReducer.tradersProfileRes != '') {
            if (this.props.tradersReducer.tradersProfileRes.code == 200) {
                this.setState({ profileData: this.props.tradersReducer.tradersProfileRes.data });
            }
            else {
                alert(this.props.tradersReducer.tradersProfileRes.message);
            }
            this.props.resetState();
        }
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
            <View style={AgentProfileScreenStyle.listMainContainerStyle}>

                <TouchableOpacity onPress={ref.callPropertyDetailsScreen.bind(ref, item._id)} >
                    <View style={AgentProfileScreenStyle.propertyImageViewStyle}>
                        {
                            propertyImagePath != '' ?
                                <Image source={{ uri: propertyImagePath }} style={AgentProfileScreenStyle.propertyImageStyle} />
                                : <View style={AgentProfileScreenStyle.emptyPropertyImageContainer} />
                        }

                        <Image source={ImagePath.HEART} style={AgentProfileScreenStyle.likeImageViewStyle} />
                    </View>
                    <View style={AgentProfileScreenStyle.propertyTitleViewStyle}>
                        <Text numberOfLines={2} style={AgentProfileScreenStyle.propertyTitleTextStyle}>{item.address}</Text>
                    </View>
                    <View style={AgentProfileScreenStyle.propetySubTitleViewStyle}>
                        <Text numberOfLines={2} style={AgentProfileScreenStyle.propertySubTitleTextStyle}>{item.description}</Text>
                    </View>
                </TouchableOpacity>

                <View style={AgentProfileScreenStyle.imageListMainContainerStyle}>
                    <View>

                        {userImage != '' ?

                            <Image source={{ uri: userImage }} style={AgentProfileScreenStyle.userImageStyle} />
                            :
                            <Image source={ImagePath.USER_DEFAULT} style={AgentProfileScreenStyle.userImageStyle} />

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

                <View style={AgentProfileScreenStyle.propertyInfoContainerViewStyle}>

                    <View style={AgentProfileScreenStyle.propertyBedroomViewContainer}>
                        <Image source={ImagePath.BEDROOM_ICON} />
                        <Text style={AgentProfileScreenStyle.propertyValueTextStyle}>{number_of_bedroom}</Text>
                    </View>

                    <View style={AgentProfileScreenStyle.propertyWashrooViewContainer}>
                        <Image source={ImagePath.BATHROOM_ICON} />
                        <Text style={AgentProfileScreenStyle.propertyValueTextStyle}>{number_of_bathroom}</Text>
                    </View>

                    <View style={AgentProfileScreenStyle.propertyWashrooViewContainer}>
                        <Image source={ImagePath.GARAGE_ICON} />
                        <Text style={AgentProfileScreenStyle.propertyValueTextStyle}>{number_of_parking}</Text>
                    </View>

                    <View style={AgentProfileScreenStyle.propertyWashrooViewContainer}>
                        <Image source={ImagePath.BATHROOM_ICON} />
                        <Text style={AgentProfileScreenStyle.propertyValueTextStyle}>{number_of_bedroom}</Text>
                    </View>

                </View>
            </View>
        );
    }


    navBar() {
        return (
            <View style={AgentProfileScreenStyle.profileHeaderContainer}>

                <TouchableOpacity onPress={() => this.closeNotifications()} style={{ marginLeft: 20 }}>
                    <Image source={ImagePath.BACK_WHITE} />
                </TouchableOpacity>

                <TouchableOpacity style={{ marginRight: 20 }}>
                    <Image source={ImagePath.HEART} />
                </TouchableOpacity>
            </View>
        );
    }

    render() {

        var userImagePath = this.state.profileData.image ? API.USER_IMAGE_PATH + this.state.profileData.image : ''
        var bannerImage = this.state.profileData.bannerImage ? API.USER_IMAGE_PATH + this.state.profileData.bannerImage : '';
        var firstName = this.state.profileData.firstname ? this.state.profileData.firstname : '';
        var lastName = this.state.profileData.lastname ? this.state.profileData.lastname : '';
        var averageRate = this.state.averageRate ? this.state.averageRate : 0;
        var totalreviews = this.state.totalreviews ? this.state.totalreviews : 0;

        return (
            <ScrollView contentContainerStyle={{ paddingBottom: 70, backgroundColor: Colors.SETTING_SCREEN_BG_COLOR }}>
                <View style={AgentProfileScreenStyle.profileContainer}>
                    <View style={AgentProfileScreenStyle.topCoverImageContainer}>
                        {
                            bannerImage != '' ?
                                <Image source={{ uri: bannerImage }} style={AgentProfileScreenStyle.topCoverImageContainer} />
                                : <View style={AgentProfileScreenStyle.topCoverImageContainer} />
                        }

                        {this.navBar()}

                    </View>

                    <View style={AgentProfileScreenStyle.bottomCoverImageContainer}>
                        <Image source={ImagePath.HEADER_BG} style={AgentProfileScreenStyle.bottomCoverImageContainer} />
                    </View>
                    <View style={AgentProfileScreenStyle.profileDataContainer}>
                        <View style={AgentProfileScreenStyle.profileNameAndReviewContainer}>

                            {
                                userImagePath != '' ? <Image source={{ uri: userImagePath }} style={AgentProfileScreenStyle.profileImageStyle} />
                                    :
                                    <View style={CommonStyles.emptyUserImageStyle}>
                                        <Text style={CommonStyles.initialTextStyle}>{firstName.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                    </View>
                            }
                            <Text style={AgentProfileScreenStyle.userNameTextStyle}>{this.state.profileData.firstname + ' ' + this.state.profileData.lastname}</Text>
                            <StarRating
                                disabled={true}
                                maxStars={5}
                                starSize={20}
                                starStyle={{ paddingRight: 2, paddingLeft: 2, marginTop: 8 }}
                                emptyStarColor={Colors.EMPTY_STAR_COLOR}
                                starColor={Colors.STAR_COLOR}
                                rating={averageRate}
                                selectedStar={(rating) => ref.onStarRatingPress(rating)}
                            />
                            <Text style={AgentProfileScreenStyle.userReviewtextStyle}>{averageRate + ' ' + 'from' + ' ' + totalreviews + ' ' + 'reviews'}</Text>
                            <TouchableOpacity onPress={this.callSendMessageScreen.bind(this)} >
                                <View style={AgentProfileScreenStyle.contactAgentView}>
                                    <Text style={AgentProfileScreenStyle.buttonTextStyle}>{Strings.SEND_MESSAGE}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={AgentProfileScreenStyle.userInfoContainerStyle}>
                            <View style={AgentProfileScreenStyle.userInfoTextContainerStyle}>
                                <Text style={AgentProfileScreenStyle.labelTextStyle}>Location</Text>
                                <Text style={AgentProfileScreenStyle.infoTextStyle}>{this.state.profileData.address}</Text>
                            </View>
                            <View style={AgentProfileScreenStyle.userInfoTextContainerStyle}>
                                <Text style={AgentProfileScreenStyle.labelTextStyle}>Phone number</Text>
                                <Text style={AgentProfileScreenStyle.infoTextStyle}>{this.state.profileData.mobile_no}</Text>
                            </View>
                            <View style={AgentProfileScreenStyle.userInfoTextContainerStyle}>
                                <Text style={AgentProfileScreenStyle.labelTextStyle}>Email address</Text>
                                <Text style={AgentProfileScreenStyle.infoTextStyle}>{this.state.profileData.email}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={AgentProfileScreenStyle.profileImageContainer}>
                        <View style={AgentProfileScreenStyle.statusViewStyle} />
                    </View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={AgentProfileScreenStyle.tabContainerScrollViewStyle}>
                        <View style={AgentProfileScreenStyle.tabContainerStyle}>

                            <TouchableOpacity onPress={() => this.onOverviewTabClick()}>
                                <View>
                                    <View style={AgentProfileScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 1) ? AgentProfileScreenStyle.tabLabelTextStyle : AgentProfileScreenStyle.tabLabelDiselectTextStyle}>{Strings.PROPERTIES}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 1) ? <View style={AgentProfileScreenStyle.tabIndicatorStyle}></View> :
                                        <View style={AgentProfileScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onJobHistoryTabClick()} >
                                <View >
                                    <View style={AgentProfileScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 2) ? AgentProfileScreenStyle.tabLabelTextStyle : AgentProfileScreenStyle.tabLabelDiselectTextStyle}>{Strings.OVERVIEW}</Text>
                                    </View>
                                    {this.state.isTabSelected == 2 ? <View style={AgentProfileScreenStyle.tabIndicatorStyle}></View> : <View style={AgentProfileScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onReviewAndRatingsTabClick()}>
                                <View>
                                    <View style={AgentProfileScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 3) ? AgentProfileScreenStyle.tabLabelTextStyle : AgentProfileScreenStyle.tabLabelDiselectTextStyle}>{Strings.REVIEWS_AND_RATINGS}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 3) ? <View style={AgentProfileScreenStyle.tabIndicatorStyle}></View> : <View style={AgentProfileScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    {(this.state.isTabSelected == 2) ?

                        <AgentOverviewScreen overviewData={this.state.profileData}/>

                        : null}
                    {(this.state.isTabSelected == 1) ?

                        this.state.propertyListData.length > 0
                            ?
                            <FlatList
                                data={this.state.propertyListData}
                                renderItem={this.renderItem}
                            />
                            : <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ fontSize: 20, textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>{Strings.PROPERTY_NOT_FOUND}</Text>
                            </View>

                        : null}
                    {(this.state.isTabSelected == 3) ?
                        <AgentReviewAndRatingScreen reviewToId={this.state.tradersId} averageRate={averageRate} totalreviews={totalreviews}/>
                        : null}
                </View>
            </ScrollView>
        );
    }
}

function mapStateToProps(state) {
    console.log('traders profile mapStateToProps= ', JSON.stringify(state));
    return {
        tradersReducer: state.tradersReducer,
        homeScreenReducer: state.homeScreenReducer
    }
}

export default connect(
    mapStateToProps,
    {
        getTradersProfile,
        getPropertyList,
        showLoading,
        resetState,
    }

)(TradersProfileScreen);


