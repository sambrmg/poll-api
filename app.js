const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 4000;
const pollRoute = require('./routes/poll.route');
const userRoute = require('./routes/user.route');

const db = require("./models");

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors({
  origin: "http://localhost:3000"
}));


db.sequelize.sync({ force: false }).then(() => {
  console.log("Drop and re-sync db.");
});

app.use('/', pollRoute);
app.use('/user', userRoute);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({'message': err.message});
  
  return;
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
