<template>
  <div class="card card-prioridad-overlay">
    <div class="image-container">
      <div class="prioridad-overlay" :style="{ backgroundColor: prioridad_color }"></div> 
      <img :src="image" alt="Task Image" class="task-image" />
      
    </div>
      
    <div class="content">
      <h2 class="title">{{ title }}</h2>
      <p class="info">Tickets asignados: {{ tickets }}</p>

      <div class="progress-container">
        <div class="progress-header">
          <span>Progreso</span>
          <span class="progress-text">{{ progress }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }">
            <div class="progress-circle"></div>
          </div>
        </div>
      </div>

      <div class="time-remaining">
        <div>
          <span class="clock-icon">⏳</span>
          <span :style="{ color: progress === 100 ? 'green' : remainingDays < 0 ? '#ba0000' : remainingDays === 0 ? '#008080' : '#666', fontWeight: '550' }">
            {{ progress === 100 ? 'Pauta completada' : remainingDays < 0 ? 'Pauta retrasada' : remainingDays === 0 ? 'Hoy' : remainingDays + ' Día(s) restante(s)' }}
          </span>
        </div>
        <div class="user-list">
          <img
            v-for="(user, index) in users"
            :key="index"
            :src="user"
            class="user-avatar"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    image: String,
    title: String,
    tickets: Number,
    progress: Number,
    remainingDays: [Number, String],
    users: Array,
    prioridad: Number,
    prioridad_color: String
  }
};
</script>

<style scoped>
.card {
  width: 260px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  font-family: Arial, sans-serif;
}

.image-container {
  width: 100%;
  position: relative;
  
}

.task-image {
  width: 100%; /* Changed from 300px to 100% */
  height: 120px; /* You might want to adjust this or use aspect-ratio */
  object-fit: cover;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.content {
  padding-left: 17px;
  padding-right: 17px;
  padding-bottom: 15px;
}

.title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
}

.info {
  color: #555;
  font-size: 13px;
}

.progress-container {
  margin-top: 10px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #444;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e0e0e0;
  border-radius: 4px;
  position: relative;
  margin-top: 4px;
}

.progress-fill {
  height: 6px;
  background: blue;
  border-radius: 4px;
  position: relative;
  transition: width 0.3s ease-in-out;
}

.progress-circle {
  width: 12px;
  height: 12px;
  background: blue;
  border-radius: 50%;
  position: absolute;
  top: -3px;
  right: -6px;
}

.time-remaining {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  font-size: 13px;
  color: #666;
}

.clock-icon {
  margin-right: 6px;
}

.user-list {
  display: flex;
}

.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid white;
  margin-right: -8px;
}

.prioridad-overlay {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 26px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  z-index: 2;
  opacity: 1;
}

.alert {
  background-color: #fff3cd;
  border-color: #ffeeba;
  color: #856404;
  padding: 8px;
  border-radius: 4px;
  margin-top: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
}

.alert-text {
  margin-left: 4px;
}
</style>