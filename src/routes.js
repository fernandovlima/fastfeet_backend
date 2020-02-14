import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

// session routes
routes.post('/sessions', SessionController.store);

// user routes
routes.post('/users', UserController.store);

export default routes;
