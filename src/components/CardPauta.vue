<template>
  <div class="card">      
    <div class="prioridad"></div>
    <div class="image-container">
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
          <span>{{ remainingDays }} Días restantes</span>
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
    users: Array
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
}

.task-image {
  width: 100%;
  object-fit: cover;
}

.content {
  padding: 12px;
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

.prioridad {
  margin: 8px;
  width: 25%;
  height: 8px;
  background: #2575fc;
  border-radius: 15px;
}
</style>
