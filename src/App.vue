<template>
  <div id="app">
    <h1>Awesome Bike Rental</h1>
    <section class="rent__form-section">
      <h2>🤑 Create new rent</h2>
      <div class="form__wrapper">
        <form class="rent__form" @submit.prevent="submitHandler">
          <div class="input__field">
            <label for="bike_name">Bike name</label>
            <input
                v-model="rentData.bikeName"
                type="text"
                id="bike_name"
                class="bike__name-input"
                placeholder="Ex. Cannondale S6"
                required
            >
          </div>
          <div class="input__field">
            <label for="bike__type">Bike type</label>
            <select
                v-model="rentData.bikeType"
                id="bike__type"
                class="bike__type-select"
                required
            >
              <option disabled value="">Choose type</option>
              <option>Custom</option>
              <option>Road</option>
              <option>Mountain</option>
              <option>Trekking</option>
              <option>Touring</option>
              <option>Cruiser</option>
            </select>
          </div>
          <div class="input__field">
            <label for="rent__price">Rent price</label>
            <input
                v-model="rentData.rentPrice"
                type="number"
                min="0"
                step="0.01"
                id="rent__price"
                placeholder="99.00"
                class="rent__price-input"
                required
            >
          </div>
          <button class="rent__form-btn" type="submit">Submit rent</button>
        </form>
      </div>
    </section>
    <section class="rented__bikes">
      <h2>🤩 Your rent (${{ rentedPrice.toFixed(2) }})</h2>
      <div class="card__wrapper"
           v-for="(bike, index) of rentedBikes"
           :key="bike._id"
      >
        <div class="card__main">
          <span>{{ bike.bikeName }} / </span>
          <span>{{ bike.bikeType }} / </span>
          <span>${{ bike.rentPrice }}</span>
        </div>
        <div class="card__buttons">
          <button class="cancel__rent-btn" @click="cancelRent(bike, index)">Cancel rent</button>
        </div>
      </div>
    </section>
    <section class="available__bikes">
      <h2>🚲 Available bicycles ({{ numberOfBikes }})</h2>
      <div class="card__wrapper"
           v-for="(bike, index) of availableBikes"
           :key="bike._id"
      >
        <div class="card__main">
          <span>{{ bike.bikeName }} / </span>
          <span>{{ bike.bikeType }} / </span>
          <span>${{ bike.rentPrice }} / </span>
          <div class="card__main-info" v-if="bike.lastRentTime">
            <span>🕐 Last rent duration: {{ bike.lastRentTime | time(bike.lastRentTime) }} / </span>
            <span>💵 Last rent price: {{ bike.lastRentPrice }}$</span>
          </div>
        </div>
        <div class="card__buttons">
          <button class="rent__bike-btn" @click="rentBike(bike, index)">Rent</button>
          <button class="delete__bike-btn" @click="deleteBike(bike._id)">Delete</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

export default {
  name: 'App',
  data: () => ({
    rentData: {
      bikeName: '',
      bikeType: '',
      rentPrice: 0
    },
    availableBikes: [],
    rentedBikes: [],
    rentedPrice: 0
  }),
  methods: {
    async submitHandler() {
      const formData = {
        bikeName: this.rentData.bikeName,
        bikeType: this.rentData.bikeType,
        rentPrice: this.rentData.rentPrice,
        rented: false
      }

      try {
        await this.$store.dispatch('createBike', formData)
        const bikes = await this.$store.dispatch('getBikes')
        this.availableBikes = bikes.data;

        this.rentData.bikeName = this.rentData.bikeType = ''
        this.rentData.rentPrice = null
      } catch (e) {
      }
    },

    async rentBike(bike, index) {

      const updateData = {
        id: bike._id
      }

      try {
        await this.$store.dispatch('startRent', updateData)

        const bikes = await this.$store.dispatch('getBikes')
        bikes.data.forEach(item => {
          if (bike._id === item._id && item.rented) {
            this.rentedBikes.unshift(bike)
            this.availableBikes.splice(index, 1)
          }
        })
        this.rentedPrice += bike.rentPrice
      } catch (e) {
      }
    },

    async cancelRent(bike, index) {
      const updateData = {
        id: bike._id
      }

      try {
        await this.$store.dispatch('endRent', updateData)

        const bikes = await this.$store.dispatch('getBikes')
        bikes.data.forEach(item => {
          if (bike._id === item._id && !item.rented) {
            this.availableBikes.unshift(bike)
            this.rentedBikes.splice(index, 1)
            this.availableBikes[index].lastRentTime = item.lastRentTime
            this.availableBikes[index].lastRentPrice = item.lastRentPrice
          }
        })

        this.rentedBikes.length ? this.rentedPrice -= bike.rentPrice : this.rentedPrice = 0
      } catch (e) {
      }
    },
    async deleteBike(id) {
      try {
        await this.$store.dispatch('deleteBike', id)
        this.availableBikes = this.availableBikes.filter(bike => bike._id !== id)
      } catch (e) {
        throw Error(e)
      }
    }
  },
  async mounted() {
    const bikes = await this.$store.dispatch('getBikes')
    bikes.data.forEach(bike => {
      if (bike.rented) {
        this.rentedBikes.push(bike)
      } else {
        this.availableBikes.push(bike)
      }
    })

    if (this.rentedBikes.length) {
      this.rentedBikes.forEach(bike => {
        this.rentedPrice += bike.rentPrice
      })
    } else {
      this.rentedPrice = 0
    }
  },
  computed: {
    numberOfBikes() {
      return this.availableBikes.length
    }
  },
  watch: {
    numberOfBikes(value) {
      return value
    }
  },

  filters: {
    time(minutes) {
      if (!minutes) return ''
      let hours = Math.floor(minutes / 60)
      let mins = Math.floor(minutes % 60)
      let seconds = Math.floor((minutes * 60) % 60)

      hours < 10 ? hours = "0" + hours : hours
      mins < 10 ? mins = "0" + mins : mins
      seconds < 10 ? seconds = "0" + seconds : seconds

      return `${hours} : ${mins} : ${seconds}`

    }
  }
}
</script>

<style lang="scss">
@import "public/style";
</style>
