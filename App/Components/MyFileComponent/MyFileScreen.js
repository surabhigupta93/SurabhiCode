
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
    Dimensions
} from 'react-native';

import {

    uploadMyFileDoc,
    addDocumentToFav,
    getFavUploadedDocument,
    getUploadedDocument,

} from "../../Action/ActionCreators";

import {

    showLoading,
    resetState,

} from "./MyFileAction";
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import MyFileScreenStyle from './MyFileScreenStyle';
import listData from '../../../data';
import { Dropdown } from 'react-native-material-dropdown';
import API from '../../Constants/APIUrls';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import FilterScreen from '../FilterComponent/FilterScreen';
import * as Progress from 'react-native-progress';
import MyFileFilterScreen from '../MyFileFilterComponent/MyFileFilterScreen';
const window = Dimensions.get('window');
let ref;
class MyFileScreen extends Component {
    constructor() {
        super();
        ref = this;
        this.state = {
            isTabSelected: true,
            isTile: false,
            uploadedDocumentData: [],
            isFilter: false,
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {

        this.onGetUploadedDocumentSuccess();
        this.onGetFavUploadedDocumentSuccess();
        this.onDocumentToFavSuccess();
        this.onUploadFileSuccess(); 
        this.onFilterMyFileListSuccess();
    }

    componentWillUnmount() {

    }

    componentWillMount() {
        
        this.callGetUploadedDocument();
    }


    onAllTabClick() {
        this.callGetUploadedDocument();
        this.setState({ isTabSelected: true });
    }
    onFavoriteTabClick() {
        this.callGetFavUploadedDocument();
        this.setState({ isTabSelected: false });
    }

    refreshListList() {
        if (this.state.isTabSelected) {

            this.callGetUploadedDocument();
        }
        else {

            this.callGetFavUploadedDocument();
        }
    }

    onTileClick() {

        if (this.state.isTile) {

            this.setState({ isTile: false });
        }
        else {

            this.setState({ isTile: true });
        }
    }


    onFilterClick() {

        if (this.state.isFilter) {

            this.setState({ isFilter: false });
        }
        else {

            this.setState({ isFilter: true });
        }
    }

    openFileChooser() {
        // iPhone/Android
        DocumentPicker.show({
            filetype: [DocumentPickerUtil.allFiles()],
        }, (error, res) => {
            // Android
            console.log(
                res.uri,
                res.type, // mime type
                res.fileName,
                res.fileSize
            );
            AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                if (value) {
                    var userData = JSON.parse(value);
                    var authToken = userData.token;
                    //this.props.showLoading();
                    console.log('image path==', res.uri.replace("file://", ""));
                    this.props.showLoading();
                    this.props.uploadMyFileDoc(authToken, res.uri.replace("file://", ""), userData.data._id, res.type, res.fileName);
                }
            }).done();

        });
    }

    callGetUploadedDocument() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;

                var postData = {

                    created_by: userData.data._id,
                }
                this.props.showLoading();
                this.props.getUploadedDocument(authToken, postData);
            }
        }).done();
    }

    onGetUploadedDocumentSuccess() {
        if (this.props.myFileReducer.uploadedDocumentRes != '') {
            if (this.props.myFileReducer.uploadedDocumentRes.code == 200) {

                this.setState({ uploadedDocumentData: this.props.myFileReducer.uploadedDocumentRes.data });
            }
            else {
                alert(this.props.myFileReducer.uploadedDocumentRes.message);
            }
            this.props.resetState();
        }
    }

    onUploadFileSuccess() {
        console.log('upload success==',JSON.stringify(this.props.myFileReducer.uploadDocSuccessRes));
        if (this.props.myFileReducer.uploadDocSuccessRes != ''&&this.props.myFileReducer.uploadDocSuccessRes!=undefined) {
            if (this.props.myFileReducer.uploadDocSuccessRes.code == 200) {

                this.refreshListList();             
            }
            else {
                alert(this.props.myFileReducer.uploadDocSuccessRes.message);
            }
            this.props.resetState();
        }
    }

    onFilterMyFileListSuccess() {
        if (this.props.myFileFilterReducer.filterFileRes != '') {
            if (this.props.myFileFilterReducer.filterFileRes.code == 200) {
                console.log('my file filterRes data== ', JSON.stringify(this.props.myFileFilterReducer.filterFileRes));
                this.setState({ uploadedDocumentData: this.props.myFileFilterReducer.filterFileRes.data });
            }
            else {

                //alert(this.props.myFileFilterReducer.filterFileRes.message);
            }
            this.props.resetState();
        }
    }




    

    callGetFavUploadedDocument() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;

                var postData = {

                    created_by: userData.data._id,
                }
                this.props.showLoading();
                this.props.getFavUploadedDocument(authToken, postData);
            }
        }).done();
    }

    onGetFavUploadedDocumentSuccess() {
        if (this.props.myFileReducer.uploadedFavDocumentRes != '') {
            if (this.props.myFileReducer.uploadedFavDocumentRes.code == 200) {

                this.setState({ uploadedDocumentData: this.props.myFileReducer.uploadedFavDocumentRes.data });
            }
            else {

                alert(this.props.myFileReducer.uploadedFavDocumentRes.message);
            }
            this.props.resetState();
        }
    }


    callDocumentToFav(isFav, id) {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;

                var postData = {

                    created_by: userData.data._id,
                    _id: id,
                    is_favorite: !isFav
                }
                this.props.showLoading();
                this.props.addDocumentToFav(authToken, postData);
            }
        }).done();
    }

    onDocumentToFavSuccess() {
        if (this.props.myFileReducer.addDocumentToFavRes != '') {
            if (this.props.myFileReducer.addDocumentToFavRes.code == 200) {

                this.refreshListList();
            }
            else {
                alert(this.props.myFileReducer.addDocumentToFavRes.message);
            }
            this.props.resetState();
        }
    }


    navBar() {
        return (
            <View style={{ backgroundColor: Colors.WHITE }}>
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.MY_FILES}</Text>
                <TouchableOpacity onPress={this.openFileChooser.bind(this)} style={CommonStyles.navPlusImageView}>
                    <Image source={ImagePath.PLUS_ICON} />
                </TouchableOpacity>
            </View>
        );
    }

    renderImageItem(item, index) {
        return (
            <Image source={{ uri: item.url }} style={MyFileScreenStyle.userListImageStyle} />
        );
    }

    renderItem({ item, index }) {
        var documentPath = API.DOCUMENTS_PATH + item.document_path;
        console.log('document path==', documentPath.includes('.png'));
        return (
            <View style={MyFileScreenStyle.listContainerStyle}>

                {
                    (documentPath.includes('.jpg')||documentPath.includes('.png')||documentPath.includes('.jpeg')) ? <View style={MyFileScreenStyle.imageContainerStyle}>
                        <Image source={{ uri: documentPath }} style={MyFileScreenStyle.userImageStyle} />
                    </View> : <View style={MyFileScreenStyle.imageContainerStyle}>
                            <Image source={ImagePath.DOC_IMAGE} style={MyFileScreenStyle.userImageStyle} />
                        </View>

                }


                <View>
                    <View style={MyFileScreenStyle.detailTitleContainerStyle}>
                        <Text numberOfLines={2} style={MyFileScreenStyle.detailTitleTextStyle}>{item.document_name}</Text>
                        <TouchableOpacity style={MyFileScreenStyle.listImageStyle} onPress={ref.callDocumentToFav.bind(ref, item.is_favorite, item._id)}>
                            <Image source={(item.is_favorite) ? ImagePath.BLUE_HEART : ImagePath.HEART_OUTLINE} />
                        </TouchableOpacity>
                        <Image source={ImagePath.DOTS_ICON} style={MyFileScreenStyle.listImageStyle} />
                    </View>
                    {/*<Text style={MyFileScreenStyle.categoryTextStyle}>{item.createdDate}</Text>*/}
                </View>

            </View>
        );
    }

    tileRenderItem({ item, index }) {
        var documentPath = API.DOCUMENTS_PATH + item.document_path;
        return (

            <View style={MyFileScreenStyle.tileImageContainerStyle}>
                {
                    (documentPath.includes('.jpg')||documentPath.includes('.png')||documentPath.includes('.jpeg')) ?
                        <Image source={{ uri: documentPath }} style={MyFileScreenStyle.tileImageGridStyle} />
                        :
                        <Image source={ImagePath.DOC_IMAGE} style={MyFileScreenStyle.tileImageGridStyle} />

                }

                <TouchableOpacity style={MyFileScreenStyle.likeImageViewStyle} onPress={ref.callDocumentToFav.bind(ref, item.is_favorite, item._id)}>
                    <Image source={(item.is_favorite) ? ImagePath.BLUE_HEART : ImagePath.HEART_OUTLINE} />
                </TouchableOpacity>
                <View style={MyFileScreenStyle.detailTitleContainerStyle}>
                    <Text numberOfLines={2} style={MyFileScreenStyle.tileTextStyle}>{item.document_name}</Text>
                    <TouchableOpacity>
                        <Image source={ImagePath.DOTS_ICON} style={MyFileScreenStyle.tileListImageStyle} />
                    </TouchableOpacity>
                </View>
            </View>

        );
    }



    render() {
        let data = [{
            value: 'By added date',
        }];

        return (
            <View style={{ flex: 1, backgroundColor: Colors.SETTING_SCREEN_BG_COLOR }}>

                {this.navBar()}
                <TouchableOpacity onPress={() => this.onFilterClick()} >
                    <View style={MyFileScreenStyle.refineResultContainerStyle}>
                        <View>
                            <Text style={MyFileScreenStyle.refineResultTextStyle}>{Strings.REFINE_RESULTS}</Text>
                            <View style={MyFileScreenStyle.refineResultBottomBarStyle} />
                        </View>
                        {this.state.isFilter ? <Image source={ImagePath.ARROW_DOWN} style={MyFileScreenStyle.refineResultArrowUpStyle} />
                            : <Image source={ImagePath.ARROW_DOWN} style={MyFileScreenStyle.refineResultArrowStyle} />
                        }

                    </View>
                </TouchableOpacity>
                <View style={MyFileScreenStyle.tabContainerStyle}>
                    <TouchableOpacity onPress={() => this.onAllTabClick()} >

                        <View>
                            <View style={MyFileScreenStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected == true) ? MyFileScreenStyle.tabLabelTextStyle : MyFileScreenStyle.tabLabelDiselectTextStyle}>{Strings.ALL}</Text>
                            </View>
                            {(this.state.isTabSelected == true) ? <View style={MyFileScreenStyle.tabIndicatorStyle}></View> : <View style={MyFileScreenStyle.tabWhiteIndicatorStyle}></View>}
                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.onFavoriteTabClick()}>
                        <View>
                            <View style={MyFileScreenStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected == false) ? MyFileScreenStyle.tabLabelTextStyle : MyFileScreenStyle.tabLabelDiselectTextStyle}>Favorites</Text>
                            </View>
                            {(this.state.isTabSelected == false) ? <View style={MyFileScreenStyle.tabIndicatorStyle}></View> : <View style={MyFileScreenStyle.tabWhiteIndicatorStyle}></View>}
                        </View>
                    </TouchableOpacity>
                    <View style={MyFileScreenStyle.tileViewImageContainerStyle}>
                        <TouchableOpacity onPress={() => this.onTileClick()}>

                            <Image source={this.state.isTile ? ImagePath.TILE_VIEW_ICON : ImagePath.UNSELECTED_TILES_VIEW_ICON} style={MyFileScreenStyle.tileImageStyle} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.onTileClick()}>
                            <Image source={this.state.isTile ? ImagePath.LIST_VIEW_ICON : ImagePath.SELECTED_MENU_VIEW_ICON} style={MyFileScreenStyle.tileImageStyle} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={MyFileScreenStyle.tileViewContainerStyle}>
                    {/* <Dropdown
                        label=''
                        labelHeight={5}
                        fontSize={14}
                        baseColor={Colors.DROP_DOWN_BACKGROUND_COLOR}
                        containerStyle={MyFileScreenStyle.dropDownViewStyle}
                        data={data}
                        value={data[0].value}
                    /> */}

                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={CommonStyles.flatListStyle}>
                    {
                        this.state.isFilter ?
                        <MyFileFilterScreen /> : null
                    }
                    {this.state.isTile ?
                        this.state.uploadedDocumentData.length > 0 ?

                            <View style={MyFileScreenStyle.tileListContainerStyle} >
                                <FlatList contentContainerStyle={CommonStyles.flatListStyle} showsVerticalScrollIndicator={false}
                                    numColumns={2}
                                    data={this.state.uploadedDocumentData}
                                    renderItem={this.tileRenderItem}
                                    extraData={this.state}
                                />
                            </View>
                            :
                            <View style={{ flex: 1, justifyContent: 'center', marginTop:window.height*0.25 }}>
                                <Text style={{ fontSize: 20, justifyContent: 'center', textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>
                                    {Strings.NO_DATA_FOUND}</Text>
                            </View>
                        :
                        null
                    }

                    {!this.state.isTile ?
                        this.state.uploadedDocumentData.length > 0 ?
                            <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                                data={this.state.uploadedDocumentData}
                                renderItem={this.renderItem}
                                extraData={this.state}
                            />
                            :
                            <View style={{ flex: 1, justifyContent: 'center', marginTop:window.height*0.25 }}>
                                <Text style={{ fontSize: 20, justifyContent: 'center', textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>
                                    {Strings.NO_DATA_FOUND}</Text>
                            </View>
                        :
                        null
                    }
                </ScrollView>

                {

                    this.props.myFileReducer.isScreenLoading ?
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
    console.log('mapStateToProps= ', JSON.stringify(state));
    return {
        myFileReducer: state.myFileReducer,
        myFileFilterReducer: state.myFileFilterReducer

    }
}

export default connect(
    mapStateToProps,
    {
        uploadMyFileDoc,
        addDocumentToFav,
        getFavUploadedDocument,
        getUploadedDocument,
        showLoading,
        resetState,
    }

)(MyFileScreen);

