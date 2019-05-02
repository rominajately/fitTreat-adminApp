const path = require('path');
const express = require('express');
const app = express();

let env = process.env.NODE_ENV || 'development';

let forceSSL = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  return next();
};

if (env === 'production') {
  app.use(forceSSL);
}

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
// Serve static files
app.use(express.static(__dirname + '/dist/fitTreat-adminapp'));
//app.use(express.static(__dirname + '/src/index.html'));
const allowedExt = [
  '.js',
  '.ico',
  '.css',
  '.png',
  '.jpg',
  '.woff2',
  '.woff',
  '.ttf',
  '.svg',
];

/* app.get('/config',(req,res)=>{
  console.log(process.env.BACKEND_URL)
  res.status(200).send({url:process.env.BACKEND_URL||'http://localhost:8989'});
}); */

// Send all requests to index.html
 app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/fitTreat-adminapp/index.html'));
}); 

// default Heroku port
app.listen(process.env.PORT || 5000);

