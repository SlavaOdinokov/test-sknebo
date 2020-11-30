<template>
  <div class="ymap">
    <yandex-map
      @click="onClick"
      @map-was-initialized="initMapHandler"
      :settings="settings"
      :coords="COORDS"
      zoom="11"
      style="width: 100%; height: 100vh;"
    >
      <ymap-marker
        :coords="COORDS"
        marker-id="123"
        marker-type="placemark"
        :balloon-template="balloonTemplate"
      />
      <!-- <ymap-marker
        @click="onClick"
        :coords="COORDS_POLYGON"
        marker-id="1234"
        marker-type="polygon"
        :markerFill="{color: '#e7e7e7', opacity: .4}"
      /> -->
    </yandex-map>
  </div>
</template>

<script>
  import { yandexMap, ymapMarker, loadYmap } from 'vue-yandex-maps'
  import { mapActions, mapGetters } from 'vuex'
  import { mkadCoords } from '@/helpers/mkadCoords'

  export default {
    name: 'ymap',
    components: { yandexMap, ymapMarker },
    data() {
      return {
        settings: {
          apiKey: '5050011e-f8a4-4b8f-b989-98479f0acb4b',
          lang: 'ru_RU',
          coordorder: 'latlong',
          version: '2.1'
        },
        ymaps: null,
        ymapsInstance: null,
        polygon: null,
        prevLine: null,
        prevRoute: null
      }
    },
    computed: {
      ...mapGetters([
        'COORDS',
        'ADDRESS'
      ]),
      balloonTemplate() {
        return `
          <h1>Hi, everyone!</h1>
          <p>${this.ADDRESS}</p>
        `
      }
    },
    methods: {
      ...mapActions([
        'GET_ADDRESS',
        'GET_NEW_COORDS'
      ]),
      async initMapHandler(map) {
        await loadYmap()
        this.ymapsInstance = map
        this.ymaps = window.ymaps

        const polygonGeometry = new this.ymaps.geometry.Polygon([ mkadCoords ])
        const polygonGeoObject = new this.ymaps.GeoObject({ geometry: polygonGeometry }, { opacity: .5 })
        map.geoObjects.add(polygonGeoObject)
        this.polygon = polygonGeoObject

        this.polygon.events.add('click', this.onClick)
      },
      onClick(e) {
        this.GET_NEW_COORDS(e.get('coords'))
        this.GET_ADDRESS({ lat: this.COORDS[0], long: this.COORDS[1] })
        this.createRoute()
      },
      createRoute() {
        const indexClosestPoint = this.polygon.geometry.getClosest(this.COORDS).closestPointIndex

        this.ymaps.route(
          [ this.COORDS, mkadCoords[indexClosestPoint] ],
          { mapStateAutoApply: true }
        ).then(route => {
          this.ymapsInstance.geoObjects.remove(this.prevRoute)
          console.log(`Длина маршрута: ${Math.floor(route.getLength())} метров`)
          this.ymapsInstance.geoObjects.add(route)
          this.prevRoute = route
        })

        const polyline = new this.ymaps.Polyline([
          this.COORDS, mkadCoords[indexClosestPoint],
          ], {}, {
            draggable: false,
            strokeColor: '#000000',
            strokeWidth: 3,
            strokeStyle: '1 5',
        })

        this.ymapsInstance.geoObjects.remove(this.prevLine)
        this.prevLine = polyline
        this.ymapsInstance.geoObjects.add(polyline)
        // this.ymapsInstance.setBounds(polyline.geometry.getBounds())
      }
    },
    mounted() {
      this.GET_ADDRESS({ lat: this.COORDS[0], long: this.COORDS[1] })
    }
  }
</script>

<style lang="scss">
  .ymap {
    width: 100%;
    height: 100vh;
  }
</style>
