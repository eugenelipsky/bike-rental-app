const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const bikesRoutes = require('./routes/bikes.routes')
require('dotenv').config()

const app = express()

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
  .then(() => {
    console.log('MongoDB is connected...')
  })
  .catch((e) => {
    console.log(`Error: ${e}`)
  })

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


app.use('/api/bikes', bikesRoutes)

app.listen(PORT, HOST, () => {
  console.log(`Server is listening on http://${HOST}:${PORT}`)
})
