import ACTION_TYPES from '../../Action/ActionsType';
const INITIAL_STATE = {

	fileChangeText: '',
	filterFileRes: '',
	isScreenLoading: false
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.FILTER_FILE_SHOW_LOADING:
			return { ...state, isScreenLoading: true }

		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.FILTER_FILE_RES:
			return { ...state, filterFileRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.FILTER_FILE_NAME_CHANGED:
			return { ...state, fileChangeText: action.payload }

		default:
			return state;
	}

};
