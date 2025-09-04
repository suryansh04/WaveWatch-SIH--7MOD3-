const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const app = require("./app");
const DB = process.env.DB.replace("<PASSWORD>", process.env.DB_PASSWORD);

mongoose.connect(DB).then((connection) => {
  console.log("DB connection successful");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});

//ADMIN PASSWORD -: admin@1234
//ADMIN EMAIL -: admin@incois.gov.in
