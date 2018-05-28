import { applyMiddleware, compose, createStore } from 'redux';
import { fromJS } from 'immutable';
import createSagaMiddleware from 'redux-saga';
import reducers from '../Reducer/MainReducer';
import sagas from '../Saga/sagas';

const sagaMiddleware = createSagaMiddleware();

function configureStore(initialState = fromJS({})) {
	// console.log(sagas)
	const middlewares = [ sagaMiddleware ];

	const enhancers = [ applyMiddleware(...middlewares) ];

	// if (__DEV__) {
	//   enhancers.push(devTools());
	// }

	const store = createStore(reducers, compose(...enhancers));

	//	console.log(store);

	// Extensions
	sagaMiddleware.run(sagas, store.dispatch);
	// const rootTask = sagaMiddleware.run(sagas, store.dispatch);
	// rootTask.done.catch(function (err) {
	//     console.log("Error in Sagas", err);
	// });
	return store;
}

export default configureStore;
