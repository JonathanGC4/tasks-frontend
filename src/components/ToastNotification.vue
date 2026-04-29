<template>
    <teleport to="body">
        <div class="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-80">
            <transition-group name="toast">
                <div
                    v-for="toast in toasts"
                    :key="toast.id"
                    :class="[
                        'flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium cursor-pointer',
                        toast.type === 'success' ? 'bg-green-500' : '',
                        toast.type === 'error'   ? 'bg-red-500'   : '',
                        toast.type === 'info'    ? 'bg-indigo-500': '',
                        toast.type === 'warning' ? 'bg-yellow-500': '',
                    ]"
                    @click="remove(toast.id)"
                >
                    <!-- Ícono -->
                    <span class="text-lg flex-shrink-0">
                        {{ icons[toast.type] }}
                    </span>

                    <div class="flex-1">
                        <p v-if="toast.title" class="font-bold">{{ toast.title }}</p>
                        <p class="opacity-90">{{ toast.message }}</p>
                    </div>

                    <!-- Barra de progreso -->
                    <div class="absolute bottom-0 left-0 h-1 rounded-b-xl bg-white bg-opacity-40"
                        :style="{ width: toast.progress + '%', transition: 'width linear' }"
                    />
                </div>
            </transition-group>
        </div>
    </teleport>
</template>

<script setup>
import { useToastStore } from '../stores/toast'
import { storeToRefs } from 'pinia'

const toastStore = useToastStore()
const { toasts } = storeToRefs(toastStore)
const { remove } = toastStore

const icons = {
    success: '✅',
    error:   '❌',
    info:    'ℹ️',
    warning: '⚠️',
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}
.toast-enter-from {
    opacity: 0;
    transform: translateX(100%);
}
.toast-leave-to {
    opacity: 0;
    transform: translateX(100%);
}
</style>