// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app:{
    head: {
      "link": [
        {
          "rel": "stylesheet",
          "href": "https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
        },
        {
          "rel": "stylesheet",
          "href": "https://unpkg.com/leaflet.markercluster@1.1.0/dist/MarkerCluster.css"
        },
        {
          "rel": "stylesheet",
          "href": "https://unpkg.com/leaflet.markercluster@1.1.0/dist/MarkerCluster.Default.css"
        },
      ],
      "style": [],
      "script": [
        {
          "src": "https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
        },
        {
          "src": "https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.1.0/leaflet.markercluster.js"
        },
      ],
    }
  },
  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL,
    },
  },
  modules: ['@nuxtjs/tailwindcss']
})
