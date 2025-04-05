<template>
    <div class="card">      
      <div class="prioridad"></div>
      <div class="image-container">
        <v-img src="@/assets/imagenAdidas.png" alt="Task Image" class="task-image" />
        
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
  
        <!-- Tiempo restante -->
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
    data() {
      return {
        image: "https://via.placeholder.com/300",
        title: "PROMO ADIDAS JUNIO 2025",
        tickets: 3,
        progress: 75, // Cambia este valor para ver cómo se mueve el círculo
        remainingDays: 3,
        users: [
          "https://randomuser.me/api/portraits/women/1.jpg",
          "https://randomuser.me/api/portraits/men/2.jpg",
          "https://randomuser.me/api/portraits/women/3.jpg",
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  .card {
    width: 40% !important;
    margin-left: 6%;    
    width: 350px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    font-family: Arial, sans-serif;  
  }
  
  .image-container {
    position: relative;
    width: 90%;  
    margin-left: 5%;
    margin-top: 4%;
  }
  
  .task-image {
    width: 100%;
    object-fit: cover;
  }
  
  .overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.2);
  }
  
  .content {
    padding: 16px;
  }
  
  .title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  .info {
    color: #555;
    font-size: 14px;
  }
  
  .progress-container {
    margin-top: 12px;
  }
  
  .progress-header {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
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
    margin-top: 12px;
    font-size: 14px;
    color: #666;
    gap: 29%;
  }
  
  .clock-icon {
    margin-right: 6px;
  }
  
  .user-list {
    margin-left: 10%;
    display: flex;
    margin-top: 10px;
  }
  
  .user-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid white;
    margin-right: -8px;
  }
  .prioridad {
    margin-top: 4%;
    margin-left: 5%;
    width: 20%;
    height: 10px;
    background: #2575fc; /* Color azul */
    border-radius: 15px; /* Bordes redondeados */  
  }
  </style>
  