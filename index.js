const express = require('express')
const app = express()
// const path = require('path')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fs = require('fs')
const Question = require('./models/question.js')
var port = process.env.PORT || 8080;
var mlab = process.env.MONGOLAB_URI || 'mongodb://localhost/questionbank'

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
  // res.render('home')
})

app.post('/', (req, res) => {
  // console.log('testing 1 trigger', req.body.question)
  Question.create({question: req.body.question, score: 0}, function (err, question) {
    if (err) return console.log(err)
    console.log('question added', req.body.question)
  })
  res.redirect('/')
})
app.listen(port, () => {
  console.log('App is running on port 8080')
})
