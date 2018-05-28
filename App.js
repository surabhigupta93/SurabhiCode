/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,


} from 'react-native';
import SplashScreen from 'react-native-splash-screen'

import { Actions, Router, Reducer, Scene } from 'react-native-router-flux';
import SplashScreen from './App/Components/SplashComponent/SplashScreen';
import WelcomeScreen from './App/Components/WelcomeComponent/WelcomeScreen';
import ProceedToDashboardScreen from './App/Components/ProceedToDashboardComponent/ProceedToDashboardScreen';
import ResetPasswordScreen from './App/Components/ForgotPasswordComponent/ResetPasswordScreen';
import ResendPasswordScreen from './App/Components/ForgotPasswordComponent/ResendPasswordScreen';
import RegistrationScreen from './App/Components/SignInAndSignUpComponent/RegistrationScreen';
import Dashboard from './App/Components/DashboardComponent/DashboardScreen';
import AddPropertyScreenStepOne from './App/Components/PropertiesComponent/AddPropertyComponent/AddPropertyScreenStepOne';
import AddPropertyScreenStepTwo from './App/Components/PropertiesComponent/AddPropertyComponent/AddPropertyScreenStepTwo';
import AddPropertyScreenStepThree from './App/Components/PropertiesComponent/AddPropertyComponent/AddPropertyScreenStepThree';
import AddPropertyScreenFinalStep from './App/Components/PropertiesComponent/AddPropertyComponent/AddPropertyScreenFinalStep';
import NotificationsScreen from './App/Components/NotificationsComponent/NotificationsScreen';
import SwitchProfileScreen from './App/Components/SwitchProfileComponent/SwitchProfileScreen';
import SearchScreen from './App/Components/SearchComponent/SearchScreen';
import SettingsScreen from './App/Components/SettingComponent/SettingsScreen';
import AddNewTenantScreen from './App/Components/TenantsComponent/AddNewTenantComponent/AddNewTenantScreen';
import TenantsProfile from './App/Components/TenantsComponent/TenantsProfileComponent/TenantsProfile';
import MessageToTraderScreen from './App/Components/TradersComponent/MessageToTraderComponent/MessageToTraderScreen';
import AgentRemovalScreen from './App/Components/AgentsComponent/AgentRemovalComponent/AgentRemovalScreen';
import PropertiesDetailsScreen from './App/Components/PropertiesComponent/PropertiesDetailsComponent/PropertiesDetailsScreen';
import AddOwnerScreen from './App/Components/PropertiesComponent/AddOwnerComponent/AddOwnerScreen';
import TradersProfileScreen from './App/Components/TradersComponent/TradersProfileComponent/TradersProfileScreen';
import NewNoticeBoardScreen from './App/Components/NoticeBoardComponent/NewNoticeBoardComponent/NewNoticeBoardScreen';
import AddPostScreen from './App/Components/MaintenanceRequestComponent/AddPostComponent/AddPostScreen';
import EditPropertyScreenStepOne from './App/Components/PropertiesComponent/EditPropertyComponent/EditPropertyScreenStepOne';
import EditPropertyScreenStepTwo from './App/Components/PropertiesComponent/EditPropertyComponent/EditPropertyScreenStepTwo';
import EditPropertyScreenStepThree from './App/Components/PropertiesComponent/EditPropertyComponent/EditPropertyScreenStepThree';
import EditPropertyScreenFinalStep from './App/Components/PropertiesComponent/EditPropertyComponent/EditPropertyScreenFinalStep';
import NewMaintenanceRequestScreen from './App/Components/MaintenanceRequestComponent/NewMaintenanceRequest/NewMaintenanceRequestScreen';
import AddDisputesScreen from './App/Components/DisputesComponent/AddDisputesComponents/AddDisputesScreen';
import ForwardMaintenanceRequestScreen from './App/Components/MaintenanceRequestComponent/ForwardMaintenanceRequest/ForwardMaintenanceRequestScreen';
import MaintenanceRequestDetailsScreen from './App/Components/MaintenanceRequestComponent/MaintenanceRequestDetailsComponent/MaintenanceRequestDetailsScreen';
import DisputesDetailsScreen from './App/Components/DisputesComponent/DisputesDetailsComponent/DisputesDetailsScreen';
import AddAgreementScreen from './App/Components/AgreementsComponent/AddAgreementComponent/AddAgreementScreen';
import EditAgreementScreen from './App/Components/AgreementsComponent/EditAgreementComponent/EditAgreementScreen';
import AgreementDetailsScreen from './App/Components/AgreementsComponent/AgreementDetailComponent/AgreementDetailsScreen';
import TradersMaintenanceRequestDetailsScreen from './App/Components/TradersMaintenanceRequestComponent/TradersMaintenanceRequestDetailsComponent/TradersMaintenanceRequestDetailsScreen';
import NoticeBoardDetailScreen from './App/Components/NoticeBoardComponent/NoticeBoardDetailComponent/NoticeBoardDetailScreen';
import Chat from './App/Components/ChatComponent/ChatScreen';
import WriteReviewScreen from './App/Components/WriteReviewComponent/WriteReviewScreen';

import AgentProfileScreen from './App/Components/AgentsComponent/AgentProfileComponent/AgentProfileScreen';

import GeneralCommunicationScreen from './App/Components/AgreementsComponent/AgreementDetailComponent/GeneralCommunicationComponent/GeneralCommunicationScreen';
import AddAgentScreen from './App/Components/AgentsComponent/AddAgentComponent/AddAgentScreen';
// define router scenes
const scenes = Actions.create(
  <Scene key="root">

    <Scene key="SplashScreen" component={SplashScreen}
      hideNavBar={true}
      initial
    />

    <Scene key="WelcomeScreen" component={WelcomeScreen}
      hideNavBar={true} />

    <Scene key="ProceedToDashboardScreen" component={ProceedToDashboardScreen}
      hideNavBar={true} />

    <Scene key="ResetPasswordScreen" component={ResetPasswordScreen}
      hideNavBar={true} />

    <Scene key="ResendPasswordScreen" component={ResendPasswordScreen}
      hideNavBar={true} />

    <Scene key="RegistrationScreen" component={RegistrationScreen}
      hideNavBar={true} />

    <Scene key="Dashboard" component={Dashboard} title="Syncitt"
      hideNavBar={true}
    />

    <Scene key="AddPropertyScreenStepOne" component={AddPropertyScreenStepOne}
      hideNavBar={true}
    />
    <Scene key="AddPropertyScreenStepTwo" component={AddPropertyScreenStepTwo}
      hideNavBar={true}
    />
    <Scene key="AddPropertyScreenStepThree" component={AddPropertyScreenStepThree}
      hideNavBar={true}
    />
    <Scene key="AddPropertyScreenFinalStep" component={AddPropertyScreenFinalStep}
      hideNavBar={true}
    />

    <Scene key="SwitchProfileScreen" component={SwitchProfileScreen}
      hideNavBar={true}
    />
    <Scene key="NotificationsScreen" component={NotificationsScreen}
      hideNavBar={true}
    />
    <Scene key="SearchScreen" component={SearchScreen}
      hideNavBar={true}
    />
    <Scene key="SettingsScreen" component={SettingsScreen}
      hideNavBar={true}
    />
    <Scene key="AddNewTenantScreen" component={AddNewTenantScreen}
      hideNavBar={true}
    />
    <Scene key="MessageToTraderScreen" component={MessageToTraderScreen}
      hideNavBar={true}
    />
    <Scene key="TenantsProfile" component={TenantsProfile}
      hideNavBar={true}
    />

    <Scene key="AgentRemovalScreen" component={AgentRemovalScreen}
      hideNavBar={true}
    />
    <Scene key="PropertiesDetailsScreen" component={PropertiesDetailsScreen}
      hideNavBar={true}
    />
    <Scene key="AddOwnerScreen" component={AddOwnerScreen}
      hideNavBar={true}
    />
    <Scene key="TradersProfileScreen" component={TradersProfileScreen}
      hideNavBar={true}
    />
    <Scene key="NewNoticeBoardScreen" component={NewNoticeBoardScreen}
      hideNavBar={true}
    />
    <Scene key="AddPostScreen" component={AddPostScreen}
      hideNavBar={true}
    />

    <Scene key="EditPropertyScreenStepOne" component={EditPropertyScreenStepOne}
      hideNavBar={true}
    />
    <Scene key="EditPropertyScreenStepTwo" component={EditPropertyScreenStepTwo}
      hideNavBar={true}
    />
    <Scene key="EditPropertyScreenStepThree" component={EditPropertyScreenStepThree}
      hideNavBar={true}
    />
    <Scene key="EditPropertyScreenFinalStep" component={EditPropertyScreenFinalStep}
      hideNavBar={true}
    />
    <Scene key="NewMaintenanceRequestScreen" component={NewMaintenanceRequestScreen}
      hideNavBar={true}
    />
    <Scene key="AddDisputesScreen" component={AddDisputesScreen}
      hideNavBar={true}
    />
    <Scene key="ForwardMaintenanceRequestScreen" component={ForwardMaintenanceRequestScreen}
      hideNavBar={true}
    />
    <Scene key="MaintenanceRequestDetailsScreen" component={MaintenanceRequestDetailsScreen}
      hideNavBar={true}
    />

    <Scene key="DisputesDetailsScreen" component={DisputesDetailsScreen}
      hideNavBar={true}
    />
    <Scene key="AddAgreementScreen" component={AddAgreementScreen}
      hideNavBar={true}
    />
    <Scene key="EditAgreementScreen" component={EditAgreementScreen}
      hideNavBar={true}
    />

    <Scene key="AgreementDetailsScreen" component={AgreementDetailsScreen}
      hideNavBar={true}
    />

    <Scene key="TradersMaintenanceRequestDetailsScreen" component={TradersMaintenanceRequestDetailsScreen}
      hideNavBar={true}
    />

    <Scene key="Chat" component={Chat}
      hideNavBar={true}
    />

    <Scene key="NoticeBoardDetailScreen" component={NoticeBoardDetailScreen}
      hideNavBar={true}
    />

    <Scene key="WriteReviewScreen" component={WriteReviewScreen}
      hideNavBar={true}
    />

    <Scene key="AgentProfileScreen" component={AgentProfileScreen}
      hideNavBar={true}
    />

    <Scene key="AddAgentScreen" component={AddAgentScreen}
      hideNavBar={true}
    />

  </Scene>
);

export default class App extends Component {
  render() {
    return (
      <Router
        scenes={scenes}
      />
    );
  }
}

