<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">

        <!-- Navbar -->
        <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div class="max-w-5xl mx-auto flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <router-link to="/dashboard" class="text-gray-400 hover:text-indigo-600 transition">
                        ← Volver
                    </router-link>
                    <span class="text-gray-300">|</span>
                    <span class="font-bold text-gray-800 dark:text-white">Mi perfil</span>
                </div>
            </div>
        </nav>

        <div class="max-w-lg mx-auto px-6 py-10">

            <!-- Avatar -->
            <div class="text-center mb-8">
                <div class="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center mx-auto mb-4 text-4xl font-bold text-white">
                    {{ initials }}
                </div>
                <h2 class="text-xl font-bold text-gray-800 dark:text-white">{{ auth.user?.name }}</h2>
                <p class="text-gray-500 dark:text-gray-400 text-sm">{{ auth.user?.email }}</p>
            </div>

            <!-- Card editar perfil -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
                <h3 class="font-bold text-gray-800 dark:text-white mb-5">Editar información</h3>

                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                        <input
                            v-model="form.name"
                            type="text"
                            class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input
                            v-model="form.email"
                            type="email"
                            class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                    </div>

                    <button
                        @click="handleUpdateProfile"
                        :disabled="saving"
                        class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-3 rounded-xl transition"
                    >
                        {{ saving ? 'Guardando...' : 'Guardar cambios' }}
                    </button>
                </div>
            </div>

            <!-- Card cambiar contraseña -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 class="font-bold text-gray-800 dark:text-white mb-5">Cambiar contraseña</h3>

                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña actual</label>
                        <input
                            v-model="passwords.current"
                            type="password"
                            placeholder="••••••••"
                            class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nueva contraseña</label>
                        <input
                            v-model="passwords.new"
                            type="password"
                            placeholder="Mínimo 8 caracteres"
                            class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmar nueva contraseña</label>
                        <input
                            v-model="passwords.confirmation"
                            type="password"
                            placeholder="Repite la nueva contraseña"
                            class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                    </div>

                    <button
                        @click="handleChangePassword"
                        :disabled="changingPassword"
                        class="w-full bg-gray-800 dark:bg-gray-600 hover:bg-gray-900 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition"
                    >
                        {{ changingPassword ? 'Cambiando...' : 'Cambiar contraseña' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'
import api from '../plugins/axios'

const auth   = useAuthStore()
const toast  = useToastStore()
const saving          = ref(false)
const changingPassword = ref(false)

const form = ref({
    name:  auth.user?.name  || '',
    email: auth.user?.email || '',
})

const passwords = ref({
    current:      '',
    new:          '',
    confirmation: '',
})

const initials = computed(() => {
    return auth.user?.name
        ?.split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || '?'
})

async function handleUpdateProfile() {
    if (!form.value.name || !form.value.email) {
        toast.error('Completa todos los campos.')
        return
    }

    saving.value = true
    try {
        const { data } = await api.put('/profile', form.value)
        auth.user = data.user
        localStorage.setItem('user', JSON.stringify(data.user))
        toast.success('Perfil actualizado correctamente.')
    } catch (e) {
        toast.error(e.response?.data?.message || 'Error al actualizar el perfil.')
    } finally {
        saving.value = false
    }
}

async function handleChangePassword() {
    if (!passwords.value.current || !passwords.value.new) {
        toast.error('Completa todos los campos de contraseña.')
        return
    }

    if (passwords.value.new !== passwords.value.confirmation) {
        toast.error('Las contraseñas nuevas no coinciden.')
        return
    }

    changingPassword.value = true
    try {
        await api.put('/profile/password', {
            current_password:      passwords.value.current,
            password:              passwords.value.new,
            password_confirmation: passwords.value.confirmation,
        })
        toast.success('Contraseña cambiada correctamente.')
        passwords.value = { current: '', new: '', confirmation: '' }
    } catch (e) {
        toast.error(e.response?.data?.message || 'Error al cambiar la contraseña.')
    } finally {
        changingPassword.value = false
    }
}
</script>