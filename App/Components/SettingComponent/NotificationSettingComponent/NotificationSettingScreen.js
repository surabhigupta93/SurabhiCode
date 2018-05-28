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
    AsyncStorage
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import NotificationSettingScreenStyle from './NotificationSettingScreenStyle';
import CheckBox from 'react-native-checkbox';
import * as Progress from 'react-native-progress';

import {
    changeNotificationSetting,
} from "../../../Action/ActionCreators";

import {
    showLoading,
    resetState,
    clearResponse,
} from "./NotificationSettingAction";

var postData = {};


class NotificationSettingScreen extends Component {
    constructor() {
        super();
        this.state = {
            isNotification: false,
            authToken: '',
            userId: '',
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onChangeNotificationSuccess();
    }

    componentWillUnmount() {

    }


    componentWillMount() {
        this.getUserDetails();
    }


    getUserDetails() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                this.setState({ isNotification: userData.data.flag });
                this.setState({ authToken: userData.token });
                this.setState({ userId: userData.data._id });
            }
        }).done();
    }


    onCheckBoxClick() {

        if (this.state.isNotification) {

            this.setState({ isNotification: false });

        }
        else {

            this.setState({ isNotification: true });
        }

        postData = {
            userId: this.state.userId,
            chat_notification: this.state.isNotification,
            appointment_notification: this.state.isNotification,
            email_notification: this.state.isNotification,
            sms_notification: this.state.isNotification
        };
        console.log('on password userinfo : ' + this.state.authToken + ':' + JSON.stringify(postData));
        this.props.showLoading();
        this.props.changeNotificationSetting(this.state.authToken, postData);
    }

    onChangeNotificationSuccess() {

        if (this.props.notificationSettingReducer.notificationRes != '') {

            if (this.props.notificationSettingReducer.notificationRes.code == 200) {
                console.log('on password change userinfo : ' + JSON.stringify(this.props.notificationSettingReducer.notificationRes));

                //AsyncStorage.setItem("SyncittUserProfileInfo", JSON.stringify(this.props.notificationSettingReducer.notificationRes));

            }
            else {
                // alert(this.props.notificationSettingReducer.notificationRes.message);
            }
            this.props.resetState();
            this.props.clearResponse();
        }
    }


    render() {

        return (
            <View style={NotificationSettingScreenStyle.settingContainerStyle}>

                <CheckBox
                    label={Strings.NOTIFICATION_ALERT}
                    labelBefore={Strings.NOTIFICATION_ALERT}
                    labelStyle={NotificationSettingScreenStyle.textStyle}
                    checked={this.state.isNotification}
                    onChange={this.onCheckBoxClick.bind(this)}
                    checkedImage={ImagePath.CHECK_BOX_ACTIVE }
                    uncheckedImage={ImagePath.UNCHECK}

                />

                {   //23 Nov
                    this.props.notificationSettingReducer.isScreenLoading ?
                        <View style={CommonStyles.circles}>
                            <Progress.CircleSnail color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]} />
                        </View>
                        : null
                    //
                }
            </View>

        );
    }
}

function mapStateToProps(state) {
    console.log('mapStateToProps= ', JSON.stringify(state));
    return {
        notificationSettingReducer: state.notificationSettingReducer
    }
}

export default connect(
    mapStateToProps,
    {
        changeNotificationSetting,
        showLoading,
        resetState,
        clearResponse,
    }

)(NotificationSettingScreen);
