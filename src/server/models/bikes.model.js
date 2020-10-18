const {model, Schema} = require ('mongoose')

const bikeSchema = new Schema({
  bikeName: {
    type: String,
    required: true
  },
  bikeType: {
    type: String,
    required: true
  },
  rentPrice: {
    type: Number,
    required: true
  },
  rented: {
    type: Boolean,
    required: true,
    default: false
  },
  startRent: {
    type: Date,
  },
  endRent: {
    type: Date,
  },
  lastRentTime: {
    type: Number
  },
  lastRentPrice: {
    type: Number
  }
})

module.exports = model('bike', bikeSchema)
