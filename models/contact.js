

const mongoose = require('mongoose')
// const config = require('../config.json');

// ÄLÄ KOSKAAN TALLETA SALASANOJA GitHubiin!
const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)
mongoose.connect(url)

.then(result => {
  console.log('connected to MongoDB')
})
.catch((error) => {
  console.log('error connecting to MongoDB:', error.message)
})

const contactSchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      required: true
    },
    number: String,
    id: Number
  })

  contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Contact', contactSchema)

