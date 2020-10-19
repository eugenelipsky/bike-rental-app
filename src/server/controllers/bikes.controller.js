const Bike = require('../models/bikes.model')

module.exports.create = async (req, res) => {
  const bike = new Bike({
    bikeName: req.body.bikeName,
    bikeType: req.body.bikeType,
    rentPrice: req.body.rentPrice
  })

  try {
    await bike.save()
    res.status(201).json(bike)
  } catch (e) {
    res.status(500).json(e)
  }

}

module.exports.remove = async (req, res) => {
  try {
    await Bike.deleteOne({_id: req.query.id})
    res.status(200).json('Deleted successfully')
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.startRent = async (req, res) => {
  const $set = {
    rented: true,
    startRent: Date.now(),
  }
  try {
    const bike = await Bike.findOneAndUpdate({_id: req.body.id}, {$set}, {new: true})
    res.json(bike)
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.endRent = async (req, res) => {

  const bike = await Bike.findOne({_id: req.body.id});
  const now = Date.now()

  let lastRent = _calculateRentPrice(bike.startRent, now, bike.rentPrice)

  const $set = {
    rented: false,
    endRent: Date.now(),
    lastRentTime: lastRent.rentTime.toFixed(2),
    lastRentPrice: lastRent.endPrice.toFixed(2)
  }
  try {
    await Bike.updateOne({_id: req.body.id}, {$set}, {new: true})
    res.json(bike)
  } catch (e) {
    res.status(500).json(e)
  }
}

function _calculateRentPrice(timeStart, timeEnd, price) {
  let rentTime = (timeEnd - timeStart) / (1000 * 60);
  let endPrice = 0;
  if (rentTime > 1200) {
    endPrice = 20 * (price / 60);
    rentTime -= 20;
    endPrice += rentTime * (price / 60 / 2);
  } else {
    endPrice = rentTime * (price / 60)
  }

  return {rentTime, endPrice}
}

module.exports.getAll = async (req, res) => {
  try {
    const bikes = await Bike.find()
    res.status(200).json(bikes)
  } catch (e) {
    res.status(500).json(e)
  }
}


