import { Request, Response } from 'express';
import db from '../database/database';

export default class ArticlesController {
  async index(req: Request, res: Response) {
    try {
      const articles = await db('articles')
        .join('events', 'events.id', '=', 'articles.event_id')
        .join('actors', 'actors.id', '=', 'articles.member_id')
        .join('users', 'users.id', '=', 'actors.user_id')
        .select([
          { articleId: 'articles.id' },
          'articles.*',
          { userId: 'users.id' },
          { userName: 'users.name' },
          { eventId: 'events.id' },
          { eventName: 'events.name' },
          'events.*',
        ]);

      const articlesTopics = await db('article_topics')
        .join('articles', 'articles.id', '=', 'article_topics.article_id')
        .join('topics', 'topics.id', '=', 'article_topics.topic_id')
        .select(['articles.id', 'topics.type']);

      const articlesResponse = articles.map((article) => {
        const topics = articlesTopics.filter((topicEvent) => {
          if (topicEvent.id === article.articleId) {
            delete topicEvent.id;
            const topic = topicEvent.type;
            return { topic };
          }
        });

        return {
          id: article.id,
          article: {
            title: article.title,
            submission: article.userName,
            topics,
          },
          event: {
            name: article.eventName,
            federation: article.federation,
            deadline: article.deadline,
          },
        };
      });

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
        event_id: eventId,
      });

      const articleTopoics = topics.map((topic) => {
        return {
          article_id: articlesIds,
          topic_id: topic.id,
        };
      });

      await trx('article_topics').insert(articleTopoics);

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
