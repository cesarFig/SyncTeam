<template>
  <v-navigation-drawer
    :model-value="true"
    permanent
    app
    :width="store.sidebarWidth"
    color="white"
  >
    <v-list density="compact" nav class="pt-0 pd-1">
      <v-list-item 
        @click="store.toggleSidebar" 
        class="mx-2 my-1 rounded-17" 
        :height="store.isMobile ? '48px' : '55px'"
      >
        <template v-slot:prepend>
          <v-icon color="grey-darken-1">
            {{ store.isCollapsed ? 'mdi-chevron-right' : 'mdi-chevron-left' }}
          </v-icon>
        </template>
      </v-list-item>
    </v-list>

    <v-list-item 
      class="d-flex flex-column align-center pb-6 pt-0" 
      v-if="!store.isCollapsed"
    >
       <v-avatar size="40" :style="{ backgroundColor: userColor }">
  <span class="text-white text-subtitle-2 font-weight-medium">
    {{ userInitials }}
  </span>
</v-avatar>
       <span class="text-h6 font-weight-medium mt-2">{{ usuario.nombre }}</span>
    </v-list-item>
    <v-list-item 
      class="d-flex justify-center py-6 pt-0" 
      v-else
    >
      <v-avatar size="35" :style="{ backgroundColor: userColor }">
  <span class="text-white text-subtitle-2 font-weight-medium">
    {{ userInitials }}
  </span>
</v-avatar>
    </v-list-item>
    
    <!-- Sidebar Menu Items -->
    <v-list density="compact" nav>
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :prepend-icon="item.icon"
        :value="item.title"
        :active="activeItem === item.title"
        @click="navigateTo(item.route)"
        class="mx-2 my-1 rounded-17"
        :class="{ 'bg-pucha': activeItem === item.title }"
        :height="store.isMobile ? '48px' : '55px'"
      >
        <template v-slot:prepend>
          <v-icon :color="activeItem === item.title ? 'white' : 'grey-darken-1'">
            {{ item.icon }}
          </v-icon>
        </template>
        <v-list-item-title
          v-if="!store.isCollapsed"
          :class="{
            'text-white': activeItem === item.title,
            'text-grey-darken-1': activeItem !== item.title
          }"
          class="text-body-1 font-weight-medium"
        >
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <v-divider class="my-2"></v-divider>
      <v-list-item 
        prepend-icon="mdi-logout" 
        @click="logout" 
        class="mx-2 my-1 rounded-17" 
        :height="store.isMobile ? '48px' : '55px'"
      >
        <template v-slot:prepend>
          <v-icon color="grey-darken-1">mdi-logout</v-icon>
        </template>
        <v-list-item-title 
          v-if="!store.isCollapsed" 
          class="text-body-1 text-grey-darken-1 font-weight-medium"
        >
          Cerrar sesión
        </v-list-item-title>
      </v-list-item>
      <div class="pa-4" v-if="!store.isCollapsed">
        <v-img 
          src="@/assets/logoSyncTeamHorizontal.png" 
          alt="logo" 
          height="25" 
          contain 
        />
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { useLayoutStore } from '@/stores/layout'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const usuario = JSON.parse(localStorage.getItem("usuario")) || {};
const userInitials = `${usuario.nombre?.charAt(0) || ''}${usuario.apellidos?.charAt(0) || ''}`.toUpperCase();

const userColor = generateColorFromString(`${usuario.nombre}${usuario.apellido}`);

function generateColorFromString(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 60%)`;
}

const store = useLayoutStore()
const activeItem = ref("Home")
const router = useRouter()

const menuItems = ref([
  { title: "Home", icon: "mdi-home", route: "/dashboard-admin" },
  { title: "Pautas y Tickets", icon: "mdi-ticket", route: "/tickets-admin" },
  { title: "Calendario", icon: "mdi-calendar", route: "/calendario-admin" },
  { title: "Equipo", icon: "mdi-account-group", route: "/equipo" },
  { title: "Notificaciones", icon: "mdi-bell", route: "/notificaciones" },
  { title: "Estadísticas", icon: "mdi-chart-bar", route: "/estadisticas-admin" },
  { title: "Ajustes", icon: "mdi-cog", route: "/ajustes" },
])

const navigateTo = (route) => {
  activeItem.value = route
  router.push(route)
}

const logout = () => {
  console.log("Cerrando sesión... ");
  router.push('/');
}
</script>

<style scoped>
.rounded-17 {
  border-radius: 17px;
}

.v-list-item {
  min-height: 55px;
  transition: all 0.3s ease;
}

.v-navigation-drawer {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1) !important;
}
</style>