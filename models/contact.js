

const mongoose = require('mongoose')
const config = require('../config.json');

// ÄLÄ KOSKAAN TALLETA SALASANOJA GitHubiin!
const url = config.mongodb.url


mongoose.set('strictQuery',false)
mongoose.connect(url)
.then(result => {
  console.log('connected to MongoDB')
})
.catch((error) => {
  console.log('error connecting to MongoDB:', error.message)
})

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number
  })

module.exports = mongoose.model('Contact', contactSchema)

