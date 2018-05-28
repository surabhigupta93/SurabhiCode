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
    AsyncStorage,
    FlatList
} from 'react-native';

import {
    savePropertyAsDraft,
    addProperty,
    editProperty,
    getAmenitiesList,

} from "../../../Action/ActionCreators";

import {

    showLoading,
    resetState,
    clearAmenitiesRes

} from "./EditPropertyAction";

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import EditPropertyScreenStyle from './EditPropertyScreenStyle';
import CheckBox from 'react-native-checkbox';
import * as Progress from 'react-native-progress';
let contextRef;
var amenitiesSelectedArrray = [];

var uploadedImageArray = [];
var propertyId='';

class EditPropertyScreenStepThree extends Component {
    constructor() {
        super();
        this.state = {
            amenitiesListData: {}
        };
        contextRef = this;
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onGetAmenitiesSuccess();
        this.onAddPropertySuccess();
        this.onSavePropertySuccess();
    }

    componentWillUnmount() {
        amenitiesSelectedArrray = [];
        uploadedImageArray = [];
        this.setState({amenitiesListData:{}});
    }
    componentWillMount() {
        this.callGetAmenities();
        uploadedImageArray = this.props.uploadedImages;
        propertyId = this.props.propertId;
    }

    closeAddProperty() {
        Actions.popTo('Dashboard');
    }

    callBack() {
        Actions.pop();
    }

    callProceedToFinalStep() {
        this.callAddPropertyApi();
        //Actions.AddPropertyScreenFinalStep();
    }
    onAddPropertySuccess() {
        console.log("Edit property success"+this.props.editPropertyReducer.addPropertyResponse);
        if (this.props.editPropertyReducer.addPropertyResponse != '') {

            if (this.props.editPropertyReducer.addPropertyResponse.code == 200) {
                    
                    Actions.AddPropertyScreenFinalStep();
                    this.props.resetState();
                
            }
            else {
                alert(this.props.editPropertyReducer.addPropertyResponse.message);
                this.props.resetState();
            }
        }
    }
    onSavePropertySuccess() {
         console.log("Edit save draft success"+this.props.editPropertyReducer.addPropertyResponse);
        if (this.props.editPropertyReducer.savePropertyResponse != '') {
            if (this.props.editPropertyReducer.savePropertyResponse.code == 200) {
                Actions.popTo('Dashboard');
            }
            else {
                alert(this.props.editPropertyReducer.savePropertyResponse.message);
            }
            this.props.resetState();
        }
    }

    onGetAmenitiesSuccess() {
        if (this.props.editPropertyReducer.amenitiesListResponse != '') {
            if (this.props.editPropertyReducer.amenitiesListResponse.code == 200) {
                console.log('surabhi'+JSON.stringify(this.props.editPropertyReducer.amenitiesListResponse.data));
                this.setState({ amenitiesListData: this.prePareAmenitiesData(this.props.editPropertyReducer.amenitiesListResponse.data) });
               
            }
            else {
                alert(this.props.editPropertyReducer.amenitiesListResponse.message);
                
            }
            this.props.clearAmenitiesRes();
        }
    }
    callGetAmenities() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                this.props.showLoading();
                this.props.getAmenitiesList(authToken);
            }
        }).done();
    }

    callAddPropertyApi() {

        this.state.amenitiesListData.map((data, index) => {
        console.log(" Edit Saveapi amenities data"+ JSON.stringify(this.state.amenitiesListData));
            // if (this.state.amenitiesListData[index].isChecked) {

            // }

            var selectedAmenities = {
                amenity_id:this.state.amenitiesListData[index]._id,
                amenity_name:this.state.amenitiesListData[index].name,
                is_checked:this.state.amenitiesListData[index].isChecked
            }
            amenitiesSelectedArrray.push(selectedAmenities);

        })

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
               
                addPropertyData = {
                    _id:propertyId,
                    property_name: this.props.editPropertyReducer.propertyName,
                    country: this.props.editPropertyReducer.propertyCountry,
                    property_type: this.props.editPropertyReducer.propertyType,
                    property_category:this.props.editPropertyReducer.propertyCategory.toLowerCase(),
                    created_by: userData.data._id,
                    created_by_agency_id:userData.data.agency_id,
                    owned_by: this.props.editPropertyReducer.propertyOwnerId,
                    address: this.props.editPropertyReducer.propertyAddress,
                    description: this.props.editPropertyReducer.propertyDes,
                    number_of_bathroom: parseInt(this.props.editPropertyReducer.propertyBathroomNo),
                    number_of_parking: parseInt(this.props.editPropertyReducer.propertyCarNo),
                    floor_area: parseInt(this.props.editPropertyReducer.propertyFloorArea),
                    lot_erea: parseInt(this.props.editPropertyReducer.propertyLotArea),
                    other_amenity: '',
                    number_bedroom: parseInt(this.props.editPropertyReducer.propertyBedroomNo),
                    amenities: amenitiesSelectedArrray,
                    image: uploadedImageArray
                };
                this.props.showLoading();
                console.log('edit proeprty postdata ==', JSON.stringify(addPropertyData));
                this.props.editProperty(authToken, addPropertyData);
            }
        }).done();

    }


    callSavePropertyApi() {

        //propertyName:'',
        //propertyCountry:'',
        //propertyOwner:'',
        console.log("Edit Saveapi amenities data"+ JSON.stringify(this.state.amenitiesListData));
        this.state.amenitiesListData.map((data, index) => {


            // if (this.state.amenitiesListData[index].isChecked) {
              
            // }

            var selectedAmenities = {
                amenity_id:this.state.amenitiesListData[index]._id,
                amenity_name:this.state.amenitiesListData[index].name,
                is_checked:this.state.amenitiesListData[index].isChecked
            }
            amenitiesSelectedArrray.push(selectedAmenities);

        })

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                console.log('user data ==', value);
                addPropertyData = {

                    property_name: this.props.editPropertyReducer.propertyName,
                    country: this.props.editPropertyReducer.propertyCountry,
                    property_type: this.props.editPropertyReducer.propertyType,
                    created_by: userData.data._id,
                    owned_by: this.props.editPropertyReducer.propertyOwnerId,
                    address: this.props.editPropertyReducer.propertyAddress,
                    description: this.props.editPropertyReducer.propertyDes,
                    number_of_bathroom: parseInt(this.props.editPropertyReducer.propertyBathroomNo),
                    number_of_parking: parseInt(this.props.editPropertyReducer.propertyCarNo),
                    floor_area: parseInt(this.props.editPropertyReducer.propertyFloorArea),
                    lot_erea: parseInt(this.props.editPropertyReducer.propertyLotArea),
                    other_amenity: '',
                    number_bedroom: parseInt(this.props.editPropertyReducer.propertyBedroomNo),
                    amenities: amenitiesSelectedArrray,
                    image: uploadedImageArray
                };
                this.props.showLoading();
                this.props.savePropertyAsDraft(authToken, addPropertyData);
            }
        }).done();
    }

    callAddOwnerScreen() {
        Actions.AddOwnerScreen();
    }

    navBar() {
        return (
            <View >
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.NAV_UPDATE_PROPERTY_TITLE}</Text>
                <TouchableOpacity onPress={() => this.callBack()} style={CommonStyles.navBackRightImageView}>
                    <View>
                        <Image source={ImagePath.HEADER_BACK} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.closeAddProperty()} style={CommonStyles.navRightImageView} >
                    <View>
                        <Image source={ImagePath.DRAWER_CROSS_ICON} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    prePareAmenitiesData(amenitiesData) {
    console.log("prePareAmenitiesData>>>>>>1111"+ JSON.stringify(amenitiesData));
    console.log("prePareAmenitiesData>>>>>>"+ JSON.stringify(this.props.propertyData.data[0].amenities));
    var selectedamenities =[];
    var selectedamenitiesId = [];
    var tempArray = amenitiesData;
    selectedamenities = this.props.propertyData.data[0].amenities;
        

        selectedamenities.map((data, index) => {
            if(selectedamenities[index].is_checked){
                selectedamenitiesId.push(selectedamenities[index].amenity_id);
            }
           

        })

        console.log("Selected amenities id"+JSON.stringify(selectedamenitiesId));
        console.log("tempArray"+JSON.stringify(tempArray));

        if(tempArray.length>0){
            tempArray.map((data, index) => {
            
                if(selectedamenitiesId!=null&&selectedamenitiesId!=undefined){

                    if(selectedamenitiesId.includes(tempArray[index]._id)){

                        tempArray[index].isChecked = true;
                    }
                    else{

                        tempArray[index].isChecked = false;
                    }
                }
                else{

                     tempArray[index].isChecked = false;
                }
               
               
               
            })
            console.log('userroles list= '+JSON.stringify(tempArray));
        }


        return tempArray;

    }

    updateCheckBoxSelection(selectedIndex, amenitiesData) {

        var tempArray = amenitiesData;
        tempArray.map((data, index) => {


            if (tempArray[selectedIndex].isChecked) {

                tempArray[selectedIndex].isChecked = false;
            }
            else {
                
                tempArray[selectedIndex].isChecked = true;

            }

        })

        return tempArray;

    }

    renderItem({ item, index }) {
        console.log("Checked status>>>>>"+item.isChecked);

        return (
            <View style={EditPropertyScreenStyle.amenitiesListItemContainerStyle}>
                <CheckBox
                    label={item.name}
                    labelStyle={EditPropertyScreenStyle.amenitisListCheckboxLabelStyle}
                    checked={item.isChecked?item.isChecked:false}
                    checkedImage={ImagePath.CHECK_BOX_ACTIVE }
                    uncheckedImage={ImagePath.UNCHECK}
                    onChange={contextRef.onCheckBoxChangeListener.bind(contextRef, index)}
                />
            </View>
        );
    }

    onCheckBoxChangeListener(index) {
        console.log('selected index== ', index);
        var tempData = this.updateCheckBoxSelection(index, this.state.amenitiesListData);
        this.setState({ amenitiesListData: tempData });
    }

    callSaveAsDraft() {
        
        this.callSavePropertyApi();
    }


    render() {
        
        console.log("amenities data for property>>>"+this.state.amenitiesListData);
        return (
            <View style={{ flex: 1 }}>
                {this.navBar()}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={EditPropertyScreenStyle.scrollViewContainerStyle}>
                    <View style={EditPropertyScreenStyle.headerContainer}>
                        <View style={EditPropertyScreenStyle.dotContainer}>
                            <View style={EditPropertyScreenStyle.blueDotStyle} />
                            <View style={EditPropertyScreenStyle.blueDotStyle} />
                            <View style={EditPropertyScreenStyle.blueDotStyle} />
                            <View style={EditPropertyScreenStyle.greyDotStyle} />
                        </View>
                     
                    </View>

                    <View style={EditPropertyScreenStyle.addPropertyInputContainer}>
                        <Text style={EditPropertyScreenStyle.checkAllAmenitiesTextStyle}>{Strings.CHECK_ALL_AMENITIES}</Text>
                        <View style={EditPropertyScreenStyle.amenitiesListViewStyle}>
                            <FlatList
                                data={this.state.amenitiesListData}
                                extraData={this.state}
                                renderItem={this.renderItem}
                            />
                        </View>
                    </View>

                    <View style={EditPropertyScreenStyle.addPropertyInputContainer}>

                        <Text style={EditPropertyScreenStyle.labelStyle}>
                            {Strings.PROPERTY_DESCRIPTION}
                        </Text>
                        <TextInput style={EditPropertyScreenStyle.inputDescriptionTextStyle}
                            multiline={true} />

                    </View>

                </ScrollView>
                <View style={EditPropertyScreenStyle.buttonContainerStyle}>
                   { /*<TouchableOpacity onPress={() => this.callSaveAsDraft()}>
                                           <View style={EditPropertyScreenStyle.roundedTransparentDraftButtonStyle}>
                                               <Text style={EditPropertyScreenStyle.draftButtonTextStyle}>
                                                   {Strings.SAVE_AS_DRAFT}
                                               </Text>
                                           </View>
                                       </TouchableOpacity>*/}
                    <TouchableOpacity onPress={() => this.callProceedToFinalStep()}>
                        <View style={EditPropertyScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={EditPropertyScreenStyle.proceedButtonTextStyle}>
                                {Strings.PUBLISH}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {
                    //23 Nov
                    this.props.editPropertyReducer.isScreenLoading ?
                        <View style={CommonStyles.circles}>
                            <Progress.CircleSnail color={[Colors.PROGRESS1, Colors.PROGRESS2, Colors.PROGRESS3]} />
                        </View>
                        : null
                    //
                }
            </View>
        );
    }
}

function mapStateToProps(state) {
    console.log('editPropertyReducer mapStateToProps= ', JSON.stringify(state));
    return {
        editPropertyReducer: state.editPropertyReducer
    }
}

export default connect(
    mapStateToProps,
    {
        savePropertyAsDraft,
        addProperty,
        editProperty,
        getAmenitiesList,
        showLoading,
        resetState,
        clearAmenitiesRes
    }

)(EditPropertyScreenStepThree);

