import { Request, Response } from 'express';
import db from '../database/database';
import { ArticleEvent, ArticleTopic } from '../interfaces';

export default class ArticlesController {
  async index(req: Request, res: Response) {
    try {
      const articles = await db('articles_events')
        .join('events', 'events.id', '=', 'articles_events.event_id')
        .join(
          'actor_articles',
          'actor_articles.article_id',
          '=',
          'articles_events.article_id',
        )
        .join('articles', 'articles.id', '=', 'actor_articles.article_id')
        .join('actors', 'actors.id', '=', 'articles.member_id')
        .join('users', 'users.id', '=', 'actors.user_id')
        .select([
          'events.name',
          'articles.id',
          'articles.title',
          { userName: 'users.name' },
        ]);

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
    const { title, memberId, eventId, topics } = req.body;
    const trx = await db.transaction();
    try {
      const articlesIds = await trx('articles').insert({
        title,
        member_id: memberId,
      });

      const articleTopoics = topics.map((topic: ArticleTopic) => ({
        article_id: articlesIds,
        topic_id: topic.id,
      }));

      await trx('article_topics').insert(articleTopoics);
      await trx('articles_events').insert({
        article_id: articlesIds,
        event_id: eventId,
      });
      await trx('actor_articles').insert({
        actor_id: memberId,
        article_id: articlesIds,
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
