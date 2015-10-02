// Load the http module to create an http server.
var http = require('https');
var request = require('request');
var mongoose = require('mongoose');
var url = require('url');
var fs = require('fs');
var config = require('./config.js');
var Schema = mongoose.Schema;

mongoose.connect(config.mongoUrl);

var dislikeSchema = new Schema({
    user_id: {
        type: String,
        index: true
    },
    target_id: {
        type: String,
        index: true
    },
    created_at: {
        type: Date
    }
});

dislikeSchema.index({
    user_id: 1,
    target_id: 1
}, {
    unique: true
});

var Dislike = mongoose.model('Dislike', dislikeSchema);

var options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(options, function(req, response) {
    var params = url.parse(req.url, true).query;

    if (('accessToken' in params) && ('action' in params) && ('fbId' in params)) {
        // Check Facebook login
        request.get('https://graph.facebook.com/me?access_token=' + params.accessToken,
            function(error, res, body) {
                if (!error && res.statusCode == 200) {
                    if (params.action === 'dislike') {
                        // Save a dislike
                        var dislike = {
                            user_id: JSON.parse(body).id,
                            target_id: params.fbId,
                            created_at: new Date()
                        };
                        new Dislike(dislike).save(function(err) {
                            if (err) {
                                response.writeHead(400, {
                                    'Content-Type': 'application/json'
                                });
                                response.end(JSON.stringify({
                                    'message': 'Couldn\'t save dislike!'
                                }));
                            } else {
                                response.writeHead(200, {
                                    'Content-Type': 'application/json'
                                });
                                response.end(JSON.stringify(dislike));
                            }
                        });
                    } else if (params.action === 'cancel') {
                        // Cancel an dislike
                        Dislike.find({
                            user_id: JSON.parse(body).id,
                            target_id: params.fbId,
                        }).remove(function(err) {
                            if (err) {
                                response.writeHead(400, {
                                    'Content-Type': 'application/json'
                                });
                                response.end(JSON.stringify({
                                    'message': 'Couldn\'t cancel dislike!'
                                }));
                            } else {
                                response.writeHead(200, {
                                    'Content-Type': 'application/json'
                                });
                                response.end();
                            }
                        });
                    } else if (params.action === 'count') {
                        // Request dislikes' count
                        Dislike.count({
                            target_id: params.fbId
                        }, function(err, c) {
                            if (err) {
                                response.writeHead(400, {
                                    'Content-Type': 'application/json'
                                });
                                response.end(JSON.stringify({
                                    'message': 'Couldn\'t count dislikes!'
                                }));
                            } else {
                                response.writeHead(200, {
                                    'Content-Type': 'application/json'
                                });
                                Dislike.count({
                                    user_id: JSON.parse(body).id,
                                    target_id: params.fbId,
                                }, function(err, uc) {
                                    if (err) {
                                        response.end(JSON.stringify({
                                            count: c,
                                            me: false
                                        }));
                                    } else {
                                        response.end(JSON.stringify({
                                            count: c,
                                            me: (uc > 0)
                                        }));
                                    }
                                });
                            }
                        });
                    } else {
                        response.writeHead(400, {
                            'Content-Type': 'application/json'
                        });
                        response.end(JSON.stringify({
                            'message': 'No valid action has been specified!'
                        }));
                    }
                } else {
                    response.writeHead(400, {
                        'Content-Type': 'application/json'
                    });
                    response.end(JSON.stringify({
                        'message': 'Denied Facebook Authorization!'
                    }));
                }
            });
    } else {
        response.writeHead(400, {
            'Content-Type': 'application/json'
        });
        response.end(JSON.stringify({
            'message': 'No accessToken, action, or fbId provided!'
        }));
    }
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:8000/');
