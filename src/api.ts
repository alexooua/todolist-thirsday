import axios from "axios";
import {TodoType} from "./types/entities";

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/todo-lists",
    //configs
    withCredentials: true,
    // меняем API-KEY на собственный
    headers: {"API-KEY": "30e72227-8e6a-43bd-abeb-5f8819797dc9"}
});
type CreatResponseType={
    resultCode:number
    messages: Array<string>
    data: {
        item:TodoType
    }
}
export const api = {
    getTodolists() {
        return instance.get("");
    },
    createTodolist(title:string) {

        return instance.post<CreatResponseType>("", {title: title})
    },
    deleteTodolist(todolistId:string) {
        return instance.delete(`/${todolistId}` )
    },
    updateTodolistTitle(title:string, todolistId:string) {
        return instance.put(`/${todolistId}`, {title: title})
    },
    getTasks(todolistId:string) {
        return instance.get(`/${todolistId}/tasks`)
    },
    createTask(newTaskTitle:string, todolistId:string) {
        return instance.post(`/${todolistId}/tasks`, {title: newTaskTitle});
    },
    updateTask(task:any) {
        return instance.put(`/${task.todoListId}/tasks/${task.id}`,  task);
    },
    deleteTask(taskId:string, todolistId:string) {
        return instance.delete(`/${todolistId}/tasks/${taskId}`)
    }
};




