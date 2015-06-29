var basicScraper = require('./controllers/basicScraperController');
var getExternalUrl = require('./controllers/urlController').getExternalUrl;
var CronJob = require('cron').CronJob;
var secret = require('../config.js');
var db = require('./db.js');
var Sequelize = require('sequelize');
var compare = require('./imgCompare.js').compare;
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'mailgun',
    auth: secret.auth
});

// To run the cronjob as it is now: navigate to server dir and type node cronjob
// for every five minutes
// var schedule = '* +' */5 * * * *';

// for faster testing
var schedule = '*/30 * * * * *';

//To run every 3 seconds do */3; every 5 min do * */5 *
// var schedule = '*/5 * * * * *';


var cronjob = new CronJob(schedule, function() {
  console.log('You will see this message every 5 min');
  // check database for jobs assigned for cronjob

  // get urls
  db.User.findAll()
  .then(function(allUsers) {
    for (var i = 0; i < allUsers.length; i++){
      allUsers[i].getUrls()
      .then(function(url) {
        for (var j=0; j<url.length; j++){
          console.log('checking', url[j].url, 'for changes');
           var oldImg = url[j].UserUrl.cropImage;
           var email = url[j].UserUrl.email;
           var website = url[j].url
           var params = {
            h: url[j].UserUrl.cropHeight,
            w: url[j].UserUrl.cropWidth,
            x: url[j].UserUrl.cropOriginX,
            y: url[j].UserUrl.cropOriginY
          }
<<<<<<< HEAD
           //console.log('about to call basicScraper')
        // get the server to render the page with params coordinates
        basicScraper.getScreenshot(url[j].url, url[j].id, function(urlToThePage) {
          console.log('url to the page', urlToThePage)
          basicScraper.cropImg(urlToThePage, params, true,  function(img2) {
            console.log('image path', img2);

            compare(img1, img2, function (equal){
              if (!equal){
               //sendEmail(currEmail, currEmail);
              };
            });
          });
        });
        }
      });
    };
  });
=======

          // get the server to render the page with params coordinates
          basicScraper.getScreenshot(url[j].url, url[j].id, function(img1, email) {
            basicScraper.cropImg(img1, params, true, function(newImg) {
              console.log('old image path', oldImg);
              console.log('new image path', newImg);


              compare(oldImg, newImg, function (equal){

                if (!equal){

                  console.log('change detected on', website, 'sending email to ', email);

                  // TODO: update oldImg to be newImg

                  var mailOptions = {
                      from: "The Blank Arrays <postmaster@sandbox72a87403dd654630bfa3c4b021cda08d.mailgun.org>", // sender address
                      // currently accessing only one user email
                      to: email, // list of receivers
                      subject: 'We found some tubular changes!', // Subject line
                      text: 'Hi there! It looks like we found a change on '+ website + '!', // plaintext body
                      html: "<span>The Scrapinit team found a change on " + website +"!</span>",
                          // html: '<b>Hello world </b>' // html body
                  };

                  // Send email function
                  transporter.sendMail(mailOptions, function(error, info){
                      if(error){
                          console.log(error);
                      }else{
                          console.log('Message sent: ' + info.response);
                      } //  else statemenet  
                  }); //  transporter.sendMail(mailOptions, function(error, info){
                }; // if (!equal){
              }) // compare(img1, img2, function (equal){
            }); // basicScraper.cropImg(img1, params, true, function(img2) {
          }, email); // basicScraper.getScreenshot()
        } // for loop iterating over each url for a user
      }); // .then(function(url){
    }; // or (var i = 0; i < allUsers.length; i++){
  }); // .then(function(allUsers) {
>>>>>>> c12b474b88814c938d2cfc7c16cd3a2bad2b370b
}, null, true, 'America/Los_Angeles');


