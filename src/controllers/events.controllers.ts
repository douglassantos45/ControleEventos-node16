/* eslint-disable no-shadow */
import { Request, Response } from 'expres';
import db from '../database/database';
import {
  Event,
  EventTopic,
  Committiee,
  CommittieeEvent,
  CommittieeArticle,
  Article,
} from '../interfaces/index';

export default class EventsController {
  async index(req: Request, res: Response) {
    try {
      const events = await db('events');
      const eventsTopics = await db('event_topics')
        .join('events', 'events.id', '=', 'event_topics.event_id')
        .join('topics', 'topics.id', '=', 'event_topics.topic_id')
        .select(['events.id', 'topics.type']);

      const eventsResponse = events.map((event: Event) => {
        const topics = eventsTopics.filter((topicEvent: EventTopic) => {
          if (topicEvent.id === event.id) {
            const topic = topicEvent.type;
            return { topic };
          }
        });

        return {
          id: event.id,
          event: {
            name: event.name,
            federation: event.federation,
            topics: topics.map((topic: EventTopic) => ({
              type: topic.type,
            })),
            start: event.start,
            end: event.end,
          },
        };
      });

      res.status(200).json({
        error: false,
        data: eventsResponse,
      });
    } catch (err) {
      console.log(`Error in INDEX of EVENTS controller ${err}`);
      return res.status(500).json({
        error: true,
        message: 'Error',
      });
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const [event] = await db('events').where('events.id', '=', id);
      const committieesEvent = await db('committiee_events')
        .join(
          'committiees',
          'committiees.id',
          '=',
          'committiee_events.committiee_id',
        )
        .join('events', 'events.id', '=', 'committiee_events.event_id')
        .join('actors', 'actors.id', '=', 'events.coordenator_id')
        .join('users', 'users.id', '=', 'actors.user_id');

      const committieeArticles = await db('committiee_articles').join(
        'articles',
        'articles.id',
        '=',
        'committiee_articles.article_id',
      );

      if (!event) {
        return res.status(404).json({
          error: false,
          message: 'Event not found!',
        });
      }

      const committiees = committieesEvent.filter(
        (committieeEvent: CommittieeEvent) => {
          if (event.id === committieeEvent.event_id) {
            return committieeEvent;
          }
        },
      );

      const committieeEvent = committiees.map((committiee: CommittieeEvent) => {
        const articles = committieeArticles.filter(
          (article: CommittieeArticle) => {
            if (article.committiee_id === committiee.committiee_id) {
              return article;
            }
          },
        );

        return {
          id: committiee.committiee_id,
          coordenator: {
            name: committiee.name,
          },
          articles: articles.map((article: Article) => ({
            title: article.title,
          })),
        };
      });

      const { name, federation, deadline, start, end } = event;

      const eventResponse = {
        event: {
          id: event.id,
          name,
          federation,
          deadline,
          start,
          end,
          committiee: committieeEvent,
        },
      };

      res.status(200).json(eventResponse);
    } catch (err) {
      console.log(`Error in INDEX of COMMITTIEE controllers ${err}`);
      return res.status(500).json({
        error: true,
        message: 'Error',
      });
    }
  }

  async store(req: Request, res: Response) {
    const { name, federation, deadline, start, end, topics, coordenatorId } =
      req.body;

    const trx = await db.transaction();
    try {
      const [event] = await trx('events').where('name', '=', name);
      if (event) {
        await trx.rollback();
        return res.status(401).json({
          error: false,
          message: 'event already registered!',
        });
      }

      const eventsId = await trx('events').insert({
        name,
        federation,
        deadline,
        start,
        end,
        coordenator_id: coordenatorId,
      });

      const eventTopics = topics.map((topic: EventTopic) => ({
        event_id: eventsId,
        topic_id: topic.id,
      }));

      await trx('event_topics').insert(eventTopics);

      await trx.commit();
      res.status(200).json({
        error: false,
        message: 'success',
      });
    } catch (err) {
      await trx.rollback();
      console.log(`Error in STORE of EVENTS controller: ${err}`);
      return res.status(500).json({
        error: true,
        message: 'Error',
      });
    }
  }
}
