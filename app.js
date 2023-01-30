//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
// const { urlencoded } = require("body-parser");
// const { post } = require("request");
// const { response } = require("express");

const app = express();
// create app.use with express and set the direcry to public so you can move image and
//  css file into it for the images and styles to  show on the rignup page
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
//setup get with response to send file from our root route and signup.html so that 
// we can be able to access it online through localhost:3000
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});
//set post to grab data from our signup htmn with name properties and send the data to the 
// terminal thrugh consoe.log.
app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        }        
      }
    ]
  };
  //turn the data into json format by using stringnify
  const jsonData = JSON.stringify(data);

  //put in the mailchimp endpoint, the digit number of your API keys afterthe word us, and your list ID to follow at the list.
  const url = "https://us21.api.mailchimp.com/3.0/lists/c6f1c2d2af";

  const options = {
    method: "POST",
    //authentication, any password with your API key, seperated with colon.
    auth: "danku2023:4e3ddc8f1d8f0ef34b6b3d92287c59d6-us21"
  }

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();

  //we redirect users to try sign up again if there is a prolem with their sign up.
  app.post("/failure", function(req, res) {
  res.redirect("/");
  });

  app.post("/success", function(req, res) {
    res.redirect("/");
  })
  

});

 

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});


//API Keys
// 4e3ddc8f1d8f0ef34b6b3d92287c59d6-us21

//List ID from mailchimp
//c6f1c2d2af


// curl --request GET \
// --url 'https://<dc>.api.mailchimp.com/3.0/' \
// --user 'anystring:TOKEN