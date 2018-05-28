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
    Modal
} from 'react-native';

import {
    cancelMaintenanceReq,
    getMaintenanceReqDetail,

} from "../../../Action/ActionCreators";

import {

    showLoading,
    resetState,

} from "./MaintenanceRequestDetailsAction";

import API from '../../../Constants/APIUrls';
import { Actions } from 'react-native-router-flux';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import MaintenanceRequestDetailsScreenStyle from './MaintenanceRequestDetailsScreenStyle';
import listData from '../../../../data';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import ThreadScreen from './ThreadComponent/ThreadScreen';
import TrackerScreen from './TrackerScreen';
import RequestDetailScreen from './RequestDetailScreen';
import StarRating from 'react-native-star-rating';
import * as Progress from 'react-native-progress';
let ref;

class MaintenanceRequestDetails extends Component {

    constructor() {
        super();
        ref = this;
        this.state = {
            isTabSelected: 0,
            starCount: 3.5,
            maintenanceReqData: {},
            isShowPopup: false
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onGetMaintenanceDetailSuccess();
        this.onCancelMaintenanceReqSuccess();
    }

    componentWillUnmount() {

    }

    componentWillMount() {
        this.callGetMaintenanceDetail(this.props.reqId);
    }

    closeNotifications() {
        Actions.popTo('Dashboard');
    }

    onAllTabClick() {

        this.setState({ isTabSelected: 1 });
    }
    onActiveTabClick() {

        this.setState({ isTabSelected: 2 });
    }
    onRequestedByTenentTabClick() {

        this.setState({ isTabSelected: 3 });
    }

    callGetMaintenanceDetail(id) {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                console.log('maintenance id= ',id);
                this.props.showLoading();
                this.props.getMaintenanceReqDetail(authToken, id);
            }
        }).done();
    }
    callCancelMaintenanceReq(id) {
        this.showPopup();
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                this.props.showLoading();
                this.props.cancelMaintenanceReq(authToken, id);
            }
        }).done();
    }

    onCancelMaintenanceReqSuccess() {

        if (this.props.maintenanceRequestDetailsReducer.cancelMaintenanceReqRes != '') {

            if (this.props.maintenanceRequestDetailsReducer.cancelMaintenanceReqRes.code == 200) {

                alert(this.props.maintenanceRequestDetailsReducer.cancelMaintenanceReqRes.message);
                Actions.pop();
                //this.setState({maintenanceReqData:this.props.maintenanceRequestDetailsReducer.cancelMaintenanceReqRes.data});              
            }
            else {

                alert(this.props.maintenanceRequestDetailsReducer.cancelMaintenanceReqRes.message);
            }
            this.props.resetState();
        }
    }

    onGetMaintenanceDetailSuccess() {

        if (this.props.maintenanceRequestDetailsReducer.maintenanceReqDetailRes != '') {

            if (this.props.maintenanceRequestDetailsReducer.maintenanceReqDetailRes.code == 200) {
                console.log('this.props.maintenanceRequestDetailsReducer.maintenanceReqDetailRes' + JSON.stringify(this.props.maintenanceRequestDetailsReducer.maintenanceReqDetailRes));
                this.setState({ maintenanceReqData: this.props.maintenanceRequestDetailsReducer.maintenanceReqDetailRes.data });
                this.setState({ isTabSelected: 1 });
            }
            else {

                alert(this.props.maintenanceRequestDetailsReducer.maintenanceReqDetailRes.message);
            }
            this.props.resetState();
        }
    }

    showPopup() {

        if (this.state.isShowPopup == false) {

            this.setState({ isShowPopup: true });
        }
        else {

            this.setState({ isShowPopup: false });
        }
    }

    navBar() {
        return (
            <View style={MaintenanceRequestDetailsScreenStyle.profileHeaderContainer}>

                <TouchableOpacity onPress={() => this.closeNotifications()} style={{ marginLeft: 20, marginTop: 10 }}>
                    <Image source={ImagePath.BACK_WHITE} />
                </TouchableOpacity>

                <TouchableOpacity onPress={this.showPopup.bind(this)} style={{ marginRight: 20, marginTop: 10 }}>
                    <View style={MaintenanceRequestDetailsScreenStyle.optionViewStyle} >
                        <Image source={ImagePath.THREE_DOTS_ICON} />
                    </View>
                </TouchableOpacity>

                {
                    (this.state.isShowPopup) ?

                        <Modal transparent >
                            <TouchableOpacity onPress={this.showPopup.bind(this)} style={MaintenanceRequestDetailsScreenStyle.modalContainer}>
                                <View style={{
                                    flex: 1, justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <View style={MaintenanceRequestDetailsScreenStyle.modalContainerStyles}>
                                        <TouchableOpacity style={{ marginTop: 10 }}>

                                            <View style={MaintenanceRequestDetailsScreenStyle.roundedGrayButtonStyle}>
                                                <Text style={MaintenanceRequestDetailsScreenStyle.grayButtonTextStyle}>
                                                    {Strings.APPROVE_REQUEST}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>


                                        <TouchableOpacity style={{ marginBottom: 20 }} onPress={this.callCancelMaintenanceReq.bind(this, this.props.reqId)}>
                                            <View style={MaintenanceRequestDetailsScreenStyle.roundedTransparentButtonStyle}>
                                                <Text style={MaintenanceRequestDetailsScreenStyle.redTextStyle}>
                                                    {Strings.CANCEL_REQ}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Modal> : null
                }


            </View>
        );
    }

    render() {

        return (

            <View style={MaintenanceRequestDetailsScreenStyle.profileContainer}>
                <View >

                    <Image source={ImagePath.HEADER_BG} style={MaintenanceRequestDetailsScreenStyle.topCoverImageContainer} />

                    <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: Colors.TRANSPARENT }}>
                        <Text numberOfLines={2} style={{ color: Colors.WHITE, fontSize: 24, fontWeight: '600' }}>{this.state.maintenanceReqData.request_overview}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Image source={ImagePath.PROPERTY_ID_ICON} style={{ margin: 3 }} />
                                <Text style={{ color: Colors.WHITE, fontSize: 14, marginLeft: 7 }}>PID : </Text>
                                <Text style={{ color: Colors.WHITE, fontSize: 14 }}> {this.state.maintenanceReqData.request_id}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Image source={ImagePath.DRAWER_TRADERS} style={{ height: 15, width: 15, justifyContent: 'center' }} />
                                <Text style={{ color: Colors.WHITE, fontSize: 14, marginLeft: 5 }}>{this.state.maintenanceReqData.trader_id ? this.state.maintenanceReqData.trader_id.firstname + ' ' + this.state.maintenanceReqData.trader_id.lastname : ''}</Text>
                            </View>
                        </View>
                    </View>
                    {this.navBar()}

                </View>
                <View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={MaintenanceRequestDetailsScreenStyle.tabContainerScrollViewStyle}>
                        <View style={MaintenanceRequestDetailsScreenStyle.tabContainerStyle}>

                            <TouchableOpacity onPress={() => this.onAllTabClick()} >
                                <View >
                                    <View style={MaintenanceRequestDetailsScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 1) ? MaintenanceRequestDetailsScreenStyle.tabLabelTextStyle : MaintenanceRequestDetailsScreenStyle.tabLabelDiselectTextStyle}>{Strings.TRACKER}</Text>
                                    </View>
                                    {this.state.isTabSelected == 1 ? <View style={MaintenanceRequestDetailsScreenStyle.tabIndicatorStyle}></View> :
                                        <View style={MaintenanceRequestDetailsScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onActiveTabClick()}>
                                <View>
                                    <View style={MaintenanceRequestDetailsScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 2) ? MaintenanceRequestDetailsScreenStyle.tabLabelTextStyle : MaintenanceRequestDetailsScreenStyle.tabLabelDiselectTextStyle}>{Strings.REQUEST_DETAILS}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 2) ? <View style={MaintenanceRequestDetailsScreenStyle.tabIndicatorStyle}></View> :
                                        <View style={MaintenanceRequestDetailsScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onRequestedByTenentTabClick()}>
                                <View>
                                    <View style={MaintenanceRequestDetailsScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 3) ? MaintenanceRequestDetailsScreenStyle.tabLabelTextStyle : MaintenanceRequestDetailsScreenStyle.tabLabelDiselectTextStyle}>{Strings.THREAD}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 3) ? <View style={MaintenanceRequestDetailsScreenStyle.tabIndicatorStyle}></View> :
                                        <View style={MaintenanceRequestDetailsScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
                {(this.state.isTabSelected == 1) ?
                    <TrackerScreen reqDetailData={this.state.maintenanceReqData} />
                    : null}

                {(this.state.isTabSelected == 2) ?
                    <RequestDetailScreen reqDetailData={this.state.maintenanceReqData} />
                    : null}
                {(this.state.isTabSelected == 3) ?
                    <ThreadScreen reqDetailData={this.state.maintenanceReqData}/>
                    : null}

                {
                    this.props.maintenanceRequestDetailsReducer.isScreenLoading ?
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
    console.log('maintenance screen mapStateToProps= ', JSON.stringify(state));
    return {
        maintenanceRequestDetailsReducer: state.maintenanceRequestDetailsReducer
    }
}

export default connect(
    mapStateToProps,
    {
        cancelMaintenanceReq,
        getMaintenanceReqDetail,
        showLoading,
        resetState,
    }

)(MaintenanceRequestDetails);


