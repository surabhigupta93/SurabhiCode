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
import NoticeBoardScreenStyle from './NoticeBoardScreenStyle';
import listData from '../../../data';
import { CardWithWhiteBG } from '../CommonComponent/CardWithWhiteBG';
import { Dropdown } from 'react-native-material-dropdown';
import API from '../../Constants/APIUrls';
import Moment from 'moment';
import {

    getNoticeBoardList,

} from "../../Action/ActionCreators";

import {

    showLoading,
    resetState,

} from "./NoticeBoardAction";
import FilterScreen from '../FilterComponent/FilterScreen';

let ref;

class NoticeBoardScreen extends Component {

    constructor() {
        super();
        ref = this;
        this.state = {
            roleName: '',
            isTabSelected: true,
            noticeBoardListData: [],
            isFilter: false,
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onNoticeBoardListSuccess();
    }

    componentWillUnmount() {

    }

    componentWillMount() {
        this.getRoleName();
        this.callGetNoticeBoardList();
    }


    callAddNoticeBoardScreen() {

        Actions.NewNoticeBoardScreen();
    }

    onDiscoverTabClick() {

        this.setState({ isTabSelected: true });
    }

    onLinksTabClick() {

        this.setState({ isTabSelected: false });
    }



    onFilterClick() {

        if (this.state.isFilter) {

            this.setState({ isFilter: false });
        }
        else {

            this.setState({ isFilter: true });
        }
    }

    getRoleName() {

        AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
            if (value) {
                //console.log('user name == ', value);
                this.setState({ roleName: value });

            }
        }).done();
    }

    callGetNoticeBoardList() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {

            if (value) {

                var userData = JSON.parse(value);
                var postdata = {};
                var authToken = userData.token;

                postdata = {
                    //agency_id: userData.data.agency_id,
                    role_id: userData.data.role_id,
                    user_id: userData.data._id


                };
                this.props.showLoading();
                // console.log('post data== ', JSON.stringify(postdata));
                this.props.getNoticeBoardList(authToken, postdata);
            }

        }).done();
    }

    onNoticeBoardListSuccess() {

        if (this.props.noticeBoardReducer.noticeBoardListResponse != '') {
            if (this.props.noticeBoardReducer.noticeBoardListResponse.code == 200) {
                console.log('Notice board data== ', JSON.stringify(this.props.noticeBoardReducer.noticeBoardListResponse.data));
                this.setState({ noticeBoardListData: this.props.noticeBoardReducer.noticeBoardListResponse.data });
            }
            else {

                alert(this.props.noticeBoardReducer.noticeBoardListResponse.message);
            }
            this.props.resetState();
        }
    }

    navBar() {

        return (
            <View >
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.NOTICE_BOARD}</Text>
                {/* {
                    this.state.roleName == Strings.USER_ROLE_STRATA_STAFF ? */}
                <TouchableOpacity onPress={() => this.callAddNoticeBoardScreen()}>
                    <Image source={ImagePath.PLUS_ICON} style={CommonStyles.navPlusImageView} />
                </TouchableOpacity>
                {/* :null
                   }                 */}

            </View>
        );
    }

    callNoticeDetail(id) {

        Actions.NoticeBoardDetailScreen({ noticeBoardId: id });
    }

    renderImageItem(item, index) {

        return (
            <Image source={{ uri: item.url }} style={NoticeBoardScreenStyle.userListImageStyle} />
        );
    }

    renderItem({ item, index }) {

        var propertyImagePath = item.property_id ? (item.property_id.image.length > 0 ? API.PROPERTY_IMAGE_PATH + item.property_id.image[0].path : '') : '';
        return (

            <TouchableOpacity style={NoticeBoardScreenStyle.listMainContainerStyle} onPress={ref.callNoticeDetail.bind(ref, item._id)}>
                <View >

                    <View style={NoticeBoardScreenStyle.propertyImageViewStyle}>
                        {
                            propertyImagePath != '' ? <Image source={{ uri: propertyImagePath }} style={NoticeBoardScreenStyle.propertyImageStyle} />
                                :
                                <View style={NoticeBoardScreenStyle.topCoverImageContainer} />
                        }
                        <Image source={ImagePath.HEART} style={NoticeBoardScreenStyle.likeImageViewStyle} />
                    </View>

                    <View style={NoticeBoardScreenStyle.propertyTitleViewStyle}>
                        <Text numberOfLines={2} style={NoticeBoardScreenStyle.propertyTitleTextStyle}>{item.property_id ? item.property_id.address : ''}</Text>
                    </View>

                    <View style={NoticeBoardScreenStyle.propetySubTitleViewStyle}>
                        <Text numberOfLines={3} style={NoticeBoardScreenStyle.propertySubTitleTextStyle}>Property ID 100786213</Text>
                    </View>

                    <View style={NoticeBoardScreenStyle.propertyInfoContainerViewStyle}>

                        <View style={NoticeBoardScreenStyle.propertyBedroomViewContainer}>
                            <Image source={ImagePath.FLAG_ICON} />
                            <Text style={NoticeBoardScreenStyle.propertyValueTextStyle}>25 posts</Text>
                        </View>
                        <View style={NoticeBoardScreenStyle.propertyWashrooViewContainer}>
                            <Image source={ImagePath.TENANTS_ICON} />
                            <Text style={NoticeBoardScreenStyle.propertyValueTextStyle}>40 members</Text>
                        </View>

                    </View>
                </View>
            </TouchableOpacity>
        );
    }


    noticeBoardRenderItem({ item, index }) {
        var title = item.title ? item.title : '';
        var description = item.description ? item.description : '';
        var createdDate = item.createdAt ? item.createdAt : '';
        var noticeboard_id = item.noticeboard_id ? item.noticeboard_id : '';
        var noticePostCnt = item.noticePostCnt ? item.noticePostCnt : 0;
        return (

            <CardWithWhiteBG>
                <TouchableOpacity style={NoticeBoardScreenStyle.listMainContainerStyle} onPress={ref.callNoticeDetail.bind(ref, item._id)}>
                    <View style={{ padding: 10 }}>

                        <Text style={NoticeBoardScreenStyle.noticeBoardTitleTextStyle}>
                            {'Title : ' + title}
                        </Text>

                        <Text style={NoticeBoardScreenStyle.propertySubTitleTextStyle}>
                            {Moment(createdDate).format('MMM dd, YYYY')}
                        </Text>

                        <Text style={NoticeBoardScreenStyle.propertySubTitleTextStyle}>
                            {'Plan ID : ' + noticeboard_id}
                        </Text>

                        <Text style={NoticeBoardScreenStyle.propertySubTitleTextStyle}>
                            {description}
                        </Text>

                        {/* <View style={NoticeBoardScreenStyle.noticeBoardPostCountContainer}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Image source={ImagePath.TENANTS_ICON} />
                                <Text style={NoticeBoardScreenStyle.postCountTextStyle}>
                                    {'0'}
                                </Text>
                            </View>

                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Image source={ImagePath.FLAG_ICON} />
                                <Text style={NoticeBoardScreenStyle.postCountTextStyle}>
                                    {noticePostCnt}
                                </Text>
                            </View>
                        </View> */}
                    </View>
                </TouchableOpacity>
            </CardWithWhiteBG>
        );
    }



    render() {

        return (
            <View style={CommonStyles.listMainContainerStyle}>
                {this.navBar()}
                <TouchableOpacity onPress={() => this.onFilterClick()} >
                    <View style={NoticeBoardScreenStyle.refineResultContainerStyle}>
                        <View>
                            <Text style={NoticeBoardScreenStyle.refineResultTextStyle}>{Strings.REFINE_RESULTS}</Text>
                            <View style={NoticeBoardScreenStyle.refineResultBottomBarStyle} />
                        </View>
                        {this.state.isFilter ? <Image source={ImagePath.ARROW_DOWN} style={NoticeBoardScreenStyle.refineResultArrowUpStyle} />
                            : <Image source={ImagePath.ARROW_DOWN} style={NoticeBoardScreenStyle.refineResultArrowStyle} />
                        }

                    </View>
                </TouchableOpacity>
                <View style={NoticeBoardScreenStyle.tabContainerStyle}>

                    <TouchableOpacity onPress={() => this.onDiscoverTabClick()} >
                        <View style={NoticeBoardScreenStyle.tabTextViewContainerStyle}>
                            <View style={NoticeBoardScreenStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected) ? NoticeBoardScreenStyle.tabLabelTextStyle : NoticeBoardScreenStyle.tabLabelDiselectTextStyle}>All</Text>
                            </View>
                            {this.state.isTabSelected ? <View style={NoticeBoardScreenStyle.tabIndicatorStyle}></View> : null}
                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.onLinksTabClick()}>
                        <View>
                            <View style={NoticeBoardScreenStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected == false) ? NoticeBoardScreenStyle.tabLabelTextStyle : NoticeBoardScreenStyle.tabLabelDiselectTextStyle}>Favorites</Text>
                            </View>
                            {(this.state.isTabSelected == false) ? <View style={NoticeBoardScreenStyle.tabIndicatorStyle}></View> : null}
                        </View>
                    </TouchableOpacity>

                </View>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={CommonStyles.flatListStyle}>
                    {this.state.isFilter ?
                        <FilterScreen /> : null
                    }
                    {
                        this.state.noticeBoardListData.length > 0 ?

                            <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                                data={this.state.noticeBoardListData}
                                extraData={this.state}
                                renderItem={this.noticeBoardRenderItem}
                            />
                            :
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ fontSize: 20, textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>{Strings.NOTICE_NOT_FOUND}</Text>
                            </View>
                    }
                </ScrollView>
            </View>
        );
    }
}

function mapStateToProps(state) {
    console.log('mapStateToProps= ', JSON.stringify(state));
    return {
        noticeBoardReducer: state.noticeBoardReducer
    }
}

export default connect(
    mapStateToProps,
    {
        getNoticeBoardList,
        showLoading,
        resetState,
    }

)(NoticeBoardScreen);



