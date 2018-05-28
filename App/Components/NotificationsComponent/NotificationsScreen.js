
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
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import NotificationsScreenStyle from './NotificationsScreenStyle';
import { CardViewWithLowMargin } from '../CommonComponent/CardViewWithLowMargin';
import listData from '../../../data';
import { Dropdown } from 'react-native-material-dropdown';
import API from '../../Constants/APIUrls';
import Moment from 'moment';
import * as Progress from 'react-native-progress';
import {
    getNotificationList,
} from "../../Action/ActionCreators";
import {

    showLoading,
    resetState,
} from "./NotificationScreenAction";
let ref;
class NotificationsScreen extends Component {
    constructor() {
        super();
        ref = this;
        this.state = {
            notificationListData: [],
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onNotificationListSuccess();
    }

    componentWillUnmount() {

    }

    componentWillMount() {
        this.callNotificationList();
    }

    callNotificationList() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var postdata = {};
                var userData = JSON.parse(value);
                var authToken = userData.token;
                postdata = {
                    user_id: userData.data._id,
                };
                this.props.showLoading();
                this.props.getNotificationList(authToken, postdata);
            }
        }).done();
    }

    onNotificationListSuccess() {
        if (this.props.notificationScreenReducer.notificationListResponse != '') {
            if (this.props.notificationScreenReducer.notificationListResponse.code == 200) {
                //console.log('notification list data== ', JSON.stringify(this.props.notificationScreenReducer.notificationListResponse));
                this.setState({ notificationListData: this.props.notificationScreenReducer.notificationListResponse.data });
            }
            else {
                alert(this.props.notificationScreenReducer.notificationListResponse.message);
            }
            this.props.resetState();
        }
    }


    closeNotifications() {
        Actions.popTo('Dashboard');
    }

    navBar() {
        return (
            <View style={CommonStyles.navBarMainView}>
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.NOTIFICATIONS}</Text>
                <TouchableOpacity onPress={() => this.closeNotifications()} style={CommonStyles.navRightImageView}>
                    <Image source={ImagePath.DRAWER_CROSS_ICON} />
                </TouchableOpacity>
            </View>
        );
    }

    renderItem({ item, index }) {
        var userImagePath = item.from_user.image ? API.USER_IMAGE_PATH + item.from_user.image : '';
        return (
            <CardViewWithLowMargin>
                <View style={NotificationsScreenStyle.listContainerStyle}>

                    <View style={NotificationsScreenStyle.imageContainerStyle}>
                        <Image source={{ uri: userImagePath }} style={NotificationsScreenStyle.userImageStyle} />
                    </View>
                    <View >
                        <View style={NotificationsScreenStyle.detailTitleContainerStyle}>
                            <Text style={NotificationsScreenStyle.detailTitleTextStyle}>{item.subject}</Text>
                            <Text style={NotificationsScreenStyle.messageTimeTextStyle}>{Moment(item.createdAt).fromNow()}</Text>

                        </View>
                        <Text style={NotificationsScreenStyle.detailTextStyle}>{item.message}</Text>

                    </View>
                </View>
            </CardViewWithLowMargin>
        );
    }

    render() {

        return (
            <View>
                {this.navBar()}

                <View style={NotificationsScreenStyle.searchViewStyle} />


                <FlatList contentContainerStyle={{ paddingBottom: 150 }}
                    data={this.state.notificationListData}
                    renderItem={this.renderItem}
                />

                {

                    this.props.notificationScreenReducer.isScreenLoading ?
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
    console.log('mapStateToProps= ', JSON.stringify(state));
    return {
        notificationScreenReducer: state.notificationScreenReducer
    }
}

export default connect(
    mapStateToProps,
    {
        getNotificationList,
        showLoading,
        resetState,
    }

)(NotificationsScreen);
