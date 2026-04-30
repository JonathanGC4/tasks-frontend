<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

        <!-- Navbar -->
        <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div class="max-w-5xl mx-auto flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <router-link to="/dashboard"
                        class="text-gray-400 hover:text-indigo-600 transition text-sm">
                        ← Dashboard
                    </router-link>
                    <span class="text-gray-300">|</span>
                    <span class="font-bold text-gray-800 dark:text-white">Gestión de Employees</span>
                </div>
                <span class="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full font-medium">
                    Admin
                </span>
            </div>
        </nav>

        <div class="max-w-5xl mx-auto px-6 py-8">

            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-xl font-bold text-gray-800 dark:text-white">Employees</h2>
                    <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        {{ usersStore.users.length }} empleado(s) registrado(s)
                    </p>
                </div>
                <button
                    @click="openModal()"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
                >
                    + Nuevo employee
                </button>
            </div>

            <!-- Loading -->
            <div v-if="usersStore.loading" class="text-center py-16 text-gray-400">
                Cargando employees...
            </div>

            <!-- Empty -->
            <div v-else-if="usersStore.users.length === 0" class="text-center py-16">
                <p class="text-gray-400 text-lg">No hay employees aún</p>
                <p class="text-gray-300 dark:text-gray-600 text-sm mt-1">Crea el primero con el botón de arriba</p>
            </div>

            <!-- Lista -->
            <div v-else class="space-y-3">
                <div
                    v-for="employee in usersStore.users"
                    :key="employee.id"
                    class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between gap-4"
                >
                    <div class="flex items-center gap-4">
                        <!-- Avatar -->
                        <div class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {{ getInitials(employee.name) }}
                        </div>
                        <div>
                            <p class="font-medium text-gray-800 dark:text-white">{{ employee.name }}</p>
                            <p class="text-gray-500 dark:text-gray-400 text-sm">{{ employee.email }}</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-4">
                        <span class="text-sm text-gray-500 dark:text-gray-400">
                            {{ employee.tasks_count }} tarea(s)
                        </span>
                        <button
                            @click="handleDelete(employee)"
                            class="text-gray-400 hover:text-red-500 transition p-1"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal crear employee -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-5">Nuevo Employee</h3>

                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                        <input v-model="form.name" type="text" placeholder="Juan Pérez"
                            class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input v-model="form.email" type="email" placeholder="juan@empresa.com"
                            class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña temporal</label>
                        <input v-model="form.password" type="password" placeholder="Mínimo 8 caracteres"
                            class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                    </div>
                </div>

                <div class="flex gap-3 mt-6">
                    <button @click="closeModal"
                        class="flex-1 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        Cancelar
                    </button>
                    <button @click="handleCreate" :disabled="saving"
                        class="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-3 rounded-xl transition">
                        {{ saving ? 'Creando...' : 'Crear employee' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUsersStore } from '../../stores/users'
import { useToastStore } from '../../stores/toast'

const usersStore = useUsersStore()
const toast      = useToastStore()

const showModal = ref(false)
const saving    = ref(false)
const form      = ref({ name: '', email: '', password: '' })

onMounted(() => usersStore.fetchUsers())

function getInitials(name) {
    return name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '?'
}

function openModal() {
    form.value  = { name: '', email: '', password: '' }
    showModal.value = true
}

function closeModal() {
    showModal.value = false
}

async function handleCreate() {
    if (!form.value.name || !form.value.email || !form.value.password) {
        toast.error('Completa todos los campos.')
        return
    }

    saving.value = true
    try {
        await usersStore.createUser(form.value)
        toast.success(`Employee ${form.value.name} creado correctamente.`)
        closeModal()
    } catch (e) {
        toast.error(e.response?.data?.message || 'Error al crear el employee.')
    } finally {
        saving.value = false
    }
}

async function handleDelete(employee) {
    if (confirm(`¿Eliminar a ${employee.name}? También se eliminarán sus tareas.`)) {
        try {
            await usersStore.deleteUser(employee.id)
            toast.success('Employee eliminado correctamente.')
        } catch (e) {
            toast.error('Error al eliminar el employee.')
        }
    }
}
</script>