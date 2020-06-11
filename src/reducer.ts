import {api} from "./api";
import {TaskType, TodoType, UpdateTaskType} from "./types/entities";
import {Dispatch} from "redux";
import {AppStateType} from "./store";

export const ADD_TODOLIST = "TodoList/Reducer/ADD-TODOLIST";
export const DELETE_TODOLIST = "TodoList/Reducer/DELETE-TODOLIST";
export const DELETE_TASK = "TodoList/Reducer/DELETE-TASK";
export const UPDATE_TODOLIST_TITLE = "TodoList/Reducer/UPDATE_TODOLIST_TITLE";
export const ADD_TASK = "TodoList/Reducer/ADD-TASK";
export const SET_TASKS = "TodoList/Reducer/SET_TASKS";
export const UPDATE_TASK = "TodoList/Reducer/UPDATE-TASK";
export const SET_TODOLISTS = "TodoList/Reducer/SET_TODOLISTS";
export const SET_SPINNER = "TodoList/Reducer/SET_SPINNER";


type  InitialStateType = {
    todolists: Array<TodoType>
    isLoad: boolean
}
const initialState: InitialStateType = {
    todolists: [],
    isLoad: false

};

const reducer = (state: InitialStateType = initialState, action: TodoActionType): InitialStateType => {
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

type TodoActionType=AddTodolistAT|UpdateTodolistTitleAT|SetTasksAT|SetTodolistsAT|SetIsLoadAT|DeleteTodolistAT|DeleteTaskAT|AddTaskAT|AddTodolistAT|UpdateTaskAT
// Action creators
type UpdateTaskAT = {
    type: typeof UPDATE_TASK
    taskId: string
    obj: UpdateTaskType
    todolistId: string
}
export const updateTaskAC = (taskId: string, obj: UpdateTaskType, todolistId: string): UpdateTaskAT => ({
    type: UPDATE_TASK,
    taskId,
    obj,
    todolistId
});

type UpdateTodolistTitleAT = {
    type: typeof UPDATE_TODOLIST_TITLE
    todolistId: string
    title: string
}
export const updateTodolistTitleAC = (todolistId: string, title: string): UpdateTodolistTitleAT => ({
    type: UPDATE_TODOLIST_TITLE,
    todolistId,
    title
});

type SetTasksAT = {
    type: typeof SET_TASKS
    tasks: Array<TaskType>
    todolistId: string
}
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string): SetTasksAT => ({
    type: SET_TASKS,
    tasks,
    todolistId
});

type SetTodolistsAT = {
    type: typeof SET_TODOLISTS
    todolists: Array<TodoType>
}
export const setTodolistsAC = (todolists: Array<TodoType>): SetTodolistsAT => ({
    type: SET_TODOLISTS,
    todolists: todolists
});

type SetIsLoadAT = {
    type: typeof SET_SPINNER
    isLoad: boolean
}
export const setIsLoadAC = (isLoad: boolean): SetIsLoadAT => ({type: SET_SPINNER, isLoad: isLoad});

type DeleteTodolistAT = {
    type: typeof DELETE_TODOLIST
    todolistId: string
}
export const deleteTodolistAC = (todolistId: string): DeleteTodolistAT => ({
    type: DELETE_TODOLIST,
    todolistId: todolistId
});

type DeleteTaskAT = {
    type: typeof DELETE_TASK
    todolistId: string
    taskId: string
}
export const deleteTaskAC = (todolistId: string, taskId: string): DeleteTaskAT => ({
    type: DELETE_TASK,
    todolistId,
    taskId
});

type AddTaskAT = {
    type: typeof ADD_TASK
    newTask: TaskType
    todolistId: string
}
export const addTaskAC = (newTask: TaskType, todolistId: string): AddTaskAT => ({type: ADD_TASK, newTask, todolistId});

type AddTodolistAT = {
    type: typeof ADD_TODOLIST
    newTodolist: TodoType
}
export const addTodolistAC = (newTodolist: TodoType): AddTodolistAT => ({type: ADD_TODOLIST, newTodolist: newTodolist});

//Thunk
export const getTodoListsTC = () => (dispatch:Dispatch) => {
    dispatch(setIsLoadAC(true))
    //get axios request
    api.getTodolists()
        .then(res => {
            //dispatch action
            dispatch(setTodolistsAC(res.data))
            dispatch(setIsLoadAC(false))
        })
}
export const addTodoListTC = (title:string) => (dispatch:Dispatch<TodoActionType>) => {
//get axios request
    dispatch(setIsLoadAC(true))
    api.createTodolist(title)
        .then(res => {
            let todolist = res.data.data.item
            dispatch(addTodolistAC(todolist))
            dispatch(setIsLoadAC(false))
        })
}
export const deleteTodolistTC = (id:string) => (dispatch:Dispatch<TodoActionType>) => {
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

export const getTasksTC = (todoListId:string) => (dispatch:Dispatch<TodoActionType>, getState:()=>AppStateType) => {
    dispatch(setIsLoadAC(true))
    api.getTasks(todoListId)
        .then(
            res => {

                let allTasks = res.data.items;
                dispatch(setTasksAC(allTasks, todoListId));
                dispatch(setIsLoadAC(false))
            });
}
export const addTaskTC = (newText:string, todoListId:string) => (dispatch:Dispatch<TodoActionType>, getState:()=>AppStateType) => {
    dispatch(setIsLoadAC(true))
    api.createTask(newText, todoListId).then(res => {
        let newTask = res.data.data.item;
        dispatch(addTaskAC(newTask, todoListId));
        dispatch(setIsLoadAC(false))
    });
}

export const changeTaskTC = (task:any, obj:UpdateTaskType) => (dispatch:Dispatch<TodoActionType>, getState:()=>AppStateType) => {
    debugger
    dispatch(setIsLoadAC(true))
    api.updateTask(task)
        .then(res => {
            res.data.resultCode === 0 && dispatch(updateTaskAC(task.id, obj, task.todoListId))
            dispatch(setIsLoadAC(false))
        })
}
export const deleteTaskTC = (taskId:string, id:string) => (dispatch:Dispatch<TodoActionType>) => {
    dispatch(setIsLoadAC(true))
    api.deleteTask(taskId, id)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(deleteTaskAC(id, taskId))
                dispatch(setIsLoadAC(false))
            }
        });
}
export const updateTitleTC = (id:string, title:string) => (dispatch:Dispatch<TodoActionType>) => {
    dispatch(setIsLoadAC(true))
    api.updateTodolistTitle(title, id)
        .then(res => {
            res.data.resultCode === 0 && dispatch(updateTodolistTitleAC(id, title))
            dispatch(setIsLoadAC(false))
        });
}
