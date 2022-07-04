// require modules
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const https = require('https')

// initialize express
const app = express()

// Set up static references for dynamic app
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

// GET
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/signup.html')
})

// POST
app.post('/', function (req, res) {
  const firstName = req.body.fName
  const lastName = req.body.lName
  const email = req.body.email

  // Mailchimp
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_field: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  const jsonData = JSON.stringify(data)

  const url = 'https://us13.api.mailchimp.com/3.0/lists/3a07031f43'

  const options = {
    method: 'POST',
    auth: 'user:e712d1851da876a673d553e0227c416b-us13'
  }

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + '/success.html')
    } else {
      res.sendFile(__dirname + '/failure.html')
    }

    response.on('data', function (data) {
      console.log(JSON.parse(data))
    })
  })
  // request.write(jsonData)
  request.end()
})

// failure cenario, try again button form
app.post('/failure', function (req, res) {
  res.redirect('/')
})

// LISTEN to port
app.listen(process.env.PORT || 3000, function () {
  console.log(`Server started at port ${port}.`)
}) // Heroku OR localhost:3000

//API Key: e712d1851da876a673d553e0227c416b - us13
//Audience ID: 3a07031f43
