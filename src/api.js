import axios from "axios";

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/todo-lists",
    //configs
    withCredentials: true,
    // меняем API-KEY на собственный
    headers: {"API-KEY": "bdf52653-d6b7-4a3f-a378-af4831d7858c"}
});

export const api = {
    getTodolists() {
        return instance.get("");
    },
    createTodolist(title) {
        return instance.post("", {title})
    },
    deleteTodolist(todolistId) {
        return instance.delete(`/${todolistId}` )
    },
    updateTodolistTitle(title, todolistId) {
        return instance.put(`/${todolistId}`, {title: title})
    },
    getTasks(todolistId) {
        return instance.get(`/${todolistId}/tasks`)
    },
    createTask(newTaskTitle, todolistId) {
        return instance.post(`/${todolistId}/tasks`, {title: newTaskTitle});
    },
    updateTask(taskId, todolistId, task) {
        return instance.put(`/${todolistId}/tasks/${taskId}`,  task);
    },
    deleteTask(taskId, todolistId) {
        return instance.delete(`/${todolistId}/tasks/${taskId}`)
    }
};




