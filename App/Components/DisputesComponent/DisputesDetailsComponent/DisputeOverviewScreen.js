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
import DisputeOverviewScreenStyle from './DisputeOverviewScreenStyle';
import listData from '../../../../data';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import { Dropdown } from 'react-native-material-dropdown';
import { CardViewWithLowMargin } from '../../CommonComponent/CardViewWithLowMargin';
import StarRating from 'react-native-star-rating';
import API from '../../../Constants/APIUrls';
import Moment from 'moment';
let ref;
class DisputeOverviewScreen extends Component {
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

    maintenanceRequestRenderItem({ item, index }) {

        return (

            <CardViewWithLowMargin>
                <View style={DisputeOverviewScreenStyle.maintenanceListHeaderContainer}>
                    <View style={DisputeOverviewScreenStyle.statusContainerStyle}>
                        <View style={DisputeOverviewScreenStyle.maintenanceStatusViewStyle}>
                            <Text style={DisputeOverviewScreenStyle.statusViewTextStyle}>COMPELTED</Text>
                        </View>
                    </View>
                    <Image source={ImagePath.USER_DEFAULT} style={DisputeOverviewScreenStyle.maintenaceUserImageStyle} />
                    <View style={DisputeOverviewScreenStyle.statusContainerStyle}>
                        <Text style={DisputeOverviewScreenStyle.dollarTextStyle}>$77</Text>
                        <Text style={DisputeOverviewScreenStyle.daysTextStyle}>in 7 days</Text>
                    </View>
                </View>
                <View style={DisputeOverviewScreenStyle.detailContainerStyle}>
                    <View style={DisputeOverviewScreenStyle.maintenanceDetailTitleContainerStyle}>
                        <Text style={DisputeOverviewScreenStyle.maintenanceDetailTitleTextStyle}>Faucet not running water</Text>
                        <Image source={ImagePath.RED_NOTIFICATION} style={DisputeOverviewScreenStyle.notificatioImageStyle} />
                    </View>
                    <Text style={DisputeOverviewScreenStyle.maintenanceDetailTextStyle}>Request ID : 100923824</Text>
                    <Text style={DisputeOverviewScreenStyle.maintenanceDetailTextStyle}>Category name</Text>
                </View>
            </CardViewWithLowMargin>
        );

    }


    fileRenderItem({ item, index }) {
        var path = API.MAINTENANCE_IMAGE_PATH + item.path;
        console.log('image path==', path);
        return (
            <View style={DisputeOverviewScreenStyle.listContainerStyle}>

                <View style={DisputeOverviewScreenStyle.imageContainerStyle}>
                    <Image source={{ uri: path }} style={DisputeOverviewScreenStyle.userImageStyle} />
                </View>

                <View style={{ justifyContent: 'center', }}>
                    <View style={DisputeOverviewScreenStyle.detailTitleContainerStyle}>
                        <Text style={DisputeOverviewScreenStyle.detailTitleTextStyle}>{item.path}</Text>
                        <Image source={ImagePath.BLUE_HEART} style={DisputeOverviewScreenStyle.listImageStyle} />
                        <Image source={ImagePath.DOTS_ICON} style={DisputeOverviewScreenStyle.listImageStyle} />
                    </View>

                </View>

            </View>
        );
    }

    watcherRenderItem({ item, index }) {

        return (
            <View style={DisputeOverviewScreenStyle.listContainerStyle}>

                <View style={DisputeOverviewScreenStyle.imageContainerStyle}>
                    <Image source={{ uri: item.url }} style={DisputeOverviewScreenStyle.watcherImageStyle} />
                </View>

                <View style={DisputeOverviewScreenStyle.detailTitleContainerStyle}>
                    <Text style={DisputeOverviewScreenStyle.watcherTitleTextStyle}>{item.name}</Text>

                    <Image source={ImagePath.DOTS_ICON} style={DisputeOverviewScreenStyle.listImageStyle} />
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

        var uploadedImages = this.props.reqDetailData ? this.props.reqDetailData.images : [];
        return (
            <ScrollView>

                <View>
                    <CardViewWithLowMargin>
                        <Text style={DisputeOverviewScreenStyle.fileTitleTextStyle}>Highlights</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={DisputeOverviewScreenStyle.highlightViewContainer}>
                                <Text style={DisputeOverviewScreenStyle.aboutRequestDetailTextStyle}>Tenancy Start date</Text>
                                <Text style={DisputeOverviewScreenStyle.highlightValueTextStyle}>July 30, 2017</Text>
                            </View>

                            <View style={DisputeOverviewScreenStyle.highlightValueViewContainer}>
                                <Text style={DisputeOverviewScreenStyle.aboutRequestDetailTextStyle}>Tenancy length</Text>
                                <Text style={DisputeOverviewScreenStyle.highlightValueTextStyle}>5 years</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <View style={DisputeOverviewScreenStyle.highlightViewContainer}>
                                <Text style={DisputeOverviewScreenStyle.aboutRequestDetailTextStyle}>Rental Case validity</Text>
                                <Text style={DisputeOverviewScreenStyle.highlightValueTextStyle}>July 30, 2017</Text>
                            </View>

                            <View style={DisputeOverviewScreenStyle.highlightValueViewContainer}>
                                <Text style={DisputeOverviewScreenStyle.aboutRequestDetailTextStyle}>Payment frequency</Text>
                                <Text style={DisputeOverviewScreenStyle.highlightValueTextStyle}>Monthly</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <View style={DisputeOverviewScreenStyle.highlightViewContainer}>
                                <Text style={DisputeOverviewScreenStyle.aboutRequestDetailTextStyle}>Contact for Lease Renewal</Text>
                                <Text style={DisputeOverviewScreenStyle.highlightValueRedTextStyle}>1 month</Text>
                            </View>

                            <View style={DisputeOverviewScreenStyle.highlightValueViewContainer}>
                                <Text style={DisputeOverviewScreenStyle.aboutRequestDetailTextStyle}>Rent per week</Text>
                                <Text style={DisputeOverviewScreenStyle.highlightValueTextStyle}>$2500</Text>
                            </View>
                        </View>

                    </CardViewWithLowMargin>
                </View>


                <View>
                    <CardViewWithLowMargin>
                        <Text style={DisputeOverviewScreenStyle.fileTitleTextStyle}>Agreement details</Text>
                        <Text numberOfLines={(this.state.isShowMore == false) ? 6 : null} style={DisputeOverviewScreenStyle.aboutRequestDetailTextStyle}>{Strings.DUMMY_TEXT}</Text>

                        <TouchableOpacity onPress={this.showHideMore.bind(this)}>
                            <Text style={DisputeOverviewScreenStyle.loadMoreTextStyle}>
                                {(this.state.isShowMore == false) ? 'Show more' : 'Show less'}
                            </Text>
                        </TouchableOpacity>


                    </CardViewWithLowMargin>
                </View>


                <View>
                    <CardViewWithLowMargin>
                        <Text style={DisputeOverviewScreenStyle.fileTitleTextStyle}>Maintenance requests</Text>
                        <View style={DisputeOverviewScreenStyle.tileListContainerStyle} >

                            <FlatList
                                horizontal={false}
                                data={listData}
                                renderItem={this.maintenanceRequestRenderItem}
                                extraData={this.state}
                            />

                        </View>
                    </CardViewWithLowMargin>
                </View>

                <View>
                    <CardViewWithLowMargin>
                        <Text style={DisputeOverviewScreenStyle.fileTitleTextStyle}>Files Attached</Text>
                        <View style={DisputeOverviewScreenStyle.tileListContainerStyle} >

                            <FlatList
                                horizontal={false}
                                data={listData}
                                renderItem={this.fileRenderItem}
                                extraData={this.state}
                            />

                        </View>
                    </CardViewWithLowMargin>
                </View>


                <View>
                    <CardViewWithLowMargin>
                        <Image source={ImagePath.HEADER_BG} style={DisputeOverviewScreenStyle.disputesImageViewStyle} />
                        <View style={DisputeOverviewScreenStyle.disputesTitleViewStyle}>
                            <Text style={DisputeOverviewScreenStyle.disputesTitleTextStyle}>Tropical Oasis In The Heart Of Brisbane City</Text>
                        </View>
                        <View style={DisputeOverviewScreenStyle.disputesSubTitleViewStyle}>
                            <Text style={DisputeOverviewScreenStyle.disputesSubTitleTextStyle}>Property ID : 10098273</Text>

                            <Text style={DisputeOverviewScreenStyle.disputesSubTitleTextStyle}>Unit 5, Oasis buidling, 3rd street Brisbane</Text>
                        </View>
                    </CardViewWithLowMargin>
                </View>


                <View>
                    <CardViewWithLowMargin>
                        <Text style={DisputeOverviewScreenStyle.titleTextStyle}>Watcher</Text>
                        <View style={DisputeOverviewScreenStyle.tileListContainerStyle} >
                            {
                                listData ?
                                    <FlatList
                                        horizontal={false}
                                        data={listData}
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

export default DisputeOverviewScreen;
