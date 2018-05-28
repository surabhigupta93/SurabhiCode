import React, { Component } from 'react';
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
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import OverviewScreenStyle from './OverviewScreenStyle';
import listData from '../../../data';
import CommonStyles from '../../CommonStyle/CommonStyle';
import API from '../../Constants/APIUrls';
import StarRating from 'react-native-star-rating';
let contextRef;

class OverviewScreen extends Component {
    constructor() {
        super();
        this.state = {
            uploadImagesData: {},
            selectedImage: 0,
            overViewData:'',
            starCount: 3.5,
            roleName:'',
            agencyId:'',
        };
        contextRef = this;
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    componentWillMount() {

        console.log('overview=',JSON.stringify(this.props.overviewData));
        this.setState({overViewData:this.props.overviewData});
        this.getRoleName();
        this.getAgencyId();
       
    }
    componentDidMount() {
         this.uploadImageListSelection(0); 
    } 

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }

    getRoleName() {

        AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
            if (value) {
                console.log('user name == ', value);
                this.setState({ roleName: value });

            }
        }).done();
    }
    getAgencyId() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                agencyId=userData.data.agency_id?userData.data.agency_id:'';
            }
        }).done();
    }

    uploadImageListSelection(index) {

        console.log('selectedimage== ', index);
       
        var overviewImagePath = this.state.overViewData.images ? (this.state.overViewData.images.length > 0 ? this.state.overViewData.images[index].url : '') : '';
         console.log('selectedimage== ',overviewImagePath);
        this.setState({ selectedImage: overviewImagePath });
        var tempData = this.state.overViewData.images;
        var tempArray = this.state.overViewData.images;
        tempArray.map((data, position) => {

            if (index == position) {

                if (tempArray[index].isSelected == 0) {
                    tempArray[index].isSelected = 1;
                }

            }
            else {
                tempArray[position].isSelected = 0;
            }


        })
        tempData.imageArray = tempArray;
        this.setState({ uploadImagesData: tempData });

    }


    renderItem({ item, index }) {
    var imagePath = item.url?API.USER_IMAGE_PATH+item.url : '';
        return (
            <TouchableOpacity onPress={() => contextRef.uploadImageListSelection(index)}>
                <View style={OverviewScreenStyle.overviewImageListItemStyle}>
                    <Image source={{ uri:imagePath }} style={OverviewScreenStyle.overviewPropertyListImageStyle} />
                </View>
                {
                    item.isSelected == 1 ? <View style={OverviewScreenStyle.selectedImageStyle}>

                    </View> : null
                }
            </TouchableOpacity>
        );
    }


    render() {

        return (
            <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>

                {
                        this.state.selectedImage != ''
                        ?
                        <Image source={{ uri: API.USER_IMAGE_PATH+this.state.selectedImage }} style={OverviewScreenStyle.overviewImageStyle} />
                        :
                        null
                }
                <View style={{ marginTop: 5}}>
                    {
                        this.state.overViewData.images.length>0 ?
                            <FlatList
                                horizontal={true}
                                data={this.state.overViewData.images}
                                renderItem={this.renderItem}
                                extraData={this.state}
                            /> : null
                    }

                </View>
             
                <View>
                            <Text style={OverviewScreenStyle.titleTextStyle}>About {this.state.overViewData.firstname+' '+this.state.overViewData.lastname}</Text>
                                <Text style={OverviewScreenStyle.detailsTextStyle}>
                                {
                                    this.state.overViewData.about_user?this.state.overViewData.about_user:'No data found'
                                }
                            </Text>
                </View>
              
              
                {
                       
                         <View>
                         <Text style={OverviewScreenStyle.titleTextStyle}>Agency</Text>
                         {this.state.roleName == Strings.USER_ROLE_AGENT&&this.state.agencyId!=''? 
                         <View style={OverviewScreenStyle.agencyReviewContainerStyle}>
                             <Image source={{uri:this.state.overViewData.agency_id?API.USER_IMAGE_PATH+this.state.overViewData.agency_id.logoImage:''}} style={OverviewScreenStyle.agencyImageStyle} />
                             <View style={OverviewScreen.reviewContainerStyle}>
                                 <Text style={OverviewScreenStyle.agencyTitleTextStyle}>{this.state.overViewData.agency_id?this.state.overViewData.agency_id.name:''}</Text>
                                 <View style={{ marginLeft: 16}}>
                                 <StarRating
                                         disabled={true}
                                         maxStars={5}
                                         starSize={20}
                                         starStyle={{ paddingRight: 2, paddingLeft: 2, marginTop: 5,marginBottom:5 }}
                                         emptyStarColor={Colors.EMPTY_STAR_COLOR}
                                         starColor={Colors.STAR_COLOR}
                                         rating={this.state.starCount}
                                         selectedStar={(rating) => this.onStarRatingPress(rating)}
                                 />
                                 </View>
                                 <Text style={OverviewScreenStyle.reviewDetailsTextStyle}>4.5 from 238 reviews</Text>
                             </View>
                         </View> :  <View style={{marginTop:10,marginLeft:5}}><Text style={OverviewScreenStyle.reviewDetailsTextStyle}>Not associate with agency</Text></View>
                        }
                         </View>
                       
         
                        //  <Text style={OverviewScreenStyle.detailsTextStyle}>
                        //      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.◊
                        //  </Text>
                }
               
            </ScrollView >

        );
    }
}

export default OverviewScreen;
