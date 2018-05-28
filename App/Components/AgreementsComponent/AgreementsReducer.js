import ACTION_TYPES from '../../Action/ActionsType';
const INITIAL_STATE = {
	
	agreementsListRes: '',
	isScreenLoading: false
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.AGREEMENTS_SHOW_LOADING:
			return { ...state, isScreenLoading: true }
	
		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.GET_AGREEMENT_LIST_RES:
			return { ...state, agreementsListRes: action.payload, isScreenLoading: false }
		



		default:
			return state;
	}

};
