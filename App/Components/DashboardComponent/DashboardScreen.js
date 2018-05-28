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
	ScrollView,
	TextInput,
	Modal,
	AsyncStorage,

} from 'react-native';

import { Actions } from 'react-native-router-flux';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import CommonStyles from '../../CommonStyle/CommonStyle';
import DashboardStyle from './DashboardScreenStyle';
import ImagePath from '../../Constants/ImagesPath';
import HomeScreen from '../HomeComponent/HomeScreen';
import PropertiesScreen from '../PropertiesComponent/PropertiesScreen';
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation';
import Drawer from 'react-native-drawer'
import TenantScreen from '../TenantsComponent/TenantScreen';
import API from '../../Constants/APIUrls';
import TradersScreen from '../TradersComponent/TradersScreen';
import MyFileScreen from '../MyFileComponent/MyFileScreen';
import DisputesScreen from '../DisputesComponent/DisputesScreen';
import AgreementsScreen from '../AgreementsComponent/AgreementsScreen';
import SettingsScreen from '../SettingComponent/SettingsScreen';
import MaintenanceRequestScreen from '../MaintenanceRequestComponent/MaintenanceRequestScreen';
import MessagesScreen from '../MessagesComponent/MessagesScreen';
import ProfileScreen from '../ProfileComponent/ProfileScreen';
import AgentsScreen from '../AgentsComponent/AgentsScreen';
import NoticeBoardScreen from '../NoticeBoardComponent/NoticeBoardScreen';
import TradersMaintenanceRequestScreen from '../TradersMaintenanceRequestComponent/TradersMaintenanceRequestScreen';
import { CardWithWhiteBG } from '../CommonComponent/CardWithWhiteBG';
import * as Progress from 'react-native-progress';
//
const drawerStyles = {
	drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
	main: { paddingLeft: 0 },
}

import {
	userLogout,
	getStatistics,
} from "../../Action/ActionCreators";

import {
	logout,
	showLoading,
	resetState,
} from "../LogoutComponent/LogoutAction";
import CommonStyle from '../../CommonStyle/CommonStyle';

var logoutPostData = {};

class Dashboard extends Component {


	constructor() {

		super();
		this.state = {
			activeTab: 0,
			previousTab: 0,
			userInfo: {},
			selectedMenuItem: '',
			userPermission: [],
			roleName: '',
			statisticsData: {},

		};

		this.handleTabChange = this.handleTabChange.bind(this);
	}
	componentWillMount() {
		AsyncStorage.getItem("SyncittUserInfo").then((value) => {
			if (value) {
				var userData = JSON.parse(value);
				this.setState({ userInfo: userData });
			}
		}).done();
		this.getUsePermission();
		this.getRoleName();
	}

	componentWillReceiveProps(nextProps) {

		// if (this.props.logoutReducer.onTabPressed.tab == Strings.TENANTS) {
		// 	this.setState({ activeTab: 4, previousTab: 0, selectedMenuItem: Strings.TENANTS });
		// } else if (this.props.logoutReducer.onTabPressed.tab == Strings.PROPERTIES) {
		// 	this.setState({ activeTab: 1, previousTab: 0 });
		// } else if (this.props.logoutReducer.onTabPressed.tab == Strings.REQUESTS) {
		// 	this.setState({ activeTab: 3, previousTab: 0 });
		// }

	}


	componentDidUpdate() {
		this.onLogoutSuccess();
		this.onGetStatisticsSuccess();
	}

	componentDidMount() {

	}

	getRoleName() {

		AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
			if (value) {
				//console.log('user name == ', value);
				this.setState({ roleName: value });
				value == Strings.USER_ROLE_TRADER ? null : this.callGetStatistics();
			}
		}).done();
	}

	getUsePermission() {
		AsyncStorage.getItem("userPermission").then((value) => {
			if (value) {
			
				var permission = JSON.parse(value);
				console.log('userPermission== ', JSON.stringify(permission.data));
				this.setState({ userPermission: permission.data });
			}
		}).done();
	}


	drawerCheck() {
		if (this._drawer.open()) {
			this._drawer.close();
		} else {
			this._drawer.close();
		}
	}

	onLogout() {

		//console.log('userdata:', this.state.userInfo);
		if (this.state.userInfo.data) {
			//console.log('userdata:', this.state.userInfo.data + ' ' + this.state.userInfo.data.user_id);
			logoutPostData = {
				user_id: this.state.userInfo.data.user_id
			};
			this.props.showLoading();
			this.props.userLogout(logoutPostData);

		}
	}

	//today changes
	confirmUserLogout() {
		Alert.alert(
			Strings.APP_NAME,
			Strings.LOGOUT_CONFIRMATION_MSG,
			[
				{ text: Strings.YES, onPress: () => this.onLogout() },
				{ text: Strings.NO, onPress: () => console.log("Logout Denied") },
			],
			{ cancelable: false }
		)
	}


	onLogoutSuccess() {

		if (this.props.logoutReducer.logoutResponse != '') {

			if (this.props.logoutReducer.logoutResponse.code == 200) {
				Actions.WelcomeScreen({ type: "reset" });
				AsyncStorage.clear();
			}
			else {
				//alert(this.props.logoutReducer.logoutResponse.message);

			}
			this.props.resetState();
		}
	}


	closeControlPanel = () => {
		this._drawer.close()
	};

	openControlPanel = () => {
		this._drawer.open()

	};

	onSetting() {
		this.setState({ selectedMenuItem: Strings.SETTINGS });
		this.closeControlPanel();
	}

	onAgreements() {
		this.setState({ selectedMenuItem: Strings.AGREEMENTS });
		this.closeControlPanel();
	}

	onNoticeBoard() {
		this.setState({ selectedMenuItem: Strings.NOTICE_BOARD });
		this.closeControlPanel();
	}

	onDisputes() {
		this.setState({ selectedMenuItem: Strings.DISPUTES });
		this.closeControlPanel();
	}

	onMyFile() {
		this.setState({ selectedMenuItem: Strings.MYFILE });
		this.closeControlPanel();
	}

	onAgents() {
		this.setState({ selectedMenuItem: Strings.AGENTS });
		this.closeControlPanel();
	}

	onTrader() {
		this.setState({ selectedMenuItem: Strings.TRADERS });
		this.closeControlPanel();
	}

	onNoticeClick(id) {
		Actions.NoticeBoardDetailScreen({ noticeBoardId: id });
	}

	onTenant() {
		this.setState({ selectedMenuItem: Strings.TENANTS });
		this.closeControlPanel();

	}


	onTenantClick() {

		this.setState({ selectedMenuItem: Strings.TENANTS });

	}

	onProperties() {
		if (this.state.statisticsData.propertyCnt > 0) {
			this.setState({ activeTab: 1, previousTab: 0 });
		}
	}

	onRequest() {
		if (this.state.statisticsData.requestCnt > 0) {
			this.setState({ activeTab: 3, previousTab: 0 });
		}
	}

	handleTabChange(newTabIndex, oldTabIndex) {

		this.setState({ activeTab: newTabIndex, previousTab: oldTabIndex });

	}
	callSwitchAccountScreen() {

		this._drawer.close()
		Actions.SwitchProfileScreen();
	}
	callNotificationScreen() {
		this._drawer.close()
		Actions.NotificationsScreen();
	}
	callSearchScreen() {
		this._drawer.close()
		Actions.SearchScreen();
	}

	callProfileScreen() {

		this.setState({ selectedMenuItem: Strings.PROFILE });
		this.closeControlPanel();
	}

	callGetStatistics() {

		AsyncStorage.getItem("SyncittUserInfo").then((value) => {
			if (value) {
				var userData = JSON.parse(value);
				var authToken = userData.token;

				var postData = {
					agency_id: userData.data.agency_id,
					request_by_role: userData.data.role_id,
					user_id: userData.data._id,
				}
				this.props.showLoading();
				this.props.getStatistics(authToken, postData);
			}
		}).done();
	}

	onGetStatisticsSuccess() {
		if (this.props.logoutReducer.statisticRes != '') {
			if (this.props.logoutReducer.statisticRes.code == 200) {
				console.log('static data' + JSON.stringify(this.props.logoutReducer.statisticRes.data))
				this.setState({ statisticsData: this.props.logoutReducer.statisticRes.data });
			}
			else {
				//	alert(this.props.logoutReducer.statisticRes.message);
			}
			this.props.resetState();
		}
	}


	_showSelectedScreen(newTabIndex) {

		switch (newTabIndex) {
			case 0:
				return (
					<View style={DashboardStyle.scrollViewStyle}>
						{this.navBar()}
						{this.staticView()}
					</View>
				);
				break;
			case 1:
				return (
					<PropertiesScreen />
				);
				break;
			case 2:
				return (
					<MessagesScreen />
				);

				break;
			case 3:
				return (

					this.state.roleName == Strings.USER_ROLE_TRADER ? <TradersMaintenanceRequestScreen /> : <MaintenanceRequestScreen />
				);

				break;
			case 4:

				this._drawer.open();

				if (this.state.selectedMenuItem == '') {
					return (
						<View style={DashboardStyle.scrollViewStyle}>
							{this.navBar()}
							{this.staticView()}
						</View>
					);
				}
				switch (this.state.selectedMenuItem) {

					case Strings.TENANTS:
						return (

							<TenantScreen />

						);
						break;
					case Strings.TRADERS:
						return (

							<TradersScreen />
						);
						break;

					case Strings.AGENTS:
						return (

							<AgentsScreen/>
						);
						break;

					case Strings.MYFILE:
						return (

							<MyFileScreen />
						);
						break;

					case Strings.DISPUTES:
						return (

							<DisputesScreen />
						);
						break;
					case Strings.AGREEMENTS:
						return (

							<AgreementsScreen />
						);
						break;

					case Strings.NOTICE_BOARD:
						return (

							<NoticeBoardScreen />
						);
						break;
					case Strings.PROFILE:
						return (

							<ProfileScreen />
						);
						break;
					case Strings.SETTINGS:
						return (

							<SettingsScreen />
						);
						break;
					default:

				}
				break;
			default:

		}

	}
	drawerContentView() {
		{
			var firstName = this.state.userInfo.data ? this.state.userInfo.data.firstname : '';
			var lastName = this.state.userInfo.data ? this.state.userInfo.data.lastname : '';
			var userEmail = this.state.userInfo.data ? this.state.userInfo.data.email : '';
			var userImage = this.state.userInfo.data ? (this.state.userInfo.data.image ? API.USER_IMAGE_PATH + this.state.userInfo.data.image : '') : '';
			console.log('user data drawer== ', JSON.stringify(this.state.userInfo.data));
			console.log('user image drawer== ', userImage);
			return (

				<View style={DashboardStyle.drawerContentView} >
					<View style={DashboardStyle.headerViewStyle}>
						<TouchableOpacity onPress={() => this.callNotificationScreen()}>
							<View>
								<Image source={ImagePath.DRAWER_NOTIFICATION_ICON} />
							</View>
						</TouchableOpacity>
						<View style={DashboardStyle.searchViewStyle}>
							<TouchableOpacity onPress={() => this.callSearchScreen()}>
								<Image source={ImagePath.DRAWER_SEARCH_NAV} style={DashboardStyle.searchImageStyle} />
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.closeControlPanel()}>
								<Image source={ImagePath.DRAWER_CROSS_ICON} />
							</TouchableOpacity>
						</View>
					</View>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View style={DashboardStyle.userImageViewStyle}>
							<TouchableOpacity onPress={() => this.callProfileScreen()} style={DashboardStyle.userImageViewStyle}>

								{
									userImage != '' ? <Image source={{ uri: userImage }} style={DashboardStyle.userImageStyle} />
										:
										<View style={CommonStyles.emptyUserImageStyle}>
											<Text style={CommonStyles.initialTextStyle}>{firstName.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
										</View>
								}

								<Text style={DashboardStyle.userNameTextStyle}>{firstName + ' ' + lastName}</Text>
								<Text style={DashboardStyle.userEmailTextStyle}>{userEmail}</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.callSwitchAccountScreen()}>
								<View style={DashboardStyle.roundedBlueSwitchButtonStyle}>
									<Text style={DashboardStyle.swithButtonTextStyle}>{Strings.SWITCH_ACCOUNT}</Text>
								</View>
							</TouchableOpacity>
						</View>

						<View style={DashboardStyle.drawerItemViewContainer}>

							{
								this.state.userPermission.includes('tenants_listing')
									?
									<TouchableOpacity onPress={() => this.onTenant()} style={this.state.selectedMenuItem == Strings.TENANTS ? DashboardStyle.selectedMenuItemBackgroundStyle : DashboardStyle.menuItemBackgroundStyle}>
										<View style={DashboardStyle.drawerMenuItemViewStyle}>
											<Image source={ImagePath.DRAWER_TENANTS} />
											<View style={DashboardStyle.drawerItemTextViewStyle}>
												<Text style={DashboardStyle.drawerItemText}>{Strings.TENANTS}</Text>
											</View>
										</View>
									</TouchableOpacity> : null
							}

							{
								this.state.userPermission.includes('trader_listing')
									?
									<TouchableOpacity onPress={() => this.onTrader()} style={this.state.selectedMenuItem == Strings.TRADERS ? DashboardStyle.selectedMenuItemBackgroundStyle : DashboardStyle.menuItemBackgroundStyle}>
										<View style={DashboardStyle.drawerMenuItemViewStyle}>
											<Image source={ImagePath.DRAWER_TRADERS} />
											<View style={DashboardStyle.drawerItemTextViewStyle}>
												<Text style={DashboardStyle.drawerItemText}>{Strings.TRADERS}</Text>
											</View>
										</View>
									</TouchableOpacity> : null
							}

							{
							this.state.userPermission.includes('agents_listing')
									?
									<TouchableOpacity onPress={() => this.onAgents()} style={this.state.selectedMenuItem == Strings.AGENTS ? DashboardStyle.selectedMenuItemBackgroundStyle : DashboardStyle.menuItemBackgroundStyle}>
										<View style={DashboardStyle.drawerMenuItemViewStyle}>
											<Image source={ImagePath.DRAWER_TRADERS} />
											<View style={DashboardStyle.drawerItemTextViewStyle}>
												<Text style={DashboardStyle.drawerItemText}>{Strings.AGENTS}</Text>
											</View>
										</View>
									</TouchableOpacity> : null
							}

							{
								this.state.userPermission.includes('myFile')
									?
									<TouchableOpacity onPress={() => this.onMyFile()} style={this.state.selectedMenuItem == Strings.MYFILE ? DashboardStyle.selectedMenuItemBackgroundStyle : DashboardStyle.menuItemBackgroundStyle}>
										<View style={DashboardStyle.drawerMenuItemViewStyle}>
											<Image source={ImagePath.DRAWER_MY_FILES} />
											<View style={DashboardStyle.drawerItemTextViewStyle}>
												<Text style={DashboardStyle.drawerItemText}>{Strings.MYFILE}</Text>
											</View>
										</View>
									</TouchableOpacity> : null
							}

							{/* {
								this.state.userPermission.includes('disputes')
									?
									<TouchableOpacity onPress={() => this.onDisputes()} style={this.state.selectedMenuItem == Strings.DISPUTES ? DashboardStyle.selectedMenuItemBackgroundStyle : DashboardStyle.menuItemBackgroundStyle}>
										<View style={DashboardStyle.drawerMenuItemViewStyle}>
											<Image source={ImagePath.DRAWER_DISPUTES} />
											<View style={DashboardStyle.drawerItemTextViewStyle}>
												<Text style={DashboardStyle.drawerItemText}>{Strings.DISPUTES}</Text>
											</View>
										</View>
									</TouchableOpacity> : null
							} */}

							{
								this.state.userPermission.includes('agreement')
									?
									<TouchableOpacity onPress={() => this.onAgreements()} style={this.state.selectedMenuItem == Strings.AGREEMENTS ? DashboardStyle.selectedMenuItemBackgroundStyle : DashboardStyle.menuItemBackgroundStyle}>
										<View style={DashboardStyle.drawerMenuItemViewStyle}>
											<Image source={ImagePath.DRAWER_AGREEMENT} />
											<View style={DashboardStyle.drawerItemTextViewStyle}>
												<Text style={DashboardStyle.drawerItemText}>{Strings.AGREEMENTS}</Text>
											</View>
										</View>
									</TouchableOpacity> : null
							}

							{
								this.state.userPermission.includes('noticeboard')?
								<TouchableOpacity onPress={() => this.onNoticeBoard()} style={this.state.selectedMenuItem == Strings.NOTICE_BOARD ? DashboardStyle.selectedMenuItemBackgroundStyle : DashboardStyle.menuItemBackgroundStyle}>
									<View style={DashboardStyle.drawerMenuItemViewStyle}>
										<Image source={ImagePath.DRAWER_AGREEMENT} />
										<View style={DashboardStyle.drawerItemTextViewStyle}>
											<Text style={DashboardStyle.drawerItemText}>{Strings.NOTICE_BOARD}</Text>
										</View>
									</View>
								</TouchableOpacity>:null
							}

							{
								this.state.userPermission.includes('setting')
									?
									<TouchableOpacity onPress={() => this.onSetting()} style={this.state.selectedMenuItem == Strings.SETTINGS ? DashboardStyle.selectedMenuItemBackgroundStyle : DashboardStyle.menuItemBackgroundStyle}>
										<View style={DashboardStyle.drawerMenuItemViewStyle}>
											<Image source={ImagePath.DRAWER_SETTINGS} />
											<View style={DashboardStyle.drawerItemTextViewStyle}>
												<Text style={DashboardStyle.drawerItemText}>{Strings.SETTINGS}</Text>
											</View>
										</View>
									</TouchableOpacity> : null
							}


							<TouchableOpacity onPress={() => this.confirmUserLogout()} style={this.state.selectedMenuItem == Strings.SIGNOUT ? DashboardStyle.selectedMenuItemBackgroundStyle : DashboardStyle.menuItemBackgroundStyle}>
								<View style={DashboardStyle.drawerMenuItemViewStyle}>
									<Image source={ImagePath.DRAWER_SIGNOUT} />
									<View style={DashboardStyle.drawerItemTextViewStyle}>
										<Text style={DashboardStyle.drawerItemText}>{Strings.SIGNOUT}</Text>
									</View>
								</View>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</View>

			);
		}

	}

	callSearchScreen() {

		Actions.SearchScreen();
	}

	navBar() {

		return (
			<View >
				<Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
				<Text style={CommonStyles.navBarTitleTextView}>{Strings.NAV_HOME_TITLE}</Text>

				<TouchableOpacity onPress={() => this.callSearchScreen()} style={CommonStyles.navRightImageView}>
					<View>
						<Image source={ImagePath.DRAWER_SEARCH_ICON} />
					</View>
				</TouchableOpacity>
			</View>
		);
	}
	staticView() {
		return (
			<ScrollView >
				<HomeScreen />
				{(this.state.roleName == Strings.USER_ROLE_AGENT||this.state.roleName == Strings.USER_ROLE_AGENCY_OWNER) ?
					<View style={DashboardStyle.noticeBoardContainerViewStyle}>
					<Text style={DashboardStyle.managePropertyTextStyle}>
						{Strings.STATISTICS}
					</Text>
				
					<CardWithWhiteBG>
							<TouchableOpacity onPress={() => this.onTenantClick()}>

								<View style={DashboardStyle.statisticsViewContainer}>
									<Text style={DashboardStyle.statisticsLabelTextStyle}>{Strings.TENANTS}</Text>
									<Text style={DashboardStyle.statisticsTextStyle}>{this.state.statisticsData.tenantCnt ? this.state.statisticsData.tenantCnt : 0}</Text>
								</View>
							</TouchableOpacity>
					</CardWithWhiteBG>
			
					<CardWithWhiteBG>
						<TouchableOpacity onPress={() => this.onProperties()}>

							<View style={DashboardStyle.statisticsViewContainer}>
								<Text style={DashboardStyle.statisticsLabelTextStyle}>{Strings.PROPERTIES}</Text>
								<Text style={DashboardStyle.statisticsTextStyle}>{this.state.statisticsData.propertyCnt ? this.state.statisticsData.propertyCnt : 0}</Text>
							</View>
						</TouchableOpacity>
					</CardWithWhiteBG>

					<CardWithWhiteBG>
						<TouchableOpacity onPress={() => this.onRequest()}>

							<View style={DashboardStyle.statisticsViewContainer}>
								<Text style={DashboardStyle.statisticsLabelTextStyle}>{Strings.REQUESTS}</Text>
								<Text style={DashboardStyle.statisticsTextStyle}>{this.state.statisticsData.requestCnt ? this.state.statisticsData.requestCnt : 0}</Text>
							</View>
						</TouchableOpacity>
					</CardWithWhiteBG>
				</View>
					: null
				}
			</ScrollView>
		);
	}


	render() {


		return (

			<View style={{ flex: 1 }}>
				<Drawer
					ref={(ref) => this._drawer = ref}
					type="overlay"
					side="right"
					content={this.drawerContentView()}
					tapToClose={true}
					openDrawerOffset={0.2} // 20% gap on the right side of drawer
					panCloseMask={0.2}
					closedDrawerOffset={-3}
					styles={drawerStyles}
					tweenHandler={(ratio) => ({
						main: { opacity: (2 - ratio) / 2 }
					})}>


					{this._showSelectedScreen(this.state.activeTab)}

					<BottomNavigation
						activeTab={this.state.activeTab}
						labelColor="white"
						rippleColor="white"
						style={{ flex: 1, height: 64, elevation: 8, position: 'absolute', left: 0, bottom: 0, right: 0 }}
						innerStyle={{ paddingTop: 10 }}
						onTabChange={this.handleTabChange}
						shifting={false}>

						<Tab
							barBackgroundColor="#FFFFFF"
							icon={<Image source={ImagePath.DASHBOARD_HOME} style={CommonStyles.bottomTabIcons} />}
							activeIcon={<Image source={ImagePath.DASHBOARD_HOME_ACTIVE} style={CommonStyles.bottomTabIcons} />}
						/>
						<Tab
							barBackgroundColor="#FFFFFF"
							icon={<Image source={ImagePath.DASHBOARD_PRPERTY} style={CommonStyles.bottomTabIcons} />}
							activeIcon={<Image source={ImagePath.DASHBOARD_PROPERTY_ACTIVE} style={CommonStyles.bottomTabIcons} />}
						/>
						<Tab
							barBackgroundColor="#FFFFFF"
							icon={<Image source={ImagePath.DASHBOARD_MESSAGE} style={CommonStyles.bottomTabIcons} />}
							activeIcon={<Image source={ImagePath.DASHBOARD_MESSAGE_ACTIVE} style={CommonStyles.bottomTabIcons} />}
						/>
						<Tab
							barBackgroundColor="#FFFFFF"
							icon={<Image source={ ImagePath.DASHBOARD_REQUEST} style={CommonStyles.bottomTabIcons} />}
							activeIcon={<Image source={ ImagePath.DASHBOARD_REQUEST_ACTIVE} style={CommonStyles.bottomTabIcons} />}
						/>
						<Tab
							barBackgroundColor="#FFFFFF"
							icon={<Image source={ImagePath.DASHBOARD_MENU} style={CommonStyles.bottomTabIcons} />}
							activeIcon={<Image source={ImagePath.DASHBOARD_MENU_ACTIVE} style={CommonStyles.bottomTabIcons} />}
						/>

					</BottomNavigation>

				</Drawer>

				{

					this.props.logoutReducer.isScreenLoading ?
						<View style={CommonStyles.circles}>
							<Progress.CircleSnail color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]} />
						</View>
						: null

				}

			</View>
		);
	}

}


function mapStateToProps(state) {
	console.log('mapStateToProps= ', JSON.stringify(state));
	return {
		logoutReducer: state.logoutReducer,
	}
}

export default connect(
	mapStateToProps,
	{
		userLogout,
		getStatistics,
		showLoading,
		resetState,
	}

)(Dashboard)
