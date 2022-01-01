import { Router } from 'express';
import UserController from '../controllers/users.controllers';
import EventsController from '../controllers/events.controllers';
import ArticlesController from '../controllers/articles.controllers';
import CommittieesControllers from '../controllers/committiees.controllers';
import TopicsControllers from '../controllers/topics.controllers';
import InstitutionsController from '../controllers/institutions.controllers';

const routes = Router();

const userController = new UserController();
const eventController = new EventsController();
const articleController = new ArticlesController();
const committieeController = new CommittieesControllers();
const topicsController = new TopicsControllers();
const institutionsController = new InstitutionsController();

/* USERS */
routes.get('/users', userController.index);
routes.get('/users/:id', userController.show);
routes.post('/users', userController.store);
routes.patch('/users/:id', userController.update);
routes.delete('/users/:id', userController.remove);
/* END USERS */

/* EVENTS */
routes.get('/events', eventController.index);
routes.get('/events/:id', eventController.show);
routes.post('/events', eventController.store);
/* END EVENTS */

/* ARTICLES */
routes.get('/articles', articleController.index);
routes.post('/articles', articleController.store);
/* END ARTICLES */

/* COMMITTIEE */
routes.get('/committiees', committieeController.index);
routes.get('/committiees/:id', committieeController.show);
routes.post('/committiees/:id', committieeController.store);
/* END COMMITTIEE */

/* TOPICS */
routes.get('/topics', topicsController.index);
routes.post('/topics', topicsController.store);
/* END TOPICS */

/* INSTITUTIONS */
routes.get('/institutions', institutionsController.index);
routes.post('/institutions', institutionsController.store);
/* END INSTITUTIONS */

export default routes;
