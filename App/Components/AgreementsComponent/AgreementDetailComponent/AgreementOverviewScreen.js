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

import AgreementOverviewScreenStyle from './AgreementOverviewScreenStyle';
import listData from '../../../../data';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import { Dropdown } from 'react-native-material-dropdown';
import { CardViewWithLowMargin } from '../../CommonComponent/CardViewWithLowMargin';
import StarRating from 'react-native-star-rating';
import API from '../../../Constants/APIUrls';
import Moment from 'moment';
let ref;
class AgreementOverviewScreen extends Component {
    constructor() {
        super();
        this.state = {
            isShowMore: false,
            starCount: 3.5,
            agreementData:[],

        };
        ref = this;
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }    
    componentWillMount() {
        this.setState({agreementData:this.props.agreementDetail});
        console.log('date==',JSON.stringify(this.props.agreementDetail));
    }
    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }

    renderStatusView(item){
        // 1 for sent , 2 for accepted, 3 for booked, 4 for completed, 5 for closed, 6 for due, 7 denied

            switch (item.req_status) {

                    case 1:
                        return(
                            <View style={AgreementOverviewScreenStyle.statusSentViewStyle}>
                                    <Text style={AgreementOverviewScreenStyle.statusViewTextStyle}>SENT</Text>
                            </View>
                        );
                        break;
                    case 2:
                        return(
                            <View style={AgreementOverviewScreenStyle.statusAcceptedViewStyle}>
                                    <Text style={AgreementOverviewScreenStyle.statusViewTextStyle}>ACCEPTED</Text>
                            </View>
                        );
                        break;
                    case 3:
                        return(
                            <View style={AgreementOverviewScreenStyle.statusBookViewStyle}>
                                    <Text style={AgreementOverviewScreenStyle.statusViewTextStyle}>BOOKED</Text>
                            </View>
                        );
                        break;

                    case 4:
                        return(
                            <View style={AgreementOverviewScreenStyle.statusCompletedViewStyle}>
                                    <Text style={AgreementOverviewScreenStyle.statusViewTextStyle}>COMPLETED</Text>
                            </View>
                        );
                        break;
                    case 5:
                        return(
                            <View style={AgreementOverviewScreenStyle.statusOverDueViewStyle}>
                                    <Text style={AgreementOverviewScreenStyle.statusViewTextStyle}>COLSED</Text>
                            </View>
                        );
                        break;
                    case 6:
                        return(
                            <View style={AgreementOverviewScreenStyle.statusOverDueViewStyle}>
                                    <Text style={AgreementOverviewScreenStyle.statusViewTextStyle}>OVER DUE</Text>
                            </View>
                        );
                        break;
                    case 7:
                        return(
                            <View style={MaintenanceRequestScreenStyle.statusOverDueViewStyle}>
                                    <Text style={MaintenanceRequestScreenStyle.statusViewTextStyle}>DENIED</Text>
                            </View>
                        );
                        break;
                    default:

                }
      
    }

    maintenanceRequestRenderItem({ item, index }) {
        var userImage=API.USER_IMAGE_PATH+item.created_by.image;    
        return (

            <CardViewWithLowMargin>
                <View style={AgreementOverviewScreenStyle.maintenanceListHeaderContainer}>
                    <View style={AgreementOverviewScreenStyle.statusContainerStyle}>
                       {
                            ref.renderStatusView(item)
                       }
                    </View>
                    <Image source={{uri:userImage}} style={AgreementOverviewScreenStyle.maintenaceUserImageStyle} />
                    <View style={AgreementOverviewScreenStyle.statusContainerStyle}>
                        <Text style={AgreementOverviewScreenStyle.dollarTextStyle}>${item.budget}</Text>
                        <Text style={AgreementOverviewScreenStyle.daysTextStyle}>{Moment(item.completed_date).fromNow()}</Text>
                    </View>
                </View>
                <View style={AgreementOverviewScreenStyle.detailContainerStyle}>
                    <View style={AgreementOverviewScreenStyle.maintenanceDetailTitleContainerStyle}>
                        <Text style={AgreementOverviewScreenStyle.maintenanceDetailTitleTextStyle}>{item.request_overview}</Text>
                        <Image source={ImagePath.RED_NOTIFICATION} style={AgreementOverviewScreenStyle.notificatioImageStyle} />
                    </View>
                    <Text style={AgreementOverviewScreenStyle.maintenanceDetailTextStyle}>Request ID : {item.request_id}</Text>
                    <Text style={AgreementOverviewScreenStyle.maintenanceDetailTextStyle}>Category name</Text>
                </View>
            </CardViewWithLowMargin>
        );

    }


    fileRenderItem({ item, index }) {

        var path = API.AGREEMENT_PATH + item.path;
        console.log('image path==', path);
        return (
            <View style={AgreementOverviewScreenStyle.listContainerStyle}>

                <View style={AgreementOverviewScreenStyle.imageContainerStyle}>
                    <Image source={{ uri: path }} style={AgreementOverviewScreenStyle.userImageStyle} />
                </View>

                <View style={{ justifyContent: 'center'}}>
                    <View style={AgreementOverviewScreenStyle.detailTitleContainerStyle}>
                        <Text style={AgreementOverviewScreenStyle.detailTitleTextStyle}>{item.path}</Text>
                        {/*<Image source={ImagePath.BLUE_HEART} style={AgreementOverviewScreenStyle.listImageStyle} />*/}
                        {/*<Image source={ImagePath.DOTS_ICON} style={AgreementOverviewScreenStyle.listImageStyle} />*/}
                    </View>

                </View>

            </View>
        );
    }

    tenantsRenderItem({ item, index }) {

        var tenatImage = item.users_id?API.USER_IMAGE_PATH +item.users_id.image:'';

        return (
            <View style={AgreementOverviewScreenStyle.listContainerStyle}>

                <View style={AgreementOverviewScreenStyle.imageContainerStyle}>
                    <Image source={{ uri: tenatImage }} style={AgreementOverviewScreenStyle.watcherImageStyle} />
                </View>

                <View style={AgreementOverviewScreenStyle.detailTitleContainerStyle}>
                    <Text style={AgreementOverviewScreenStyle.watcherTitleTextStyle}>{ item.users_id.firstname+' '+item.users_id.lastname}</Text>

                    <Image source={ImagePath.DOTS_ICON} style={AgreementOverviewScreenStyle.listImageStyle} />
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

        var PropertyData={};
        var MaintenanceData=[];
        {
            this.state.agreementData.length>0
            ?
            PropertyData=this.state.agreementData[0].propertyData?this.state.agreementData[0].propertyData:{}
            :{}
        }

        {
            this.state.agreementData.length>0
            ?
            MaintenanceData=this.state.agreementData[1].maintenanceData?this.state.agreementData[1].maintenanceData:{}
            :{}
        }
        var propertyImagesArray=PropertyData.property_id?PropertyData.property_id.image:[];
        var propertyImagePath =(propertyImagesArray.length > 0 ? API.PROPERTY_IMAGE_PATH + propertyImagesArray[0].path : '') ;
        console.log('date==',JSON.stringify(PropertyData));
        return (
          
            <ScrollView contentContainerStyle={{paddingBottom:300}}>
                <View>
                    <CardViewWithLowMargin>
                        <Text style={AgreementOverviewScreenStyle.fileTitleTextStyle}>Highlights</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={AgreementOverviewScreenStyle.highlightViewContainer}>
                                <Text style={AgreementOverviewScreenStyle.aboutRequestDetailTextStyle}>Tenancy Start date</Text>
                                <Text style={AgreementOverviewScreenStyle.highlightValueTextStyle}>{Moment(PropertyData.tenancy_start_date).format(Strings.DATE_FORMATE)}</Text>
                            </View>

                            <View style={AgreementOverviewScreenStyle.highlightValueViewContainer}>
                                <Text style={AgreementOverviewScreenStyle.aboutRequestDetailTextStyle}>Tenancy length</Text>
                                <Text style={AgreementOverviewScreenStyle.highlightValueTextStyle}>-</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <View style={AgreementOverviewScreenStyle.highlightViewContainer}>
                                <Text style={AgreementOverviewScreenStyle.aboutRequestDetailTextStyle}>Rental Case validity</Text>
                                <Text style={AgreementOverviewScreenStyle.highlightValueTextStyle}>{Moment(PropertyData.case_validity).format(Strings.DATE_FORMATE)}</Text>
                            </View>

                            <View style={AgreementOverviewScreenStyle.highlightValueViewContainer}>
                                <Text style={AgreementOverviewScreenStyle.aboutRequestDetailTextStyle}>Payment frequency</Text>
                                <Text style={AgreementOverviewScreenStyle.highlightValueTextStyle}>{PropertyData.rental_period==0?'Monthly':'Yearly'}</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <View style={AgreementOverviewScreenStyle.highlightViewContainer}>
                                <Text style={AgreementOverviewScreenStyle.aboutRequestDetailTextStyle}>Contact for Lease Renewal</Text>
                                <Text style={AgreementOverviewScreenStyle.highlightValueRedTextStyle}>{PropertyData.terms==1?'Monthly':'Yearly'}</Text>
                            </View>

                            <View style={AgreementOverviewScreenStyle.highlightValueViewContainer}>
                                <Text style={AgreementOverviewScreenStyle.aboutRequestDetailTextStyle}>Rent per Month</Text>
                                <Text style={AgreementOverviewScreenStyle.highlightValueTextStyle}>${PropertyData.rental_period==0?PropertyData.rent_price:parseInt(PropertyData.rent_price)}</Text>
                            </View>
                        </View>

                    </CardViewWithLowMargin>
                </View>


                <View>
                    <CardViewWithLowMargin>
                        <Text style={AgreementOverviewScreenStyle.fileTitleTextStyle}>Agreement details</Text>
                        <Text numberOfLines={(this.state.isShowMore == false) ? 6 : null} style={AgreementOverviewScreenStyle.aboutRequestDetailTextStyle}>{PropertyData.detail!=''?PropertyData.detail:'No agreement details added'}</Text>

                        {
                            PropertyData.detail.length>0?
                            <TouchableOpacity onPress={this.showHideMore.bind(this)}>
                                <Text style={AgreementOverviewScreenStyle.loadMoreTextStyle}>
                                    {(this.state.isShowMore == false) ? 'Show more' : 'Show less'}
                                </Text>
                            </TouchableOpacity>:null
                        }

                    </CardViewWithLowMargin>
                </View>


                <View>
                    <CardViewWithLowMargin>
                        <Text style={AgreementOverviewScreenStyle.fileTitleTextStyle}>Maintenance requests</Text>
                        <View style={AgreementOverviewScreenStyle.tileListContainerStyle} >

                            <FlatList
                                horizontal={false}
                                data={MaintenanceData}
                                renderItem={this.maintenanceRequestRenderItem}
                                extraData={this.state}
                            />

                        </View>
                    </CardViewWithLowMargin>
                </View>

                <View>
                    <CardViewWithLowMargin>
                        <Text style={AgreementOverviewScreenStyle.fileTitleTextStyle}>Files Attached</Text>
                        <View style={AgreementOverviewScreenStyle.tileListContainerStyle} >
                            
                            {
                                PropertyData.images.length>0?
                                <FlatList
                                    horizontal={false}
                                    data={PropertyData.images}
                                    renderItem={this.fileRenderItem}
                                    extraData={this.state}
                                />:
                                 <Text  style={AgreementOverviewScreenStyle.aboutRequestDetailTextStyle}>No Files Attached</Text>
                            }

                        </View>
                    </CardViewWithLowMargin>
                </View>


                <View>
                    <CardViewWithLowMargin>
                        {
                            propertyImagePath!=''?
                            <Image source={{uri:propertyImagePath}} style={AgreementOverviewScreenStyle.agreementsImageViewStyle} />
                            : <View style={AgreementOverviewScreenStyle.topCoverImageContainer} />
                        }
                        <View style={AgreementOverviewScreenStyle.agreementsTitleViewStyle}>
                            <Text numberOfLines={2} style={AgreementOverviewScreenStyle.agreementsTitleTextStyle}>{PropertyData.property_id?PropertyData.property_id.description:''}</Text>
                        </View>
                        <View style={AgreementOverviewScreenStyle.agreementsSubTitleViewStyle}>
                            {/*<Text style={AgreementOverviewScreenStyle.agreementsSubTitleTextStyle}>Property ID : 10098273</Text>*/}

                            <Text style={AgreementOverviewScreenStyle.agreementsSubTitleTextStyle}>{PropertyData.property_id?PropertyData.property_id.address:''}</Text>
                        </View>
                    </CardViewWithLowMargin>
                </View>


                <View>
                    <CardViewWithLowMargin>
                        <Text style={AgreementOverviewScreenStyle.titleTextStyle}>People involved on this cases</Text>
                        <View style={AgreementOverviewScreenStyle.tileListContainerStyle} >
                            {
                                PropertyData.tenants.length>0 ?
                                    <FlatList
                                        horizontal={false}
                                        data={PropertyData.tenants}
                                        renderItem={this.tenantsRenderItem}
                                        extraData={this.state}
                                    /> : null
                            }
                        </View>
                    </CardViewWithLowMargin>
                </View>
            </ScrollView>
         

        );
    }
}

export default AgreementOverviewScreen;
