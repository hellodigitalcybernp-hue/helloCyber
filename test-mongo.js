const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => {
    console.log("Connected");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });