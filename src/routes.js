import { Router } from 'express';

const routes = new Router();


//rotas
routes.get('/', (req, res) => {
  return res.json({ message: 'Testando Rotas'})
});

export default routes;