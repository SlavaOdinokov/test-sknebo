import axios from 'axios'

export default {
  GET_ADDRESS({commit}, {lat, long}) {
    return axios.get(`https://geocode-maps.yandex.ru/1.x/?apikey=5050011e-f8a4-4b8f-b989-98479f0acb4b&format=json&geocode=${long},${lat}`)
      .then(response => {
        const address = response.data.response.GeoObjectCollection.featureMember[0]
          .GeoObject.metaDataProperty.GeocoderMetaData.text
        console.log(`Адрес метки: ${address}`)
        commit('SET_ADDRESS', address)
        return address
      })
      .catch(error => {
        console.error(error)
        return error
      })
  }
}
