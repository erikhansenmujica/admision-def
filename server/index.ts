// Serve the same data endpoint in production as in development, alongside the built application.
import express from 'express';
import path from 'node:path';
import { economicHandler } from './economic-data';
const app = express();
app.get('/api/economic-params', economicHandler);
app.use('/api', (_req, res) => { res.status(404).json({ error: 'Endpoint desconocido' }); });
app.use(express.static(path.resolve('dist')));
app.get('*', (_req, res) => { res.sendFile(path.resolve('dist/index.html')); });
app.listen(Number(process.env.PORT || 3000), () => console.log('Semáforo disponible en puerto ' + (process.env.PORT || 3000)));
