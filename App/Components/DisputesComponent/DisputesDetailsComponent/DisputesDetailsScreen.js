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

    getMaintenanceReqDetail,

} from "../../../Action/ActionCreators";

import {

    showLoading,
    resetState,

} from "./DisputesDetailsAction";

import API from '../../../Constants/APIUrls';
import { Actions } from 'react-native-router-flux';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import DisputesDetailsScreenStyle from './DisputesDetailsScreenStyle';
import listData from '../../../../data';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import DisputeOverviewScreen from './DisputeOverviewScreen';
import GeneralCommunicationScreen from './GeneralCommunicationScreen';
import StarRating from 'react-native-star-rating';
let ref;

class DisputesDetailsScreen extends Component {

    constructor() {
        super();
        ref = this;
        this.state = {
            isTabSelected: 1,
            starCount: 3.5,
            maintenanceReqData: {}
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
       // this.onGetMaintenanceDetailSuccess();
    }

    componentWillUnmount() {

    }

    componentWillMount() {
       // this.callGetMaintenanceDetail(this.props.reqId);
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


    callGetMaintenanceDetail(id) {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                this.props.showLoading();
                this.props.getMaintenanceReqDetail(authToken, id);
            }
        }).done();
    }

    onGetMaintenanceDetailSuccess() {

        if (this.props.maintenanceRequestDetailsReducer.maintenanceReqDetailRes != '') {

            if (this.props.maintenanceRequestDetailsReducer.maintenanceReqDetailRes.code == 200) {

                this.setState({ maintenanceReqData: this.props.maintenanceRequestDetailsReducer.maintenanceReqDetailRes.data });
            }
            else {

                alert(this.props.maintenanceRequestDetailsReducer.maintenanceReqDetailRes.message);
            }
            this.props.resetState();
        }
    }



    navBar() {
        return (
            <View style={DisputesDetailsScreenStyle.profileHeaderContainer}>

                <TouchableOpacity onPress={() => this.closeNotifications()} style={{ marginLeft: 20, marginTop: 10 }}>
                    <Image source={ImagePath.BACK_WHITE} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.closeNotifications()} style={{ marginRight: 20, marginTop: 10 }}>
                    <View style={DisputesDetailsScreenStyle.optionViewStyle} >
                        <Image source={ImagePath.THREE_DOTS_ICON} />
                    </View>
                </TouchableOpacity>

            </View>
        );
    }

    render() {



        return (

            <View style={DisputesDetailsScreenStyle.profileContainer}>
                <View >

                    <Image source={ImagePath.HEADER_BG} style={DisputesDetailsScreenStyle.topCoverImageContainer} />

                    <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: Colors.TRANSPARENT }}>
                        <Text numberOfLines={2} style={{ color: Colors.WHITE, fontSize: 24, fontWeight: '600' }}>Unit 5, Oasis budiling, 3rd street : Despute #76</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Image source={ImagePath.PROPERTY_ID_ICON} style={{ margin: 3 }} />
                                <Text style={{ color: Colors.WHITE, fontSize: 14, marginLeft: 7 }}>PID : 10098273</Text>
                                <Text style={{ color: Colors.WHITE, fontSize: 14 }}> {this.state.maintenanceReqData.request_id}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Image source={ImagePath.CALENDAR_ICON} style={{ height: 15, width: 15, justifyContent: 'center' }} />
                                <Text style={{ color: Colors.WHITE, fontSize: 14, marginLeft: 5 }}>July 30, 2017</Text>
                            </View>
                        </View>
                    </View>
                    {this.navBar()}

                </View>
                <View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={DisputesDetailsScreenStyle.tabContainerScrollViewStyle}>
                        <View style={DisputesDetailsScreenStyle.tabContainerStyle}>

                            <TouchableOpacity onPress={() => this.onAllTabClick()} >
                                <View style={DisputesDetailsScreenStyle.tabTextViewContainerStyle}>
                                    <View style={DisputesDetailsScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 1) ? DisputesDetailsScreenStyle.tabLabelTextStyle : DisputesDetailsScreenStyle.tabLabelDiselectTextStyle}>{Strings.OVERVIEW}</Text>
                                    </View>
                                    {this.state.isTabSelected == 1 ? <View style={DisputesDetailsScreenStyle.tabIndicatorStyle}></View> : null}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onActiveTabClick()}>
                                <View>
                                    <View style={DisputesDetailsScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 2) ? DisputesDetailsScreenStyle.tabLabelTextStyle : DisputesDetailsScreenStyle.tabLabelDiselectTextStyle}>{Strings.GENERAL_COMMUNICATION}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 2) ? <View style={DisputesDetailsScreenStyle.tabIndicatorStyle}></View> : null}
                                </View>
                            </TouchableOpacity>

                        </View>
                    </ScrollView>
                </View>

                {(this.state.isTabSelected == 1) ?
                    <DisputeOverviewScreen />
                    : null}
                {(this.state.isTabSelected == 2) ?
                    <GeneralCommunicationScreen />
                    : null}

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
        getMaintenanceReqDetail,
        showLoading,
        resetState,
    }

)(DisputesDetailsScreen);


