
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
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import MaintenanceRequestScreenStyle from './MaintenanceRequestScreenStyle';
import listData from '../../../data';
import { Dropdown } from 'react-native-material-dropdown';
import { CardWithWhiteBG } from '../CommonComponent/CardWithWhiteBG';
import * as Progress from 'react-native-progress';
import Moment from 'moment';
import API from '../../Constants/APIUrls';
import {

    getMaintenanceReqByTenant,
    getMaintenanceRequestList,

} from "../../Action/ActionCreators";
import {

    showLoading,
    resetState,

} from "./MaintenanceAction";
import FilterScreen from '../FilterComponent/FilterScreen';

let ref;
class MaintenanceRequestScreen extends Component {
    constructor() {
        super();
        ref = this;
        this.state = {
            isTabSelected: 1,
            maintenanceData: [],
            tenantReqData: [],
            activeReqData: [],
            isFilter: false,
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {

        this.onMaintenanceRquestSuccess();
        this.onMaintenanceRquestByTenantSuccess();
    }

    componentWillUnmount() {

    }

    componentWillMount() {

        this.callGetMaintenanceRequest();
    }

    onFilterClick() {

        if (this.state.isFilter) {

            this.setState({ isFilter: false });
        }
        else {

            this.setState({ isFilter: true });
        }
    }

    onAllTabClick() {

        this.setState({ isTabSelected: 1 });
    }
    
    onActiveTabClick() {

        this.setState({ isTabSelected: 2 });
    }

    onRequestedByTenentTabClick() {

        this.setState({ isTabSelected: 3 });
        this.callGetMaintenanceRequestByTenant();
    }

    callAddPostScreen() {

        Actions.NewMaintenanceRequestScreen();

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
                console.log('maintenance req = ', JSON.stringify(postData));
                this.props.showLoading();
                this.props.getMaintenanceRequestList(authToken, postData);
            }
        }).done();
    }

    callGetMaintenanceRequestByTenant() {

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
                console.log('maintenance req by tenant= ', JSON.stringify(postData));
                this.props.getMaintenanceReqByTenant(authToken, postData);
            }
        }).done();
    }

    onMaintenanceRquestSuccess() {

        if (this.props.maintenanceReducer.maintenanceListResponse != '') {
            if (this.props.maintenanceReducer.maintenanceListResponse.code == 200) {

                this.setState({ maintenanceData: this.props.maintenanceReducer.maintenanceListResponse.data, activeReqData: this.prePareActiveReqData(this.props.maintenanceReducer.maintenanceListResponse.data) });
            }
            else {

                alert(this.props.maintenanceReducer.maintenanceListResponse.message);
            }
        }
        this.props.resetState();
    }

    prePareActiveReqData(maintenancedata) {

        var tempArray = [];
        maintenancedata.map((data, index) => {

            if (maintenancedata[index].req_status != 4 && maintenancedata[index].req_status != 5 && maintenancedata[index].req_status != 7) {

                tempArray.push(maintenancedata[index]);
            }

        })
        return tempArray;
    }

    onMaintenanceRquestByTenantSuccess() {

        if (this.props.maintenanceReducer.maintenanceListReqByTenantResponse != '') {
            if (this.props.maintenanceReducer.maintenanceListReqByTenantResponse.code == 200) {
                this.setState({ tenantReqData: this.props.maintenanceReducer.maintenanceListReqByTenantResponse.data });
            }
            else {
                alert(this.props.maintenanceReducer.maintenanceListReqByTenantResponse.message);
            }
        }
        this.props.resetState();
    }


    navBar() {
        return (
            <View>
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.MAINTENANCE_REQUEST}</Text>
                <TouchableOpacity onPress={() => this.callAddPostScreen()} style={CommonStyles.navPlusImageView} >
                    <View>
                        <Image source={ImagePath.PLUS_ICON} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    renderStatusView(item) {
        // 1 for sent , 2 for accepted, 3 for booked, 4 for completed, 5 for closed, 6 for due, 7 denied

        switch (item.req_status) {

            case 1:
                return (
                    <View style={MaintenanceRequestScreenStyle.statusSentViewStyle}>
                        <Text style={MaintenanceRequestScreenStyle.statusViewTextStyle}>SENT</Text>
                    </View>
                );
                break;
            case 2:
                return (
                    <View style={MaintenanceRequestScreenStyle.statusAcceptedViewStyle}>
                        <Text style={MaintenanceRequestScreenStyle.statusViewTextStyle}>ACCEPTED</Text>
                    </View>
                );
                break;
            case 3:
                return (
                    <View style={MaintenanceRequestScreenStyle.statusBookViewStyle}>
                        <Text style={MaintenanceRequestScreenStyle.statusViewTextStyle}>BOOKED</Text>
                    </View>
                );
                break;

            case 4:
                return (
                    <View style={MaintenanceRequestScreenStyle.statusCompletedViewStyle}>
                        <Text style={MaintenanceRequestScreenStyle.statusViewTextStyle}>COMPLETED</Text>
                    </View>
                );
                break;
            case 5:
                return (
                    <View style={MaintenanceRequestScreenStyle.statusOverDueViewStyle}>
                        <Text style={MaintenanceRequestScreenStyle.statusViewTextStyle}>COLSED</Text>
                    </View>
                );
                break;
            case 6:
                return (
                    <View style={MaintenanceRequestScreenStyle.statusOverDueViewStyle}>
                        <Text style={MaintenanceRequestScreenStyle.statusViewTextStyle}>OVER DUE</Text>
                    </View>
                );
                break;
            case 7:
                return (
                    <View style={MaintenanceRequestScreenStyle.statusOverDueViewStyle}>
                        <Text style={MaintenanceRequestScreenStyle.statusViewTextStyle}>DENIED</Text>
                    </View>
                );
                break;
            default:

        }

    }

    onListItemClick(id) {

        Actions.MaintenanceRequestDetailsScreen({ reqId: id });

    }

    renderItem({ item, index }) {

        var userImage = item.created_by.image ? API.USER_IMAGE_PATH + item.created_by.image : '';
        var firstname = item.created_by.firstname ? item.created_by.firstname : '';
        var lastName = item.created_by.lastname ? item.created_by.lastname : '';
        return (
            <View style={MaintenanceRequestScreenStyle.listContainerStyle}>
                <TouchableOpacity onPress={ref.onListItemClick.bind(ref, item._id)}>
                    <View style={MaintenanceRequestScreenStyle.listHeaderContainer}>
                        <View style={MaintenanceRequestScreenStyle.statusContainerStyle}>
                            {ref.renderStatusView(item)}
                        </View>
                        {

                            userImage != '' ? <Image source={{ uri: userImage }} style={MaintenanceRequestScreenStyle.userImageStyle}/>
                                :
                                <View style={MaintenanceRequestScreenStyle.emptyUserMessageListImageStyle}>
                                    <Text style={MaintenanceRequestScreenStyle.initialTextStyle}>{firstname.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                </View>

                        }
                        
                        <View style={MaintenanceRequestScreenStyle.statusContainerStyle}>
                            <Text numberOfLines={1} style={MaintenanceRequestScreenStyle.dollarTextStyle}>${item.budget}</Text>
                            <Text numberOfLines={1} style={MaintenanceRequestScreenStyle.daysTextStyle}>{Moment(item.completed_date).fromNow()}</Text>
                        </View>
                    </View>
                    <View style={MaintenanceRequestScreenStyle.detailContainerStyle}>
                        <View style={MaintenanceRequestScreenStyle.detailTitleContainerStyle}>
                            <Text style={MaintenanceRequestScreenStyle.detailTitleTextStyle}>{item.request_overview}</Text>
                            <Image source={ImagePath.RED_NOTIFICATION} style={MaintenanceRequestScreenStyle.notificatioImageStyle} />
                        </View>
                        <Text style={MaintenanceRequestScreenStyle.detailTextStyle}>Request ID : {item.request_id}</Text>
                        {/* <Text style={MaintenanceRequestScreenStyle.detailTextStyle}>Category name</Text> */}
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    goForwardReqScreen(reqData) {

        Actions.ForwardMaintenanceRequestScreen({ maintenanceReqData: reqData });

    }

    requestedByTenantsRenderItem({ item, index }) {

        var userImage = API.USER_IMAGE_PATH + item.created_by.image;
        return (
            <CardWithWhiteBG>

                <View style={MaintenanceRequestScreenStyle.byTenantListContainerStyle}>

                    <View style={MaintenanceRequestScreenStyle.imageContainerStyle}>
                        <Image source={{ uri: userImage }} style={MaintenanceRequestScreenStyle.userImageStyle} />
                    </View>

                    <View style={MaintenanceRequestScreenStyle.messageViewContainerStyle}>
                        <Text style={MaintenanceRequestScreenStyle.requestByTenantDetailTitleTextStyle}>{item.request_overview}</Text>
                        <Text numberOfLines={1} style={MaintenanceRequestScreenStyle.requestByTenantDetailTextStyle}>Request ID : {item.request_id}</Text>
                        {/* <Text numberOfLines={1} style={MaintenanceRequestScreenStyle.maintenanceThreadpropertyIdTextStyle}>Category name</Text> */}

                        <TouchableOpacity onPress={ref.goForwardReqScreen.bind(ref, item)}>
                            <View style={MaintenanceRequestScreenStyle.roundedBlueProceedButtonStyle}>
                                <Text style={MaintenanceRequestScreenStyle.proceedButtonTextStyle}>
                                    {Strings.FORWARD}
                                </Text>
                            </View>
                        </TouchableOpacity>

                    </View>

                </View>

            </CardWithWhiteBG>);
    }



    render() {
        let data = [{
            value: 'Request Overview',
        },
        {
            value: 'Due date',
        },
        {
            value: 'Budget',
        }
        ];

        return (

            <View style={CommonStyles.listMainContainerStyle}>
                {this.navBar()}
                <TouchableOpacity onPress={() => this.onFilterClick()} >
                    <View style={MaintenanceRequestScreenStyle.refineResultContainerStyle}>
                        {/* <View>
                            <Text style={MaintenanceRequestScreenStyle.refineResultTextStyle}>{Strings.REFINE_RESULTS}</Text>
                            <View style={MaintenanceRequestScreenStyle.refineResultBottomBarStyle} />
                        </View>
                        {this.state.isFilter ? <Image source={ImagePath.ARROW_DOWN} style={MaintenanceRequestScreenStyle.refineResultArrowUpStyle} />
                            : <Image source={ImagePath.ARROW_DOWN} style={MaintenanceRequestScreenStyle.refineResultArrowStyle} />
                        } */}
                        { <Dropdown
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.DROP_DOWN_BACKGROUND_COLOR}
                            containerStyle={MaintenanceRequestScreenStyle.dropDownViewStyle}
                            data={data}
                            value={data[0].value}
                        /> }
                    </View>
                </TouchableOpacity>
                <View style={MaintenanceRequestScreenStyle.tabContainerStyle}>

                    <TouchableOpacity onPress={() => this.onAllTabClick()} >
                        <View >
                            <View style={MaintenanceRequestScreenStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected == 1) ? MaintenanceRequestScreenStyle.tabLabelTextStyle : MaintenanceRequestScreenStyle.tabLabelDiselectTextStyle}>{Strings.ALL}</Text>
                            </View>
                            {this.state.isTabSelected == 1 ? <View style={MaintenanceRequestScreenStyle.tabIndicatorStyle}></View> : <View style={MaintenanceRequestScreenStyle.tabWhiteIndicatorStyle}></View>}
                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.onActiveTabClick()}>
                        <View>
                            <View style={MaintenanceRequestScreenStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected == 2) ? MaintenanceRequestScreenStyle.tabLabelTextStyle : MaintenanceRequestScreenStyle.tabLabelDiselectTextStyle}>{Strings.ACTIVE}</Text>
                            </View>
                            {(this.state.isTabSelected == 2) ? <View style={MaintenanceRequestScreenStyle.tabIndicatorStyle}></View> : <View style={MaintenanceRequestScreenStyle.tabWhiteIndicatorStyle}></View>}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onRequestedByTenentTabClick()}>
                        <View>
                            <View style={MaintenanceRequestScreenStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected == 3) ? MaintenanceRequestScreenStyle.tabLabelTextStyle : MaintenanceRequestScreenStyle.tabLabelDiselectTextStyle}>{Strings.REQUESTED_BY_TENENT}</Text>
                            </View>
                            {(this.state.isTabSelected == 3) ? <View style={MaintenanceRequestScreenStyle.tabIndicatorStyle}></View> : <View style={MaintenanceRequestScreenStyle.tabWhiteIndicatorStyle}></View>}
                        </View>
                    </TouchableOpacity>
                </View>


                {/* <Dropdown
                    label=''
                    labelHeight={5}
                    fontSize={14}
                    baseColor={Colors.DROP_DOWN_BACKGROUND_COLOR}
                    containerStyle={MaintenanceRequestScreenStyle.dropDownViewStyle}
                    data={data}
                    value={data[0].value}
                /> */}

                {

                    (this.state.isTabSelected == 1) ?
                        this.state.maintenanceData.length > 0
                            ?
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={CommonStyles.flatListStyle}>
                                {this.state.isFilter ?
                                    <FilterScreen /> : null
                                }
                                <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                                    data={this.state.maintenanceData}
                                    renderItem={this.renderItem}
                                />
                            </ScrollView>
                            :
                            this.props.maintenanceReducer.isScreenLoading
                                ?
                                null
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItem: 'center' }}>
                                    <Text style={{ fontSize: 20, textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>{Strings.MAINTENANCE_NOT_FOUND}</Text>
                                </View>
                        :
                        null

                }
                {

                    (this.state.isTabSelected == 2) ?
                        this.state.activeReqData.length > 0
                            ?
                            <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                                data={this.state.activeReqData}
                                renderItem={this.renderItem}
                            />
                            :
                            this.props.maintenanceReducer.isScreenLoading
                                ?
                                null
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItem: 'center' }}>
                                    <Text style={{ fontSize: 20, textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>{Strings.MAINTENANCE_NOT_FOUND}</Text>
                                </View>
                        :
                        null
                }
                {

                    (this.state.isTabSelected == 3) ?
                        this.state.tenantReqData.length > 0
                            ?
                            <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                                data={this.state.tenantReqData}
                                renderItem={this.requestedByTenantsRenderItem}
                            />
                            :
                            this.props.maintenanceReducer.isScreenLoading
                                ?
                                null
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItem: 'center' }}>
                                    <Text style={{ fontSize: 20, textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>{Strings.MAINTENANCE_NOT_FOUND}</Text>
                                </View>
                        :
                        null


                }

                {


                    this.props.maintenanceReducer.isScreenLoading ?
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
    console.log('maintenance screen mapStateToProps= ', JSON.stringify(state));
    return {
        maintenanceReducer: state.maintenanceReducer
    }
}

export default connect(
    mapStateToProps,
    {
        getMaintenanceReqByTenant,
        getMaintenanceRequestList,
        showLoading,
        resetState,
    }

)(MaintenanceRequestScreen);



