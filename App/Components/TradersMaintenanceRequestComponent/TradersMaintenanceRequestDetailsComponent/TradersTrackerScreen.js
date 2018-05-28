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
import TradersTrackerScreenStyle from './TradersTrackerScreenStyle';
import listData from '../../../../data';
import CommonStyles from '../../../CommonStyle/CommonStyle';
let contextRef;

class TradersTrackerScreen extends Component {
    constructor() {
        super();
        this.state = {
            trackerData: {},
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
        this.setState({ trackerData: this.props.reqDetailData });
        //console.log('req_status'+JSON.stringify(this.props.reqDetailData.req_status))
    }


    render() {

        return (

            <ScrollView contentContainerStyle={TradersTrackerScreenStyle.scrollviewContainerStyle}>
                <View style={TradersTrackerScreenStyle.mainContainerStyle}>
                    <View style={TradersTrackerScreenStyle.leftmainViewContainer}>
                        <View style={TradersTrackerScreenStyle.leftViewContainerStyle}>
                            <View style={TradersTrackerScreenStyle.lineViewStyle} />

                            {this.state.trackerData.req_status == 5 ?
                                <View style={{ position: 'absolute', marginTop: 25, justifyContent: 'center', alignItems: 'center', paddingRight: 40 }} >
                                    <Image source={ImagePath.TRACKER_BG} style={{ position: 'absolute', marginTop: 25, padding: 10 }} />
                                    <Image source={ImagePath.TRACKER_CONFIRMED_WHITE} style={{ marginLeft: 40 }} />
                                </View>
                                :
                                <View style={{ position: 'absolute', marginTop: 25, justifyContent: 'center', alignItems: 'center', paddingRight: 40 }} >
                                    <Image source={ImagePath.TRACKER_BG_WHITE} style={{ position: 'absolute', marginTop: 25, padding: 10 }} />
                                    <Image source={ImagePath.TRACKER_CONFIRMED} style={{ marginLeft: 40 }} />
                                </View>

                            }

                            {this.state.trackerData.req_status == 4 ?
                                <View style={{ position: 'absolute', marginTop: 125, justifyContent: 'center', alignItems: 'center', paddingRight: 40 }} >
                                    <Image source={ImagePath.TRACKER_BG} style={{ position: 'absolute', marginTop: 125, padding: 10 }} />
                                    <Image source={ImagePath.TRACKER_COMPLETED_WHITE} style={{ marginLeft: 40 }} />
                                </View>
                                :


                                <View style={{ position: 'absolute', marginTop: 125, justifyContent: 'center', alignItems: 'center', paddingRight: 40 }} >
                                    <Image source={ImagePath.TRACKER_BG_WHITE} style={{ position: 'absolute', marginTop: 125, padding: 10 }} />
                                    <Image source={ImagePath.TRACKER_COMPLETED} style={{ marginLeft: 40 }} />
                                </View>
                            }
                            {this.state.trackerData.req_status == 3 ?

                                <View style={{ position: 'absolute', marginTop: 230, justifyContent: 'center', alignItems: 'center', paddingRight: 40 }} >
                                    <Image source={ImagePath.TRACKER_BG} style={{ position: 'absolute', marginTop: 230, padding: 10 }} />
                                    <Image source={ImagePath.TRACKER_BOOKED_WHITE} style={{ marginLeft: 40 }} />
                                </View>
                                :
                                <View style={{ position: 'absolute', marginTop: 230, justifyContent: 'center', alignItems: 'center', paddingRight: 40 }} >
                                    <Image source={ImagePath.TRACKER_BG_WHITE} style={{ position: 'absolute', marginTop: 230, padding: 10 }} />
                                    <Image source={ImagePath.TRACKER_BOOKED} style={{ marginLeft: 40 }} />
                                </View>
                            }

                            {this.state.trackerData.req_status == 2 ?
                                <View style={{ position: 'absolute', marginTop: 335, justifyContent: 'center', alignItems: 'center', paddingRight: 40 }} >
                                    <Image source={ImagePath.TRACKER_BG} style={{ position: 'absolute', marginTop: 335, padding: 10 }} />
                                    <Image source={ImagePath.TAG_ACCEPTED_WHITE} style={{ marginLeft: 40 }} />
                                </View>
                                :


                                <View style={{ position: 'absolute', marginTop: 335, justifyContent: 'center', alignItems: 'center', paddingRight: 40 }} >
                                    <Image source={ImagePath.TRACKER_BG_WHITE} style={{ position: 'absolute', marginTop: 440, padding: 10 }} />
                                    <Image source={ImagePath.TAG_ACCEPTED} style={{ marginLeft: 40 }} />
                                </View>
                            }
                            {this.state.trackerData.req_status == 1 ?
                                <View style={{ position: 'absolute', marginTop: 440, justifyContent: 'center', alignItems: 'center', paddingRight: 40 }} >
                                    <Image source={ImagePath.TRACKER_BG} style={{ position: 'absolute', marginTop: 440, padding: 10 }} />
                                    <Image source={ImagePath.PAPER_PLANE_SENT_WHITE} style={{ marginLeft: 40 }} />
                                </View>

                                :

                                <View style={{ position: 'absolute', marginTop: 440, justifyContent: 'center', alignItems: 'center', paddingRight: 40 }} >
                                    <Image source={ImagePath.TRACKER_BG_WHITE} style={{ position: 'absolute', marginTop: 440, padding: 10 }} />
                                    <Image source={ImagePath.PAPER_PLANE_SENT} style={{ marginLeft: 40 }} />
                                </View>
                            }
                        </View>
                    </View>

                    <View style={{ width: 300, alignItems: 'flex-start' }}>
                        {this.state.trackerData.req_status == 5 ? <View style={{ position: 'absolute', left: 25, marginTop: 30, justifyContent: 'center', }} >
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.SKY_BLUE_BUTTON_BACKGROUND }}>Confirmed</Text>

                        </View>
                            : <View style={{ position: 'absolute', left: 25, marginTop: 30, justifyContent: 'center', }} >
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Confirmed</Text>

                            </View>
                        }

                        {this.state.trackerData.req_status == 4 ?
                            <View style={{ position: 'absolute', left: 25, marginTop: 130, justifyContent: 'center', }} >
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.SKY_BLUE_BUTTON_BACKGROUND }}>Completed</Text>

                            </View>
                            : <View style={{ position: 'absolute', left: 25, marginTop: 130, justifyContent: 'center', }} >
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Completed</Text>

                            </View>
                        }
                        {this.state.trackerData.req_status == 3 ? <View style={{ position: 'absolute', left: 25, marginTop: 230, justifyContent: 'center', }} >
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.SKY_BLUE_BUTTON_BACKGROUND }}>Booked</Text>

                        </View>
                            : <View style={{ position: 'absolute', left: 25, marginTop: 230, justifyContent: 'center', }} >
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Booked</Text>

                            </View>
                        }

                        {this.state.trackerData.req_status == 2 ? <View style={{ position: 'absolute', left: 25, marginTop: 335, justifyContent: 'center', }} >
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.SKY_BLUE_BUTTON_BACKGROUND }}>Accepted</Text>

                        </View>
                            : <View style={{ position: 'absolute', left: 25, marginTop: 335, justifyContent: 'center', }} >
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Accepted</Text>

                            </View>
                        }
                        {this.state.trackerData.req_status == 1 ?

                            <View style={{ position: 'absolute', left: 25, marginTop: 440, justifyContent: 'center', }} >
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.SKY_BLUE_BUTTON_BACKGROUND }}>Sent</Text>

                            </View>
                            : <View style={{ position: 'absolute', left: 25, marginTop: 440, justifyContent: 'center', }} >
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Sent</Text>

                            </View>
                        }

                    </View>
                </View>
            </ScrollView>

        );
    }
}

export default TradersTrackerScreen;
