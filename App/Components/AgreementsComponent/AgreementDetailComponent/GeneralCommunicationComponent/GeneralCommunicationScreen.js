import React from 'react';
import { connect } from 'react-redux';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  AsyncStorage,
} from 'react-native';

import { GiftedChat, Actionss, Bubble, SystemMessage } from 'react-native-gifted-chat';
import { Actions } from 'react-native-router-flux';
import CustomActions from './CustomActions';
import CustomView from './CustomView';
import CommonStyles from '../../../../CommonStyle/CommonStyle';
import Colors from '../../../../Constants/Colors';
import Strings from '../../../../Constants/Strings';
import ImagePath from '../../../../Constants/ImagesPath';
import API from '../../../../Constants/APIUrls';
import Moment from 'moment';

import {
  shareImageForChat,
} from "../../../../Action/ActionCreators";
import {
  showLoading,
  resetState,
} from "./ChatAction";

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var imageObject = {};
var context;
var authToken = '';

var UserID = '';
var maintenanceID='';
var userPic = '';

import SocketIOClient from 'socket.io-client';


class GeneralCommunicationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.socket = this.props.socket
    this.state = {
      messages: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
      messageHistory: [],
      isSend: true,
    };
    this.socket = SocketIOClient(API.CHAT_CONNECTION_URL, { transports: ['websocket'] });
    context = this;
    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderSystemMessage = this.renderSystemMessage.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);
    this._isAlright = null;

    this.socket.on('maintenanceUserJoined', (data) =>{
      
      this.socket.emit('groupChatHistory', { maintenanceId:this.props.agreementDetail._id, userId: UserID});
  });



    this.socket.on('groupChatResponse', (historyRes) => {
      console.log('groupChatResponse', JSON.stringify(historyRes));
      var parsedData = [];
      var history={};
      historyRes.map(function (data, i) {

        var from = historyRes[i].from !== null ? historyRes[i].from : {};
        var userImage = from.image ? API.USER_IMAGE_PATH + from.image : '';
        var firstName = from.firstname ? from.firstname : '';
        var lastName = from.lastname ? from.lastname : '';
        var id = from._id ? from._id : '';
        userPic = userImage;
        
         history = {
          text: historyRes[i].msg,
          user: {
            _id: id !== '' ? id : id,
            avatar: userImage,
            name: firstName + ' ' + lastName,
          },
          createdAt: Moment(historyRes[i].created).format(),
          _id: Math.round(Math.random() * 1000000),
          image: historyRes[i].document_path ? API.CHAT_URL + historyRes[i].document_path : '',
        }

        parsedData.unshift(history);
      })
     
      
      this.setState((previousState) => {
        previousState.messages=[];
        return {
          messages: GiftedChat.prepend(previousState.messages, parsedData),
          // loadEarlier: false,
          //  isLoadingEarlier: false,
        };
      });
      //this.setState({ messageHistory: parsedData });

    });





    this.socket.on('group_message_recieved', (message) => {

      console.log('group_message_recieved', message);
      var data = [{
        text: message.msg,
        user: { _id: this.props.nickname },
        createdAt: message.time,
        _id: message.to
      }]
      // this.setState((previousState) => {
      //   return {
      //     messages: GiftedChat.append(previousState.messages, {
      //       _id: Math.round(Math.random() * 1000000),
      //       text: message.msg,
      //       createdAt: new Date(),
      //       user: {
      //         _id: this.props.nickname,
      //         //name: firstName + ' ' + lastName,
      //         //avatar: userPic,
      //       },
      //       image: message.document_path ? API.CHAT_URL + message.document_path : '',
      //     }),
      //   };
      // });
     // this.socket.emit('groupChatHistory', { maintenanceId: this.props.agreementDetail._id});
    })

  }


  componentDidUpdate() {
    this.onShareImageForChatSuccess();
  }

  componentWillMount() {

    AsyncStorage.getItem('SyncittUserInfo').then((value) => {
      //debugger
      if (value) {
        var userData = JSON.parse(value);
        authToken = userData.token;
        UserID = userData.data._id;
        maintenanceID=this.props.agreementDetail._id;
        this.socket.emit('addMaintenanceUsers', {
          id: UserID,
          maintenanceId: this.props.agreementDetail._id,
          firstName: userData.data.firstname,
          lastName: userData.data.lastname

        });
        //this.socket.emit("getAppliedUsers", UserID);
      }
    }).done();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onLoadEarlier() {
    this.setState((previousState) => {
      return {
        isLoadingEarlier: true,

      };
    });


    setTimeout(() => {
      if (this._isMounted === true) {
        ////console.log('this.state.messageHistory', JSON.stringify(this.state.messageHistory));
        this.setState((previousState) => {
          return {
            messages: GiftedChat.prepend(previousState.messages, messageHistory),
            loadEarlier: false,
            isLoadingEarlier: false,
          };
        });
      }
    }, 1000); // simulating network
  }

  onSend(messages = []) {

    if (messages[0].image) {
       console.log('messages', JSON.stringify(messages));
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, messages),
        };
      });
      messages.map(function (data, i) {

        toId = maintenanceID;
        toTime = messages[i].createdAt;
        toMessage = messages[i].filename;

        imageObject = {

          from: UserID,
          to: maintenanceID,
          textMsg: messages[i].filename,
          time: messages[i].createdAt,
          maintenanceId: maintenanceID,
        }
        //console.log('private message sent file position', JSON.stringify(messages[i].filename));
        context.shareImageForChat(messages[i].image, imageObject);
      })

    } else if (messages[0].location) {
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, messages),
        };
      });
      //console.log(' location', JSON.stringify(messages[0].location));

      var objMessage = {

        from: UserID,
        to: this.props.agreementDetail._id,
        textMsg: messages[0].location,
        time: messages[0].createdAt,
        maintenanceId: this.props.agreementDetail._id,
      }
      //console.log('private message sent', JSON.stringify(objMessage));
      this.socket.emit('group_message_sent', objMessage)

    } else {

      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, messages),
        };
      });

      var objMessage = {

        from: UserID,
        to: this.props.agreementDetail._id,
        textMsg: messages[0].text,
        time: messages[0].createdAt,
        maintenanceId: this.props.agreementDetail._id,
      }
      console.log('group_message_sent', JSON.stringify(messages) + JSON.stringify(objMessage));
      this.socket.emit('group_message_sent', objMessage)
    }
  }


  answerDemo(messages) {
    if (messages.length > 0) {
      if ((messages[0].image || messages[0].location) || !this._isAlright) {
        this.setState((previousState) => {
          return {
            typingText: 'typing...'
          };
        });
      }
    }

    setTimeout(() => {
      if (this._isMounted === true) {
        if (messages.length > 0) {
          if (messages[0].image) {
            this.onReceive('Nice picture!');
          } else if (messages[0].location) {
            this.onReceive('My favorite place');
          } else {
            if (!this._isAlright) {
              this._isAlright = true;
              this.onReceive('Alright');
            }
          }
        }
      }

      this.setState((previousState) => {
        return {
          typingText: null,
        };
      });
    }, 1000);
  }

  renderCustomActions(props) {
    if (Platform.OS === 'ios') {
      return (
        <CustomActions
          {...props}
        />
      );
    }
    const options = {
      'Action 1': (props) => {
        alert('option 1');
      },
      'Action 2': (props) => {
        alert('option 2');
      },
      'Cancel': () => { },
    };
    return (
      <Actionss
        {...props}
        options={options}
      />
    );
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: Colors.RECEIVER_BG_COLOR,

          },
          right: {
            backgroundColor: Colors.SENDER_BG_COLOR,

          },
        }}
      />
    );
  }

  renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          fontSize: 14,
        }}
      />
    );
  }

  renderCustomView(props) {
    return (
      <CustomView
        {...props}
      />
    );
  }

  renderFooter(props) {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
  }

  shareImageForChat(uri, data) {
    this.props.showLoading();
    console.log('update user image path==', uri.replace('file://', '') + ' data:' + JSON.stringify(data));
    this.props.shareImageForChat(authToken, uri.replace('file://', ''), data);
  }



  onShareImageForChatSuccess() {
    if (this.props.threadReducer.shareImageForChatResponse != '' || this.props.threadReducer.shareImageForChatResponse != undefined) {
      console.log('this.props.threadReducer.shareImageForChatResponse' + JSON.stringify(this.props.threadReducer.shareImageForChatResponse));
      if (this.props.threadReducer.shareImageForChatResponse.code == 200) {
        var postData = {

          from: UserID,
          to: maintenanceID,
          textMsg: 'File uploaded ' +this.props.threadReducer.shareImageForChatResponse.data.document_name,
          time: toTime,
          is_file: true,
          document_name: this.props.threadReducer.shareImageForChatResponse.data.document_name,
          picture_path: this.props.threadReducer.shareImageForChatResponse.data.picture_path,
          document_path: this.props.threadReducer.shareImageForChatResponse.data.document_path + this.props.threadReducer.shareImageForChatResponse.data.picture_path,
          size: this.props.threadReducer.shareImageForChatResponse.data.size,
          msg: this.props.threadReducer.shareImageForChatResponse.data.msg,
          propertyId: maintenanceID,
          maintenanceId: maintenanceID,
        }

        //console.log('response data', JSON.stringify(this.props.threadReducer.shareImageForChatResponse.data));
        console.log('post emit data', JSON.stringify(postData));

        this.socket.emit('group_message_sent_with_file', postData)
      }
      else {
        // alert(this.props.threadReducer.shareImageForChatResponse.message);
      }
      this.props.resetState();
    }
  }


  closeMessage() {
    Actions.pop();
  }

  navBar() {
    return (
      <View >
        <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
        <Text style={CommonStyles.navBarTitleTextView}>{Strings.MESSAGES}</Text>
        <TouchableOpacity onPress={() => this.closeMessage()} style={CommonStyles.navRightImageView}>
          <View >
            <Image source={ImagePath.DRAWER_CROSS_ICON} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }


  render() {
    return (
      <View style={styles.chatWrap}>

        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          //loadEarlier={this.state.loadEarlier}
          // onLoadEarlier={this.onLoadEarlier}
          //isLoadingEarlier={this.state.isLoadingEarlier}

          user={{
            _id: UserID, // sent messages should have same user._id
          }}

          renderActions={this.renderCustomActions}
          renderBubble={this.renderBubble}
          renderSystemMessage={this.renderSystemMessage}
          renderCustomView={this.renderCustomView}
          renderFooter={this.renderFooter}
          renderHeader={this.navBar}
        />
      </View>
    );
  }
}



function mapStateToProps(state) {
  console.log('thread mapStateToProps= ', JSON.stringify(state));
  return {
    threadReducer: state.threadReducer
  }
}

export default connect(
  mapStateToProps,
  {
    shareImageForChat,
    showLoading,
    resetState,
  }

)(GeneralCommunicationScreen);

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
  chatWrap: {
    flex: 1,
    width: width,
    height: height
  },
});
