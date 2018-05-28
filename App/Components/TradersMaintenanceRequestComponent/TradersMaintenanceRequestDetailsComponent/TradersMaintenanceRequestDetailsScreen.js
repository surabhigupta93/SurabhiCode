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

    getMaintenanceReqDetail,

} from "../../../Action/ActionCreators";

import {

    showLoading,
    resetState,

} from "./TradersMaintenanceRequestDetailsAction";

import API from '../../../Constants/APIUrls';
import { Actions } from 'react-native-router-flux';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import TradersMaintenanceRequestDetailsScreenStyle from './TradersMaintenanceRequestDetailsScreenStyle';
import listData from '../../../../data';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import ThreadScreen from './ThreadComponent/ThreadScreen';
import TrackerScreen from './TradersTrackerScreen';
import RequestDetailScreen from './TradersRequestDetailScreen';
import StarRating from 'react-native-star-rating';
let ref;

class TradersMaintenanceRequestDetails extends Component {

    constructor() {
        super();
        ref = this;
        this.state = {
            isTabSelected: 1,
            starCount: 3.5,
            maintenanceReqData: {},
            isShowPopup:false
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onGetMaintenanceDetailSuccess();
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


    // req_status:{type: Number,default:1}, // 1 for sent , 2 for accepted, 3 for booked, 4 for completed, 5 for closed, 6 for due, 7 denied  
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

    onGetMaintenanceDetailSuccess(){

          if(this.props.tradersMaintenanceDetailsReducer.maintenanceReqDetailRes!=''){

            if(this.props.tradersMaintenanceDetailsReducer.maintenanceReqDetailRes.code==200){

                this.setState({maintenanceReqData:this.props.tradersMaintenanceDetailsReducer.maintenanceReqDetailRes.data});              
            }   
            else{
                
                alert(this.props.tradersMaintenanceDetailsReducer.maintenanceReqDetailRes.message);
            }
            this.props.resetState();
        }
    }

    showPopup(){
        
        if(this.state.isShowPopup==false){
            
            this.setState({isShowPopup:true});
        }
        else{
            
            this.setState({isShowPopup:false});
        }
    }

    navBar() {
        return (
            <View style={TradersMaintenanceRequestDetailsScreenStyle.profileHeaderContainer}>

                <TouchableOpacity onPress={() => this.closeNotifications()} style={{ marginLeft: 20, marginTop: 10 }}>
                    <Image source={ImagePath.HEADER_BACK} />
                </TouchableOpacity>

                <TouchableOpacity onPress={this.showPopup.bind(this)} style={{ marginRight: 20, marginTop: 10 }}>
                    <View style={TradersMaintenanceRequestDetailsScreenStyle.optionViewStyle} >
                        <Image source={ImagePath.THREE_DOTS_ICON} />
                    </View>
                </TouchableOpacity>

                {
                    (this.state.isShowPopup)?

                        <Modal transparent >
                            <TouchableOpacity onPress={this.showPopup.bind(this)} style={TradersMaintenanceRequestDetailsScreenStyle.modalContainer}>
                                <View style={{flex:1, justifyContent: 'center',
                                    alignItems: 'center'}}>
                                    <View style={TradersMaintenanceRequestDetailsScreenStyle.modalContainerStyles}>
                                        <TouchableOpacity  style={{marginTop:10}}>
                    
                                            <View style={TradersMaintenanceRequestDetailsScreenStyle.roundedGrayButtonStyle}>
                                                <Text style={TradersMaintenanceRequestDetailsScreenStyle.grayButtonTextStyle}>
                                                    {Strings.APPROVE_REQUEST}
                                                </Text>
                                            </View>

                                        </TouchableOpacity>

                                                
                                        <TouchableOpacity style={{marginBottom:20}} >

                                            <View style={TradersMaintenanceRequestDetailsScreenStyle.roundedTransparentButtonStyle}>
                                                <Text style={TradersMaintenanceRequestDetailsScreenStyle.redTextStyle}>
                                                        {Strings.CANCEL_REQ}
                                                </Text>
                                            </View>

                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </TouchableOpacity>   
                        </Modal>:null
                    }


            </View>
        );
    }

    render() {

      

        return (

            <View style={TradersMaintenanceRequestDetailsScreenStyle.profileContainer}>
                <View >
                    
                    <Image source={ImagePath.HEADER_BG} style={TradersMaintenanceRequestDetailsScreenStyle.topCoverImageContainer} />

                        <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: Colors.TRANSPARENT }}>
                            <Text numberOfLines={2}  style={{ color: Colors.WHITE, fontSize: 24, fontWeight: '600' }}>{this.state.maintenanceReqData.request_overview}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>

                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <Image source={ImagePath.PROPERTY_ID_ICON} style={{ margin: 3 }} />
                                    <Text style={{ color: Colors.WHITE, fontSize: 14, marginLeft: 7 }}>PID : </Text>
                                    <Text style={{ color: Colors.WHITE, fontSize: 14 }}> {this.state.maintenanceReqData.request_id}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <Image source={ImagePath.DRAWER_TRADERS} style={{ height: 15, width: 15, justifyContent: 'center' }} />
                                    <Text style={{ color: Colors.WHITE, fontSize: 14, marginLeft: 5 }}>{this.state.maintenanceReqData.trader_id?this.state.maintenanceReqData.trader_id.firstname+' '+this.state.maintenanceReqData.trader_id.lastname:''}</Text>
                                </View>
                            </View>
                        </View>
                    {this.navBar()}

                </View>
               <View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={TradersMaintenanceRequestDetailsScreenStyle.tabContainerScrollViewStyle}>
                        <View style={TradersMaintenanceRequestDetailsScreenStyle.tabContainerStyle}>

                            <TouchableOpacity onPress={() => this.onAllTabClick()} >
                                <View >
                                    <View style={TradersMaintenanceRequestDetailsScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 1) ? TradersMaintenanceRequestDetailsScreenStyle.tabLabelTextStyle : TradersMaintenanceRequestDetailsScreenStyle.tabLabelDiselectTextStyle}>{Strings.TRACKER}</Text>
                                    </View>
                                    {this.state.isTabSelected == 1 ? <View style={TradersMaintenanceRequestDetailsScreenStyle.tabIndicatorStyle}></View> :
                                        <View style={TradersMaintenanceRequestDetailsScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onActiveTabClick()}>
                                <View>
                                    <View style={TradersMaintenanceRequestDetailsScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 2) ? TradersMaintenanceRequestDetailsScreenStyle.tabLabelTextStyle : TradersMaintenanceRequestDetailsScreenStyle.tabLabelDiselectTextStyle}>{Strings.REQUEST_DETAILS}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 2) ? <View style={TradersMaintenanceRequestDetailsScreenStyle.tabIndicatorStyle}></View> :
                                        <View style={TradersMaintenanceRequestDetailsScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onRequestedByTenentTabClick()}>
                                <View>
                                    <View style={TradersMaintenanceRequestDetailsScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 3) ? TradersMaintenanceRequestDetailsScreenStyle.tabLabelTextStyle : TradersMaintenanceRequestDetailsScreenStyle.tabLabelDiselectTextStyle}>{Strings.THREAD}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 3) ? <View style={TradersMaintenanceRequestDetailsScreenStyle.tabIndicatorStyle}></View> :
                                        <View style={TradersMaintenanceRequestDetailsScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
                {(this.state.isTabSelected == 1) ?
                    <TrackerScreen reqDetailData={ this.state.maintenanceReqData}/>
                    : null}

                {(this.state.isTabSelected == 2) ?
                    <RequestDetailScreen reqDetailData={ this.state.maintenanceReqData}/>
                    : null}
                {(this.state.isTabSelected == 3) ?
                    <ThreadScreen reqDetailData={ this.state.maintenanceReqData} />
                    : null}
            </View>

        );
    }
}

function mapStateToProps(state) {
    console.log('maintenance screen mapStateToProps= ', JSON.stringify(state));
    return {
        tradersMaintenanceDetailsReducer: state.tradersMaintenanceDetailsReducer
    }
}

export default connect(
    mapStateToProps,
    {
        getMaintenanceReqDetail,
        showLoading,
        resetState,
    }

)(TradersMaintenanceRequestDetails);


