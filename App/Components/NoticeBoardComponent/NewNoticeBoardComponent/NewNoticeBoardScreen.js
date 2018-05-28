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
    FlatList
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import NewNoticeBoardScreenStyle from './NewNoticeBoardScreenStyle';
import CheckBox from 'react-native-checkbox';
import { Dropdown } from 'react-native-material-dropdown';
import * as Progress from 'react-native-progress';
import listData from '../../../../data';

let propertyType = [{
    value: '1002944 : Apartment 901, Building 4, R',
}, {
    value: 'Rental',
}];
let contextRef;
var amenitiesSelectedArrray = [];


import {
    getUserRolesList,
    getMaintenancePropertyList,
} from "../../../Action/ActionCreators";

import {
    postDescriptionChanged,
    postNameChanged,
    resetState,
    showLoading
} from "../NoticeBoardAction";

class NewNoticeBoardScreen extends Component {
    constructor() {
        super();
        this.state = {
            amenitiesListData: {},
            userRolesData: [],
            propertyListData: [],
            errorMsg: '',
            errorOnTextField: '',
        };
        contextRef = this;
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onUserRoleSuccess();
        this.onPropertyListSuccess();
    }

    componentWillUnmount() {
        amenitiesSelectedArrray = [];
    }
    componentWillMount() {
        this.callPropertyList();
        this.callUserRoleList();
    }

    onPostNameChange(text) {

        this.props.postNameChange(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }

    onPostDescriptionChange(text) {

        this.props.postDescriptionChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }

    callUserRoleList() {
        this.props.getUserRolesList();
    }

    onUserRoleSuccess() {

        if (this.props.noticeBoardReducer.userRoleData != '') {
            if (this.props.noticeBoardReducer.userRoleData.code == 200) {
                //console.log('user role list data' + JSON.stringify(this.props.noticeBoardReducer.userRoleData.data))
                this.setState({ userRolesData: this.props.noticeBoardReducer.userRoleData.data });
            }
            else {
                alert(this.props.noticeBoardReducer.userRoleData.message);
            }
            this.props.resetState();
        }
    }


    callPropertyList() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    agency_id: userData.data.agency_id,
                    request_by_role: userData.data.role_id,
                    request_by_id: userData.data._id,
                }
                //this.props.showLoading();
                this.props.getMaintenancePropertyList(authToken, postData);
            }
        }).done();
    }

    onPropertyListSuccess() {

        if (this.props.noticeBoardReducer.propertyListData != '') {
            if (this.props.noticeBoardReducer.propertyListData.code == 200) {
                //console.log('Property list data' + JSON.stringify(this.props.noticeBoardReducer.propertyListData.data))
                this.setState({ propertyListData: this.preparePropertyListDropdownData(this.props.noticeBoardReducer.propertyListData.data) });
            }
            else {
                alert(this.props.noticeBoardReducer.propertyListData.message);
            }
            this.props.resetState();
        }
    }

    preparePropertyListDropdownData(propertyListData) {

        var tempArray = propertyListData;
        tempArray.map((data, index) => {

            tempArray[index].value = tempArray[index].address;
            tempArray[index].id = tempArray[index]._id;

        })
        return tempArray;
    }

    closeAddProperty() {
        Actions.pop();
    }

    callBack() {
        Actions.pop();
    }

    navBar() {
        return (
            <View >
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.NEW_NOTICE_BOARD}</Text>
                <TouchableOpacity onPress={() => this.closeAddProperty()} style={CommonStyles.navRightImageView} >
                    <Image source={ImagePath.DRAWER_CROSS_ICON} />
                </TouchableOpacity>
            </View>
        );
    }
    prePareAmenitiesData(amenitiesData) {

        var tempArray = amenitiesData;
        tempArray.map((data, index) => {

            tempArray[index].isChecked = false;
        })
        console.log('amenities modify list= ' + JSON.stringify(tempArray));
        return tempArray;

    }

    userRoleRenderItem({ item, index }) {
        return (
            <View style={NewNoticeBoardScreenStyle.amenitiesListItemContainerStyle}>

                <CheckBox
                    label={item.description}
                    labelStyle={NewNoticeBoardScreenStyle.amenitisListCheckboxLabelStyle}
                    checked={item.isSelected}
                    checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                    uncheckedImage={ImagePath.UNCHECK}
                    onChange={contextRef.onCheckBoxChangeListener.bind(contextRef, index)}
                />
            </View>
        );
    }

    onCheckBoxChangeListener(index) {
        //console.log('selected index== ',index);
        var tempData = this.updateCheckBoxSelection(index, this.state.userRolesData);
        this.setState({ userRolesData: tempData });
    }

    updateCheckBoxSelection(selectedIndex, userRolesData) {

        var tempArray = userRolesData;
        tempArray.map((data, index) => {

            if (tempArray[selectedIndex].isSelected) {
                tempArray[selectedIndex].isSelected = false;
            }
            else {
                tempArray[selectedIndex].isSelected = true;
            }

        })

        return tempArray;

    }

    render() {

        return (
            <View style={{ flex: 1 }}>
                {this.navBar()}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={NewNoticeBoardScreenStyle.scrollViewContainerStyle}>

                    <View style={NewNoticeBoardScreenStyle.viewContainer}>
                        <View style={NewNoticeBoardScreenStyle.addPropertyInputContainer}>

                            <Text style={NewNoticeBoardScreenStyle.labelStyle}>
                                {Strings.POST_TITLE}
                            </Text>
                            <TextInput style={NewNoticeBoardScreenStyle.inputTextStyle}
                                multiline={false}
                                onChangeText={this.onPostNameChange.bind(this)} />
                            {
                                this.state.errorMsg != '' && this.state.errorOnTextField == 1 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                            }
                        </View>
                    </View>

                    <View style={NewNoticeBoardScreenStyle.viewContainer}>
                        <View style={NewNoticeBoardScreenStyle.addPropertyInputContainer}>

                            <Text style={NewNoticeBoardScreenStyle.labelStyle}>
                                {Strings.POST_DETAILS_OR_DESCRIPTIONS}
                            </Text>
                            <TextInput style={NewNoticeBoardScreenStyle.inputDescriptionTextStyle}
                                multiline={true}
                                onChangeText={this.onPostDescriptionChange.bind(this)} />
                            {
                                this.state.errorMsg != '' && this.state.errorOnTextField == 2 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                            }
                        </View>
                    </View>

                    <View style={NewNoticeBoardScreenStyle.headerContainer}>
                        <Text style={NewNoticeBoardScreenStyle.labelStyle}>
                            {Strings.SELECT_PROPERTY}
                        </Text>
                        <Dropdown
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            containerStyle={NewNoticeBoardScreenStyle.dropDownViewStyle}
                            data={this.state.propertyListData}
                            value={this.state.propertyListData ? (this.state.propertyListData.length > 0 ? this.state.propertyListData[0].value : '') : ''}
                        />
                    </View>

                    <View style={NewNoticeBoardScreenStyle.addPropertyInputContainer}>
                        <Text style={NewNoticeBoardScreenStyle.labelStyle}>{Strings.ADD_MEMBERS}</Text>
                        <View style={NewNoticeBoardScreenStyle.amenitiesListViewStyle}>
                            <FlatList
                                data={this.state.userRolesData}
                                extraData={this.state}
                                renderItem={this.userRoleRenderItem}
                            />
                        </View>
                    </View>

                </ScrollView>

                <View style={NewNoticeBoardScreenStyle.buttonContainerStyle}>
                    <TouchableOpacity >
                        <View style={NewNoticeBoardScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={NewNoticeBoardScreenStyle.proceedButtonTextStyle}>
                                {Strings.CREATE}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

function mapStateToProps(state) {
    console.log('user roles mapStateToProps= ', JSON.stringify(state));
    return {
        noticeBoardReducer: state.noticeBoardReducer
    }
}

export default connect(
    mapStateToProps,
    {
        resetState,
        showLoading,
        getUserRolesList,
        getMaintenancePropertyList,
        postDescriptionChanged,
        postNameChanged,
    }

)(NewNoticeBoardScreen);

