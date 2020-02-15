import { Router } from 'express';
// upload de arquivos
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';

// middleware
import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();
// upload
const upload = multer(multerConfig);

// session routes
routes.post('/sessions', SessionController.store);

// user routes
routes.post('/users', UserController.store);

// midleware for auth routes
routes.use(AuthMiddleware);
// update user
routes.put('/users', UserController.update);
// create recipient
routes.post('/recipients', RecipientController.store);
// upload files
routes.post('/files', upload.single('file'), (req, res) => {
  return res.json({ ok: true });
});

export default routes;
