import { Request, Response } from 'expres';
import db from '../database/database';

export default class EventsController {
  async index(req: Request, res: Response) {
    try {
      const events = await db('events');
      const eventsTopics = await db('event_topics')
        .join('events', 'events.id', '=', 'event_topics.event_id')
        .join('topics', 'topics.id', '=', 'event_topics.topic_id')
        .select(['events.id', 'topics.type']);

      const eventsResponse = events.map((event) => {
        const topics = eventsTopics.filter((topicEvent) => {
          if (topicEvent.id === event.id) {
            delete topicEvent.id;
            const topic = topicEvent.type;
            return { topic };
          }
        });

        return {
          id: event.id,
          event: {
            name: event.name,
            federation: event.federation,
            topics,
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

      const eventTopics = topics.map((topic) => {
        return {
          event_id: eventsId,
          topic_id: topic.id,
        };
      });

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
