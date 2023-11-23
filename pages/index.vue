<template>
  <div id="slider" :class="{
    'slider-open': isCardSliderOpen,
  }" class="absolute bottom-0 left-0 p-4 w-screen z-50 bg-white">
    <button class="relative -translate-x-1/2 left-1/2 w-10 h-10 top-[-2rem] bg-[#ff6029] rounded-lg p-1 cursor-pointer shadow-md
        flex justify-center items-center
        " @click="toggleCardSlider()">
      <svg class="transform transition-transform duration-500" :class="{
        'rotate-180': isCardSliderOpen,
      }" viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M8 13.8599L10.87 10.8C11.0125 10.6416 11.1868 10.5149 11.3815 10.4282C11.5761 10.3415 11.7869 10.2966 12 10.2966C12.2131 10.2966 12.4239 10.3415 12.6185 10.4282C12.8132 10.5149 12.9875 10.6416 13.13 10.8L16 13.8599"
            stroke="#FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          <path
            d="M3 7.41992L3 17.4199C3 19.6291 4.79086 21.4199 7 21.4199H17C19.2091 21.4199 21 19.6291 21 17.4199V7.41992C21 5.21078 19.2091 3.41992 17 3.41992H7C4.79086 3.41992 3 5.21078 3 7.41992Z"
            stroke="#FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        </g>
      </svg>
    </button>
    <div class="flex flex-col gap-2 relative">
      <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 mb-4">
        <li class="me-2">
          <a href="/" aria-current="page"
            class="inline-block p-4 rounded-t-lg  hover:text-gray-600 hover:bg-gray-50"
            :class="{
              'text-[#ff6029] bg-gray-100': $route.path === '/',
            }"
            >
            Inicio
          </a>
        </li>
        <li class="me-2">
          <a href="/heatmap" class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50"
            :class="{
              'text-[#ff6029] bg-gray-100': $route.path === '/heatmap',
            }"
          >
            Mapa de calor
          </a>
        </li>
      </ul>
    </div>
    <div class="flex flex-col gap-2 relative">
      <div class="flex flex-col gap-2 mb-4">
        <span class="text-xl font-bold tracking-tight text-gray-900">
          Crímenes en la CDMX -
          <span class="text-normal font-medium text-gray-500 mb-2">
            Equipo 17 - Prototype Day BEDU 2023
          </span>
        </span>
        <span class="font-normal text-gray-700 text-base">
          Selecciona un punto en el mapa para ver los crímenes en la zona
        </span>
      </div>
      <div class="grid grid-cols-12 gap-4">
        <select v-model="filter.mes" @change="getMoreCrimes()"
          class="col-span-4 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2">
          <option selected :value="null">Mes</option>
          <template v-for="(mes, index) in mesesList">
            <option :value="mes">{{ mes }}</option>
          </template>
        </select>
        <select v-model="filter.categoria" @change="getMoreCrimes()"
          class="col-span-4 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2">
          <option selected :value="null">Categoría</option>
          <template v-for="(categoria, index) in categoriasList">
            <option :value="categoria">{{ categoria }}</option>
          </template>
        </select> <select v-model="filter.delito" @change="getMoreCrimes()"
          class="col-span-4 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2">
          <option selected :value="null">Delito</option>
          <template v-for="(delito, index) in delitosList">
            <option :value="delito">{{ delito }}</option>
          </template>
        </select>
        <select v-model="filter.radio" @change="getMoreCrimes()"
          class="col-span-4 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2">
          <option selected :value="null">Radio</option>
          <template v-for="(radio, index) in radioList">
            <option :value="radio">{{ radio }} km</option>
          </template>
        </select>
        <select v-model="filter.total" @change="getMoreCrimes()"
          class="col-span-4 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2">
          <option selected :value="null">Total</option>
          <template v-for="(total, index) in totalList">
            <option :value="total">{{ total }} crímenes</option>
          </template>
        </select>
      </div>
      <div class="grid grid-cols-12 mt-2">
        <span class="col-span-12">
          Resultados encontrados: {{ crimenes.response.length }}
        </span>
      </div>
      <img class="absolute bottom-0 right-0 w-20" src="/img/bedu_logo.png" alt="">
    </div>
  </div>
  <div id="mimapa" class="z-10"></div>
</template>

<script setup>
import { onMounted } from 'vue';

let crimenes = ref({
  response: [],
  loading: false,
  loaded: false,
});

let cordenadasSeleccionadas = ref({
  latitud: 0,
  longitud: 0,
});

let filter = ref({
  mes: null,
  categoria: null,
  delito: null,
  radio: 2,
  total: 1000,
});

let mesesList = ref([
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]);

let delitosList = ref([]);
let categoriasList = ref([]);
let radioList = ref([
  1, 2, 3, 4, 5
]);
let totalList = ref([
  100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,
  2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000
]);

let isCardSliderOpen = ref(false);

let map = null;
let grupos = null;

const fetchCrimenes = async () => {
  crimenes.value.loading = true;
  await useAPI('/crimenes', {
    method: 'GET',
    params: {
      latitud: cordenadasSeleccionadas.value.latitud,
      longitud: cordenadasSeleccionadas.value.longitud,
      mes: filter.value.mes,
      categoria: filter.value.categoria,
      delito: filter.value.delito,
      radio: filter.value.radio,
      total: filter.value.total,
    },
  })
    .then((response) => {
      crimenes.value.response = response.data;
    })
    .finally(() => {
      crimenes.value.loading = false;
      crimenes.value.loaded = true;
    });
}

const fetchFiltroDelitos = async () => {
  await useAPI('/filtros', {
    method: 'GET',
  })
    .then((response) => {
      categoriasList.value = response.categorias;
      delitosList.value = response.delitos;
    });
}

const createMap = () => {

  let token = 'pk.eyJ1IjoiZ294dGhlciIsImEiOiJjbHA3cHVhZHMxeG50MmtucjMxanZyN3d5In0.lugCuukUHWJcxsm5PuqHfg';
  map = L.map('mimapa').setView([
    19.435702654244952, -99.14395707265346
  ], 15);

  L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${token}`, {
    maxZoom: 22,
    attribution: 'Datos del mapa de &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>, ' + '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imágenes © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
  }).addTo(map);

  var marker;
  map.on('click', function (e) {
    if (marker) {
      map.removeLayer(marker);
    }
    marker = L.marker(e.latlng).addTo(map);
    marker._icon.style.filter = "hue-rotate(120deg)"
    marker.bindPopup(`
      <div class="flex flex-col gap-2">
        <div class="flex flex-col gap-1 border-b">
          <span class="text-base font-semibols tracking-tight text-gray-900">
            Punto seleccionado
          </span>
          <span class="text-basetracking-tight text-gray-900">
            ${e.latlng.lat}, ${e.latlng.lng}
          </span>
        </div>
      </div>
    `).openPopup();
    cordenadasSeleccionadas.value.latitud = e.latlng.lat;
    cordenadasSeleccionadas.value.longitud = e.latlng.lng;
  });

}

const addMarkers = () => {
  grupos = L.markerClusterGroup();
  crimenes.value.response.forEach((crimen) => {
    var marker = L.marker([crimen.latitud, crimen.longitud]).bindPopup(`
      <div class="flex flex-col gap-2">
        <div class="flex flex-col gap-1 border-b">
          <span class="text-lg font-bold tracking-tight text-gray-900">
            ${crimen.delito}
          </span>
          <span
            class="text-sm font-medium text-gray-500 mb-2"
          >
            ${crimen.categoria} |  ${crimen.fecha_hecho} a las ${crimen.hora_hecho}
          </span>
        </div>
        <span class="font-normal text-gray-700 text-base">
         ${crimen.colonia_hecho}, ${crimen.alcaldia_hecho}, ${crimen.municipio_hecho} |</br>
          ${crimen.latitud}, ${crimen.longitud}
        </span>
      </div>
    `);
    grupos.addLayer(marker);
  });
  map.addLayer(grupos);
}

const removeMarkers = () => {
  if (grupos) {
    grupos.clearLayers();
  }
}

const toggleCardSlider = () => {
  isCardSliderOpen.value = !isCardSliderOpen.value;
}

const getMoreCrimes = async () => {
  await removeMarkers();
  await fetchCrimenes();
  await addMarkers();
}

watch(
  () => cordenadasSeleccionadas.value.latitud,
  (n, o) => {
    getMoreCrimes();
  }
);

onMounted(() => {
  fetchFiltroDelitos();
  createMap();
});

</script>

<style  scoped>
#mimapa {
  height: calc(100vh - 10rem);
  position: relative;
}

#slider {
  height: 10rem;
  transition: height 0.2s ease-out;
}

#slider.slider-open {
  height: 50vh;
  transition: height 0.3s ease-in;
}


/**
#mimapa:hover::after {
  content: "Selecciona un punto en el mapa";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 1.5rem;
  text-shadow: 0 0 10px black;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.2);
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}
*/
</style>