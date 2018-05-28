import ACTION_TYPES from '../../Action/ActionsType';
const INITIAL_STATE = {
	reviewText: '',
	writeReviewRes: '',
	isScreenLoading:false
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.WRITE_REVIEW_LOADING:
			return { ...state, isScreenLoading: true }

		case ACTION_TYPES.WRITE_REVIEW_RESET_DATA:
      		return INITIAL_STATE;
		
		case ACTION_TYPES.WRITE_REVIEW_TEXT_CHANGE:
			return { ...state, reviewText: action.payload}

		case ACTION_TYPES.WRITE_REVIEW_RES:
			return { ...state, writeReviewRes: action.payload,isScreenLoading:false }

		default:
			return state;
	}

};
