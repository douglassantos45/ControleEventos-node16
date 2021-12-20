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

  async show(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const committiees = await db('committiees');

      const committieesAppraisers = await db('committiee_appraisers')
        .join(
          'committiees',
          'committiees.id',
          '=',
          'committiee_appraisers.committiee_id',
        )
        .join('actors', 'actors.id', '=', 'committiee_appraisers.appraiser_id')
        .join('users', 'users.id', '=', 'actors.user_id')
        .select([
          { committieeId: 'committiees.id' },
          { actorsId: 'actors.user_id' },
          'actors.*',
          'users.*',
        ]);

      const committieesEvents = await db('committiee_events')
        .join('events', 'events.id', '=', 'committiee_events.event_id')
        .join('actors', 'actors.id', '=', 'events.coordenator_id')
        .join('users', 'users.id', '=', 'actors.user_id')
        .where('events.id', '=', id)
        .select([
          { userName: 'users.name' },
          { eventName: 'events.name' },
          'committiee_events.*',
        ]);

      const coordenatorCommittiees = await db('committiees')
        .join('actors', 'actors.id', '=', 'committiees.coordenator_id')
        .join('users', 'users.id', '=', 'actors.user_id')
        .select([{ committieeId: 'committiees.id' }, 'users.name']);

      const committeeResponse = committiees.map((committiee) => {
        const appraisers = committieesAppraisers.filter(
          (committieeAppraiser) => {
            if (committiee.id === committieeAppraiser.committieeId) {
              return { committieeAppraiser };
            }
          },
        );

        const committieeEvent = committieesEvents.filter((coordenatorEvent) => {
          if (coordenatorEvent.committiee_id === committiee.id) {
            return { coordenatorEvent };
          }
        });

        const [event] = committieeEvent.map((ev) => ({
          name: ev.eventName,
          coordenator: ev.userName,
          start: ev.start,
          final: ev.final,
        }));

        const [coordenatorCommittiee] = coordenatorCommittiees.map(
          (coordenator) => ({
            name: coordenator.name,
          }),
        );

        return {
          committiee: {
            id: committiee.id,
            coordenator: coordenatorCommittiee.name,
            appraisers: appraisers.map((appraiser) => ({
              name: appraiser.name,
              type: appraiser.type,
            })),
            event,
          },
        };
      });

      res.status(200).json(committeeResponse);
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
