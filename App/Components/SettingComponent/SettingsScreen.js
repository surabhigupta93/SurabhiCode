import React, { Component } from 'react';
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
    ScrollView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import SettingsScreenStyle from './SettingsScreenStyle';

import ProfileSettingScreen from './ProfileSettingComponent/ProfileSettingScreen';
import AccountSecurityScreen from './AccountSecurityComponent/AccountSecurityScreen';
import NotificationSettingScreen from './NotificationSettingComponent/NotificationSettingScreen';
import UserRoleScreen from './UserRoleComponent/UserRoleScreen';
import UserImageScreen from './UserImagesComponent/UserImageScreen';

class SettingsScreen extends Component {
    constructor() {
        super();
        this.state = {
            isTabSelected: 1,
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    onProfileSettingTabClick() {

        this.setState({ isTabSelected: 1 });
    }

    onAccountSecurityTabClick() {

        this.setState({ isTabSelected: 2 });
    }

    onNotificationSettingTabClick() {

        this.setState({ isTabSelected: 3 });
    }

    onUserRoleTabClick() {
        this.setState({ isTabSelected: 4 });
    }

    onUserImageTabClick() {
        this.setState({ isTabSelected: 5 });
    }

    navBar() {
        return (
            <View >
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.ACCOUNT_SETTINGS}</Text>
            </View>
        );
    }

    render() {

        return (
            <View style={SettingsScreenStyle.settingContainerStyle}>
                {this.navBar()}
                <View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={SettingsScreenStyle.tabContainerScrollViewStyle}>
                        <View style={SettingsScreenStyle.tabContainerStyle}>

                            <TouchableOpacity onPress={() => this.onProfileSettingTabClick()} >

                                <View>
                                    <View style={SettingsScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 1) ? SettingsScreenStyle.tabLabelTextStyle : SettingsScreenStyle.tabLabelDiselectTextStyle}>{Strings.PROFILE}</Text>
                                    </View>
                                    {this.state.isTabSelected == 1 ? <View style={SettingsScreenStyle.tabIndicatorStyle}></View> : <View style={SettingsScreenStyle.tabWhiteIndicatorStyle}></View> }
                                </View>

                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onAccountSecurityTabClick()}>

                                <View>
                                    <View style={SettingsScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 2) ? SettingsScreenStyle.tabLabelTextStyle : SettingsScreenStyle.tabLabelDiselectTextStyle}>{Strings.ACCOUNT_SECURITY}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 2) ? <View style={SettingsScreenStyle.tabIndicatorStyle}></View> :
                                    <View style={SettingsScreenStyle.tabWhiteIndicatorStyle}></View> }
                                </View>

                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onNotificationSettingTabClick()}>

                                <View>
                                    <View style={SettingsScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 3) ? SettingsScreenStyle.tabLabelTextStyle : SettingsScreenStyle.tabLabelDiselectTextStyle}>{Strings.NOTIFICATIONS}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 3) ? <View style={SettingsScreenStyle.tabIndicatorStyle}></View> : <View style={SettingsScreenStyle.tabWhiteIndicatorStyle}></View> }
                                </View>

                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onUserRoleTabClick()}>

                                <View>
                                    <View style={SettingsScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 4) ? SettingsScreenStyle.tabLabelTextStyle : SettingsScreenStyle.tabLabelDiselectTextStyle}>{Strings.USER_ROLE}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 4) ? <View style={SettingsScreenStyle.tabIndicatorStyle}></View> : <View style={SettingsScreenStyle.tabWhiteIndicatorStyle}></View> }
                                </View>

                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onUserImageTabClick()}>

                                <View>
                                    <View style={SettingsScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 5) ? SettingsScreenStyle.tabLabelTextStyle : SettingsScreenStyle.tabLabelDiselectTextStyle}>{Strings.USER_IMAGES}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 5) ? <View style={SettingsScreenStyle.tabIndicatorStyle}></View> : <View style={SettingsScreenStyle.tabWhiteIndicatorStyle}></View> }
                                </View>

                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
                {
                    (this.state.isTabSelected == 1) ?
                        <ProfileSettingScreen />
                        : null
                }
                {
                    (this.state.isTabSelected == 2) ?
                        <AccountSecurityScreen />
                        : null
                }
                {
                    (this.state.isTabSelected == 3) ?
                        <NotificationSettingScreen />
                        : null
                }
                {
                    (this.state.isTabSelected == 4) ?
                        <UserRoleScreen />
                        : null
                }
                {
                    (this.state.isTabSelected == 5) ?
                        <UserImageScreen />
                        : null
                }
            </View >

        );
    }
}

export default SettingsScreen;
