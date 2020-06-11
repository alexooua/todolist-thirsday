import React from 'react';
import './App.css';
import TodoList from "./TodoList";
import AddNewItemForm from "./AddNewItemForm";
import {connect} from "react-redux";
import {addTodoListTC, getTodoListsTC} from "./reducer";
import {AppStateType} from "./store";
import {TodoType} from "./types/entities";

type MapStatePropsType = {
    todolists: Array<TodoType>
    isLoad: boolean
}
type MapDispatchPropsType = {
    getTodoListsTC(): void
    addTodoListTC(title: string): void
}

class App extends React.Component<MapStatePropsType & MapDispatchPropsType> {

    componentDidMount() {
        this.restoreState();
    }

    restoreState = () => {
        this.props.getTodoListsTC()
    };
    addTodoList = (title: string) => {
        this.props.addTodoListTC(title)
    };

    render = () => {
        const todolists = this.props.todolists.map(tl => {
            return <TodoList key={tl.id}
                             id={tl.id}
                             title={tl.title}
                             tasks={tl.tasks}/>
        });


        // {this.props.isLoad ? <div><AddNewItemForm addItem={this.addTodoList}/></div>
        //     <div className="App">{todolists}</div>:SPINNER}

        return (<div>
            {this.props.isLoad?<div className="lds-ripple">
                {/*<div>{console.log(this.props.isLoad)}</div>*/}
                <div></div>
            </div>:<div><AddNewItemForm addItem={this.addTodoList}/><div className="App">{todolists}
            </div></div>}
        </div>);
    }
}

const mapStateToProps = (state: AppStateType): MapStatePropsType => {
    return {
        todolists: state.todolists,
        isLoad: false
    }
};


const ConnectedApp = connect<MapStatePropsType,MapDispatchPropsType,{},AppStateType>(mapStateToProps, {addTodoListTC,getTodoListsTC})(App);
export default ConnectedApp;
