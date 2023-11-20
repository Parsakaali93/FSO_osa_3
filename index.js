const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')

const Contact = require('./models/contact')

const app = express()
const cors = require('cors')

app.use(cors())

// yksinkertainen middleware, joka tulostaa 
// konsoliin palvelimelle tulevien pyyntöjen perustietoja.
/*const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
*/

app.use(express.static('dist'))

/*In Express.js, the body is not automatically parsed by default,
so you need to use middleware like express.json() to parse the
incoming request body. (in a POST request)*/
app.use(express.json())

/* Middlewaret suoritetaan siinä järjestyksessä, jossa ne on otettu
 käyttöön sovellusolion metodilla use. Huomaa, että json-parseri
tulee ottaa käyttöön ennen middlewarea requestLogger,
muuten request.body ei ole vielä alustettu loggeria suoritettaessa! */
//app.use(requestLogger)

app.use(morgan('tiny'))

let contacts = [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Kalevi Pöögilä",
        "number": "040632234",
        "id": 5
      },
      {
        "name": "Mau Kissa",
        "number": "43 434 4567",
        "id": 6
      }
    ]
  

app.get('/api/persons', (req, res) => {
  Contact.find({}).then(contacts => {
    res.json(contacts)
  })
})


app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  const contact = contacts.find(contact => {
    return contact.id === id
  })

  if(contact)
  {
    response.json(contact)
  }

  // Jos id:llä ei löydy notea lähetetään 404 error
  else
  {
    // Koska vastaukseen ei nyt liity mitään dataa, käytetään statuskoodin asettavan
    // metodin status lisäksi metodia end ilmoittamaan siitä, että pyyntöön tulee vastata ilman dataa.
    response.status(404).end()
  }
})

app.get('/info', (req, res) => {
    var datetime = new Date();
    console.log(datetime, typeof datetime);

    res.send(`<p>Phonebook has info for ${contacts.length} people<br><br>${datetime}</p>`)
})

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Check if contact with this name already exists
function doesPersonExist(name) {
  return contacts.some(contact => contact.name === name);
}

// Kontaktin lisääminen tietokantaan POST metodilla
app.post('/api/persons', (request, response) => {
  const body = request.body

  // We require the content field to not be empty
  if (!body.name) {
    // Return is important, otherwise the function will
    // continue and post the note into the database
    return response.status(400).json({ 
      error: 'no name' 
    })
  }

  else if(doesPersonExist(body.name))
  {
    return response.status(400).json({ 
      error: 'name not unique' 
    })
  }

  else if (!body.number) {
    // Return is important, otherwise the function will
    // continue and post the note into the database
    return response.status(400).json({ 
      error: 'no number' 
    })
  }

  const contact = new Contact ({
    name: body.name,
    number: body.number,
    id: getRandomInt(2000000000),
  })

  contact.save().then(result => {
    console.log(`Added ${body.name} ${body.number} to the phonebook`)
    mongoose.connection.close()
  })

  contacts = contacts.concat(contact)

  response.json(contact)
})

// Poista kontakti puhelinluettelosta
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  contacts = contacts.filter(contact => contact.id !== id)

  // Jos poisto onnistuu eli poistettava muistiinpano on olemassa,
  // vastataan statuskoodilla 204 no content sillä mukaan ei lähetetä mitään dataa.
  response.status(204).end()
})

// Lisätään routejen jälkeen seuraava middleware, jonka ansiosta
// saadaan routejen käsittelemättömistä virhetilanteista JSON-muotoinen virheilmoitus:
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})