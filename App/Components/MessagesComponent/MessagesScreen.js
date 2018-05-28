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
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import MessagesScreenStyle from './MessagesScreenStyle';
import listData from '../../../data';
import * as Progress from 'react-native-progress';
import Moment from 'moment';
import API from '../../Constants/APIUrls';
import { Dropdown } from 'react-native-material-dropdown';
import {
    getMessageList,
} from "../../Action/ActionCreators";
import {
    showLoading,
    resetState,
} from "./MessageAction";
import SocketIOClient from 'socket.io-client';
var UserID = '';

let ref;
class MessagesScreen extends Component {
    constructor(props) {
        super(props);
        //use your own local ip
        this.socket = SocketIOClient(API.CHAT_CONNECTION_URL, { transports: ['websocket'] });
        ref = this;
        this.state = {
            isTabSelected: 1,
            messageList: [],
        };

        this.socket.on('getAppliedUsersRes', (messages) => {
            console.log('on getAppliedUsersRes', JSON.stringify(messages));
            this.setState({ users: messages })
        });
    }



    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onMessageListSuccess();
    }

    componentWillUnmount() {

    }

    componentWillMount() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                UserID = userData.data._id;
                //console.log('will mount props data', UserID + ' :ID: ' + userData.data._id);
                this.socket.emit('addUser', { id: UserID });
                this.socket.emit("getAppliedUsers", UserID);
            }
        }).done();

        this.getMessageListRequest();
    }

    componentDidMount() {

    }

    _goChat(receiver, emitter, socket, userName, userPic) {
        //this.props.navigator.push({ ident: "Chat", receiver, emitter, socket })
        Actions.Chat({ receiver, emitter, socket, userName, userPic });
    }

    getMessageListRequest() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    agency_id: userData.data.agency_id,
                    request_by_role: userData.data.role_id,
                    user_id: userData.data._id,
                }
                this.props.showLoading();
                this.props.getMessageList(authToken, postData);
            }
        }).done();
    }

    onMessageListSuccess() {

        if (this.props.messageReducer.messageListRes != '') {
            if (this.props.messageReducer.messageListRes.code == 200) {
                console.log('message response data== ', JSON.stringify(this.props.messageReducer.messageListRes));
                this.setState({ messageList: this.props.messageReducer.messageListRes.data });
            }
            else {

                alert(this.props.messageReducer.messageListRes.message);
            }
        }
        this.props.resetState();
    }




    onAllTabClick() {

        this.setState({ isTabSelected: 1 });
    }
    onMessagesTabClick() {

        this.setState({ isTabSelected: 2 });
    }
    onThreadsTabClick() {

        this.setState({ isTabSelected: 3 });
    }

    navBar() {
        return (
            <View >
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.MESSAGES}</Text>
                {/* <TouchableOpacity style={CommonStyles.navPlusImageView} >
                    <View>
                        <Image source={ImagePath.PLUS_ICON} />
                    </View>
                </TouchableOpacity> */}
            </View>
        );
    }

    renderImageItem(item, index) {
        return (
            <Image source={{ uri: item.url }} style={MessagesScreenStyle.userListImageStyle} />
        );
    }

    renderItem({ item, index }) {
        var userImage = API.USER_IMAGE_PATH + item.image;
        var imagePath = item.image ? item.iamge : '';
        var id = item._id ? item._id : '';
        var _goChat = ref._goChat.bind(ref);
        var userName = item.firstname ? item.firstname + ' ' + item.lastname : '';
        var chat_message = item.chat_message ? item.chat_message : '';
        var chat_time = item.chat_time ? item.chat_time : '';
        return (
            <TouchableOpacity activeOpacity={0} underlayColor="#FFFFFF" style={MessagesScreenStyle.listContainerStyle} onPress={() => _goChat(id, UserID, ref.socket, userName, userImage)}>

                <View style={MessagesScreenStyle.listContainerStyle} >

                    <View style={MessagesScreenStyle.imageContainerStyle}>

                        {
                            imagePath != '' ? <Image source={{ uri: userImage }} style={MessagesScreenStyle.userImageStyle} />
                                :
                                <View style={MessagesScreenStyle.emptyUserListImageStyle}>
                                    <Text style={MessagesScreenStyle.initialTextStyle}>{item.firstname.charAt(0).toUpperCase() + ' ' + item.lastname.charAt(0).toUpperCase()}</Text>
                                </View>
                        }
                        {item.is_online ?
                            <View style={MessagesScreenStyle.onLineStatusViewStyle} />
                            :
                            <View style={MessagesScreenStyle.statusViewStyle} />
                        }

                    </View>

                    <View>
                        <View style={MessagesScreenStyle.detailTitleContainerStyle}>
                            <Text numberOfLines={1} style={MessagesScreenStyle.detailTitleTextStyle}>{item.firstname + ' ' + item.lastname}</Text>
                            <Text numberOfLines={1} style={MessagesScreenStyle.messageTimeTextStyle}>{chat_time == '' ? '' : chat_time}</Text>
                        </View>
                        <Text numberOfLines={2} style={MessagesScreenStyle.detailTextStyle}>{chat_message}</Text>
                        {/* <Text style={MessagesScreenStyle.categoryTextStyle}>Request ID : 100923824</Text> */}
                    </View>

                </View>

            </TouchableOpacity>
        );
    }


    render() {

        return (
            <View style={CommonStyles.listMainContainerStyle}>
                {this.navBar()}

                <View style={MessagesScreenStyle.searchViewStyle}>
                    <Image source={ImagePath.SEARCH_ICON} style={MessagesScreenStyle.searchImageStyle} />
                    <TextInput
                        placeholder={Strings.SEARCH_MESSAGES}
                        underlineColorAndroid={Colors.TRANSPARENT}
                        style={MessagesScreenStyle.searchTextInputStyle} />
                </View>
                <View style={MessagesScreenStyle.tabContainerStyle}>

                    <TouchableOpacity onPress={() => this.onAllTabClick()} >


                        <View>
                            <View style={MessagesScreenStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected == 1) ? MessagesScreenStyle.tabLabelTextStyle : MessagesScreenStyle.tabLabelDiselectTextStyle}>{Strings.ALL}</Text>
                            </View>
                            {(this.state.isTabSelected == 1) ? <View style={MessagesScreenStyle.tabIndicatorStyle}></View> : <View style={MessagesScreenStyle.tabWhiteIndicatorStyle}></View>}
                        </View>


                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.onMessagesTabClick()}>
                        <View>
                            <View style={MessagesScreenStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected == 2) ? MessagesScreenStyle.tabLabelTextStyle : MessagesScreenStyle.tabLabelDiselectTextStyle}>{Strings.MESSAGES}</Text>
                            </View>
                            {(this.state.isTabSelected == 2) ? <View style={MessagesScreenStyle.tabIndicatorStyle}></View> : <View style={MessagesScreenStyle.tabWhiteIndicatorStyle}></View>}
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.onThreadsTabClick()}>
                        <View>
                            <View style={MessagesScreenStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected == 3) ? MessagesScreenStyle.tabLabelTextStyle : MessagesScreenStyle.tabLabelDiselectTextStyle}>{Strings.THREADS}</Text>
                            </View>
                            {(this.state.isTabSelected == 3) ? <View style={MessagesScreenStyle.tabIndicatorStyle}></View> : <View style={MessagesScreenStyle.tabWhiteIndicatorStyle}></View>}
                        </View>
                    </TouchableOpacity>
                </View>


                <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                    data={this.state.messageList}
                    renderItem={this.renderItem}
                />
                {


                    this.props.messageReducer.isScreenLoading ?
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
        messageReducer: state.messageReducer
    }
}

export default connect(
    mapStateToProps,
    {
        getMessageList,
        showLoading,
        resetState,
    }

)(MessagesScreen);
