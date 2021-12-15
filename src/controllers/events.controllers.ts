import { Request, Response } from 'expres';
import db from '../database/database';

export default class EventsController {
  async index(req: Request, res: Response) {
    try {
      const events = await db('events');
      res.status(200).json({
        error: false,
        data: events,
      });
    } catch (err) {
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
      const event = await db('events').where('name', '=', name);
      if (event) {
        return res.status(401).json({
          error: false,
          message: 'event already registered!',
        });
      }

      const eventsId = await db('events').insert({
        name,
        federation,
        deadline,
        start,
        end,
        coordenatorId,
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
      return res.status(500).json({
        error: true,
        message: 'Error',
      });
    }
  }
}
