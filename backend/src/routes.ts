import { Router } from 'express';

const routes = Router();

routes.get('/users', (req, res) => {
  res.json({ ok: 'test' });
});

export default routes;
