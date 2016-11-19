var express = require('express');
var router = express.Router();
var User = require('../models/User.js');
var Project = require('../models/Project.js');
var Exception = require('../models/Exception.js');
var Instance = require('../models/Instance.js');
var md5 = require('md5');

/**
 * @api {post} /api/exception Store a new instance of an exception
 * @apiName StoreException
 * @apiGroup Exceptions
 *
 * @apiParam {Mixed}  [user] 	The user that this error occurred for. This could be an ID, email, name etc.
 * @apiParam {String} [browser] 	The browser that the user was using when this error occurred.
 * @apiParam {String} [os] 		The operating system that the user was using when this error occurred.
 * @apiParam {String} method 	The HTTP method used when this error occurred.
 * @apiParam {String} [url] 		The referrer URL from when this error occurred.
 * @apiParam {String} [ip] 		The IP address from where this error occurred.
 * @apiParam {String} [location] 	The IP based location from where this error occured.
 * @apiParam {String} [useragent]	The user agent string from where this error occured.
 * @apiParam {String} project 	The Zappem Project ID which this error relates to.
 * @apiParam {String} message 	The error message
 * @apiParam {String} [class] 	The class in which the error occurred in.
 * @apiParam {String} file		The file in which the error occurred in.
 * @apiParam {Integer} line		The line number where the error occurred.
 * @apiParam {Object[]} [trace]	The trace stack
 * @apiParam {String} trace.class The class name
 * @apiParam {String} trace.file  The file name
 * @apiParam {Integer} trace.line The line number
 *
 * @api
 */
router.post('/exception', function(req, res){
	// An exception happened.
	// Does it already exist?

	var hash = md5(req.body.message+""+req.body.file);
	var newInstance = new Instance({
		user: req.body.instance.user,
		browser: req.body.instance.browser,
		os: req.body.instance.os,
		method: req.body.method,
  		url: req.body.instance.url,
		ip: req.body.instance.ip,
		location: req.body.instance.location,
		useragent: req.body.instance.useragent,
		project: req.body.project
	})

	Exception.findOne({hash: hash}, function(err, exception){
		if(exception){
			console.log('exception is apparently found!!!');
			console.log('here it is: ');
			console.log(exception);
			// Just add a new instance
			newInstance.exception = exception._id;
			newInstance.save(function(err, instance){
				console.log(err);
				console.log(instance);
				console.log('saved?');
				res.send('done');
			});
		}else{
			// It's never been seen before
			// Add the exception,
			var newException = new Exception({
				message: req.body.message,
				class: req.body.class,
				file: req.body.file,
				line: req.body.line,
				trace: req.body.trace,
				hash: md5(req.body.message+""+req.body.file),
				project: req.body.project
			});

			newException.save(function(err, exception){
				console.log(err);
				console.log(exception);
				console.log('saved? exception');
				newInstance.exception = exception._id;
				newInstance.save(function(err, instance){
					console.log('saved? instance');

					res.send('done');
				});
			});

			// And the instance
		}
	})

	

});



module.exports = router;
