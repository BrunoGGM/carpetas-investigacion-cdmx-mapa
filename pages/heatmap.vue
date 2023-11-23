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
          Crimenes en la CDMX por alcaldía. Selecciona una alcaldía para ver el total de crímenes.
        </span>
      </div>
      <div class="grid grid-cols-12 mt-2">
        <span class="col-span-12">
          Resultados encontrados: {{ total }}
        </span>
      </div>
      <img class="absolute bottom-0 right-0 w-20" src="/img/bedu_logo.png" alt="">
    </div>
  </div>
  <div id="mimapa" class="z-10"></div>
</template>

<script setup>
import { onMounted } from 'vue';
import alcaldias from '/data/alcaldias.json';

let crimenes = ref({
  response: [],
  loading: false,
  loaded: false,
});

let total = ref(0);

let isCardSliderOpen = ref(false);

const fetchCrimenes = async () => {
  crimenes.value.loading = true;
  console.log('fetchCrimenes');
  await useAPI('/crimenes-heatmap', {
    method: 'GET',
    params: {
    },
  })
    .then((response) => {
      crimenes.value.response = response.data;
      alcaldias.features.forEach((alcaldia) => {
        let count = crimenes.value.response.find((crimen) => {
          return crimen.alcaldia_hecho == alcaldia.properties.nomgeo;
        }).count;
        alcaldia.properties.count = count;
      });
      total.value = response.total;
    })
    .finally(() => {
      crimenes.value.loading = false;
      crimenes.value.loaded = true;
    });
}
const toggleCardSlider = () => {
  isCardSliderOpen.value = !isCardSliderOpen.value;
}

onMounted(async () => {
  await fetchCrimenes();

  var map = L.map('mimapa').setView([
    19.40, -99.12
  ], 11);

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ294dGhlciIsImEiOiJjbHA3cHVhZHMxeG50MmtucjMxanZyN3d5In0.lugCuukUHWJcxsm5PuqHfg', {
    maxZoom: 25,
    attribution: 'Datos del mapa de &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>, ' + '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imágenes © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
  }).addTo(map);

  function getColor(d) {
    const segmentSize = 2000;

    if (d > 8 * segmentSize) {
      return '#800026';
    } else if (d > 6 * segmentSize) {
      return '#BD0026';
    } else if (d > 4 * segmentSize) {
      return '#E31A1C';
    } else if (d > 2 * segmentSize) {
      return '#FC4E2A';
    } else if (d > segmentSize) {
      return '#FD8D3C';
    } else if (d > 0.75 * segmentSize) {
      return '#FEB24C';
    } else if (d > 0.25 * segmentSize) {
      return '#FED976';
    } else {
      return '#FFEDB9';
    }
  }
  function style(feature) {
    return {
      fillColor: getColor(feature.properties.count),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.5,

    };
  }

  function onEachFeature(feature, layer) {
    layer.bindPopup('<h4>' + feature.properties.nomgeo + '</h4><h4> Crimenes: ' + feature.properties.count + '</h4>');
  }

  var geojson = L.geoJson(alcaldias, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);


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
</style>