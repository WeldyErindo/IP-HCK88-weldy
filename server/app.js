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

app.use(cors());
app.use(express.json());           
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.json({ message: 'Recipely API ok' }));
app.use('/apis', routes);          


app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});
module.exports = app;
