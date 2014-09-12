/*
 * socket.js - Accela event demo
*/

/*jslint         node    : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global */

// ------------ BEGIN MODULE SCOPE VARIABLES --------------
//'use strict';
var
  emitEventMessage, 
  http        = require( 'http'      ),
  express     = require( 'express'   ),
  bodyParser  = require( 'body-parser'),
  socketIo    = require( 'socket.io' ),
  request     = require( 'request'),

  app       = express(),
  server    = http.createServer( app ),
  io        = socketIo.listen( server )
  ;
// ------------- END MODULE SCOPE VARIABLES ---------------

// --------------- BEGIN UTILITY METHODS ------------------

// ---------------- END UTILITY METHODS -------------------

// ------------- BEGIN SERVER CONFIGURATION ---------------

app.use(bodyParser.json({ type: 'text/plain' }));
app.use( express.static( __dirname + '/' ) );

app.get('/', function( req, res ){
  res.status(200).end();
});

app.get('/event', function( req, res ){
  res.redirect( '/event.html' );
});

app.post('/', function(req, res){
  if(req.body.Type === 'SubscriptionConfirmation') {
    var url = req.body.SubscribeURL;
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
        res.status(200).end();
      }
      else {
        console.log('Error: ' + response.statusCode);
      }
    });
  }
  else {
    console.log( req.body.Message );
    io.sockets.emit( 'messageUpdate', JSON.parse(req.body.Message) );
    res.status(200).end();
  }
}); 
// -------------- END SERVER CONFIGURATION ----------------

// ----------------- BEGIN START SERVER -------------------
server.listen( 3000 );
console.log(
  'Express server listening on port %d in %s mode',
   server.address().port, app.settings.env
);
// ------------------ END START SERVER --------------------
