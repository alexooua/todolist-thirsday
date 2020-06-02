import {api} from "./api";

export const ADD_TODOLIST = "TodoList/Reducer/ADD-TODOLIST";
export const DELETE_TODOLIST = "TodoList/Reducer/DELETE-TODOLIST";
export const DELETE_TASK = "TodoList/Reducer/DELETE-TASK";
export const UPDATE_TODOLIST_TITLE = "TodoList/Reducer/UPDATE_TODOLIST_TITLE";
export const ADD_TASK = "TodoList/Reducer/ADD-TASK";
export const SET_TASKS = "TodoList/Reducer/SET_TASKS";
export const UPDATE_TASK = "TodoList/Reducer/UPDATE-TASK";
export const SET_TODOLISTS = "TodoList/Reducer/SET_TODOLISTS";
export const SET_SPINNER = "TodoList/Reducer/SET_SPINNER";

const initialState = {
    todolists: [],
    isLoad:false

};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TASKS:
            return {
                ...state,
                todolists: state.todolists.map(tl => {
                    if (tl.id !== action.todolistId) {
                        return tl;
                    } else {
                        return {...tl, tasks: action.tasks}
                    }
                })
            };
        case SET_SPINNER:
            return {
                ...state,
                isLoad: action.isLoad
            };
        case SET_TODOLISTS:
            return {
                ...state,
                todolists: action.todolists.map(tl => ({...tl, tasks: []}))
            };
        case ADD_TODOLIST:
            return {
                ...state,
                todolists: [action.newTodolist, ...state.todolists]
            };
        case DELETE_TODOLIST:
            return {
                ...state,
                todolists: state.todolists.filter(tl => tl.id !== action.todolistId)
            };
        case UPDATE_TODOLIST_TITLE:
            return {
                ...state,
                todolists: state.todolists.map(tl => {
                    if (tl.id !== action.todolistId) return tl;
                    else return {...tl, title: action.title}
                })
            };
        case DELETE_TASK:
            return {
                ...state,
                todolists: state.todolists.map(tl => {
                    if (tl.id === action.todolistId) {
                        return {
                            ...tl,
                            tasks: tl.tasks.filter(t => t.id !== action.taskId)
                        }
                    } else {
                        return tl
                    }
                })
            };
        case ADD_TASK:
            return {
                ...state,
                todolists: state.todolists.map(tl => {
                    if (tl.id === action.todolistId) {
                        return {...tl, tasks: [action.newTask, ...tl.tasks]}
                    } else {
                        return tl
                    }
                })
            };
        case UPDATE_TASK:
            return {
                ...state,
                todolists: state.todolists.map(tl => {
                    if (tl.id === action.todolistId) {
                        return {
                            ...tl,
                            tasks: tl.tasks.map(t => {
                                if (t.id !== action.taskId) {
                                    return t;
                                } else {
                                    return {...t, ...action.obj};
                                }
                            })
                        }
                    } else {
                        return tl
                    }
                })
            };

        default:
            return state
    }
};

export default reducer;

// Action creators
export const updateTaskAC = (taskId, obj, todolistId) => ({type: UPDATE_TASK, taskId, obj, todolistId});
export const deleteTodolistAC = (todolistId) => ({type: DELETE_TODOLIST, todolistId: todolistId});
export const deleteTaskAC = (todolistId, taskId) => ({type: DELETE_TASK, todolistId, taskId});
export const updateTodolistTitleAC = (todolistId, title) => ({type: UPDATE_TODOLIST_TITLE, todolistId, title});
export const addTaskAC = (newTask, todolistId) => ({type: ADD_TASK, newTask, todolistId});
export const setTasksAC = (tasks, todolistId) => ({type: SET_TASKS, tasks, todolistId});
export const addTodolistAC = (newTodolist) => ({type: ADD_TODOLIST, newTodolist: newTodolist});
export const setTodolistsAC = (todolists) => ({type: SET_TODOLISTS, todolists: todolists});
export const setIsLoadAC = (isLoad) => ({type: SET_SPINNER, isLoad: isLoad});

//Thunk
export const getTodoListsTC = () => (dispatch) => {
    dispatch(setIsLoadAC(true))
    //get axios request
    api.getTodolists()
        .then(res => {
            //dispatch action
            dispatch(setTodolistsAC(res.data))
            dispatch(setIsLoadAC(false))
        })
}
export const addTodoListTC = (title) => (dispatch) => {
//get axios request
    dispatch(setIsLoadAC(true))
    api.createTodolist(title)
        .then(res => {
            let todolist = res.data.data.item
            dispatch(addTodolistAC(todolist))
            dispatch(setIsLoadAC(false))
        })
}
export const deleteTodolistTC = (id) => (dispatch) => {
//get axios request
    dispatch(setIsLoadAC(true))
    api.deleteTodolist(id)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(deleteTodolistAC(id))
            }
            dispatch(setIsLoadAC(false))
        })

}

export const getTasksTC = (todoListId) => (dispatch, getState) => {
    dispatch(setIsLoadAC(true))
    api.getTasks(todoListId)
        .then(
            res => {

                let allTasks = res.data.items;
                dispatch(setTasksAC(allTasks, todoListId));
                dispatch(setIsLoadAC(false))
            });
}
export const addTaskTC = (newText, todoListId) => (dispatch, getState) => {
    dispatch(setIsLoadAC(true))
    api.createTask(newText, todoListId).then(res => {
        let newTask = res.data.data.item;
        dispatch(addTaskAC(newTask, todoListId));
        dispatch(setIsLoadAC(false))
    });
}

export const changeTaskTC = (task, obj) => (dispatch, getState) => {
    dispatch(setIsLoadAC(true))
    api.updateTask(task)
        .then(res => {
            res.data.resultCode === 0 && dispatch(updateTaskAC(task.id, obj, task.todoListId))
            dispatch(setIsLoadAC(false))
        })
}
export const deleteTaskTC = (taskId, id) => (dispatch) => {
    dispatch(setIsLoadAC(true))
    api.deleteTask(taskId, id)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(deleteTaskAC(id, taskId))
                dispatch(setIsLoadAC(false))
            }
        });
}
export const updateTitleTC = (id, title) => (dispatch) => {
    dispatch(setIsLoadAC(true))
    api.updateTodolistTitle(title, id)
        .then(res => {
            res.data.resultCode === 0 && dispatch(updateTodolistTitleAC(id, title))
            dispatch(setIsLoadAC(false))
        });
}
