import { Request, Response } from 'express';
import db from '../database/database';
import { ArticleEvent, ArticleTopic } from '../interfaces';

export default class ArticlesController {
  async index(req: Request, res: Response) {
    try {
      const articles = await db('ARTICLE_EVENTS')
        .join('EVENTS', 'EVENTS.id', '=', 'ARTICLE_EVENTS.eventId')
        .join(
          'AUTHOR_ARTICLES',
          'AUTHOR_ARTICLES.articleId',
          '=',
          'ARTICLE_EVENTS.articleId',
        )
        .join('ARTICLES', 'ARTICLES.id', '=', 'AUTHOR_ARTICLES.articleId')
        .join('ACTORS', 'ACTORS.id', '=', 'ARTICLES.actorId')
        .join('USERS', 'USERS.id', '=', 'ACTORS.userId')
        .select([
          'EVENTS.name',
          'ARTICLES.id',
          'ARTICLES.title',
          { userName: 'USERS.name' },
        ]);
      console.log(articles);
      const articlesResponse = articles.map((article: ArticleEvent) => ({
        id: article.id,
        article: {
          title: article.title,
          submission: article.userName,
        },
        event: article.name,
      }));

      res.status(200).json({
        error: false,
        data: articlesResponse,
      });
    } catch (err) {
      console.log(`Error in INDEX of EVENTS controller ${err}`);
      return res.status(500).json({
        error: true,
        message: 'Error',
      });
    }
  }

  async store(req: Request, res: Response) {
    const { title, actorId, eventId, topics } = req.body;
    const trx = await db.transaction();
    try {
      const articlesIds = await trx('ARTICLES').insert({
        title,
        actorId,
      });

      const articleTopoics = topics.map((topic: ArticleTopic) => ({
        articleId: articlesIds,
        topicId: topic.id,
      }));

      await trx('ARTICLE_TOPICS').insert(articleTopoics);
      await trx('ARTICLE_EVENTS').insert({
        articleId: articlesIds,
        eventId,
      });
      await trx('AUTHOR_ARTICLES').insert({
        actorId,
        articleId: articlesIds,
      });

      await trx.commit();

      res.status(201).json({
        error: false,
        message: 'success',
      });
    } catch (err) {
      console.log(`Error in STORE of ARTICLES controllers ${err}`);
      await trx.rollback();
      return res.status(500).json({
        error: true,
        message: 'Error',
      });
    }
  }
}
