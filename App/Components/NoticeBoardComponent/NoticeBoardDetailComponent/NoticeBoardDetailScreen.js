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

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import NoticeBoardDetailScreenStyle from './NoticeBoardDetailScreenStyle';
import listData from '../../../../data';
import { Dropdown } from 'react-native-material-dropdown';
import API from '../../../Constants/APIUrls';
import { CardView } from '../../CommonComponent/CardView';
import {

    getNoticeBoardDetail,
} from "../../../Action/ActionCreators";

import {

    showLoading,
    resetState,
} from "../../HomeComponent/HomeScreenAction";

let ref;
class NoticeBoardDetailScreen extends Component {
    constructor() {
        super();
        ref = this;
        this.state = {
            isTabSelected: true,
            noticeBoardDetailListData: [],
            isShowPopup: false,
            roleName: '',
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {

        this.onNoticeBoardDetailListSuccess();
    }

    componentWillUnmount() {

    }

    componentWillMount() {
        this.getRoleName();
        this.callGetNoticeBoardDetailList();
    }

    getRoleName() {

        AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
            if (value) {
                //console.log('user name == ', value);
                this.setState({ roleName: value });
            }
        }).done();
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

    callGetNoticeBoardDetailList() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {

            if (value) {

                var userData = JSON.parse(value);
                var postdata = {};
                var authToken = userData.token;

                postdata = {

                    agency_id: userData.data.agency_id,
                    role_id: userData.data.role_id
                };
                this.props.showLoading();
                //console.log('post data==', JSON.stringify(this.props.noticeBoardId));
                this.props.getNoticeBoardDetail(authToken, this.props.noticeBoardId);
            }

        }).done();

    }

    onNoticeBoardDetailListSuccess() {

        if (this.props.noticeBoardReducer.noticeBoardDetailListResponse != '') {
            if (this.props.noticeBoardReducer.noticeBoardDetailListResponse.code == 200) {
                console.log('notice detail data== ', JSON.stringify(this.props.noticeBoardReducer.noticeBoardDetailListResponse.data));
                this.setState({ noticeBoardDetailListData: this.props.noticeBoardReducer.noticeBoardDetailListResponse.data });
            }
            else {

                alert(this.props.noticeBoardReducer.noticeBoardDetailListResponse.message);
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

    onBackPress() {

        Actions.pop();
    }
    navBar() {

        return (
            <View style={NoticeBoardDetailScreenStyle.profileHeaderContainer}>

                <TouchableOpacity onPress={() => this.onBackPress()} style={{ marginLeft: 20, marginTop: 10 }}>
                    <Image source={ImagePath.BACK_WHITE} />
                </TouchableOpacity>
                {this.state.roleName == Strings.USER_ROLE_STRATA_STAFF ?
                    <TouchableOpacity onPress={this.showPopup.bind(this)} style={{ marginRight: 20, marginTop: 10 }}>
                        <View style={NoticeBoardDetailScreenStyle.optionViewStyle} >
                            <Image source={ImagePath.THREE_DOTS_ICON} />
                        </View>
                    </TouchableOpacity>
                    : null
                }

                {
                    (this.state.isShowPopup) ?


                        <Modal transparent >
                            <TouchableOpacity onPress={this.showPopup.bind(this)} style={NoticeBoardDetailScreenStyle.modalContainer}>
                                <View style={{
                                    flex: 1, justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <View style={NoticeBoardDetailScreenStyle.modalContainerStyles}>

                                        <TouchableOpacity style={{ marginTop: 10 }}>

                                            <View style={NoticeBoardDetailScreenStyle.roundedBlueEditPropertyButtonStyle}>
                                                <Text style={NoticeBoardDetailScreenStyle.blueButtonTextStyle}>
                                                    {Strings.NEW_POST}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={{ marginTop: 10 }}>

                                            <View style={NoticeBoardDetailScreenStyle.roundedTransparentButtonStyle}>
                                                <Text style={NoticeBoardDetailScreenStyle.grayButtonTextStyle}>
                                                    {Strings.EDIT}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>


                                        <TouchableOpacity style={{ marginBottom: 20 }} >
                                            <View style={NoticeBoardDetailScreenStyle.roundedTransparentButtonStyle}>
                                                <Text style={NoticeBoardDetailScreenStyle.redTextStyle}>
                                                    {Strings.DELETE}
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



    renderImageItem(item, index) {

        return (

            <Image source={{ uri: item.url }} style={NoticeBoardDetailScreenStyle.userListImageStyle} />
        );
    }

    renderItem({ item, index }) {


        return (

            <CardView>
                <View style={NoticeBoardDetailScreenStyle.listMainContainerStyle}>
                    {ref.state.roleName == Strings.USER_ROLE_STRATA_STAFF ?
                        <View style={{ marginRight: 10, alignItems: 'flex-end' }}>
                            <Image source={ImagePath.DELETE_ICON} />
                        </View>
                        : null
                    }
                    <View style={NoticeBoardDetailScreenStyle.propertyTitleViewStyle}>
                        <Text numberOfLines={2} style={NoticeBoardDetailScreenStyle.propertyTitleTextStyle}>{'Anouncement : ' + item.agenda_resolution}</Text>
                    </View>
                    <View style={NoticeBoardDetailScreenStyle.propetySubTitleViewStyle}>
                        <Text numberOfLines={3} style={NoticeBoardDetailScreenStyle.propertySubTitleTextStyle}>{item.description}</Text>
                    </View>

                    <View style={NoticeBoardDetailScreenStyle.propertyInfoContainerViewStyle}>

                        { /*<View style={NoticeBoardDetailScreenStyle.propertyWashrooViewContainer}>
                            <Image source={ImagePath.TENANTS_ICON} />
                            <Text style={NoticeBoardDetailScreenStyle.propertyValueTextStyle}>40 members</Text>
                        </View>*/}

                    </View> 
                </View>
            </CardView>
        );
    }




    render() {

        //console.log('notice posts= ',JSON.stringify(this.state.noticeBoardDetailListData));
        let data = [{
            value: 'By best match',
        }, {
            value: 'By Property Name',
        }];


        return (

            <View style={CommonStyles.listMainContainerStyle}>
                <View >

                    <Image source={ImagePath.HEADER_BG} style={NoticeBoardDetailScreenStyle.topCoverImageContainer} />

                    <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: Colors.TRANSPARENT }}>
                        <Text numberOfLines={2} style={{ color: Colors.WHITE, fontSize: 24, fontWeight: '600' }}>{this.state.noticeBoardDetailListData.length > 0 ? this.state.noticeBoardDetailListData[0].title : ''}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Image source={ImagePath.PROPERTY_ID_ICON} style={{ margin: 3 }} />
                                <Text style={{ color: Colors.WHITE, fontSize: 14, marginLeft: 7 }}>PID :{this.state.noticeBoardDetailListData.length > 0 ? this.state.noticeBoardDetailListData[0].noticeboard_id : ''} </Text>
                            </View>

                            {/* <View style={{ flexDirection: 'row', justifyContent: 'center', marginLeft: 10 }}>
                                <Image source={ImagePath.FLAG_ICON} />
                                <Text style={{ color: Colors.WHITE, fontSize: 14, marginLeft: 7 }}>25 posts</Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginLeft: 10 }}>
                                <Image source={ImagePath.TENANTS_ICON} />
                                <Text style={{ color: Colors.WHITE, fontSize: 14, marginLeft: 7 }}>25 posts</Text>
                            </View> */}
                        </View>
                    </View>
                    {this.navBar()}

                </View>

                {/*  <View style={NoticeBoardDetailScreenStyle.refineResultContainerStyle}>
                    <View>
                        <Text style={NoticeBoardDetailScreenStyle.refineResultTextStyle}>{Strings.REFINE_RESULTS}</Text>
                        <View style={NoticeBoardDetailScreenStyle.refineResultBottomBarStyle} />
                    </View>

                    <Image source={ImagePath.ARROW_DOWN} style={NoticeBoardDetailScreenStyle.refineResultArrowStyle} />
                </View>
                 <View style={NoticeBoardDetailScreenStyle.tabContainerStyle}>

                    <TouchableOpacity onPress={() => this.onDiscoverTabClick()} >
                        <View style={NoticeBoardDetailScreenStyle.tabTextViewContainerStyle}>
                            <View style={NoticeBoardDetailScreenStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected) ? NoticeBoardDetailScreenStyle.tabLabelTextStyle : NoticeBoardDetailScreenStyle.tabLabelDiselectTextStyle}>All</Text>
                            </View>
                            {this.state.isTabSelected ? <View style={NoticeBoardDetailScreenStyle.tabIndicatorStyle}></View> : null}
                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.onLinksTabClick()}>
                        <View>
                            <View style={NoticeBoardDetailScreenStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected == false) ? NoticeBoardDetailScreenStyle.tabLabelTextStyle : NoticeBoardDetailScreenStyle.tabLabelDiselectTextStyle}>Favorites</Text>
                            </View>
                            {(this.state.isTabSelected == false) ? <View style={NoticeBoardDetailScreenStyle.tabIndicatorStyle}></View> : null}
                        </View>
                    </TouchableOpacity>

                </View> */}


                {
                    /* <Dropdown
                         label=''
                         labelHeight={5}
                         fontSize={14}
                         baseColor={Colors.DROP_DOWN_BACKGROUND_COLOR}
                         containerStyle={NoticeBoardDetailScreenStyle.dropDownViewStyle}
                         data={data}
                         value={data[0].value}
                     />*/

                }

                {
                    this.state.noticeBoardDetailListData.length > 0 ?
                        this.state.noticeBoardDetailListData[0].noticeboardposts ?
                            this.state.noticeBoardDetailListData[0].noticeboardposts.length > 0 ?
                                <FlatList contentContainerStyle={CommonStyles.flatListStyle}

                                    data={this.state.noticeBoardDetailListData[0].noticeboardposts}
                                    extraData={this.state}
                                    renderItem={this.renderItem}
                                /> :
                                <Text style={NoticeBoardDetailScreenStyle.noticePlaceHolerTextStyle}>
                                    {Strings.NO_DATA_FOUND}
                                </Text>
                            :
                            <Text style={NoticeBoardDetailScreenStyle.noticePlaceHolerTextStyle}>
                                {Strings.NO_DATA_FOUND}
                            </Text>
                        : <Text style={NoticeBoardDetailScreenStyle.noticePlaceHolerTextStyle}>
                            {Strings.NO_DATA_FOUND}
                        </Text>
                }



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
        getNoticeBoardDetail,
        showLoading,
        resetState,
    }

)(NoticeBoardDetailScreen);



