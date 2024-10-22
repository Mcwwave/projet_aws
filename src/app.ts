import express from 'express';
import apiRoutes from './routes/api';

const app = express();

app.use(express.json()); // Pour traiter le body en JSON
app.use('/v1', apiRoutes); // Toutes les routes API seront sous /api

export default app;
