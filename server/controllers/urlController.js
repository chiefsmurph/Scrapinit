var basicScraper = require('./basicScraperController');
var cronjob = require('./cronController').addCron;
var db = require("../db");




module.exports = {
  getList: function (req, res, next) {
    console.log('we are here')
    var email = req.session.email;
    db.User.findOne({
      where: {
        email: email
      },
      attributes: ['email'],
      include: [
        {
          model: db.Url
        }
      ]
    })
    .then(function(urls) {
      if (urls) {
        res.status(200).json(urls);
      }else{
        res.status(500).json({error:'Server error'});
      }
    });
  },

  checkParametersAddUrl: function (req, res, next) {
    var params = req.body;
    if (!params.url || !params.urlImg || !params.crop || !params.crop.x ||
      !params.crop.y || !params.crop.w || !params.crop.h){
      res.status(400).json({error: 'Need more data'});
    }
    next();
  },

  addUrl: function (req, res, next) {
    var email = req.session.email;
    var url = {url: req.body.url};
    console.log('req body', JSON.stringify(req.body));
    console.log('url up top ' + JSON.stringify(url));
    var selector = 'body';

    db.User.findOne({
      where: {
        email: email
      }
    })
    .then(function (userFound) {

      if (userFound) {

        // always will be true (hopefully) because they are logged in to access this route
        // current user equals userFound

        console.log('url: ' + JSON.stringify(url));

        db.Url.findOne({
          where: url
        })
        .then(function(urlFound) {
          console.log('req.body.urlImg' + req.body.urlImg);
          console.log('req.body.crop' + JSON.stringify(req.body.crop));
          basicScraper.cropImg(req.body.urlImg, req.body.crop, false, req.session.email, function(cropImg, crop) {

            basicScraper.imagetotext(cropImg, function(text) {


              // crop image whether or not the url has already been submitted
              console.log('***** urlImg',req.body.urlImg )
              if (urlFound) {

                 console.log('loggin it yo', JSON.stringify(crop));
                 console.log('urlfound: '+ urlFound);

                 userFound.addUrl(urlFound, {
                    email: userFound.email,
                    cropImage: cropImg,
                    cropHeight: crop.h,
                    cropWidth: crop.w,
                    cropOriginX: crop.x,
                    cropOriginY: crop.y,
                    ocrText: text
                 })
                 .then(function(associate) {


                   db.Url.findOne({
                     where: {
                       id: urlFound.id
                     },
                     include: [
                       {
                         model: db.UserUrl,
                         where: {
                           user_id: req.session.user_id
                         }
                       }
                     ]
                   }).then(function (userUrl){

                     console.log('sending ' + userUrl.url + ' to cronjob');
                     cronjob(userUrl.UserUrls[0], userUrl.url);
                     res.status(201).json({ cropImage: cropImg, text: text });

                   }); // end url findone then

                 })
                 .catch(function (err) {
                   res.status(400).json({message: err.message});
                 });


                 console.log('url found');;

              } else {  // else !urlFound

                console.log('url not found');

                db.Url.create(url)
                  .then(function (urlCreated) {

                    userFound.addUrl(urlCreated, {
                       email: userFound.email,
                       ocrText: text,
                       cropImage: cropImg,
                       cropHeight: crop.h,
                       cropWidth: crop.w,
                       cropOriginX: crop.x,
                       cropOriginY: crop.y
                    })
                    .then(function(associate) {

                      db.Url.findOne({
                        where: {
                          id: urlFound.id
                        },
                        include: [
                          {
                            model: db.UserUrl,
                            where: {
                              user_id: req.session.user_id
                            }
                          }
                        ]
                      }).then(function (userUrl){

                        console.log('sending ' + userUrl.url + ' to cronjob');
                        cronjob(userUrl.UserUrls[0], userUrl.url);

                        //console.log('associate datavalues  ', JSON.stringify(associate[0][0].dataValues));
                        res.status(201).json({cropImage: userUrl.UserUrls[0].cropImage, text: text });
                      })
                      .catch(function (err) {
                        res.status(403).json({message: err.message});
                      }); // close catch of userurl db call
                    })  // close then of addurl url db call
                    .catch(function (err) {
                      res.status(403).json({message: err.message});
                    }); // close catch of create url db call

                  }); // close db createurl

              }   // close else !urlfound

            }); // close image to text callback

          }); // close cropImg callback

        }); // close urlFound then

      } // close if userFound

    });  // close userFound then
  },

  getUrl: function (req, res) {
    var idUrl = req.params.idUrl;
    db.User.findOne({
      where: {
        email: req.session.email
      },
      attributes: ['email'],
      include: [
        {
          model: db.Url,
          where: {
            id: idUrl
          }
        }
      ]
    })
    .then(function (userFound) {
      //object return {email: .., urls: []}
      //return the first element in the userFound.urls
      if(userFound) {
        res.status(200).json(userFound.urls[0]);
      }else {
        res.status(403).json({error: 'You dont have permissions in this URL'});
      }
    });
  },

  removeUrl: function(req, res, next) {
    var email = req.session.email;
    var url = {url: req.body.url};

    db.User.findOne({
      where: {
        email: email
      }
    })
    .then(function (userFound) {

      if (userFound) {

        db.Url.findOne({
          where: url
        })
        .then(function(urlFound) {
          if (urlFound) {

            //cronJob.deleteCron(userFound.id, urlFound.id);
            userFound.removeUrl(urlFound);
            res.status(200).json({});

          } else {

            res.status(403).json({});

          } // end urlFound
        }); // end url.findOne then

      } // end if userFound
    }); // end user.findOne then

  },

  getListOfUrls: function(req, res, next){
    console.log('in getListOfUrls ', req.session.email)
     var email = req.session.email;

     db.User.findOne({
       where: {
         email: email
       }
     }).then(function(userFound) {

       userFound.getUrls()
         .then(function(urlArr) {

           if (urlArr && urlArr[0]) {
             console.log('our url array', urlArr[0].UserUrl);
             res.status(200).json(urlArr);
           } else {
             res.status(200).json({});
           }
         });

     });

 }

};
