const express = require('express')
const morgan = require('morgan')
const app = express()

const cors = require('cors')

app.use(cors())


let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": "1"
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": "2"
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": "3"
  },
  {
    "name": "Mary Poppenduncer",
    "number": "39-23-6423122",
    "id": "4"
  }
]

morgan.token('req-body', (req, res) => JSON.stringify(req.body));

const customFormat = (tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens['req-body'](req, res)
    ].join(' ');
  };

app.use(express.json())
app.use(morgan(customFormat))
app.use(express.static('dist'))
      

app.get('/info', (request, response) => {
    const timestamp = new Date().toString(); // Get current date and time
    response.send(`<div>Phonebook has info for ${persons.length} people</div><br> <div>${timestamp}</div>`);
});


app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    console.log(id)
    const person = persons.find(person => person.id === id)

    if (person) {    
        response.json(person)  
    } else {    
        response.status(404).end()  
    }
  })

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})


const generateId = () => {
    const randomInteger = Math.floor(Math.random() * 1000000)
    return randomInteger.toString();
}



app.post('/api/persons', (request, response) => {  
    const body = request.body  
    
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: !body.name ? 'name missing' : 'number missing'
        });
    }

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        });
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)
    response.json(person)

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


