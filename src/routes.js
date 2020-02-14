import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

// middleware
import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();

// session routes
routes.post('/sessions', SessionController.store);

// user routes
routes.post('/users', UserController.store);

// midleware for auth routes
routes.use(AuthMiddleware);

routes.put('/users', UserController.update);

export default routes;
