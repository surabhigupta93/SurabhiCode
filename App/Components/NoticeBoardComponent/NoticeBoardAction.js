import ACTION_TYPES from '../../Action/ActionsType';


export function showLoading() {
  return {
    type: ACTION_TYPES.NOTICE_BOARD_LIST_FETCHING_DATA
  }
}

export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}


// post name TextField Value Change
export const postNameChanged = (text) => {
  return {
    type: ACTION_TYPES.POST_NAME_CHANGED,
    payload: text
  };
};


//post Description TextField Value Change
export const postDescriptionChanged = (text) => {
  return {
    type: ACTION_TYPES.POST_DESCRIPTION_CHANGED,
    payload: text
  };
};
