const express = require('express')
const app = express()
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))

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
    return console.log('render trigger', quest)
  }
)
}

app.get('/', (req, res) => {
  questSearch(res)
})
app.post('/', (req, res) => {
  if (req.body.question) {
    Question.create({question: req.body.question, score: 0}, function (err, question) {
      if (err) return console.log(err)
      console.log('question added', req.body.question)
    })
    .then(() => {
      return res.redirect('/')
    }, (err) => {
      return console.log(err)
    })
  } else if (Object.keys(req.body).length) {
    console.log('Object keys', Object.keys(req.body))
    console.log('req.body', req.body)
    Question.findById(Object.keys(req.body)[0], function (err, doc) {
      if (err) return console.log(err)
      doc.score += Number(req.body[Object.keys(req.body)[0]])
      doc.save()
      .then(() => {
        return res.redirect('/')
      }, (err) => {
        return console.log(err)
      })
    })
  }
})

app.listen(port, () => {
  console.log('App is running on port 8080')
})
