
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

else if (process.argv.length==4) {
  console.log('Give as arguments: DatabasePassword, NameToInsert, NumberToInsert')
  process.exit(1)
}
const password = process.argv[2]
const nameVar = process.argv[3]
const numberVar = process.argv[4]
const url = `mongodb+srv://misuel:${password}@cluster0.63nwogr.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

if(process.argv.length >= 5)
{
  const contact = new Contact({
    name: nameVar,
    number: numberVar,
  })

  contact.save().then(result => {
    console.log(`Added ${nameVar} ${numberVar} to the phonebook`)
    mongoose.connection.close()
  })
}

else
{
  Contact.find({})
    .exec()
    .then((contacts) => {
      console.log('All contacts in the phonebook:')
      contacts.forEach(contact => {
        console.log(`${contact.name}  ${contact.number}`)
      })
    })
    .catch(error => {console.error('Error retrieving contacts:', error)})
    .finally(() => mongoose.connection.close())
}

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