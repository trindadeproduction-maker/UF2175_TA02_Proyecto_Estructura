require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth.routes');
const companiesRoutes = require('./routes/companies.routes');
const candidatesRoutes = require('./routes/candidates.routes');
const usersRoutes = require('./routes/users.routes');
const technologiesRoutes = require('./routes/technologies.routes');
const headhuntersRoutes = require('./routes/headhunters.routes');
const jobOffersRoutes = require('./routes/jobOffers.routes');
const offerTechnologiesRoutes = require('./routes/offerTechnologies.routes');
const interviewsRoutes = require('./routes/interviews.routes');
const favoritesRoutes = require('./routes/favorites.routes');
const applicationsRoutes = require('./routes/applications.routes');
const salariesRoutes = require('./routes/salaries.routes');
const reviewsRoutes = require('./routes/reviews.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/companies', companiesRoutes);
app.use('/candidates', candidatesRoutes);
app.use('/users', usersRoutes);
app.use('/technologies', technologiesRoutes);
app.use('/headhunters', headhuntersRoutes);
app.use('/joboffers', jobOffersRoutes);
app.use('/interviews', interviewsRoutes);
app.use('/favorites', favoritesRoutes);
app.use('/offerTechnologies', offerTechnologiesRoutes);
app.use('/applications', applicationsRoutes);
app.use('/salaries', salariesRoutes);
app.use('/reviews', reviewsRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
