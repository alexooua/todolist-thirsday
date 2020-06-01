import {api} from "./api";

export const ADD_TODOLIST = "TodoList/Reducer/ADD-TODOLIST";
export const DELETE_TODOLIST = "TodoList/Reducer/DELETE-TODOLIST";
export const DELETE_TASK = "TodoList/Reducer/DELETE-TASK";
export const UPDATE_TODOLIST_TITLE = "TodoList/Reducer/UPDATE_TODOLIST_TITLE";
export const ADD_TASK = "TodoList/Reducer/ADD-TASK";
export const SET_TASKS = "TodoList/Reducer/SET_TASKS";
export const UPDATE_TASK = "TodoList/Reducer/UPDATE-TASK";
export const SET_TODOLISTS = "TodoList/Reducer/SET_TODOLISTS";

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

//Thunk
export const getTodoListsTC = () => (dispatch) => {
//get axios request
    api.getTodolists()
        .then(res => {
            //dispatch action
                 dispatch(setTodolistsAC(res.data))
            })
}
export const getTasksThunkC = (todoListId) => (dispatch, getState) => {
    api.getTasks(todoListId)
        .then(res => {
            let allTasks = res.data.items;
            dispatch(setTasksAC(allTasks, todoListId ));
        });
}
export const createTaskTC=(newText,todoListId)=>(dispatch,getState)=>{
    api.createTask(newText, todoListId).then(res => {
        let newTask = res.data.data.item;
        dispatch(addTaskAC(newTask, todoListId));
    });
}
