
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://USERNAMEHERE:${password}@cluster0.63nwogr.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Contact = mongoose.model('Contact', contactSchema)


const contact = new Contact({
  content: 'Tosi iso Kissa',
  important: true,
})

contact.save().then(result => {
  console.log('contact saved!')
  mongoose.connection.close()
})

/*Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})

// Voisimme hakea esim. ainoastaan tärkeät muistiinpanot seuraavasti:
/*
Note.find({ important: true }).then(result => {
  // ...
})*/