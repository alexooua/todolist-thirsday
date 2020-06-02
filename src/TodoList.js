import React from 'react';
import './App.css';
import TodoListTasks from "./TodoListTasks";
import TodoListFooter from "./TodoListFooter";
import TodoListTitle from "./TodoListTitle";
import AddNewItemForm from "./AddNewItemForm";
import {connect} from "react-redux";
import {updateTitleTC,addTaskTC, changeTaskTC, deleteTaskTC, deleteTodolistTC, getTasksTC} from "./reducer";

class TodoList extends React.Component {
    state = {
        filterValue: "All"
    };
    componentDidMount() {
        this.restoreState();
    }
    restoreState = () => {
        this.props.getTasksTC(this.props.id)
    };
    addTask = (newText) => {
        this.props.addTaskTC(newText, this.props.id)
    };
    changeFilter = (newFilterValue) => {
        this.setState({
            filterValue: newFilterValue
        });
    };

    changeTask = (taskId, obj) => {
        let changedTask = this.props.tasks.find(task => {
            return task.id === taskId
        });
        let task = {...changedTask, ...obj};
        this.props.changeTaskTC(task, obj)

    };

    changeStatus = (taskId, status) => {
        this.changeTask(taskId, {status: status});
    };

    changeTitle = (taskId, title) => {
        this.changeTask(taskId, {title: title});
    };

    deleteTodolist = () => {
        this.props.deleteTodolistTC(this.props.id)

    };

    deleteTask = (taskId) => {
        this.props.deleteTaskTC(taskId, this.props.id)

    };

    updateTitle = (title) => {
        this.props.updateTitleTC(this.props.id, title)
    };

    render = () => {
        let {tasks = []} = this.props;
        return (
            <div className="todoList">
                <div className="todoList-header">
                    <div className="wrapper">
                        <TodoListTitle title={this.props.title} updateTitle={this.updateTitle}/>
                        <button onClick={this.deleteTodolist}>X</button>
                    </div>
                    <AddNewItemForm addItem={this.addTask}/>
                </div>

                <TodoListTasks changeStatus={this.changeStatus}
                               changeTitle={this.changeTitle}
                               deleteTask={this.deleteTask}
                               tasks={tasks.filter(t => {
                                   if (this.state.filterValue === "All") {
                                       return true;
                                   }
                                   if (this.state.filterValue === "Active") {
                                       return t.status === 0;
                                   }
                                   if (this.state.filterValue === "Completed") {
                                       return t.status === 2;
                                   }
                               })}/>
                <TodoListFooter changeFilter={this.changeFilter} filterValue={this.state.filterValue}/>
            </div>
        );
    }
}


const ConnectedTodolist = connect(null, {
    updateTitleTC,
    deleteTaskTC,
    deleteTodolistTC,
    getTasksTC,
    changeTaskTC,
    addTaskTC
})(TodoList);
export default ConnectedTodolist;

