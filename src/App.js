import React from 'react';
import './App.css';
import TodoList from "./TodoList";
import AddNewItemForm from "./AddNewItemForm";
import {connect} from "react-redux";
import {addTodoListTC, getTodoListsTC} from "./reducer";

class App extends React.Component {

    componentDidMount() {
        this.restoreState();
    }

    restoreState = () => {
        this.props.getTodoListsTC()
    };
    addTodoList = (title) => {
        this.props.addTodoListTC(title)
    };

    render = () => {
        const todolists = this.props.todolists.map(tl => {
            return <TodoList key={tl.id}
                             id={tl.id}
                             title={tl.title}
                             tasks={tl.tasks}/>
        });

        return (
            <>
                <div>
                    <AddNewItemForm addItem={this.addTodoList}/>
                </div>
                <div className="App">
                    {todolists}
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        todolists: state.todolists
    }
};

const ConnectedApp = connect(mapStateToProps, {addTodoListTC,getTodoListsTC})(App);
export default ConnectedApp;
