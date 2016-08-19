var express = require('express');
var router = express.Router();

var aws = require('aws-sdk');

//require multer
var multer = require("multer");
var multerS3 = require("multer-s3")

//require s3
var options = {
	accessKeyId: process.env.AWS_AccessKEY_Id,
	secretAccessKey: process.env.AWS_SecretKey,
}

var s3 = new aws.S3(options);
var valid=false;
var key = false;
var max = false

var upload = multer({
	limits: { fileSize: 4000000},
	storage: multerS3({
		s3: s3,
		bucket: 'lamppostproject',
		contentType: multerS3.AUTO_CONTENT_TYPE,
		acl: "public-read",
		key: function(req, file, cb){
			cb(null, Date.now().toString() + "_" + file.originalname);
		}
	}),

	fileFilter: (req, file, cb) => {
		console.log("[file]", file);

		// The function should call `cb` with a boolean
		// to indicate if the file should be accepted
		if ((file.mimetype === 'image/png' || file.mimetype === 'image/jpeg')){
			cb(null, true)
			valid = true;
			return
			}
		// To reject this file pass `false`, like so:
		else{
			cb(null, false)
			valid = false;
			console.log("Nice Try!")
			return
			}
		// To accept the file pass `true`, like so:
		// You can always pass an error if something goes wrong:
		cb(new Error('I don\'t have a clue!'))
	}
});


var fs = require('fs');
var Lamppost = require("../models/lamppost")

/* GET home page. */
router.get('/', function(req, res, next) {

	Lamppost.find(function(err,lampposts){	

	var lampposts1 = [];
	var lampposts2 = [];
	var lampposts3 = [];
	var lampposts4 = [];

	for (var i=0; i<lampposts.length; i++){
		if (i % 4 === 0){
			lampposts1.push(lampposts[i]);
			}

	  else if (i % 4 === 1){
			lampposts2.push(lampposts[i]);
			}

	else if (i % 4 === 2){
			lampposts3.push(lampposts[i]);
			}

	else{
		lampposts4.push(lampposts[i]);
		}
	}




	console.log(lampposts3)
    res.render('index', {
      lampposts1: lampposts1,
      lampposts2: lampposts2,
      lampposts3: lampposts3,
      lampposts4: lampposts4
    })
  })
});

router.get('/contribute', function(req,res,next){
	res.render('contribute');
})


var uploadLampostImage = upload.single('lamppostImage');

router.post('/contribute', function(req,res,next){
	console.log("in here");
	uploadLampostImage(req, res, function(err){
		console.log("ABAXBJKDS");
		if (err){
			console.log("error: " + err);
			return next();
		} else {
			console.log("uploading photo...");
			console.log("uploading photo x2...");
			
			Lamppost.find(function(err,lampposts){
				console.log(lampposts.length)
				if (lampposts.length < 230){ //&& req.body.key === "wewilllighttheway"){
					
					console.log(key);
					console.log(max);
						if (valid){
							//there was a better way to do this but synchronous vs asynchronous is confusing :\

							console.log("city: " + req.body.city)
							console.log("state: " + req.body.state)
							console.log("country: " + req.body.country)

							if (!req.body.state && !req.body.city && !req.body.country){
								req.body.city = "Unknown Location";
								}

							else if (!req.body.state && !req.body.city){
								console.log("one")
								req.body.city = req.body.country
							}

							else if (!req.body.state && !!req.body.city && !!req.body.country){
								console.log("two")
								req.body.city += ","
								req.body.state = req.body.country;
							}

							else if (!!req.body.state && !req.body.city){
								req.body.city = req.body.state + ',';
								req.body.state = req.body.country;
							}


							// if (req.body.city === "" || req.body.city === "undefined"){
							// 	console.log("three")
							// 	req.body.city = "Unknown Location"
							// }

							else{
								req.body.city += ','
							}

							var l = new Lamppost({
								// image = req.body.image,
								country: req.body.country,
								state: req.body.state,
								city: req.body.city,
								address: req.body.address,
								imgUrl: req.file.location
							})
						
							l.save(function(err,lamppost){
								if (err){
									console.log(err);
									res.status(500).json({
										success: false,
										error: err
									});
									return;
									}
								//console.log(shipping);
								res.json({
									success: true,
									redirect: '/'
								});
							});
						}
						else{
							console.log("Try Again");
							res.status(500).json({
								success: false,
								error: "Try again"
							})
							res.redirect("/contribute")
						}


					}
					else{
						console.log("Something is not right...")
						res.status(500).json({
								success: false,
								error: "Try again"
							})
					}
				});	
		}
	})

});


module.exports = router;