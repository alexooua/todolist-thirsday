import {applyMiddleware, createStore} from "redux";
import reducer from "./reducer";
import thunk from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension";

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

window.store = store;
export default store;
