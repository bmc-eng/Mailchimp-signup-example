const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  // Send the signup.html file when requested by root
  res.sendFile(__dirname + "/signup.html");
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
  const url = "https://us7.api.mailchimp.com/3.0/lists/70afd8f7e3";
  const options = {
    method: "POST",
    auth: "bclarkeuk:bcefd1b3742901257bf6bb927c1a7a089-us7"
  }

  // Compile the request
  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {
      // Check the response code from Mailchimp server
      if (response.statusCode === 200) {
        // Return with the success.html file
        res.sendFile(__dirname + "/success.html");
      } else {
        // Return with the failure file
        res.sendFile(__dirname + "/failure.html");
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


app.listen(3000, function() {
  console.log("Server listening on port 3000");
});

// API Key: cefd1b3742901257bf6bb927c1a7a089-us7
// ListId: 70afd8f7e3
