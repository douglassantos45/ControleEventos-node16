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
      const events = await db('EVENTS');
      const eventsTopics = await db('EVENT_TOPICS')
        .join('EVENTS', 'EVENTS.id', '=', 'EVENT_TOPICS.eventId')
        .join('topics', 'topics.id', '=', 'EVENT_TOPICS.topicId')
        .select(['EVENTS.id', 'topics.type']);

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
      const [event] = await db('EVENTS').where('EVENTS.id', '=', id);
      const committieesEvent = await db('COMMITTIEES_EVENTS')
        .join(
          'COMMITTIEES',
          'COMMITTIEES.id',
          '=',
          'COMMITTIEES_EVENTS.committieeId',
        )
        .join('EVENTS', 'EVENTS.id', '=', 'COMMITTIEES_EVENTS.eventId')
        .join('ACTORS', 'ACTORS.id', '=', 'EVENTS.coordenatorId')
        .join('USERS', 'USERS.id', '=', 'ACTORS.userId');

      const committieeArticles = await db('COMMITTIEE_ARTICLES').join(
        'ARTICLES',
        'ARTICLES.id',
        '=',
        'COMMITTIEE_ARTICLES.articleId',
      );

      if (!event) {
        return res.status(404).json({
          error: false,
          message: 'Event not found!',
        });
      }

      const committiees = committieesEvent.filter(
        (committieeEvent: CommittieeEvent) => {
          if (event.id === committieeEvent.eventId) {
            return committieeEvent;
          }
        },
      );

      const committieeEvent = committiees.map((committiee: CommittieeEvent) => {
        const articles = committieeArticles.filter(
          (article: CommittieeArticle) => {
            if (article.committieeId === committiee.committieeId) {
              return article;
            }
          },
        );

        return {
          id: committiee.committieeId,
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
          coordenator: 'test',
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
      const [event] = await trx('EVENTS').where('name', '=', name);
      if (event) {
        await trx.rollback();
        return res.status(401).json({
          error: false,
          message: 'event already registered!',
        });
      }

      const eventsId = await trx('EVENTS').insert({
        name,
        federation,
        deadline,
        start,
        end,
        coordenatorId,
      });

      const eventTopics = topics.map((topic: EventTopic) => ({
        eventId: eventsId,
        topicId: topic.id,
      }));

      await trx('EVENT_TOPICS').insert(eventTopics);

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
