const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const dotenv = require('dotenv').config()

const app = express();

// MailChimp API variables from .env file These are needed by mailchimp as per API
// documentation. 
const mc_list = process.env.MC_AUDIENCE;
const mc_username = process.env.MC_LOGIN;
const mc_password = process.env.MC_PASSKEY;
const mc_server = process.env.MC_SERVER;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  // Send the signup.html file when requested by root
  res.sendFile(__dirname + "/public/signup.html");
})

app.post("/", function(req, res) {

  // Post to the mailchimp after button is clicked
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.inputEmail;

  // Construct the data as needed by the Mailchimp API
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  // Mailchimp server data
  const url = "https://us" + mc_server + ".api.mailchimp.com/3.0/lists/" + mc_list;
  const options = {
    method: "POST",
    auth: mc_username + ":" + mc_password
  }

  console.log(url);
  console.log(options);

  // Compile the request
  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {
      // Check the response code from Mailchimp server
      if (response.statusCode === 200) {
        // Return with the success.html file
        res.sendFile(__dirname + "/public/success.html");
      } else {
        // Return with the failure file
        res.sendFile(__dirname + "/public/failure.html");
      }
      console.log(response.statusCode);
    })
  });

  // Send the request with the sign up data
  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res) {
  res.redirect("/");
});


app.listen(process.env.PORT || 8080, function() {
  console.log("Server listening on port 8080");
});
