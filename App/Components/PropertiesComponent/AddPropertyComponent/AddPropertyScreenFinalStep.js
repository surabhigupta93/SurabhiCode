import React, { Component } from 'react';

import {
    Image,
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    AsyncStorage
} from 'react-native';

import * as Progress from 'react-native-progress';
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import AddPropertyScreenStyle from './AddPropertyScreenStyle';

class AddPropertyScreenFinalStep extends Component {

    constructor() {
        super();
        this.state = {

        };
    }

    componentWillMount() {

    }
    closeAddProperty() {
        Actions.popTo('Dashboard');
    }
    onAddPropertyClick() {
        Actions.popTo('AddPropertyScreenStepOne');
    }

   navBar() {
        return (
            <View >
                <Image source={null} style={CommonStyles.navBarMainView} />
                <TouchableOpacity onPress={() => this.closeAddProperty()} style={CommonStyles.navRightImageView}>
                    <View>
                        <Image source={ImagePath.DRAWER_CROSS_ICON} />
                    </View>
                </TouchableOpacity>

            </View>
        );
    }

    render() {
        return (
            <View style={CommonStyles.mainContainer}>
                <Image source={ImagePath.SPLASH_IMAGE} style={CommonStyles.mainContainer} />
                {this.navBar()}
                <View style={AddPropertyScreenStyle.successViewContainer}>
                    <View style={AddPropertyScreenStyle.successRoundViewStyle}>
                        <Image source={ImagePath.CHECK_BIG} />
                    </View>
                    <Text style={AddPropertyScreenStyle.successTitleTextStyle}>
                        {Strings.YOUR_PROPERTY_ADDED}
                    </Text>
                 
                    <TouchableOpacity onPress={() => this.onAddPropertyClick()}>
                        <View style={AddPropertyScreenStyle.roundedBlueAddNewPropertyButtonStyle}>
                            <Text style={AddPropertyScreenStyle.proceedButtonTextStyle}>
                                {Strings.NAV_ADD_NEW_PROPERTY_TITLE}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.closeAddProperty()} >

                        <Text style={AddPropertyScreenStyle.successListingDetailTextStyle}>
                            {Strings.LISTING_DETAILS}
                        </Text>
                        <View style={AddPropertyScreenStyle.lineViewStyle} />
                    </TouchableOpacity>

                </View>
            </View>
        );
    }

}

export default AddPropertyScreenFinalStep;
