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
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import DisputesScreenStyle from './DisputesScreenStyle';
import listData from '../../../data';
import { Dropdown } from 'react-native-material-dropdown';
import FilterScreen from '../FilterComponent/FilterScreen';
let ref;
class DisputesScreen extends Component {
    constructor() {
        super();
        ref = this;
        this.state = {
            isFilter: false,
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }
    callSaveAsDraft() {

    }

    navBar() {
        return (
            <View >
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.DISPUTES}</Text>
                <TouchableOpacity onPress={() => this.callAddDisputesScreen()}>
                    <Image source={ImagePath.PLUS_ICON} style={CommonStyles.navPlusImageView} />
                </TouchableOpacity>
            </View>
        );
    }

    onFilterClick() {

        if (this.state.isFilter) {

            this.setState({ isFilter: false });
        }
        else {

            this.setState({ isFilter: true });
        }
    }

    renderImageItem(item, index) {
        return (
            <Image source={{ uri: item.url }} style={DisputesScreenStyle.userListImageStyle} />
        );
    }
    callAddDisputesScreen() {
        Actions.AddDisputesScreen();
    }

    onListItemClick(id) {

        Actions.DisputesDetailsScreen({ reqId: id });
    }

    renderItem({ item, index }) {

        return (
            <View style={DisputesScreenStyle.listMainContainerStyle}>
                <TouchableOpacity onPress={ref.onListItemClick.bind(ref, item._id)}>
                    <View style={DisputesScreenStyle.disputesImageViewStyle}>
                        <Image source={{ uri: item.url }} style={DisputesScreenStyle.disputesImageViewStyle} />
                        <View style={DisputesScreenStyle.dateContainerStyle}>
                            <Image source={ImagePath.DATE_ICON} style={DisputesScreenStyle.dateImageStyle} />
                            <Text style={DisputesScreenStyle.dateTextStyle}>
                                Oct 29, 2017
                        </Text>
                        </View>
                    </View>
                    <View style={DisputesScreenStyle.disputesTitleViewStyle}>
                        <Text style={DisputesScreenStyle.disputesTitleTextStyle}>{item.category}</Text>
                    </View>
                    <View style={DisputesScreenStyle.disputesSubTitleViewStyle}>
                        <Text style={DisputesScreenStyle.disputesSubTitleTextStyle}>{item.category}</Text>
                    </View>

                    <View style={DisputesScreenStyle.imageListMainContainerStyle}>
                        <View>
                            <Image source={ImagePath.USER_DEFAULT} style={DisputesScreenStyle.userImageStyle} />
                        </View>

                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={DisputesScreenStyle.imageListContainerStyle}>
                                {
                                    listData.map((data, index) => {
                                        return ref.renderImageItem(data, index);
                                    })
                                }
                            </View>
                        </ScrollView>

                    </View>

                    <View style={DisputesScreenStyle.disputesInfoContainerViewStyle}>

                        <View style={DisputesScreenStyle.propertyBedroomViewContainer}>
                            <Image source={ImagePath.DOLLAR_ICON} />
                            <Text style={DisputesScreenStyle.propertyValueTextStyle}>4500</Text>
                        </View>
                        <View style={DisputesScreenStyle.propertyWashrooViewContainer}>
                            <Image source={ImagePath.CALENDAR_ICON} />
                            <Text style={DisputesScreenStyle.propertyValueTextStyle}>Jul 29, 2017</Text>
                        </View>
                        <View style={DisputesScreenStyle.propertyWashrooViewContainer}>
                            <Image source={ImagePath.DRAWER_SEARCH_NAV} />
                            <Text style={DisputesScreenStyle.propertyValueTextStyle}>4 times</Text>
                        </View>

                    </View>
                    <Image source={ImagePath.HEART} style={DisputesScreenStyle.likeImageViewStyle} />
                </TouchableOpacity>
            </View >
        );
    }


    render() {
        let data = [{
            value: 'By best match',
        }];

        return (
            <View style={CommonStyles.listMainContainerStyle}>
                {this.navBar()}
                <TouchableOpacity onPress={() => this.onFilterClick()} >
                    <View style={DisputesScreenStyle.refineResultContainerStyle}>
                        <View>
                            <Text style={DisputesScreenStyle.refineResultTextStyle}>{Strings.REFINE_RESULTS}</Text>
                            <View style={DisputesScreenStyle.refineResultBottomBarStyle} />
                        </View>
                        {this.state.isFilter ? <Image source={ImagePath.ARROW_DOWN} style={DisputesScreenStyle.refineResultArrowUpStyle} />
                            : <Image source={ImagePath.ARROW_DOWN} style={DisputesScreenStyle.refineResultArrowStyle} />
                        }

                    </View>
                </TouchableOpacity>
                {/* <View style={DisputesScreenStyle.tabContainerStyle}>

                    <Dropdown
                        label=''
                        labelHeight={5}
                        fontSize={14}
                        baseColor={Colors.DROP_DOWN_BACKGROUND_COLOR}
                        containerStyle={DisputesScreenStyle.dropDownViewStyle}
                        data={data}
                        value={data[0].value}
                    />
                </View> */}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={CommonStyles.flatListStyle}>
                    {this.state.isFilter ?
                        <FilterScreen /> : null
                    }

                    <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                        data={listData}
                        renderItem={this.renderItem}
                    />
                </ScrollView>

            </View>
        );
    }
}

export default DisputesScreen;
