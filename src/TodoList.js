import React from 'react';
import './App.css';
import TodoListTasks from "./TodoListTasks";
import TodoListFooter from "./TodoListFooter";
import TodoListTitle from "./TodoListTitle";
import AddNewItemForm from "./AddNewItemForm";
import {connect} from "react-redux";
import {
    addTaskAC, createTaskTC,
    deleteTaskAC,
    deleteTodolistAC,
    getTasksThunkC,
    setTasksAC,
    updateTaskAC,
    updateTodolistTitleAC
} from "./reducer";
import {api} from "./api";

class TodoList extends React.Component {

    state = {
        filterValue: "All"
    };

    componentDidMount() {
        this.restoreState();
    }

    restoreState = () => {
        this.props.getTasks(this.props.id)

        // api.getTasks(this.props.id)
        //     .then(res => {
        //         let allTasks = res.data.items;
        //         this.props.setTasks(allTasks, this.props.id);
        //     });
    };

    addTask = (newText) => {
        this.props.createTask(newText,this.props.id)
        // api.createTask(newText, this.props.id).then(res => {
        //     let newTask = res.data.data.item;
        //     this.props.addTask(newTask, this.props.id);
        // });
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

        api.updateTask(taskId, this.props.id, task)
            .then(res => {
                this.props.updateTask(taskId, obj, this.props.id)
            })
    };

    changeStatus = (taskId, status) => {
        this.changeTask(taskId, {status: status});
    };

    changeTitle = (taskId, title) => {
        this.changeTask(taskId, {title: title});
    };

    deleteTodolist = () => {
        api.deleteTodolist(this.props.id)
            .then(res => {
                this.props.deleteTodolist(this.props.id);
            });
    };

    deleteTask = (taskId) => {
        api.deleteTask(taskId, this.props.id)
            .then(res => {
                this.props.deleteTask(taskId, this.props.id);
            });
    };

    updateTitle = (title) => {
        api.updateTodolistTitle(title, this.props.id)
            .then(res => {
                this.props.updateTodolistTitle(title, this.props.id);
            });
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

const mapDispatchToProps = (dispatch) => {
    return {
        // addTask(newTask, todolistId) {
        //     dispatch(addTaskAC(newTask, todolistId));
        // },
        createTask: (newText,todoListId) => {
            const thunkAction = createTaskTC(newText,todoListId)
            dispatch(thunkAction)

        },
        // setTasks(tasks, todolistId) {
        //     dispatch(setTasksAC(tasks, todolistId));
        // },
        getTasks: (todoListId) => {
            const thunkAction = getTasksThunkC(todoListId)
            dispatch(thunkAction)

        },

        updateTask(taskId, obj, todolistId) {
            const action = updateTaskAC(taskId, obj, todolistId);
            dispatch(action);
        },
        deleteTodolist: (todolistId) => {
            const action = deleteTodolistAC(todolistId);
            dispatch(action)
        },
        deleteTask: (taskId, todolistId) => {
            const action = deleteTaskAC(todolistId, taskId);
            dispatch(action)
        },
        updateTodolistTitle: (title, todolistId) => {
            const action = updateTodolistTitleAC(todolistId, title);
            dispatch(action)
        }
    }
};

const ConnectedTodolist = connect(null, mapDispatchToProps)(TodoList);
export default ConnectedTodolist;

