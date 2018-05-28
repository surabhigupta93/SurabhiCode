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
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import TradersRequestDetailScreenStyle from './TradersRequestDetailScreenStyle';
import listData from '../../../../data';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import { Dropdown } from 'react-native-material-dropdown';
import { CardViewWithLowMargin } from '../../CommonComponent/CardViewWithLowMargin';
import StarRating from 'react-native-star-rating';
import API from '../../../Constants/APIUrls';
import Moment from 'moment';
let ref;
class TradersReviewAndRatingScreen extends Component {
    constructor() {
        super();
        this.state = {
            isShowMore: false,
            starCount: 3.5,
        };
        ref = this;
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }
    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }


    fileRenderItem({ item, index }) {
        var path=API.MAINTENANCE_IMAGE_PATH+item.path;
        console.log('image path==',path);
        return (
            <View style={TradersRequestDetailScreenStyle.listContainerStyle}>

                <View style={TradersRequestDetailScreenStyle.imageContainerStyle}>
                    <Image source={{ uri: path }} style={TradersRequestDetailScreenStyle.userImageStyle} />
                </View>

                <View style={{ justifyContent: 'center', }}>
                    <View style={TradersRequestDetailScreenStyle.detailTitleContainerStyle}>
                        <Text style={TradersRequestDetailScreenStyle.detailTitleTextStyle}>{item.path}</Text>
                        <Image source={ImagePath.BLUE_HEART} style={TradersRequestDetailScreenStyle.listImageStyle} />
                        <Image source={ImagePath.DOTS_ICON} style={TradersRequestDetailScreenStyle.listImageStyle} />
                    </View>

                </View>

            </View>
        );
    }

    watcherRenderItem({ item, index }) {
        var watcherData=item.users_id;
        return (
            <View style={TradersRequestDetailScreenStyle.listContainerStyle}>

                <View style={TradersRequestDetailScreenStyle.imageContainerStyle}>
                    <Image source={{ uri: API.USER_IMAGE_PATH+watcherData.image }} style={TradersRequestDetailScreenStyle.watcherImageStyle} />
                </View>

                <View style={TradersRequestDetailScreenStyle.detailTitleContainerStyle}>
                    <Text style={TradersRequestDetailScreenStyle.watcherTitleTextStyle}>{watcherData.firstname+' '+watcherData.lastname}</Text>

                    <Image source={ImagePath.DRAWER_CROSS_ICON} style={TradersRequestDetailScreenStyle.listImageStyle} />
                </View>


            </View>
        );
    }

    showHideMore() {
        if (this.state.isShowMore == false) {
            this.setState({ isShowMore: true });
        }
        else {
            this.setState({ isShowMore: false });
        }

    }

    render() {
        let data = [{
            value: 'Tenant reviews',
        }];

        var uploadedImages=this.props.reqDetailData.images?this.props.reqDetailData.images:[];
        return (
            <ScrollView>

                <View>
                    <CardViewWithLowMargin>
                        <Text numberOfLines={(this.state.isShowMore == false) ? 6 : null} style={TradersRequestDetailScreenStyle.aboutRequestDetailTextStyle}>{this.props.reqDetailData.request_detail}</Text>
                        {
                            this.props.reqDetailData.request_detail.length>100
                            ?
                            <TouchableOpacity onPress={this.showHideMore.bind(this)}>
                                <Text style={TradersRequestDetailScreenStyle.loadMoreTextStyle}>
                                    {(this.state.isShowMore == false) ? 'Show more' : 'Show less'}
                                </Text>
                            </TouchableOpacity>
                            :null
                        }
                       
                    </CardViewWithLowMargin>
                </View>


                <View>
                    <CardViewWithLowMargin>
                        <Text style={TradersRequestDetailScreenStyle.fileTitleTextStyle}>Files Attached</Text>
                        <View style={TradersRequestDetailScreenStyle.tileListContainerStyle} >
                            {
                                uploadedImages.length >0 ?
                                    <FlatList
                                        horizontal={false}
                                        data={uploadedImages}
                                        renderItem={this.fileRenderItem}
                                        extraData={this.state}
                                    /> : null
                            }
                        </View>
                    </CardViewWithLowMargin>
                </View>


                <View>
                    <CardViewWithLowMargin>
                        <View style={TradersRequestDetailScreenStyle.priceContainerStyle}>
                            <Text style={TradersRequestDetailScreenStyle.priceTextStyle}>${this.props.reqDetailData.budget}</Text>
                            <Text style={TradersRequestDetailScreenStyle.daysTextStyle}>{Moment(this.props.reqDetailData.completed_date).fromNow()}</Text>
                        </View>
                    </CardViewWithLowMargin>
                </View>


                <View>
                    <CardViewWithLowMargin>
                        <View style={TradersRequestDetailScreenStyle.userRatingContainer}>

                            <View>
                                <Text style={TradersRequestDetailScreenStyle.ratingTitleTextStyle}>By Jerome Thompson</Text>
                                <View style={TradersRequestDetailScreenStyle.ratingStarContainerStyle}>
                                    <StarRating
                                        disabled={true}
                                        maxStars={5}
                                        starSize={20}
                                        starStyle={{ paddingRight: 5, marginTop: 8 }}
                                        emptyStarColor={Colors.EMPTY_STAR_COLOR}
                                        starColor={Colors.STAR_COLOR}
                                        rating={ref.state.starCount}
                                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                                    />
                                </View>

                                <Text style={TradersRequestDetailScreenStyle.ratingReviewTextStyle}>{'3.5 from 150 reviews'}</Text>
                            </View>

                            <View style={TradersRequestDetailScreenStyle.ratingImageContainerStyle}>
                                <TouchableOpacity >
                                    <Image source={ImagePath.USER_DEFAULT} style={TradersRequestDetailScreenStyle.ratingImageStyle} />
                                </TouchableOpacity>
                                <View style={TradersRequestDetailScreenStyle.statusViewStyle} />
                            </View>

                        </View>
                    </CardViewWithLowMargin>
                </View>


                <View>
                    <CardViewWithLowMargin>
                        <Text style={TradersRequestDetailScreenStyle.titleTextStyle}>Watcher</Text>
                        <View style={TradersRequestDetailScreenStyle.tileListContainerStyle} >
                            {
                                this.props.reqDetailData.watchers_list.length>0 ?
                                    <FlatList
                                        horizontal={false}
                                        data={this.props.reqDetailData.watchers_list}
                                        renderItem={this.watcherRenderItem}
                                        extraData={this.state}
                                    /> : null
                            }
                        </View>
                    </CardViewWithLowMargin>
                </View>

            </ScrollView >

        );
    }
}

export default TradersReviewAndRatingScreen;
