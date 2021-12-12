import { Router } from 'express';
import UserController from '../controllers/users.controllers';

const routes = Router();

const userController = new UserController();

/* USERS */
routes.get('/users', userController.index);
routes.post('/users', userController.store);
routes.patch('/users/:id', userController.update);
routes.delete('/users/:id', userController.remove);
/* END USERS */

export default routes;
