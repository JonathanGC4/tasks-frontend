<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

        <!-- Navbar -->
        <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div class="max-w-5xl mx-auto flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <span class="font-bold text-gray-800 dark:text-white text-lg">Task Manager</span>
                </div>

                <div class="flex items-center gap-4">
                    <router-link
                        to="/profile"
                        class="text-gray-600 dark:text-gray-300 text-sm hidden sm:block hover:text-indigo-600 transition"
                    >
                        👋 {{ auth.user?.name }}
                    </router-link>

                    <!-- Botón dark mode -->
                    <button
                        @click="theme.toggle()"
                        class="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                        <span v-if="theme.isDark">☀️</span>
                        <span v-else>🌙</span>
                    </button>

                    <button
                        @click="handleLogout"
                        class="text-sm text-red-500 hover:text-red-700 font-medium transition"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </nav>

        <div class="max-w-5xl mx-auto px-6 py-8">

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-4 mb-8">
                <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <p class="text-gray-500 dark:text-gray-400 text-sm">Total tareas</p>
                    <p class="text-3xl font-bold text-gray-800 dark:text-white mt-1">{{ tasksStore.pagination.total || 0 }}</p>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <p class="text-gray-500 dark:text-gray-400 text-sm">Pendientes</p>
                    <p class="text-3xl font-bold text-yellow-500 mt-1">{{ pendingCount }}</p>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <p class="text-gray-500 dark:text-gray-400 text-sm">Completadas</p>
                    <p class="text-3xl font-bold text-green-500 mt-1">{{ completedCount }}</p>
                </div>
            </div>

            <!-- Header + Crear -->
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-gray-800 dark:text-white">Mis tareas</h2>
                <button
                    @click="openModal()"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
                >
                    + Nueva tarea
                </button>
            </div>

            <!-- Filtros -->
            <div class="flex gap-2 mb-6 flex-wrap">
                <button
                    v-for="f in filters"
                    :key="f.value"
                    @click="applyFilter(f.value)"
                    :class="[
                        'px-4 py-2 rounded-xl text-sm font-medium transition',
                        activeFilter === f.value
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-indigo-300'
                    ]"
                >
                    {{ f.label }}
                </button>
            </div>

            <!-- Loading -->
            <div v-if="tasksStore.loading" class="text-center py-16 text-gray-400">
                Cargando tareas...
            </div>

            <!-- Empty state -->
            <div v-else-if="tasksStore.tasks.length === 0" class="text-center py-16">
                <p class="text-gray-400 text-lg">No hay tareas aún</p>
                <p class="text-gray-300 dark:text-gray-600 text-sm mt-1">Crea tu primera tarea con el botón de arriba</p>
            </div>

            <!-- Lista de tareas -->
            <div v-else class="space-y-3">
                <div
                    v-for="task in tasksStore.tasks"
                    :key="task.id"
                    class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-start justify-between gap-4 hover:shadow-md transition"
                >
                    <div class="flex items-start gap-3 flex-1">
                        <button @click="toggleStatus(task)" class="mt-1 flex-shrink-0">
                            <div :class="[
                                'w-5 h-5 rounded-full border-2 flex items-center justify-center transition',
                                task.status === 'completed'
                                    ? 'bg-green-500 border-green-500'
                                    : 'border-gray-300 dark:border-gray-500 hover:border-indigo-400'
                            ]">
                                <svg v-if="task.status === 'completed'" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </button>

                        <div class="flex-1">
                            <p :class="[
                                'font-medium',
                                task.status === 'completed'
                                    ? 'line-through text-gray-400'
                                    : 'text-gray-800 dark:text-white'
                            ]">
                                {{ task.title }}
                            </p>
                            <p v-if="task.description" class="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                {{ task.description }}
                            </p>
                            <span :class="[
                                'inline-block mt-2 text-xs font-medium px-2 py-1 rounded-full',
                                task.status === 'completed'
                                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                    : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                            ]">
                                {{ task.status === 'completed' ? 'Completada' : 'Pendiente' }}
                            </span>
                        </div>
                    </div>

                    <!-- Acciones -->
                    <div class="flex items-center gap-2 flex-shrink-0">
                        <button @click="openModal(task)" class="text-gray-400 hover:text-indigo-600 transition p-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button @click="handleDelete(task.id)" class="text-gray-400 hover:text-red-500 transition p-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Paginación -->
            <div v-if="tasksStore.pagination.lastPage > 1" class="flex justify-center gap-2 mt-8">
                <button
                    v-for="page in tasksStore.pagination.lastPage"
                    :key="page"
                    @click="goToPage(page)"
                    :class="[
                        'w-9 h-9 rounded-lg text-sm font-medium transition',
                        page === tasksStore.pagination.currentPage
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-indigo-300'
                    ]"
                >
                    {{ page }}
                </button>
            </div>
        </div>

        <!-- Modal crear/editar -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-5">
                    {{ editingTask ? 'Editar tarea' : 'Nueva tarea' }}
                </h3>

                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                        <input
                            v-model="form.title"
                            type="text"
                            placeholder="¿Qué tienes que hacer?"
                            class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción (opcional)</label>
                        <textarea
                            v-model="form.description"
                            rows="3"
                            placeholder="Agrega más detalles..."
                            class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
                        <select
                            v-model="form.status"
                            class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        >
                            <option value="pending">Pendiente</option>
                            <option value="completed">Completada</option>
                        </select>
                    </div>
                </div>

                <div v-if="modalError" class="bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 text-sm px-4 py-2 rounded-lg mt-4">
                    {{ modalError }}
                </div>

                <div class="flex gap-3 mt-6">
                    <button
                        @click="closeModal"
                        class="flex-1 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        @click="handleSave"
                        :disabled="saving"
                        class="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-3 rounded-xl transition"
                    >
                        {{ saving ? 'Guardando...' : (editingTask ? 'Guardar cambios' : 'Crear tarea') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore }  from '../stores/auth'
import { useTasksStore } from '../stores/tasks'
import { useToastStore } from '../stores/toast'
import { useThemeStore } from '../stores/theme'

const router     = useRouter()
const auth       = useAuthStore()
const tasksStore = useTasksStore()
const toast      = useToastStore()   // 👈 renombrado
const theme      = useThemeStore()   // 👈 renombrado

const showModal    = ref(false)
const editingTask  = ref(null)
const saving       = ref(false)
const modalError   = ref(null)
const activeFilter = ref('all')

const form = ref({ title: '', description: '', status: 'pending' })

const filters = [
    { label: 'Todas',       value: 'all' },
    { label: 'Pendientes',  value: 'pending' },
    { label: 'Completadas', value: 'completed' },
]

const pendingCount   = computed(() => tasksStore.tasks.filter(t => t.status === 'pending').length)
const completedCount = computed(() => tasksStore.tasks.filter(t => t.status === 'completed').length)

onMounted(() => tasksStore.fetchTasks())

async function applyFilter(value) {
    activeFilter.value = value
    const params = value === 'all' ? {} : { status: value }
    await tasksStore.fetchTasks(params)
}

async function goToPage(page) {
    const params = { page }
    if (activeFilter.value !== 'all') params.status = activeFilter.value
    await tasksStore.fetchTasks(params)
}

function openModal(task = null) {
    editingTask.value = task
    form.value = task
        ? { title: task.title, description: task.description || '', status: task.status }
        : { title: '', description: '', status: 'pending' }
    modalError.value = null
    showModal.value  = true
}

function closeModal() {
    showModal.value   = false
    editingTask.value = null
    modalError.value  = null
}

async function handleSave() {
    if (!form.value.title.trim()) {
        toast.error('El título es obligatorio.')
        return
    }

    saving.value     = true
    modalError.value = null

    try {
        if (editingTask.value) {
            await tasksStore.updateTask(editingTask.value.id, form.value)
            toast.success('Tarea actualizada correctamente.')
        } else {
            await tasksStore.createTask(form.value)
            toast.success('Tarea creada correctamente.')
        }
        closeModal()
    } catch (e) {
        toast.error(e.response?.data?.message || 'Error al guardar la tarea.')
    } finally {
        saving.value = false
    }
}

async function handleDelete(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        try {
            await tasksStore.deleteTask(id)
            toast.success('Tarea eliminada correctamente.')
        } catch (e) {
            toast.error('Error al eliminar la tarea.')
        }
    }
}

async function handleLogout() {
    await auth.logout()
    toast.info('Sesión cerrada correctamente.')
    router.push('/login')
}
</script>