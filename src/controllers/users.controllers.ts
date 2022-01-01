import { Request, Response } from 'express';
import db from '../database/database';

import {
  Actor,
  Article,
  ArticleEvent,
  Institution,
  User,
} from '../interfaces/index';

export default class UserController {
  async index(req: Request, res: Response) {
    try {
      const users = await db('USERS')
        .join('ACTORS', 'ACTORS.userId', '=', 'USERS.id')
        .select(['ACTORS.type', 'USERS.*']);

      res.status(200).json({
        error: false,
        data: users.map((user: Actor) => ({
          id: user.id,
          name: user.name,
          email: user.mail,
          phone: user.phone,
          cep: user.cep,
          street: user.street,
          type: user.type,
        })),
      });
    } catch (err) {
      console.log(`Error in Index of USER controller ${err}`);
      res.status(500).json({
        error: true,
        message: 'Error',
      });
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const [user]: User[] = await db('USERS')
        .where('id', '=', id)
        .select(['USERS.*']);

      if (!user) {
        return res.status(404).json({
          error: false,
          message: 'User not found.',
        });
      }

      const institutions: Institution[] = await db('INSTITUTIONS')
        .join('ACTORS', 'ACTORS.institutionId', '=', 'INSTITUTIONS.id')
        .join('USERS', 'USERS.id', '=', 'ACTORS.userId')
        .where('USERS.id', '=', id)
        .select(['INSTITUTIONS.*']);

      const articles: Article[] = await db('AUTHOR_ARTICLES')
        .join('ACTORS', 'ACTORS.id', '=', 'AUTHOR_ARTICLES.actorId')
        .join('ARTICLES', 'ARTICLES.id', '=', 'AUTHOR_ARTICLES.articleId')
        .join('USERS', 'USERS.id', '=', 'ACTORS.userId')
        .where('USERS.id', '=', id)
        .select(['ARTICLES.*']);

      const articleEvents: ArticleEvent[] = await db('ARTICLE_EVENTS')
        .join('EVENTS', 'EVENTS.id', '=', 'ARTICLE_EVENTS.eventId')
        .join('ARTICLES', 'ARTICLES.id', '=', 'ARTICLE_EVENTS.articleId')
        .select([{ articleId: 'ARTICLE_EVENTS.articleId' }, 'EVENTS.*']);

      const articleResponse = articles.map((article) => {
        const events = articleEvents.filter((event) => {
          if (event.articleId === article.id) {
            return event;
          }
        });

        const [event] = events.map((ev) => ({
          name: ev.name,
        }));

        return {
          id: article.id,
          title: article.title,
          events: event,
        };
      });

      const { name, cep, mail, phone, street } = user;

      const institutionResponse = institutions.map((institution) => ({
        id: institution.id,
        name: institution.name,
        city: institution.city,
        country: institution.country,
      }));

      const userResponse = {
        id: Number(id),
        name,
        cep,
        street,
        mail,
        phone,
        institution: institutionResponse,
        articles: articleResponse,
      };

      res.status(200).json(userResponse);
    } catch (err) {
      console.log(`Error in SHOW of USER controller ${err}`);
      res.status(500).json({
        error: true,
        message: 'Error',
      });
    }
  }

  async store(req: Request, res: Response) {
    const {
      name,
      genus,
      cep,
      street,
      phone,
      mail,
      password,
      type,
      institutionId,
    } = req.body;
    const trx = await db.transaction();

    try {
      const usersId = await trx('USERS').insert({
        name,
        genus,
        cep,
        street,
        phone,
        mail,
        password,
      });

      await trx('ACTORS').insert({
        type,
        userId: usersId,
        institutionId,
      });

      await trx.commit();
      res.status(201).json({
        error: false,
        message: 'success',
      });
    } catch (err) {
      console.log(`Error in STORE of USER controller ${err}`);
      res.status(500).json({
        error: true,
        message: 'Error',
      });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;

    const data = req.body;
    try {
      const [user] = await db('USERS').where('id', '=', id);

      if (!user) {
        return res.status(404).json({
          error: false,
          message: 'User not found!',
        });
      }

      await db('USERS').where('id', '=', id).update(data);

      return res.status(201).json({
        error: false,
        message: 'success',
      });
    } catch (err) {
      console.log(`Error in UPDATE of USER controller ${err}`);
      res.status(500).json({
        error: true,
        message: 'Error',
      });
    }
  }

  async remove(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const [user] = await db('USERS').where('id', '=', id);

      if (!user) {
        return res.status(404).json({
          error: false,
          message: 'User not found!',
        });
      }

      await db('USERS').where('id', '=', id).del();

      res.status(200).json({
        error: false,
        message: 'success',
      });
    } catch (err) {
      console.log(`Erro in REMOVE of USER controller ${err}`);
      res.status(500).json({
        error: true,
        message: 'Error',
      });
    }
  }
}
