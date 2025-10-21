// const express = require('express');
// const cors = require('cors');
// const routes = require('./routes');

// const app = express();
// app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
// app.use(express.json());

// app.get('/', (req, res) => res.json({ message: 'Recipely API ok' }));
// app.use('/apis', routes);

// // error handler
// app.use((err, req, res, next) => {
//   console.error(err);
//   const status = err.status || 500;
//   res.status(status).json({ error: err.message || 'Internal Server Error' });
// });

// module.exports = app;
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// CORS configuration - allow Firebase hosting, localhost, and tunnel
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://recipely-e12fc.web.app',
    'https://recipely-e12fc.firebaseapp.com',
    'https://recipely.weldy.fun',
    'https://api.recipely.weldy.fun',
    'https://recipely-weldy-api.loca.lt'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Bypass-Tunnel-Reminder']
};

app.use(cors(corsOptions));
app.use(express.json());           
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.json({ message: 'Recipely API ok' }));
app.use('/apis', routes);          


app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});
module.exports = app;
