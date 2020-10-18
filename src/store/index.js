import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:3000/api/bikes',
  headers: {
    'Access-Control-Allow-Credentials': true
  }
})

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    async getBikes() {
      return await axiosInstance.get('/')
    },

    async createBike({}, payload) {
      try {
        await axiosInstance.post('/', payload)
      } catch (e) {
        console.log(e)
      }
    },

    async updateBike({}, payload) {
      try {
        return await axiosInstance.put('/', payload)
      } catch (e) {
        console.log(e)
      }
    },

    async startRent({}, payload) {
      try {
        await axiosInstance.post('/start-rent', payload)
      } catch (e) {
        console.log(e)
      }
    },

    async endRent({}, payload) {
      try {
        await axiosInstance.post('/end-rent', payload)
      } catch (e) {
        console.log(e)
      }
    },

    async deleteBike({}, id) {
      try {
        return await axiosInstance.delete('/', {params: {id}})
      } catch (e) {
        console.log(e)
      }
    }
  },
})
