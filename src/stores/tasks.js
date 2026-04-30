import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../plugins/axios'

export const useTasksStore = defineStore('tasks', () => {
    const tasks      = ref([])
    const loading    = ref(false)
    const pagination = ref({})

    async function fetchTasks(filters = {}) {
        loading.value = true
        try {
            const { data } = await api.get('/tasks', { params: filters })
            tasks.value      = data.data
            pagination.value = {
                total:       data.total,
                currentPage: data.current_page,
                lastPage:    data.last_page,
                perPage:     data.per_page,
            }
        } finally {
            loading.value = false
        }
    }

    async function createTask(taskData) {
        const { data } = await api.post('/tasks', taskData)
        tasks.value.unshift(data.data)
        return data.data
    }

    async function updateTask(id, taskData) {
        const { data } = await api.patch(`/tasks/${id}`, taskData)
        const index = tasks.value.findIndex(t => t.id === id)
        if (index !== -1) tasks.value[index] = data.data
        return data.data
    }

    async function deleteTask(id) {
        await api.delete(`/tasks/${id}`)
        tasks.value = tasks.value.filter(t => t.id !== id)
    }

    // Comentarios
    async function fetchComments(taskId) {
        const { data } = await api.get(`/tasks/${taskId}/comments`)
        return data.data
    }

    async function addComment(taskId, body) {
        const { data } = await api.post(`/tasks/${taskId}/comments`, { body })
        return data.data
    }

    async function deleteComment(taskId, commentId) {
        await api.delete(`/tasks/${taskId}/comments/${commentId}`)
    }

    return {
        tasks, loading, pagination,
        fetchTasks, createTask, updateTask, deleteTask,
        fetchComments, addComment, deleteComment
    }
})