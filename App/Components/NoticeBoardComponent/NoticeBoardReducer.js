import ACTION_TYPES from '../../Action/ActionsType';
const INITIAL_STATE = {

	noticeBoardListResponse: '',
	noticeBoardDetailListResponse: '',
	isScreenLoading: false,
	userRoleData: '',
	propertyListData: '',
	postNameChange: '',
	postDescriptionChanged: '',
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.NOTICE_BOARD_LIST_FETCHING_DATA:
			return { ...state, isScreenLoading: true }

		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.NOTICE_BOARD_LIST:
			return { ...state, noticeBoardListResponse: action.payload, isScreenLoading: false }

		case ACTION_TYPES.GET_NOTICE_BOARD_DETAIL_LIST_RES:
			return { ...state, noticeBoardDetailListResponse: action.payload, isScreenLoading: false }

		case ACTION_TYPES.USER_ROLE_LIST:
			return { ...state, userRoleData: action.payload, isScreenLoading: false }

		case ACTION_TYPES.GET_AGENCY_PROPERTY_LIST_RES:
			return { ...state, propertyListData: action.payload, isScreenLoading: false }

		case ACTION_TYPES.POST_NAME_CHANGED:
			return { ...state, postNameChange: action.payload }

		case ACTION_TYPES.POST_DESCRIPTION_CHANGED:
			return { ...state, postDescriptionChanged: action.payload }

		default:
			return state;
	}

};
