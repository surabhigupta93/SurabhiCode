
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
import TradersMaintenanceRequestScreenStyle from './TradersMaintenanceRequestScreenStyle';
import listData from '../../../data';
import { Dropdown } from 'react-native-material-dropdown';
import { CardWithWhiteBG } from '../CommonComponent/CardWithWhiteBG';
import * as Progress from 'react-native-progress';
import Moment from 'moment';
import API from '../../Constants/APIUrls';
import FilterScreen from '../FilterComponent/FilterScreen';
import {
    getMaintenanceRequestList,
} from "../../Action/ActionCreators";

import {
    showLoading,
    resetState,
} from "./TradersMaintenanceAction";

let ref;
class TradersMaintenanceRequestScreen extends Component {
    constructor() {
        super();
        ref = this;
        this.state = {
            isTabSelected: 1,
            maintenanceData: [],
            tenantReqData: [],
            newData: [],
            progressData: [],
            completedData: [],
            isFilter: false,
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onMaintenanceRquestSuccess();
        //this.onMaintenanceRquestByTenantSuccess();
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
    onNewTabClick() {

        this.setState({ isTabSelected: 2 });
    }
    onProgressTabClick() {

        this.setState({ isTabSelected: 3 });
        //this.callGetMaintenanceRequestByTenant();
    }
    onCompletedTabClick() {
        this.setState({ isTabSelected: 4 });
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
                console.log('post data', JSON.stringify(postData));
                this.props.getMaintenanceRequestList(authToken, postData);
            }
        }).done();
    }

    //  req_status:{type: Number,default:1}, // 1 for sent , 2 for accepted, 3 for booked, 4 for completed, 5 for closed, 6 for due, 7 denied  
    //new=1,onProgress=2and 3, completed=4



    onMaintenanceRquestSuccess() {

        if (this.props.tradersMaintenanceReducer.maintenanceListResponse != '') {
            console.log('response data', JSON.stringify(this.props.tradersMaintenanceReducer.maintenanceListResponse));
            if (this.props.tradersMaintenanceReducer.maintenanceListResponse.code == 200) {

                this.setState({
                    maintenanceData: this.props.tradersMaintenanceReducer.maintenanceListResponse.data,
                    newData: this.prepareNewData(this.props.tradersMaintenanceReducer.maintenanceListResponse.data),
                    progressData: this.prepareProgressData(this.props.tradersMaintenanceReducer.maintenanceListResponse.data),
                    completedData: this.prepareCompletesData(this.props.tradersMaintenanceReducer.maintenanceListResponse.data)
                });
            }
            else {

                alert(this.props.tradersMaintenanceReducer.maintenanceListResponse.message);
            }
        }
        this.props.resetState();
    }


    prepareNewData(maintenancedata) {

        var tempArray = [];
        maintenancedata.map((data, index) => {

            if (maintenancedata[index].req_status == 1) {

                tempArray.push(maintenancedata[index]);
            }

        })
        return tempArray;
    }

    prepareProgressData(maintenancedata) {

        var tempArray = [];
        maintenancedata.map((data, index) => {

            if (maintenancedata[index].req_status == 2 || maintenancedata[index].req_status == 3) {

                tempArray.push(maintenancedata[index]);
            }

        })
        return tempArray;
    }

    prepareCompletesData(maintenancedata) {

        var tempArray = [];
        maintenancedata.map((data, index) => {

            if (maintenancedata[index].req_status == 4) {

                tempArray.push(maintenancedata[index]);
            }

        })
        return tempArray;
    }


    navBar() {
        return (
            <View>
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.MAINTENANCE_REQUEST}</Text>

            </View>
        );
    }

    renderStatusView(item) {
        // 1 for sent , 2 for accepted, 3 for booked, 4 for completed, 5 for closed, 6 for due, 7 denied

        switch (item.req_status) {

            case 1:
                return (
                    <View style={TradersMaintenanceRequestScreenStyle.statusSentViewStyle}>
                        <Text style={TradersMaintenanceRequestScreenStyle.statusViewTextStyle}>SENT</Text>
                    </View>
                );
                break;
            case 2:
                return (
                    <View style={TradersMaintenanceRequestScreenStyle.statusAcceptedViewStyle}>
                        <Text style={TradersMaintenanceRequestScreenStyle.statusViewTextStyle}>ACCEPTED</Text>
                    </View>
                );
                break;
            case 3:
                return (
                    <View style={TradersMaintenanceRequestScreenStyle.statusBookViewStyle}>
                        <Text style={TradersMaintenanceRequestScreenStyle.statusViewTextStyle}>BOOKED</Text>
                    </View>
                );
                break;

            case 4:
                return (
                    <View style={TradersMaintenanceRequestScreenStyle.statusCompletedViewStyle}>
                        <Text style={TradersMaintenanceRequestScreenStyle.statusViewTextStyle}>COMPLETED</Text>
                    </View>
                );
                break;
            case 5:
                return (
                    <View style={TradersMaintenanceRequestScreenStyle.statusOverDueViewStyle}>
                        <Text style={TradersMaintenanceRequestScreenStyle.statusViewTextStyle}>COLSED</Text>
                    </View>
                );
                break;
            case 6:
                return (
                    <View style={TradersMaintenanceRequestScreenStyle.statusOverDueViewStyle}>
                        <Text style={TradersMaintenanceRequestScreenStyle.statusViewTextStyle}>OVER DUE</Text>
                    </View>
                );
                break;
            case 7:
                return (
                    <View style={TradersMaintenanceRequestScreenStyle.statusOverDueViewStyle}>
                        <Text style={TradersMaintenanceRequestScreenStyle.statusViewTextStyle}>DENIED</Text>
                    </View>
                );
                break;
            default:

        }

    }

    onListItemClick(id) {

        Actions.TradersMaintenanceRequestDetailsScreen({ reqId: id });
    }

    renderItem({ item, index }) {

        var userImage = API.USER_IMAGE_PATH + item.created_by.image;
        return (
            <View style={TradersMaintenanceRequestScreenStyle.listContainerStyle}>
                <TouchableOpacity onPress={ref.onListItemClick.bind(ref, item._id)}>
                    <View style={TradersMaintenanceRequestScreenStyle.listHeaderContainer}>
                        <View style={TradersMaintenanceRequestScreenStyle.statusContainerStyle}>
                            {ref.renderStatusView(item)}
                        </View>
                        <Image source={{ uri: userImage }} style={TradersMaintenanceRequestScreenStyle.userImageStyle} />
                        <View style={TradersMaintenanceRequestScreenStyle.statusContainerStyle}>
                            <Text style={TradersMaintenanceRequestScreenStyle.dollarTextStyle}>${item.budget}</Text>
                            <Text style={TradersMaintenanceRequestScreenStyle.daysTextStyle}>{Moment(item.completed_date).fromNow()}</Text>
                        </View>
                    </View>
                    <View style={TradersMaintenanceRequestScreenStyle.detailContainerStyle}>
                        <View style={TradersMaintenanceRequestScreenStyle.detailTitleContainerStyle}>
                            <Text style={TradersMaintenanceRequestScreenStyle.detailTitleTextStyle}>{item.request_overview}</Text>
                            <Image source={ImagePath.RED_NOTIFICATION} style={TradersMaintenanceRequestScreenStyle.notificationImageStyle} />
                        </View>
                        <Text style={TradersMaintenanceRequestScreenStyle.detailTextStyle}>Request ID : {item.request_id}</Text>
                        {/* <Text style={TradersMaintenanceRequestScreenStyle.detailTextStyle}>Category name</Text> */}
                    </View>
                </TouchableOpacity>
            </View>
        );
    }


    renderNewItem({ item, index }) {

        var userImage = API.USER_IMAGE_PATH + item.created_by.image;
        return (
            <View style={TradersMaintenanceRequestScreenStyle.listContainerStyle}>
                <TouchableOpacity onPress={ref.onListItemClick.bind(ref, item._id)}>
                    <View style={TradersMaintenanceRequestScreenStyle.listHeaderContainer}>
                        <View style={TradersMaintenanceRequestScreenStyle.statusContainerStyle}>

                        </View>
                        <Image source={{ uri: userImage }} style={TradersMaintenanceRequestScreenStyle.userImageStyle} />
                        <View style={TradersMaintenanceRequestScreenStyle.statusContainerStyle}>
                            <Text style={TradersMaintenanceRequestScreenStyle.dollarTextStyle}>${item.budget}</Text>
                            <Text style={TradersMaintenanceRequestScreenStyle.daysTextStyle}>{Moment(item.completed_date).fromNow()}</Text>
                        </View>
                    </View>
                    <View style={TradersMaintenanceRequestScreenStyle.detailContainerStyle}>
                        <View style={TradersMaintenanceRequestScreenStyle.detailTitleContainerStyle}>
                            <Text style={TradersMaintenanceRequestScreenStyle.detailTitleTextStyle}>{item.request_overview}</Text>
                        </View>

                        {/* <Text style={TradersMaintenanceRequestScreenStyle.detailTextStyle}>Category name</Text> */}

                        <View style={TradersMaintenanceRequestScreenStyle.requestedContainerStyle}>
                            <Image source={ImagePath.PROPERTY_ID_ICON} style={TradersMaintenanceRequestScreenStyle.requestImageStyle} />
                            <Text style={TradersMaintenanceRequestScreenStyle.detailTextStyle}>Request ID : {item.request_id}</Text>
                        </View>

                        <View style={TradersMaintenanceRequestScreenStyle.requestedContainerStyle}>
                            <Image source={ImagePath.PROPERTY_ID_ICON} style={TradersMaintenanceRequestScreenStyle.requestImageStyle} />
                            <Text style={TradersMaintenanceRequestScreenStyle.detailTextStyle}>Requested {Moment(item.completed_date).fromNow()}</Text>
                        </View>

                        <TouchableOpacity >
                            <View style={TradersMaintenanceRequestScreenStyle.acceptButtonViewStyle}>
                                <Text style={TradersMaintenanceRequestScreenStyle.acceptTextStyle}>{Strings.ACCEPT}</Text>
                            </View>
                        </TouchableOpacity>

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

                <View style={TradersMaintenanceRequestScreenStyle.byTenantListContainerStyle}>

                    <View style={TradersMaintenanceRequestScreenStyle.imageContainerStyle}>
                        <Image source={{ uri: userImage }} style={TradersMaintenanceRequestScreenStyle.userImageStyle} />
                    </View>

                    <View style={TradersMaintenanceRequestScreenStyle.messageViewContainerStyle}>
                        <Text style={TradersMaintenanceRequestScreenStyle.requestByTenantDetailTitleTextStyle}>{item.request_overview}</Text>
                        <Text numberOfLines={1} style={TradersMaintenanceRequestScreenStyle.requestByTenantDetailTextStyle}>Request ID : {item.request_id}</Text>
                        <Text numberOfLines={1} style={TradersMaintenanceRequestScreenStyle.maintenanceThreadpropertyIdTextStyle}>Category name</Text>


                        <TouchableOpacity onPress={ref.goForwardReqScreen.bind(ref, item)}>
                            <View style={TradersMaintenanceRequestScreenStyle.roundedBlueProceedButtonStyle}>
                                <Text style={TradersMaintenanceRequestScreenStyle.proceedButtonTextStyle}>
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

                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} contentContainerStyle={TradersMaintenanceRequestScreenStyle.tabScrollViewStyle}>
                    <View style={TradersMaintenanceRequestScreenStyle.tabContainerStyle} c>

                        <TouchableOpacity onPress={() => this.onFilterClick()} >
                            <View>
                                {/* <View style={TradersMaintenanceRequestScreenStyle.refineResultContainerStyle}>
                                    <View>
                                        <Text style={TradersMaintenanceRequestScreenStyle.refineResultTextStyle}>{Strings.REFINE_RESULTS}</Text>
                                        <View style={TradersMaintenanceRequestScreenStyle.refineResultBottomBarStyle} />
                                    </View>

                                    <Image source={ImagePath.ARROW_DOWN} style={TradersMaintenanceRequestScreenStyle.refineResultArrowStyle} />
                                </View> */}

                                   { <Dropdown
                                        label=''
                                        labelHeight={5}
                                        fontSize={14}
                                        baseColor={Colors.DROP_DOWN_BACKGROUND_COLOR}
                                        containerStyle={TradersMaintenanceRequestScreenStyle.dropDownViewStyle}
                                        data={data}
                                        value={data[0].value}
                                    /> }
                            </View>
                        </TouchableOpacity>

                        <View style={TradersMaintenanceRequestScreenStyle.deviderViewStyle} />

                        <TouchableOpacity onPress={() => this.onAllTabClick()} >
                            <View >
                                <View style={TradersMaintenanceRequestScreenStyle.tabTextViewStyle}>
                                    <Text style={(this.state.isTabSelected == 1) ? TradersMaintenanceRequestScreenStyle.tabLabelTextStyle : TradersMaintenanceRequestScreenStyle.tabLabelDiselectTextStyle}>{Strings.ALL}</Text>
                                </View>
                                {this.state.isTabSelected == 1 ? <View style={TradersMaintenanceRequestScreenStyle.tabIndicatorStyle}></View> : <View style={TradersMaintenanceRequestScreenStyle.tabWhiteIndicatorStyle}></View>}
                            </View>

                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.onNewTabClick()}>
                            <View >
                                <View style={TradersMaintenanceRequestScreenStyle.tabTextViewStyle}>
                                    <Text style={(this.state.isTabSelected == 2) ? TradersMaintenanceRequestScreenStyle.tabLabelTextStyle : TradersMaintenanceRequestScreenStyle.tabLabelDiselectTextStyle}>{Strings.NEW}</Text>
                                </View>
                                {this.state.isTabSelected == 2 ? <View style={TradersMaintenanceRequestScreenStyle.tabIndicatorStyle}></View> : <View style={TradersMaintenanceRequestScreenStyle.tabWhiteIndicatorStyle}></View>}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.onProgressTabClick()}>
                            <View>
                                <View style={TradersMaintenanceRequestScreenStyle.tabTextViewStyle}>
                                    <Text style={(this.state.isTabSelected == 3) ? TradersMaintenanceRequestScreenStyle.tabLabelTextStyle : TradersMaintenanceRequestScreenStyle.tabLabelDiselectTextStyle}>{Strings.IN_PROGRESS}</Text>
                                </View>
                                {(this.state.isTabSelected == 3) ? <View style={TradersMaintenanceRequestScreenStyle.tabIndicatorStyle}></View> : <View style={TradersMaintenanceRequestScreenStyle.tabWhiteIndicatorStyle}></View>}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.onCompletedTabClick()}>
                            <View>
                                <View style={TradersMaintenanceRequestScreenStyle.tabTextViewStyle}>
                                    <Text style={(this.state.isTabSelected == 4) ? TradersMaintenanceRequestScreenStyle.tabLabelTextStyle : TradersMaintenanceRequestScreenStyle.tabLabelDiselectTextStyle}>{Strings.COMPLETED}</Text>
                                </View>
                                {(this.state.isTabSelected == 4) ? <View style={TradersMaintenanceRequestScreenStyle.tabIndicatorStyle}></View> : <View style={TradersMaintenanceRequestScreenStyle.tabWhiteIndicatorStyle}></View>}
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>


                {/* <Dropdown
                    label=''
                    labelHeight={5}
                    fontSize={14}
                    baseColor={Colors.DROP_DOWN_BACKGROUND_COLOR}
                    containerStyle={TradersMaintenanceRequestScreenStyle.dropDownViewStyle}
                    data={data}
                    value={data[0].value}
                /> */}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={CommonStyles.flatListStyle}>
                    {this.state.isFilter ?
                        <FilterScreen /> : null
                    }

                    {
                        this.state.maintenanceData ?
                            (this.state.isTabSelected == 1) ? <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                                data={this.state.maintenanceData}
                                renderItem={this.renderItem}
                            /> : null
                            :
                            <Text style={TradersMaintenanceRequestScreenStyle.requestPlaceHolerTextStyle}>
                                {Strings.MAINTENANCE_NOT_FOUND}
                            </Text>
                    }

                    {
                        this.state.newData ?
                            (this.state.isTabSelected == 2) ? <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                                data={this.state.newData}
                                renderItem={this.renderNewItem}
                            /> : null
                            :
                            <Text style={TradersMaintenanceRequestScreenStyle.requestPlaceHolerTextStyle}>
                                {Strings.MAINTENANCE_NOT_FOUND}
                            </Text>
                    }

                    {
                        this.state.progressData ?
                            (this.state.isTabSelected == 3) ? <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                                data={this.state.progressData}
                                renderItem={this.renderItem}
                            /> : null
                            :
                            <Text style={TradersMaintenanceRequestScreenStyle.requestPlaceHolerTextStyle}>
                                {Strings.MAINTENANCE_NOT_FOUND}
                            </Text>
                    }
                    {
                        this.state.completedData ?
                            (this.state.isTabSelected == 4) ? <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                                data={this.state.completedData}
                                renderItem={this.renderItem}
                            /> : null
                            :
                            <Text style={TradersMaintenanceRequestScreenStyle.requestPlaceHolerTextStyle}>
                                {Strings.MAINTENANCE_NOT_FOUND}
                            </Text>
                    }

                </ScrollView>
                {

                    this.props.tradersMaintenanceReducer.isScreenLoading ?
                        <View style={CommonStyles.circles}>
                            <Progress.CircleSnail color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]} />
                        </View>
                        : null

                }
            </View >
        );
    }
}

function mapStateToProps(state) {
    console.log('maintenance screen mapStateToProps= ', JSON.stringify(state));
    return {
        tradersMaintenanceReducer: state.tradersMaintenanceReducer
    }
}

export default connect(
    mapStateToProps,
    {

        getMaintenanceRequestList,
        showLoading,
        resetState,
    }

)(TradersMaintenanceRequestScreen);



