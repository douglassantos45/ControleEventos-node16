import { Router } from 'express';
import UserController from '../controllers/users.controllers';
import EventsController from '../controllers/events.controllers';
import ArticlesController from '../controllers/articles.controllers';
import CommittieesControllers from '../controllers/committiees.controllers';

const routes = Router();

const userController = new UserController();
const eventController = new EventsController();
const articleController = new ArticlesController();
const committieeController = new CommittieesControllers();

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

/* ARTICLES */
routes.get('/articles', articleController.index);
routes.post('/articles', articleController.store);
/* END ARTICLES */

/* COMMITTIEE */
routes.get('/committiees', committieeController.store);
routes.post('/committiees', committieeController.store);
/* END COMMITTIEE */

export default routes;
