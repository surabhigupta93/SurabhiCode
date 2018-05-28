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
    Dimensions,
    AsyncStorage
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import HomeScreenStyle from './HomeScreenStyle';
import listData from '../../../data';
import { CardWithWhiteBG } from '../CommonComponent/CardWithWhiteBG';
import * as Progress from 'react-native-progress';
import API from '../../Constants/APIUrls';

import Moment from 'moment';
import SocketIOClient from 'socket.io-client';
import {
    getUnreadMessageList,
    getMaintenanceRequestList,
    getMaintenanceThreadList,
    getGeneralThreadList,
    getStatistics,
    likeProperty,
    getNoticeBoardList,
    getPropertyList,
} from "../../Action/ActionCreators";
import {
    onTabPressed,
    showLoading,
    resetState,
} from "./HomeScreenAction";
let ref;
const window = Dimensions.get('window');
var UserID = '';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
//import SlidingCalendarView from 'react-native-sliding-calendar-view';

class HomeScreen extends Component {
    constructor() {
        super();
        this.state = {
            maintenanceListData: [],
            maintenanceThreadListData: [],
            propertyListData: [],
            noticeBoardListData: [],
            unreadMsgListData: [],
            //  statisticsData: {},
            isTabSelected: 1,
            abc: true,
        };
        ref = this;

        this.socket = SocketIOClient(API.CHAT_CONNECTION_URL, { transports: ['websocket'] });
        this.socket.on('getAppliedUsersRes', (messages) => {
            //console.log('on getAppliedUsersRes', JSON.stringify(messages));
            this.setState({ users: messages })
        });
    }

    componentWillReceiveProps(nextProps) {
        //console.log('clicked tab',JSON.stringify(this.props.homeScreenReducer.onTabPressed));
    }

    componentDidUpdate() {

        this.onPropertyListSuccess();
        this.onNoticeBoardListSuccess();
        this.onMaintenanceRquestSuccess();
        this.onGetUnreadMessageSuccess();
        this.onMaintenanceThreadSuccess();
        this.onGeneralThreadSuccess();
        this.onLikePropertySuccess();
    }

    componentWillUnmount() {

    }

    componentWillMount() {

        this.getRoleName();
        this.callGetProperty();

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                UserID = userData.data._id;
                //console.log('will mount props data', UserID + ' :ID: ' + userData.data._id);
                this.socket.emit('addUser', { id: UserID });
                this.socket.emit("getAppliedUsers", UserID);
            }
        }).done();
    }

    getRoleName() {

        AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
            if (value) {
                // console.log('user name == ', value);
                this.setState({ roleName: value });
            }
        }).done();
    }


    callGetUnreadMessage() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;

                this.props.showLoading();
                this.props.getUnreadMessageList(authToken, userData.data._id);
            }
        }).done();
    }

    onGetUnreadMessageSuccess() {

        if (this.props.homeScreenReducer.unreadMsgListResponse != '') {
            if (this.props.homeScreenReducer.unreadMsgListResponse.code == 200) {
                console.log('unread message data:' + JSON.stringify(this.props.homeScreenReducer.unreadMsgListResponse))
                this.setState({ unreadMsgListData: this.props.homeScreenReducer.unreadMsgListResponse.data });
                //this.state.roleName == Strings.USER_ROLE_TRADER ? null : this.callGetStatistics();
                this.callGetGeneralThreadRequest();
            }
            else {

                alert(this.props.homeScreenReducer.unreadMsgListResponse.message);
            }
            this.props.resetState();

        }
    }


    callGetStatistics() {

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
                this.props.getStatistics(authToken, postData);
            }
        }).done();
    }

    onGetStatisticsSuccess() {
        if (this.props.homeScreenReducer.statisticRes != '') {
            if (this.props.homeScreenReducer.statisticRes.code == 200) {
                this.setState({ statisticsData: this.props.homeScreenReducer.statisticRes.data });
            }
            else {
                alert(this.props.homeScreenReducer.statisticRes.message);
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
                this.props.getPropertyList(authToken, postData);
            }
        }).done();
    }


    callGetNoticeBoardList() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var postdata = {};
                var authToken = userData.token;
                postdata = {
                    agency_id: userData.data.agency_id,
                    user_id: userData.data._id,
                    role_id: userData.data.role_id


                };
                this.props.showLoading();
                //  console.log('post data== ', JSON.stringify(postdata));
                this.props.getNoticeBoardList(authToken, postdata);
            }
        }).done();
    }
    onNoticeBoardListSuccess() {

        if (this.props.homeScreenReducer.noticeBoardListResponse != '') {
            if (this.props.homeScreenReducer.noticeBoardListResponse.code == 200) {
                console.log('noticebaord data== ', JSON.stringify(this.props.homeScreenReducer.noticeBoardListResponse));
                this.setState({ noticeBoardListData: this.props.homeScreenReducer.noticeBoardListResponse.data });
                this.callGetMaintenanceRequest();
            }
            else {

                alert(this.props.homeScreenReducer.propertyListResponse.message);
            }
            this.props.resetState();

        }
    }

    onMaintenanceRquestSuccess() {

        if (this.props.homeScreenReducer.maintenanceListResponse != '') {
            if (this.props.homeScreenReducer.maintenanceListResponse.code == 200) {
                // console.log('maintenance data== ', JSON.stringify(this.props.homeScreenReducer.maintenanceListResponse));
                this.setState({ maintenanceListData: this.props.homeScreenReducer.maintenanceListResponse.data });
                this.callGetUnreadMessage();
            }
            else {

                alert(this.props.homeScreenReducer.maintenanceListResponse.message);
            }
        }

        this.props.resetState();
    }

    onMaintenanceThreadSuccess() {

        if (this.props.homeScreenReducer.maintenanceThreadListResponse != '') {
            console.log('maintenance thread data== ', JSON.stringify(this.props.homeScreenReducer.maintenanceThreadListResponse));
            if (this.props.homeScreenReducer.maintenanceThreadListResponse.code == 200) {
                this.setState({ maintenanceThreadListData: this.props.homeScreenReducer.maintenanceThreadListResponse.data });
            }
            else {
                alert(this.props.homeScreenReducer.maintenanceThreadListResponse.message);
            }
        }

        this.props.resetState();
    }

    onGeneralThreadSuccess() {

        if (this.props.homeScreenReducer.generalThreadListResponse != '') {
            console.log('general thread data== ', JSON.stringify(this.props.homeScreenReducer.maintenanceThreadListResponse));
            if (this.props.homeScreenReducer.generalThreadListResponse.code == 200) {
                this.setState({ maintenanceThreadListData: this.props.homeScreenReducer.generalThreadListResponse.maintenences });
            }
            else {
                alert(this.props.homeScreenReducer.generalThreadListResponse.message);
            }
        }

        this.props.resetState();
    }

    callSearchScreen() {

        Actions.SearchScreen();
    }
    navBar() {

        return (
            <View >
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.NAV_HOME_TITLE}</Text>

                <TouchableOpacity onPress={() => this.callSearchScreen()} style={CommonStyles.navRightImageView}>
                    <View>
                        <Image source={ImagePath.DRAWER_SEARCH_ICON} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    onPropertyListSuccess() {

        if (this.props.homeScreenReducer.propertyListResponse != '') {
            if (this.props.homeScreenReducer.propertyListResponse.code == 200) {
                //console.log('property data== ', JSON.stringify(this.props.homeScreenReducer.propertyListResponse));
                this.setState({ propertyListData: this.props.homeScreenReducer.propertyListResponse.data });
                this.callGetNoticeBoardList();
            }
            else {

                alert(this.props.homeScreenReducer.propertyListResponse.message);
            }
            this.props.resetState();


        }
    }

    callPropertyDetailsScreen(id) {

        Actions.PropertiesDetailsScreen({ propertyId: id });
    }

    onAllTabClick() {

        this.setState({ isTabSelected: 1 });
        this.callGetGeneralThreadRequest();
    }
    onGeneralTabClick() {

        this.setState({ maintenanceThreadListData: [], isTabSelected: 2 });

    }

    onMaintenanceTabClick() {

        this.setState({ isTabSelected: 3 });
        this.callGetMaintenanceThreadRequest();
    }

    onDisputesTabClick() {

        this.setState({ maintenanceThreadListData: [], isTabSelected: 4 });
    }

    onInspectionsTabClick() {

        this.setState({ maintenanceThreadListData: [], isTabSelected: 5 });
    }

    onStaticTabClick(tabName) {

        this.props.onTabPressed({ tab: tabName });
    }

    onListItemClick() {

        Actions.MaintenanceRequestDetailsScreen();
    }
    callAddPropertyScreen() {
        Actions.AddPropertyScreenStepOne();
    }

    callGetMaintenanceThreadRequest() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    agency_id: userData.data.agency_id,
                    created_by: userData.data._id,
                    request_by_role: userData.data.role_id,
                }
                this.props.showLoading();
                this.props.getMaintenanceThreadList(authToken, postData);
            }
        }).done();
    }

    callGetGeneralThreadRequest() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    agency_id: userData.data.agency_id,
                    created_by: userData.data._id,
                    request_by_role: userData.data.role_id,
                }
                this.props.showLoading();
                this.props.getGeneralThreadList(authToken, postData);
            }
        }).done();
    }

    callGetMaintenanceRequest() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    agency_id: userData.data.agency_id,
                    request_by_role: userData.data.role_id,
                    request_by_id: userData.data._id,
                }
                this.props.showLoading();
                this.props.getMaintenanceRequestList(authToken, postData);
            }
        }).done();
    }

    likePropertyRequest(item, index) {

        var tempArray = this.state.propertyListData;
        var currentItem = tempArray[index];
        currentItem.is_fav = (item.is_fav == 2) ? 1 : 2;
        tempArray[index] = currentItem;
        this.setState({ propertyListData: tempArray });
        // console.log('like item data', JSON.stringify(item));

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    fav_by: userData.data._id,
                    fav_to_property: item._id,
                    fav_status: (item.is_fav == 2) ? 2 : 1,
                }
                this.props.showLoading();
                // console.log('like post data', postData);
                this.props.likeProperty(authToken, postData);
            }
        }).done();
    }

    onLikePropertySuccess() {

        if (this.props.homeScreenReducer.likePropertyResponse != '') {
            if (this.props.homeScreenReducer.likePropertyResponse.code == 200) {
                // console.log('likePropertyResponse data== ', JSON.stringify(this.props.homeScreenReducer.likePropertyResponse));
                //this.setState({ noticeBoardListData: this.props.homeScreenReducer.likePropertyResponse.data });
            }
            else {

                alert(this.props.homeScreenReducer.likePropertyResponse.message);
            }
            this.props.resetState();
        }
    }

    renderStatusView(item) {
        // 1 for sent , 2 for accepted, 3 for booked, 4 for completed, 5 for closed, 6 for due, 7 denied

        switch (item.req_status) {

            case 1:
                return (
                    <View style={HomeScreenStyle.statusSentViewStyle}>
                        <Text style={HomeScreenStyle.statusViewTextStyle}>SENT</Text>
                    </View>
                );
                break;
            case 2:
                return (
                    <View style={HomeScreenStyle.statusAcceptedViewStyle}>
                        <Text style={HomeScreenStyle.statusViewTextStyle}>ACCEPTED</Text>
                    </View>
                );
                break;
            case 3:
                return (
                    <View style={HomeScreenStyle.statusBookViewStyle}>
                        <Text style={HomeScreenStyle.statusViewTextStyle}>BOOKED</Text>
                    </View>
                );
                break;

            case 4:
                return (
                    <View style={HomeScreenStyle.statusCompletedViewStyle}>
                        <Text style={HomeScreenStyle.statusViewTextStyle}>COMPLETED</Text>
                    </View>
                );
                break;
            case 5:
                return (
                    <View style={HomeScreenStyle.statusOverDueViewStyle}>
                        <Text style={HomeScreenStyle.statusViewTextStyle}>COLSED</Text>
                    </View>
                );
                break;
            case 6:
                return (
                    <View style={HomeScreenStyle.statusOverDueViewStyle}>
                        <Text style={HomeScreenStyle.statusViewTextStyle}>OVER DUE</Text>
                    </View>
                );
                break;
            case 7:
                return (
                    <View style={HomeScreenStyle.statusOverDueViewStyle}>
                        <Text style={HomeScreenStyle.statusViewTextStyle}>DENIED</Text>
                    </View>
                );
                break;
            default:

        }

    }

    onListItemClick(id) {

        Actions.MaintenanceRequestDetailsScreen({ reqId: id });
    }

    maintenanceRequestRenderItem({ item, index }) {
        var userImage = item.created_by.image ? API.USER_IMAGE_PATH + item.created_by.image : '';
        var firstname = item.created_by.firstname ? item.created_by.firstname : '';
        var lastName = item.created_by.lastname ? item.created_by.lastname : '';
        return (

            <CardWithWhiteBG>
                <TouchableOpacity onPress={ref.onListItemClick.bind(ref, item._id)}>
                    <View style={HomeScreenStyle.maintenanceListHeaderContainer}>

                        <View style={HomeScreenStyle.statusContainerStyle}>

                            {ref.renderStatusView(item)}

                        </View>
                        {
                            userImage != '' ? <Image source={{ uri: userImage }} style={HomeScreenStyle.maintenaceUserImageStyle} />
                                :
                                <View style={HomeScreenStyle.emptyMaintenaceUserImageStyle}>
                                    <Text style={HomeScreenStyle.initialTextStyle}>{firstname.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                </View>
                        }


                        <View style={HomeScreenStyle.statusContainerStyle}>
                            <Text numberOfLines={1} style={HomeScreenStyle.dollarTextStyle}>${item.budget ? item.budget : 0}</Text>
                            <Text numberOfLines={1} style={HomeScreenStyle.daysTextStyle}>{Moment(item.due_date).fromNow()}</Text>
                        </View>
                    </View>
                    <View style={HomeScreenStyle.detailContainerStyle}>
                        <View style={HomeScreenStyle.detailTitleContainerStyle}>
                            <Text numberOfLines={1} style={HomeScreenStyle.maintenanceDetailTitleTextStyle}>{item.request_overview}</Text>
                            <Image source={ImagePath.RED_NOTIFICATION} style={HomeScreenStyle.notificatioImageStyle} />
                        </View>
                        <Text numberOfLines={1} style={HomeScreenStyle.maintenanceDetailTextStyle}>{"Request ID : " + item.request_id}</Text>
                        {/* <Text style={HomeScreenStyle.maintenanceDetailTextStyle}>Category name</Text> */}
                    </View>
                </TouchableOpacity>
            </CardWithWhiteBG>
        );

    }




    renderItem({ item, index }) {

        var propertyImagePath = item.image ? (item.image.length > 0 ? API.PROPERTY_IMAGE_PATH + item.image[0].path : '') : '';
        var userImage = item.owned_by ? (item.owned_by.image ? API.USER_IMAGE_PATH + item.owned_by.image : '') : '';
        //console.log('is_fav ', index + item.is_fav);
        return (
            <CardWithWhiteBG>

                <TouchableOpacity onPress={ref.callPropertyDetailsScreen.bind(ref, item._id)} >
                    <View style={HomeScreenStyle.propertyImageViewStyle}>
                        {
                            propertyImagePath != '' ?
                                <Image source={{ uri: propertyImagePath }} style={HomeScreenStyle.propertyImageStyle} />
                                : <View style={HomeScreenStyle.topCoverImageContainer} />
                        }

                        <TouchableOpacity style={HomeScreenStyle.likeImageViewStyle} onPress={ref.likePropertyRequest.bind(ref, item, index)} >

                            <Image source={(item.is_fav == 2) ? ImagePath.HEART : ImagePath.BLUE_HEART} />

                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>

                <View style={HomeScreenStyle.propertyTitleViewStyle}>
                    <Text numberOfLines={2} style={HomeScreenStyle.propertyTitleTextStyle}>{item.address}</Text>
                </View>

                <View style={HomeScreenStyle.propetySubTitleViewStyle}>
                    <Text numberOfLines={2} style={HomeScreenStyle.propertySubTitleTextStyle}>{item.description}</Text>
                </View>

                <View style={HomeScreenStyle.propertyInfoContainerViewStyle}>
                    <View style={HomeScreenStyle.propertyInfoSubViewContainer}>
                        <View style={HomeScreenStyle.propertyBedroomViewContainer}>
                            <Image source={ImagePath.BEDROOM_ICON} />
                            <Text style={HomeScreenStyle.propertyValueTextStyle}>{item.number_bedroom ? item.number_bedroom : '0'}</Text>
                        </View>
                        <View style={HomeScreenStyle.propertyWashrooViewContainer}>
                            <Image source={ImagePath.BATHROOM_ICON} />
                            <Text style={HomeScreenStyle.propertyValueTextStyle}>{item.number_of_bathroom ? item.number_of_bathroom : '0'}</Text>
                        </View>
                        <View style={HomeScreenStyle.propertyWashrooViewContainer}>
                            <Image source={ImagePath.GARAGE_ICON} />
                            <Text style={HomeScreenStyle.propertyValueTextStyle}>{item.number_of_parking ? item.number_of_parking : '0'}</Text>
                        </View>
                    </View>

                    <View>

                        {userImage != '' ?
                            <Image source={{ uri: userImage }} style={HomeScreenStyle.userImageStyle} />
                            :
                            <Image source={ImagePath.USER_DEFAULT} style={HomeScreenStyle.userImageStyle} />
                        }

                    </View>
                </View>
            </CardWithWhiteBG>
        );
    }

    callNoticeDetail(id) {

        Actions.NoticeBoardDetailScreen({ noticeBoardId: id });
    }

    noticeBoardRenderItem({ item, index }) {
        var title = item.title ? item.title : '';
        var description = item.description ? item.description : '';
        var createdDate = item.createdAt ? item.createdAt : '';
        return (

            <CardWithWhiteBG>
                <TouchableOpacity style={HomeScreenStyle.listMainContainerStyle} onPress={ref.callNoticeDetail.bind(ref, item._id)}>
                    <View style={{ padding: 10 }}>

                        <Text style={HomeScreenStyle.noticeBoardTitleTextStyle}>
                            {'Title : ' + title}
                        </Text>

                        <Text style={HomeScreenStyle.propertySubTitleTextStyle}>
                            {Moment(createdDate).format('MMM dd, YYYY')}
                        </Text>

                        <Text style={HomeScreenStyle.propertySubTitleTextStyle}>
                            {description}
                        </Text>

                    </View>
                </TouchableOpacity>
            </CardWithWhiteBG>);
    }

    maintenanceThreadRenderItem({ item, index }) {
        var userImage = item.created_by.image ? API.USER_IMAGE_PATH + item.created_by.image : '';
        var firstName = item.created_by.firstname ? item.created_by.firstname : '';
        var lastName = item.created_by.lastname ? item.created_by.lastname : '';
        return (

            <CardWithWhiteBG>

                <View style={HomeScreenStyle.listContainerStyle}>

                    <View style={HomeScreenStyle.maintenanceThreadImageViewContainerStyle}>
                        <View style={HomeScreenStyle.imageContainerStyle}>
                            {
                                userImage != '' ? <Image source={{ uri: userImage }} style={HomeScreenStyle.userImageStyle} />
                                    :
                                    <View style={HomeScreenStyle.emptyUserMessageListImageStyle}>
                                        <Text style={HomeScreenStyle.initialTextStyle}>{firstName.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                    </View>
                            }

                        </View>
                    </View>


                    <View style={HomeScreenStyle.messageViewContainerStyle}>
                        <Text numberOfLines={1} style={HomeScreenStyle.messageTimeTextStyle}>{Moment(item.due_date).fromNow()}</Text>
                        <Text numberOfLines={1} style={HomeScreenStyle.threadDetailTitleTextStyle}>{item.request_overview}</Text>
                        {/* <Text numberOfLines={1} style={HomeScreenStyle.detailTextStyle}>You : Good to hear we are now fixing all these damages</Text> */}
                        <Text numberOfLines={1} style={HomeScreenStyle.maintenanceThreadpropertyIdTextStyle}>{"Request ID : " + item.request_id}</Text>
                    </View>

                </View>

            </CardWithWhiteBG>
        );
    }

    _goChat(receiver, emitter, socket, userName, userPic) {
        //this.props.navigator.push({ ident: "Chat", receiver, emitter, socket })
        Actions.Chat({ receiver, emitter, socket, userName, userPic });
    }


    unreadMessageRenderItem({ item, index }) {

        var from = item.from !== null ? item.from : {};
        var imagePath = from.image ? API.USER_IMAGE_PATH + from.image : '';
        var id = item._id ? item._id : '';
        var _goChat = ref._goChat.bind(ref);
        var userName = from.firstname ? from.firstname + ' ' + from.lastname : '';
        var firstName = from.firstname ? from.firstname : '';
        var lastName = from.lastname ? from.lastname : '';
        //console.log('userimagepath:' + userImage + imagePath);
        return (

            <CardWithWhiteBG>
                <TouchableOpacity onPress={() => _goChat(id, UserID, ref.socket, userName, imagePath)}>
                    <Text style={HomeScreenStyle.unreadMsgTimeTextStyle}>{item.time}</Text>
                    <View style={HomeScreenStyle.msgListContainerStyle}>

                        <View style={HomeScreenStyle.unreadMsgimageContainerStyle}>

                            {
                                imagePath != '' ? <Image source={{ uri: imagePath }} style={HomeScreenStyle.userImageStyle} />
                                    :
                                    <View style={HomeScreenStyle.emptyUserMessageListImageStyle}>
                                        <Text style={HomeScreenStyle.initialTextStyle}>{firstName.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                    </View>
                            }

                            {from.is_online ?
                                <View style={HomeScreenStyle.onLineStatusViewStyle} />
                                :
                                <View style={HomeScreenStyle.statusViewStyle} />
                            }

                        </View>

                        <View style={HomeScreenStyle.messageViewContainerStyle}>

                            <Text style={HomeScreenStyle.detailTitleTextStyle}>{firstName + ' ' + lastName}</Text>
                            <Text numberOfLines={1} style={HomeScreenStyle.detailTextStyle}>{item.msg}</Text>
                        </View>

                    </View>
                </TouchableOpacity>
            </CardWithWhiteBG>);
    }



    render() {

        return (

            <View style={HomeScreenStyle.listMainContainerStyle}>

                <ScrollView contentContainerStyle={HomeScreenStyle.scrollViewStyle}>
                    <View style={HomeScreenStyle.managePropertyViewStyle}>
                        <Text style={HomeScreenStyle.managePropertyTextStyle}>
                            {Strings.MANAGE_PROPERTY}
                        </Text>
                        <TouchableOpacity onPress={this.callAddPropertyScreen.bind(this)}>
                            <Image source={ImagePath.PLUS_ICON} />
                        </TouchableOpacity>
                    </View>

                    <View style={HomeScreenStyle.propertyListViewContainerStyle}>

                        {
                            this.state.propertyListData.length > 0 ?
                                <FlatList
                                    horizontal={true}
                                    data={this.state.propertyListData}
                                    renderItem={this.renderItem}
                                    extraData={this.state}
                                />
                                :
                                <Text style={HomeScreenStyle.PropertyPlaceHolerTextStyle}>
                                    {Strings.PROPERTY_NOT_FOUND}
                                </Text>

                        }

                    </View>

                    <View style={HomeScreenStyle.noticeBoardContainerViewStyle}>
                        <Text style={HomeScreenStyle.managePropertyTextStyle}>
                            {Strings.NOTICE_BOARD}
                        </Text>
                        <View style={HomeScreenStyle.noticeBoardListViewContainer}>
                            {
                                console.log('notice data in render= ',JSON.stringify(this.state.noticeBoardListData))
                            }
                            {
                                this.state.noticeBoardListData.length > 0 ? <FlatList
                                    data={this.state.noticeBoardListData}
                                    renderItem={this.noticeBoardRenderItem}
                                />

                                    :
                                    <Text style={HomeScreenStyle.PropertyPlaceHolerTextStyle}>
                                        {Strings.NOTICE_NOT_FOUND}
                                    </Text>
                            }
                        </View>

                    </View>

                    <View style={HomeScreenStyle.noticeBoardContainerViewStyle}>
                        <Text style={HomeScreenStyle.managePropertyTextStyle}>
                            {Strings.UPCOMING_INSPECTION}
                        </Text>

                        <Calendar
                            style={{
                                borderTopWidth: 1,
                                paddingTop: 5,
                                borderBottomWidth: 1,
                                borderColor: '#eee',
                                height: 350,
                                marginTop: 20
                            }}
                            current={Moment().format('YYYY-MM-DD')}
                            minDate={Moment().format('YYYY-MM-DD')}
                            firstDay={1}

                            // disabledByDefault={true}
                            hideArrows={false}
                        />


                    </View>

                    <View style={HomeScreenStyle.noticeBoardContainerViewStyle}>
                        <Text style={HomeScreenStyle.managePropertyTextStyle}>
                            {Strings.ACTIVE_THREAD}
                        </Text>

                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={HomeScreenStyle.tabContainerScrollViewStyle}>
                            <View style={HomeScreenStyle.tabContainerStyle}>

                                <TouchableOpacity onPress={() => this.onAllTabClick()} >

                                    <Text style={(this.state.isTabSelected == 1) ? HomeScreenStyle.tabLabelTextStyle : HomeScreenStyle.tabLabelDiselectTextStyle}>{Strings.ALL}</Text>

                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => this.onGeneralTabClick()}>

                                    <Text style={(this.state.isTabSelected == 2) ? HomeScreenStyle.tabLabelTextStyle : HomeScreenStyle.tabLabelDiselectTextStyle}>{Strings.GENERAL}</Text>

                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => this.onMaintenanceTabClick()}>

                                    <Text style={(this.state.isTabSelected == 3) ? HomeScreenStyle.tabLabelTextStyle : HomeScreenStyle.tabLabelDiselectTextStyle}>{Strings.MAINTENANCE}</Text>

                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => this.onDisputesTabClick()}>

                                    <Text style={(this.state.isTabSelected == 4) ? HomeScreenStyle.tabLabelTextStyle : HomeScreenStyle.tabLabelDiselectTextStyle}>{Strings.DISPUTES}</Text>

                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => this.onInspectionsTabClick()}>

                                    <Text style={(this.state.isTabSelected == 5) ? HomeScreenStyle.tabLabelTextStyle : HomeScreenStyle.tabLabelDiselectTextStyle}>{Strings.INSPECTIONS}</Text>

                                </TouchableOpacity>
                            </View>
                        </ScrollView>

                        <View>
                            {
                                  this.state.maintenanceThreadListData ? (this.state.maintenanceThreadListData.length > 0) : [] ?
                                    <FlatList
                                        data={this.state.maintenanceThreadListData}
                                        renderItem={this.maintenanceThreadRenderItem}
                                    /> :
                                    <Text style={HomeScreenStyle.PropertyPlaceHolerTextStyle}>
                                        {Strings.NO_DATA_FOUND}
                                    </Text>
                            }
                        </View>

                    </View>

                    <View style={HomeScreenStyle.noticeBoardContainerViewStyle}>
                        <Text style={HomeScreenStyle.managePropertyTextStyle}>
                            {Strings.MAINTENANCE_REQUEST}
                        </Text>
                        <View style={HomeScreenStyle.noticeBoardListViewContainer}>

                            {
                                this.state.maintenanceListData.length > 0 ? <FlatList
                                    data={this.state.maintenanceListData}
                                    renderItem={this.maintenanceRequestRenderItem}
                                /> :
                                    <Text style={HomeScreenStyle.PropertyPlaceHolerTextStyle}>
                                        {Strings.MAINTENANCE_NOT_FOUND}
                                    </Text>
                            }

                        </View>
                    </View>

                    <View style={HomeScreenStyle.noticeBoardContainerViewStyle}>
                        <Text style={HomeScreenStyle.managePropertyTextStyle}>
                            {Strings.UNREAD_MESSAGE}
                        </Text>

                        <View style={HomeScreenStyle.noticeBoardListViewContainer}>
                            {
                                this.state.unreadMsgListData.length > 0 ?
                                    <FlatList
                                        data={this.state.unreadMsgListData}
                                        renderItem={this.unreadMessageRenderItem}
                                    />
                                    :
                                    <Text style={HomeScreenStyle.PropertyPlaceHolerTextStyle}>
                                        {Strings.MESSAGE_NOT_FOUND}
                                    </Text>
                            }
                        </View>
                    </View>

                    {/* {this.state.roleName == Strings.USER_ROLE_TRADER ?
                        null
                        : <View style={HomeScreenStyle.noticeBoardContainerViewStyle}>
                            <Text style={HomeScreenStyle.managePropertyTextStyle}>
                                {Strings.STATISTICS}
                            </Text>

                            <CardWithWhiteBG>
                                <TouchableOpacity onPress={() => this.onStaticTabClick(Strings.TENANTS)}>

                                    <View style={HomeScreenStyle.statisticsViewContainer}>
                                        <Text style={HomeScreenStyle.statisticsLabelTextStyle}>{Strings.TENANTS}</Text>
                                        <Text style={HomeScreenStyle.statisticsTextStyle}>{this.state.statisticsData.tenantCnt}</Text>
                                    </View>
                                </TouchableOpacity>
                            </CardWithWhiteBG>

                            <CardWithWhiteBG>
                                <TouchableOpacity onPress={() => this.onStaticTabClick(Strings.PROPERTIES)}>

                                    <View style={HomeScreenStyle.statisticsViewContainer}>
                                        <Text style={HomeScreenStyle.statisticsLabelTextStyle}>{Strings.PROPERTIES}</Text>
                                        <Text style={HomeScreenStyle.statisticsTextStyle}>{this.state.statisticsData.propertyCnt}</Text>
                                    </View>
                                </TouchableOpacity>
                            </CardWithWhiteBG>

                            <CardWithWhiteBG>
                                <TouchableOpacity onPress={() => this.onStaticTabClick(Strings.REQUESTS)}>

                                    <View style={HomeScreenStyle.statisticsViewContainer}>
                                        <Text style={HomeScreenStyle.statisticsLabelTextStyle}>{Strings.REQUESTS}</Text>
                                        <Text style={HomeScreenStyle.statisticsTextStyle}>{this.state.statisticsData.requestCnt}</Text>
                                    </View>
                                </TouchableOpacity>
                            </CardWithWhiteBG>
                        </View>
                    } */}

                </ScrollView>


            </View>

        );
    }
}

function mapStateToProps(state) {
    //console.log('mapStateToProps= ', JSON.stringify(state));
    return {
        homeScreenReducer: state.homeScreenReducer,
    }
}

export default connect(
    mapStateToProps,
    {
        getMaintenanceRequestList,
        getMaintenanceThreadList,
        getGeneralThreadList,
        getStatistics,
        likeProperty,
        getNoticeBoardList,
        getPropertyList,
        showLoading,
        resetState,
        getUnreadMessageList,
        onTabPressed,
    }

)(HomeScreen);
