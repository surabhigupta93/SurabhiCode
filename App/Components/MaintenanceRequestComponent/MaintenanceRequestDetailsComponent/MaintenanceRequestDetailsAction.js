import ACTION_TYPES from '../../../Action/ActionsType';


export function showLoading() {
  return {
    type: ACTION_TYPES.SHOW_LOADING_MAINTENANCE_DETAIL
  }
}

export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}


 