const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const alertRoutes = require("./routes/AlertRoutes");
const callReportRoutes = require("./routes/callReportRoutes");
const sosRoutes = require("./routes/SOSroutes");
const socialMediaAnalysisRoutes = require("./routes/socialMediaAnalysisRoutes");
const smsReportRoutes = require("./routes/smsRoutes");
const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/reports", reportRoutes);
app.use("/alerts", alertRoutes);

app.use("/api/v1/callReports", callReportRoutes);
app.use("/call", sosRoutes);
app.use("/social-media", socialMediaAnalysisRoutes);
app.use("/api/sms-reports", smsReportRoutes);

module.exports = app;
