<template>
	<v-container fluid class="dashboard-layout pa-2"> <!-- Changed pa-4 to pa-2 -->
		<v-row class="fill-height" no-gutters>
			<!-- COLUMNA IZQUIERDA (Agenda, Notis, Tickets, Resumen) -->
			<v-col cols="12" md="8" class="h-100"> <!-- Removed pa-2 -->
				<div class="d-flex flex-column h-100">
					<!-- FILA SUPERIOR -->
					<div class="d-flex flex-grow-1 flex-wrap" style="min-height: 65%; max-height: 65%;"> <!-- Removed mb-2 -->
						<div class="pa-2 h-100" :class="$vuetify.display.mdAndUp ? 'w-50' : 'w-100'">
							<CalendarioCard />
						</div>
						<div class="pa-2 h-100" :class="$vuetify.display.mdAndUp ? 'w-50' : 'w-100'">
							<CardNotificaciones />
						</div>
					</div>

					<!-- FILA INFERIOR -->
					<div class="d-flex flex-grow-1 flex-wrap" style="min-height: 0; max-height: 65%;">
						<div class=" h-100 d-flex flex-column" :class="$vuetify.display.mdAndUp ? 'w-50' : 'w-100'">
							<div class="d-flex flex-column flex-grow-1 justify-center align-center" style="gap: 16px; padding-top: 10px; padding-bottom: 10px;">
								<v-btn rounded="xl" elevation="2"
									style="background-color: #50D2A0; color: white; text-transform: none; width: 95%; flex-grow: 1;"
									class="pa-3"
									@click="showCreateTicketDialog = true">
									<div class="d-flex align-center justify-start w-100">
										<v-avatar color="white" size="50" class="mr-3">
											<v-icon color="#50D2A0" size="30">mdi-plus</v-icon>
										</v-avatar>
										<div class="text-left" style="font-size: 1.5rem; line-height: 1.2;">
											<div style="font-weight: bold;">Nuevo</div>
											<div style="font-weight: bold;">Ticket</div>
										</div>
									</div>
								</v-btn>
								<v-btn rounded="xl" elevation="2"
									style="background-color: #389A8E; color: white; text-transform: none; width: 95%; flex-grow: 1;"
									class="pa-3"
									@click="showCreatePautaDialog = true">
									<div class="d-flex align-center justify-start w-100 ">
										<v-avatar color="white" size="50" class="mr-3">
											<v-icon color="#389A8E" size="30">mdi-plus</v-icon>
										</v-avatar>
										<div class="text-left" style="font-size: 1.5rem; line-height: 1.2;">
											<div style="font-weight: bold;">Nueva</div>
											<div style="font-weight: bold;">Pauta</div>
										</div>
									</div>
								</v-btn>
							</div>
						</div>
						<div class="pa-2 h-100 d-flex flex-column" :class="$vuetify.display.mdAndUp ? 'w-50' : 'w-100'">
							<ResumenTicketsAdmin/>
						</div>
					</div>
				</div>
			</v-col>

			<!-- COLUMNA DERECHA: Lista de Pautas -->
			<v-col cols="12" md="4" class="h-100 pauta-list-column"> 
				<div class="pa-2 h-100 d-flex flex-column">
					<div v-if="pautasLoading" class="d-flex justify-center align-center flex-grow-1">
						<v-progress-circular indeterminate color="primary"></v-progress-circular>
					</div>
					<div v-else-if="pautasError" class="d-flex justify-center align-center flex-grow-1 pa-4">
						<v-alert type="error" dense elevation="2" prominent>
							Error al cargar las pautas: {{ pautasError }}
						</v-alert>
					</div>
					<div v-else-if="pautasList.length > 0" class="pauta-list-container flex-grow-1">
						<CardPauta 
							v-for="pauta in pautasList" 
							:key="pauta.id"
							:image="pauta.imagen"
							:title="pauta.titulo"
							:tickets="pauta.tickets" 
							:progress="pauta.progress"
							:remainingDays="pauta.remainingDays"
							:users="pauta.users"
							:prioridad_color="pauta.prioridad_color"
							class="mb-3 full-width-card"
							@click="goToPautaDetails(pauta)"
						/>
					</div>
					<div v-else class="no-pautas-placeholder flex-grow-1">
						<p class="placeholder-text">No hay pautas activas.</p>
					</div>
				</div>
			</v-col>
		</v-row>

		<!-- <v-dialog v-model="showTicketFullDialog" max-width="800"> -->
			<!-- <TicketFull v-if="selectedTicketFull" :ticket="selectedTicketFull" @close-modal="closeTicketFull" /> -->
		<!-- </v-dialog> -->

		<!-- Dialog for Creating Ticket -->
		<v-dialog v-model="showCreateTicketDialog" max-width="800px">
			<FormTicket @close-dialog="handleCloseTicketDialog" @ticket-created="handleTicketCreated" />
		</v-dialog>

		<!-- Dialog for Creating Pauta -->
		<v-dialog v-model="showCreatePautaDialog" max-width="600px">
			<FormPauta @close-dialog="handleClosePautaDialog" @pauta-created="handlePautaCreated" />
		</v-dialog>

	</v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Added import
import CalendarioCard from '@/components/CalendarioCard.vue';
import CardNotificaciones from '@/components/CardNotificaciones.vue';
import ResumenTicketsAdmin from '@/components/ResumentTicketsAdmin.vue';
import FormTicket from '@/components/forms/FormTicket.vue';
import FormPauta from '@/components/forms/FormPauta.vue';
import CardPauta from '@/components/CardPauta.vue';
import defaultImage from '@/assets/default-image.png';
import axios from 'axios';

const router = useRouter(); // Initialized router

const pautasList = ref([]);
const pautasLoading = ref(true);
const pautasError = ref(null);

const showCreateTicketDialog = ref(false);
const showCreatePautaDialog = ref(false);

const handleCloseTicketDialog = () => {
	console.log('Attempting to close Ticket dialog');
	showCreateTicketDialog.value = false;
};

const handleClosePautaDialog = () => {
	console.log('Attempting to close Pauta dialog');
	showCreatePautaDialog.value = false;
};

const handleTicketCreated = () => {
	showCreateTicketDialog.value = false;
	console.log("Ticket created, refresh data if needed.");
	// Placeholder: Add logic to refresh ticket-related data if necessary
};

const handlePautaCreated = async () => {
	showCreatePautaDialog.value = false;
	console.log("Pauta created, refreshing pauta list.");
	await fetchPautasList();
};

const goToPautaDetails = (pauta) => {
	router.push({ path: '/tickets-pautas', query: { id: pauta.id } });
};

const fetchPautasList = async () => {
	pautasLoading.value = true;
	pautasError.value = null;
	try {
		const response = await axios.get('/api/pautas');
		pautasList.value = response.data.map(apiPauta => {
			const totalTickets = apiPauta.total_tickets || 0;
			const ticketsCompletados = apiPauta.tickets_completados || 0;
			let progress = 0;
			if (totalTickets > 0) {
				progress = Math.round((ticketsCompletados / totalTickets) * 100);
			}

			return {
				// Existing properties being used or passed
				id: apiPauta.id,
				imagen: apiPauta.imagen && apiPauta.imagen.trim() !== '' ? apiPauta.imagen : defaultImage,
				titulo: apiPauta.titulo,
				descripcion: apiPauta.descripcion, // Retained though not a direct CardPauta prop
				fecha_creacion: apiPauta.fecha_creacion, // Retained
				estado_actual: apiPauta.estado_actual, // Retained

				// Props for CardPauta
				tickets: totalTickets, // For 'Tickets asignados'
				progress: progress,
				remainingDays: apiPauta.dias_restantes, // For 'Días restantes'
				users: apiPauta.users || [], // For user avatars
				prioridad_color: apiPauta.prioridad_color // For the priority indicator bar
			};
		});
	} catch (err) {
		console.error('Error al cargar la lista de pautas:', err);
		pautasError.value = err.message || 'Ocurrió un error al cargar las pautas.';
		pautasList.value = [];
	} finally {
		pautasLoading.value = false;
	}
};

onMounted(async () => {
	await fetchPautasList();
});
</script>

<style scoped>
.dashboard-layout {
	height: 100vh;
	background-color: #F3F4F8;
	overflow: hidden;
}

.h-100 {
	height: 100%;
}

.w-50 {
	width: 50% !important;
}

.w-100 {
	width: 100% !important;
}

.ticket-activo {
	/* Ensures this column tries to maintain its height if content is less */
	display: flex;
	flex-direction: column;
}

.ticket-activo-null {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	/* Take full height of its container */
	border: 2px dashed #ccc;
	border-radius: 8px;
	background-color: #f9f9f9;
}

.placeholder-text {
	font-size: 1.1rem;
	color: #777;
	text-align: center;
	padding: 20px;
}

.pauta-list-column {
	display: flex;
	flex-direction: column;
}

.pauta-list-container {
	overflow-y: auto; /* Enables vertical scrolling */
	border-radius: 8px; /* Rounded corners */
	padding: 8px; /* Some internal padding */
	background-color: #F3F4F8; /* Changed from #FFFFFF */
	flex-grow: 1;
	max-height: 100%; /* Ensure it doesn't overflow its parent column */
}

.no-pautas-placeholder {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	border: 2px dashed #ccc;
	border-radius: 8px;
	background-color: #F3F4F8; /* Changed from #f9f9f9 */
	flex-grow: 1;
}

/* Custom scrollbar styling (optional, WebKit browsers) */
.pauta-list-container::-webkit-scrollbar {
	width: 8px;
}

.pauta-list-container::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 10px;
}

.pauta-list-container::-webkit-scrollbar-thumb {
	background: #888;
	border-radius: 10px;
}

.pauta-list-container::-webkit-scrollbar-thumb:hover {
	background: #555;
}

.full-width-card {
	width: 100%;
}
</style>
