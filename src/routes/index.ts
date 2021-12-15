import { Router } from 'express';
import UserController from '../controllers/users.controllers';
import EventsController from '../controllers/events.controllers';

const routes = Router();

const userController = new UserController();
const eventController = new EventsController();

/* USERS */
routes.get('/users', userController.index);
routes.post('/users', userController.store);
routes.patch('/users/:id', userController.update);
routes.delete('/users/:id', userController.remove);
/* END USERS */

/* EVENTS */
routes.get('/events', eventController.index);
routes.post('/events', eventController.store);
/* END EVENTS */

export default routes;
