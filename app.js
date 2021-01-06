const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');


const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req,res){
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req,res){

  // Post to the mailchimp
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.inputEmail;

  const data = {
    members: [
      {
        email_address: email,
        status:"subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data)
  //const old_url = "https://server.api.mailchimp.com/3.0/lists/70afd8f7e3";
  const url = "https://us7.api.mailchimp.com/3.0/lists/70afd8f7e3";
  const options = {
    method: "POST",
    auth: "bclarkeuk:bcefd1b3742901257bf6bb927c1a7a089-us7"
  }

  const request = https.request(url, options, function(response){
    response.on("data", function(data){

      if(response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html")
      } else {
        res.sendFile(__dirname + "/failure.html")
      }
      console.log(response.statusCode);
    })
  })

  request.write(jsonData);
  request.end()
  console.log(email);
})

app.post("/failure", function(req,res){
  res.redirect("/");
})


app.listen(3000, function(){
  console.log("Server listening on port 3000");
})

// API Key: cefd1b3742901257bf6bb927c1a7a089-us7
// ListId: 70afd8f7e3
