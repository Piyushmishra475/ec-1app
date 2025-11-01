import express from 'express'
import cors from 'cors'
import 'dotenv/config'

let app;

function createApp() {
  if (!app) {
    app = express();
    app.use(express.json());
    app.use(cors());
    
    app.get('/', (req, res) => {
      res.json({ message: 'API Working' });
    });
    
    app.get('/api/test', (req, res) => {
      res.json({ success: true, message: 'Test endpoint working' });
    });
  }
  return app;
}

export default function handler(req, res) {
  const app = createApp();
  return app(req, res);
}