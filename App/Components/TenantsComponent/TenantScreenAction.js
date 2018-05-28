import ACTION_TYPES from '../../Action/ActionsType';


export function showLoading() {
  return {
    type: ACTION_TYPES.PROPERTY_LIST_FETCHING_DATA
  }
}

export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}

//for filter screen

export const nameChanged = (text) => {
  return {
    type: ACTION_TYPES.FILTER_NAME_CHANGED,
    payload: text
  };
};


export const cityChanged = (text) => {
  return {
    type: ACTION_TYPES.FILTER_CITY_CHANGED,
    payload: text
  };
};

export const stateChanged = (text) => {
  return {
    type: ACTION_TYPES.FILTER_STATE_CHANGED,
    payload: text
  };
};

export const postalCodeChanged = (text) => {
  return {
    type: ACTION_TYPES.FILTER_POSTAL_CODE_CHANGED,
    payload: text
  };
};

 