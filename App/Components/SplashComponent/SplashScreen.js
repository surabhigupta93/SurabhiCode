import React, { Component } from 'react';

import {
    Image,
    AsyncStorage
} from 'react-native';

import * as Progress from 'react-native-progress';
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';

class SplashScreen extends Component {

    constructor() {
        super();
        this.state = {
            accessToken: '',
        };
    }

    componentWillMount() {

        setTimeout(() => {
            AsyncStorage.getItem("SyncittUserInfo").then((data) => {
                if (data) {
                    var userData = JSON.parse(data);
                    if (userData.token) {
                        AsyncStorage.getItem("KeepSignedIn").then((value) => {
                            console.log('keepSignedIn data',value);
                            if (value) {
                                var keepLoginData = JSON.parse(value);
                                if (keepLoginData) {
                                    Actions.Dashboard({ type: "reset" });
                                } else {
                                    Actions.WelcomeScreen({ type: "reset" });
                                }
                            }else{
                                Actions.WelcomeScreen({ type: "reset" });
                            }
                        }).done();
                    } else {
                        Actions.WelcomeScreen({ type: "reset" });
                    }
                } else {
                    Actions.WelcomeScreen({ type: "reset" });
                }
            }).done();
        }, 2000);
    }

    render() {
        return (
            <Image source={ImagePath.INTRO_BG} style={CommonStyles.mainContainer}>
            </Image>
        );
    }

}

export default SplashScreen;
