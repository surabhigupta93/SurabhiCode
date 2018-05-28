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
    AsyncStorage,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import AccountSecurityStyle from './AccountSecurityScreenStyle';
import * as Progress from 'react-native-progress';

import {
    changePassword,
} from "../../../Action/ActionCreators";

import {
    currentPasswordChanged,
    newPasswordChanged,
    showLoading,
    resetState,
    clearResponse,
} from "./AccountSecurityAction";

var postData = {};

class AccountSecurityScreen extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            userId: '',
            authToken: '',
            errorMsg: '',
            errorOnTextField: '',
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onChangePasswordSuccess();
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
                this.setState({ email: userData.data.email });
                this.setState({ userId: userData.data._id });
                this.setState({ authToken: userData.token });
            }
        }).done();
    }


    onCurrentPasswordChange(text) {

        this.props.currentPasswordChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }

    onNewPasswordChange(text) {

        this.props.newPasswordChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }

    onChangePasswordClick() {

        if (this.props.accountSecurityReducer.currentPassword.trim() == '') {

            this.setState({ errorMsg: Strings.ERROR_CURRENT_PASSWORD });
            this.setState({ errorOnTextField: 1 });
        } else if (this.props.accountSecurityReducer.newPassword.trim() == '') {

            this.setState({ errorMsg: Strings.ERROR_NEW_PASSWORD });
            this.setState({ errorOnTextField: 2 });
        }
        else {

            postData = {
                userId: this.state.userId,
                oldPassword: this.props.accountSecurityReducer.currentPassword,
                newPassword: this.props.accountSecurityReducer.newPassword,

            };
            console.log('on password userinfo : ' + this.state.authToken + ':' + JSON.stringify(postData));
            this.props.showLoading();
            this.props.changePassword(this.state.authToken, postData);
        }

    }
    onChangePasswordSuccess() {

        if (this.props.accountSecurityReducer.changePasswordRes != '') {

            if (this.props.accountSecurityReducer.changePasswordRes.code == 200) {
                console.log('on password change userinfo : ' + JSON.stringify(this.props.accountSecurityReducer.changePasswordRes));

                AsyncStorage.setItem("SyncittUserProfileInfo", JSON.stringify(this.props.accountSecurityReducer.changePasswordRes));
            }
            else {
                alert(this.props.accountSecurityReducer.changePasswordRes.message);
            }
            this.props.resetState();
            this.props.clearResponse();
        }
    }


    render() {

        return (
            <View style={AccountSecurityStyle.settingContainerStyle}>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={AccountSecurityStyle.scrollViewContainerStyle}>

                    <View style={AccountSecurityStyle.profileBottomContainerStyle}>
                        <Text style={AccountSecurityStyle.labelStyle}>
                            {Strings.EMAIL_ADDRESS}
                        </Text>

                        <TextInput style={AccountSecurityStyle.inputTextStyle}
                            autoCapitalize='none'
                            autoCorrect={false}
                            underlineColorAndroid='transparent'
                            editable={false}
                            value={this.state.email} />

                        <Text style={AccountSecurityStyle.labelStyle}>
                            {Strings.CURRENT_PASSWORD}
                        </Text>
                        <TextInput style={AccountSecurityStyle.inputTextStyle}
                            placeholder={Strings.PASSWORD}
                            autoCapitalize='none'
                            autoCorrect={false}
                            underlineColorAndroid='transparent'
                            returnKeyType='next'
                            secureTextEntry={true}
                            maxLength={20}
                            onChangeText={this.onCurrentPasswordChange.bind(this)}
                            value={this.props.accountSecurityReducer.currentPassword}
                        />
                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 1 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }
                        <Text style={AccountSecurityStyle.labelStyle}>
                            {Strings.NEW_PASSWORD}
                        </Text>
                        <TextInput style={AccountSecurityStyle.inputTextStyle}
                            placeholder={Strings.PASSWORD}
                            autoCapitalize='none'
                            autoCorrect={false}
                            underlineColorAndroid='transparent'
                            returnKeyType='done'
                            secureTextEntry={true}
                            maxLength={20}
                            onChangeText={this.onNewPasswordChange.bind(this)}
                            value={this.props.accountSecurityReducer.newPassword}
                        />
                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 2 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }
                    </View>
                </ScrollView>

                <View style={AccountSecurityStyle.bottomViewStyle} >
                    <TouchableOpacity onPress={() => this.onChangePasswordClick()}>
                        <View style={AccountSecurityStyle.roundedBlueSaveButtonStyle}>
                            <Text style={AccountSecurityStyle.saveButtonTextStyle}>
                                {Strings.SAVE_CHANGES}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {   //23 Nov
                    this.props.accountSecurityReducer.isScreenLoading ?
                        <View style={CommonStyles.circles}>
                            <Progress.CircleSnail color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]} />
                        </View>
                        : null
                    //
                }
            </View >
        );
    }
}

function mapStateToProps(state) {
    console.log('mapStateToProps= ', JSON.stringify(state));
    return {
        accountSecurityReducer: state.accountSecurityReducer
    }
}

export default connect(
    mapStateToProps,
    {
        changePassword,
        currentPasswordChanged,
        newPasswordChanged,
        showLoading,
        resetState,
        clearResponse,
    }

)(AccountSecurityScreen);
