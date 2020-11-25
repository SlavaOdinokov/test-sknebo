<template>
  <div class="ymap">
    <yandex-map
      @click="onClick"
      :settings="settings"
      :coords="COORDS"
      zoom="11"
      style="width: 100%; height: 100vh;"
    >
      <ymap-marker
        :coords="COORDS"
        marker-id="123"
        :balloon-template="balloonTemplate"
      />
      <ymap-marker
        @click="onClick"
        :coords="COORDS_POLYGON"
        marker-id="1234"
        marker-type="polygon"
        :markerFill="{color: '#e7e7e7', opacity: .4}"
      />
    </yandex-map>
  </div>
</template>

<script>
  import { yandexMap, ymapMarker } from 'vue-yandex-maps'
  import { mapActions, mapGetters } from 'vuex'

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
        }
      }
    },
    computed: {
      ...mapGetters([
        'COORDS',
        'ADDRESS',
        'COORDS_POLYGON'
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
      onClick(e) {
        this.GET_NEW_COORDS(e.get('coords'))
        this.GET_ADDRESS({ lat: this.COORDS[0], long: this.COORDS[1] })
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
