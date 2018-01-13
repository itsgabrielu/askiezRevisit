const express = require('express')
const app = express()
// const path = require('path')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fs = require('fs')
const Question = require('./models/question.js')
mongoose.connect('mongodb://localhost/questionbank', {
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
  // console.log('testing 1 trigger', req.body.question)
  Question.create({question: req.body.question, score: 0}, function (err, question) {
    if (err) return console.log(err)
    console.log('question added', req.body.question)
  })
  res.redirect('/')
})
app.listen(4000, () => {
  console.log('App is running on port 4000')
})