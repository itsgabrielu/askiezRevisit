const express = require('express')
const app = express()
// const path = require('path')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fs = require('fs')
const Question = require('./models/question.js')
var port = process.env.PORT || 8080;
var mlab = process.env.MONGODB_URI || 'mongodb://localhost/questionbank'
// const dbUrl = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : 'mongodb://localhost/project2'

mongoose.connect(mlab, {
  useMongoClient: true
})
mongoose.Promise = global.Promise

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

var questSearch = (res) => {
  Question.find({}, (err, quest) => {
    if (err) return console.log(err)
    res.render('home', {name: 'fellow WDI 12 Hustler.', qList: quest})
    console.log('render trigger', quest)
  }
)
}

app.get('/', (req, res) => {
  questSearch(res)
})

app.post('/', (req, res) => {
  console.log('triggered here for', Object.keys(req.body)[0])
  if (req.body.question) {
    Question.create({question: req.body.question, score: 0}, function (err, question) {
      if (err) return console.log(err)
      console.log('question added', req.body.question)
    })
  } else {
    Question.findByIdAndUpdate(Object.keys(req.body)[0], { $set: { score: 1 }})
  }
  res.redirect('/')
  console.log('redirected')
})

app.post('/vote', (req, res) => {
  console.log(this.value) // TODO: upon clicking button, find the question entry, and add/subtract score
  // Question.create({question: req.body.question, score: 0}, function (err, question) {
  //   if (err) return console.log(err)
  //   console.log('question added', req.body.question)
  // })
  // res.redirect('/')
})
app.listen(port, () => {
  console.log('App is running on port 8080')
})
