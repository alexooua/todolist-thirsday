import axios from "axios";

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/todo-lists",
    //configs
    withCredentials: true,
    // меняем API-KEY на собственный
    headers: {"API-KEY": "30e72227-8e6a-43bd-abeb-5f8819797dc9"}
});

export const api = {
    getTodolists() {
        return instance.get("");
    },
    createTodolist(title) {

        return instance.post("", {title: title})
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
    updateTask(task) {
        return instance.put(`/${task.todoListId}/tasks/${task.id}`,  task);
    },
    deleteTask(taskId, todolistId) {
        return instance.delete(`/${todolistId}/tasks/${taskId}`)
    }
};




