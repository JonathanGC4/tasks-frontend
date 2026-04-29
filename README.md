# 🎨 Task Manager — Frontend Vue

> Interfaz de usuario para el sistema de gestión de tareas, construida con Vue 3 y Tailwind CSS.

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![Pinia](https://img.shields.io/badge/Pinia-FFD859?style=for-the-badge&logo=vue.js&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

---

## 📌 Descripción

SPA (Single Page Application) que consume la API REST de Task Manager. Presenta vistas diferenciadas según el rol del usuario: el **Admin** gestiona employees y asigna tareas, el **Employee** visualiza y actualiza el estado de sus tareas asignadas.

---

## ✨ Características

- 🔐 **Autenticación** con tokens persistidos en localStorage
- 👥 **Vistas por rol**: Dashboard diferente para Admin y Employee
- ✅ **CRUD de tareas** con modal de creación/edición
- 👤 **Gestión de employees** (solo Admin)
- 🔍 **Filtros** por estado y paginación
- 🌙 **Modo oscuro** con persistencia entre sesiones
- 🔔 **Notificaciones toast** animadas con barra de progreso
- 👤 **Perfil de usuario** con edición de datos y cambio de contraseña
- 🛡️ **Guards de navegación** para proteger rutas privadas y de admin
- 📱 Diseño **responsive** con Tailwind CSS

---

## 🛠️ Stack

| Tecnología | Versión | Uso |
|---|---|---|
| Vue 3 | 3.x | Framework principal (Composition API) |
| Pinia | 2.x | Manejo de estado global |
| Vue Router | 4.x | Navegación SPA y guards |
| Axios | 1.x | Cliente HTTP con interceptores |
| Tailwind CSS | 3.x | Estilos utilitarios |
| Vite | 5.x | Bundler y servidor de desarrollo |

---

## 🗂️ Estructura del proyecto

```
task-manager-front/
└── src/
    ├── plugins/
    │   └── axios.js                    # Config Axios + interceptores
    ├── stores/
    │   ├── auth.js                     # Usuario, token, rol
    │   ├── tasks.js                    # CRUD de tareas
    │   ├── users.js                    # Gestión de employees
    │   ├── toast.js                    # Notificaciones
    │   └── theme.js                    # Dark mode
    ├── router/
    │   └── index.js                    # Rutas + guards
    ├── views/
    │   ├── LoginView.vue               # Inicio de sesión
    │   ├── DashboardView.vue           # Vista principal (admin/employee)
    │   ├── ProfileView.vue             # Perfil de usuario
    │   └── admin/
    │       └── EmployeesView.vue       # Gestión de employees
    └── components/
        └── ToastNotification.vue       # Sistema de notificaciones
```

---

## ⚙️ Instalación

### Requisitos previos

- Node.js 18+
- npm 9+
- Backend corriendo en `http://127.0.0.1:8000`

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/task-manager-front.git
cd task-manager-front

# 2. Instalar dependencias
npm install

# 3. Levantar servidor de desarrollo
npm run dev
```

App disponible en `http://localhost:5173`

### Build para producción

```bash
npm run build
```

---

## 🔌 Configuración de la API

La URL base de la API se configura en `src/plugins/axios.js`:

```js
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
})
```

Cámbiala si tu backend corre en otro puerto o dominio.

---

## 📱 Vistas de la aplicación

### Login
- Formulario de inicio de sesión
- Redirección automática si ya hay sesión activa
- Mensajes de error con toast

### Dashboard — Admin
- Estadísticas: total, pendientes y completadas
- Lista completa de todas las tareas con el employee asignado
- Filtros por estado
- Modal para crear y asignar tareas a employees
- Botones de editar y eliminar tarea
- Link a gestión de employees

### Dashboard — Employee
- Solo ve sus tareas asignadas
- Puede marcar tareas como completadas o pendientes con un clic
- Sin botones de editar ni eliminar

### Employees (solo Admin)
- Lista de employees con contador de tareas
- Modal para crear nuevos employees
- Eliminar employees

### Perfil
- Editar nombre y email
- Cambiar contraseña
- Avatar con iniciales del nombre

---

## 🔒 Seguridad en el frontend

### Interceptor de token
Axios agrega automáticamente el token en cada request:

```js
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})
```

### Interceptor de errores
Si el backend devuelve 401, limpia la sesión y redirige al login:

```js
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)
```

### Guards de navegación
```
/dashboard       → requiresAuth → redirige a /login si no hay sesión
/admin/employees → requiresAdmin → redirige a /dashboard si no es admin
/login           → guest → redirige a /dashboard si ya hay sesión
```

---

## 🎨 Personalización del tema

### Dark mode
El modo oscuro se activa desde el navbar y persiste en `localStorage`. Usa la estrategia `class` de Tailwind:

```js
// stores/theme.js
function toggle() {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}
```

---

## 🔔 Sistema de notificaciones

Los toasts se usan desde cualquier vista importando el store:

```js
import { useToastStore } from '../stores/toast'
const toast = useToastStore()

toast.success('Tarea creada correctamente.')
toast.error('Error al guardar.')
toast.info('Sesión cerrada.')
toast.warning('Campos incompletos.')
```

Cada toast desaparece automáticamente a los 3 segundos y tiene barra de progreso animada.

---

## 🔑 Roles en el frontend

| Elemento | Admin | Employee |
|----------|-------|----------|
| Ver todas las tareas | ✅ | ❌ |
| Botón "Nueva tarea" | ✅ | ❌ |
| Selector de employee en modal | ✅ | ❌ |
| Botón editar tarea | ✅ | ❌ |
| Botón eliminar tarea | ✅ | ❌ |
| Marcar tarea completada | ✅ | ✅ |
| Link a Employees | ✅ | ❌ |
| Badge de rol en navbar | ✅ Admin | ✅ Employee |

---

## 🧩 Stores de Pinia

| Store | Responsabilidad |
|-------|----------------|
| `auth` | Usuario, token, rol, login, logout |
| `tasks` | Fetch, crear, actualizar, eliminar tareas |
| `users` | Fetch, crear, eliminar employees |
| `toast` | Cola de notificaciones con auto-dismiss |
| `theme` | Toggle dark mode con persistencia |

---

## 👨‍💻 Autor

Desarrollado como proyecto de portafolio.

---

## 📄 Licencia

MIT
