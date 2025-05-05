<template>    
    <v-dialog v-model="showForm" max-width="500">
       <FormPauta 
         @close="toggleForm" 
         @save="handleSavePauta" 
       />
     </v-dialog>
     <v-row class="mt-5 ml-3" align="center" justify="space-between">
     <v-col cols="20" sm="13" md="4">
       <v-text-field
         density="compact"
         variant="outlined"
         v-model="nombre"
         class="buscador-field"
         label="Buscar pauta"      
       /> 
     </v-col>
    
     <v-col cols="6" sm="6" md="2">
       <v-text-field
         density="compact"
         variant="outlined"
         v-model="categoria"
         class="categoria-field"
         label="Categoría"      
       />
     </v-col>
   
     <v-col cols="6" sm="6" md="2">
       <v-text-field
         density="compact"
         variant="outlined"
         v-model="orden"
         class="Ordenar-field"
         label="Ordenar por:"
       />
     </v-col>
   </v-row>
   <h1>Pautas</h1>
   <v-btn @click="toggleForm" variant="outlined" class="btnAddPauta">Nueva pauta</v-btn>
       <div class="card-grid">
         <TaskCard
           v-for="(task, index) in tasks"
           :key="index"
           :image="task.image"
           :title="task.title"
           :tickets="task.tickets"
           :progress="task.progress"
           :remainingDays="task.remainingDays"
           :users="task.users"
         />
       </div>
     </template>
     
     <script>
     import FormPauta from '../components/forms/FormPauta.vue';
     import TaskCard from '../components/CardPauta.vue';
     import imagenAdidas from '@/assets/imagenAdidas.png';  
     export default {
       components: { TaskCard, FormPauta },
       data() {
         return {
           showForm: false,
           tasks: [
             {
               image: imagenAdidas,
               title: 'Promo Adidas Junio 2025',
               tickets: 3,
               progress: 75,
               remainingDays: 3,
               users: [
                 'https://randomuser.me/api/portraits/women/1.jpg',
                 'https://randomuser.me/api/portraits/men/2.jpg',
               ]
             },
             {
               image: imagenAdidas,
               title: 'Publicación MeraliCakes',
               tickets: 2,
               progress: 25,
               remainingDays: 1,
               users: [
                 'https://randomuser.me/api/portraits/women/3.jpg',
                 'https://randomuser.me/api/portraits/men/4.jpg',
               ]
             },
             {
               image: imagenAdidas,
               title: 'Banner Web Page',
               tickets: 1,
               progress: 50,
               remainingDays: 4,
               users: [
                 'https://randomuser.me/api/portraits/men/5.jpg',
               ]
             },
             {
               image: imagenAdidas,
               title: 'Campaña Epson',
               tickets: 2,
               progress: 60,
               remainingDays: 2,
               users: [
                 'https://randomuser.me/api/portraits/women/6.jpg',
                 'https://randomuser.me/api/portraits/women/7.jpg',
               ]
             }
           ]
         };
       },methods: {
       toggleForm() {
         this.showForm = !this.showForm;
       }
     }
     };
     </script>
     
     <style>
     .btnAddPauta{
       position: fixed;
       bottom: 80px;
       right: 40px;
       z-index: 999;
       background-color: #B5179E;
       color: white;
       border-radius: 15px;
     }
     .card-grid {
       display: grid;
       grid-template-columns: repeat(4, 1fr);
       gap: 20px;
       padding: 20px;
       justify-items: center;
     }
     .buscador-field{
       margin-left: 1vw;
     }
     .categoria-field{
           margin-left: 100% !important;
           margin-right: -100% !important;
     }
     .Ordenar-field{
           margin-left: -10% !important;
           margin-right: 20% !important;    
     }
     @media (max-width: 1024px) {
       .card-grid {
         grid-template-columns: repeat(2, 1fr);
       }
       .categoria-field{
           margin-left: 0% !important;
           margin-right: 0% !important;
       }  
       .Ordenar-field{
           margin-left: 0% !important;
           margin-right: 0% !important;    
     }
     .buscador-field{
       margin-left: 0vw;
     }
       
     }
     
     @media (max-width: 600px) {
       .card-grid {
         grid-template-columns: 1fr;
       }
       h1{
           margin-left: 6vw !important;
       }
     }
     h1{
       margin-left: 3vw;
     }
     </style>
     