import ACTION_TYPES from '../../Action/ActionsType';


export function showLoading() {
  return {
    type: ACTION_TYPES.FILTER_SHOW_LOADING
  }
}

export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}


export const stateChanged = (text) => {
  return {
    type: ACTION_TYPES.FILTER_STATE_CHANGED,
    payload: text
  };
};

export const cityChanged = (text) => {
  return {
    type: ACTION_TYPES.FILTER_CITY_CHANGED,
    payload: text
  };
};
export const propertyTypeChanged = (text) => {
  return {
    type: ACTION_TYPES.FILTER_PROPERTY_TYPE_CHANGED,
    payload: text
  };
};

