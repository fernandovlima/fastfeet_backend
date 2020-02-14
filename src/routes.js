import { Router } from 'express';

import UserController from './app/controllers/UserController';

const routes = new Router();

// user routes
routes.post('/users', UserController.store);

export default routes;
