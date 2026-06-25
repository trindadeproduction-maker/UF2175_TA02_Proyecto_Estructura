require("dotenv").config();

const express = require("express");
const cors = require("cors");

const companiesRoutes = require("./routes/companies.routes");
const candidatesRoutes = require("./routes/candidates.routes");
const usersRoutes = require("./routes/users.routes");
const technologiesRoutes = require("./routes/technologies.routes");
const headhuntersRoutes = require("./routes/headhunters.routes");
const jobOffersRoutes = require("./routes/jobOffers.routes");
const offerTechnologiesRoutes = require("./routes/offerTechnologies.routes");
const interviewsRoutes = require("./routes/interviews.routes");
const favoritesRoutes = require("./routes/favorites.routes");
const applicationsRoutes = require("./routes/applications.routes");
const salariesRoutes = require("./routes/salaries.routes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/companies", companiesRoutes);

app.use("/joboffers",jobOffersRoutes);

app.use("/users", usersRoutes);

app.use("/technologies",technologiesRoutes);

app.use("/candidates", candidatesRoutes);

app.use("/interviews", interviewsRoutes);

app.use("/", favoritesRoutes);

app.use("/offerTechnologies",offerTechnologiesRoutes);

app.use("/applications", applicationsRoutes);

app.use("/salaries", salariesRoutes);

app.use("/headhunters", headhuntersRoutes);


// app.get("/", (req, res) => {
//     res.send("Servidor funcionando");
// });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});