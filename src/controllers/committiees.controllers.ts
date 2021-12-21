/* eslint-disable no-plusplus */
import { Request, Response } from 'express';
import db from '../database/database';

export default class CommittieesControllers {
  async index(req: Request, res: Response) {
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

  async show(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const [committiee] = await db('committiees').where(
        'committiees.id',
        '=',
        id,
      );

      if (!committiee) {
        return res.status(404).json({
          error: false,
          message: 'Committee not found!',
        });
      }

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

      const [committieesEvents] = await db('committiee_events')
        .join('events', 'events.id', '=', 'committiee_events.event_id')
        .join('actors', 'actors.id', '=', 'events.coordenator_id')
        .join('users', 'users.id', '=', 'actors.user_id')
        .where('committiee_events.committiee_id', '=', id)
        .select([
          { userName: 'users.name' },
          { eventName: 'events.name' },
          'committiee_events.*',
          'events.*',
        ]);

      const committieeArticles = await db('committiee_articles')
        .join('articles', 'articles.id', '=', 'committiee_articles.article_id')
        .join('actors', 'actors.id', '=', 'articles.member_id')
        .join('users', 'users.id', '=', 'actors.user_id')
        .join(
          'committiees',
          'committiees.id',
          '=',
          'committiee_articles.committiee_id',
        )
        .select([
          'committiee_articles.committiee_id',
          'articles.title',
          'users.name',
        ]);

      const coordenatorCommittiees = await db('committiees')
        .join('actors', 'actors.id', '=', 'committiees.coordenator_id')
        .join('users', 'users.id', '=', 'actors.user_id')
        .select([{ committieeId: 'committiees.id' }, 'users.name']);

      const { userName, eventName, federation, start, end } = committieesEvents;

      const appraisers = committieesAppraisers.filter((committieeAppraiser) => {
        if (committiee.id === committieeAppraiser.committieeId) {
          return { committieeAppraiser };
        }
      });

      const articles = committieeArticles.filter((article) => {
        if (committiee.id === article.committiee_id) {
          return { article };
        }
      });

      const [coordenatorCommittiee] = coordenatorCommittiees.map(
        (coordenator) => ({
          name: coordenator.name,
        }),
      );

      const committeeResponse = {
        committiee: {
          id: committiee.id,
          coordenator: coordenatorCommittiee.name,
          appraisers: appraisers.map((appraiser) => ({
            name: appraiser.name,
            type: appraiser.type,
          })),
          articles: articles.map((article) => ({
            subimission: article.name,
            title: article.title,
          })),
          event: {
            coordenator: userName,
            name: eventName,
            federation,
            start,
            end,
          },
        },
      };

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
    const { coordenatorId, appraisers, event, articles } = req.body;
    const trx = await db.transaction();

    try {
      const committieeId = await trx('committiees').insert({
        coordenator_id: coordenatorId,
      });

      const committieeApraisers = appraisers.map((appraiser) => ({
        committiee_id: committieeId,
        appraiser_id: appraiser.id,
      }));

      const memberArticles = await trx('articles_events')
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
        .where('events.id', '=', event)
        .select(['users.name', 'articles.member_id']);

      const appraisersIds = committieeApraisers.map(
        (appraiser) => appraiser.appraiser_id,
      );

      const membersIds = memberArticles.map(
        (articleAppraiser) => articleAppraiser.member_id,
      );

      const nameArray: string[] = [];

      memberArticles.map((member) => {
        const memberName = appraisersIds.map((appraiserId) => {
          if (appraiserId === member.member_id) {
            const { name } = member;
            return nameArray.push(name);
          }
        });
        return memberName;
      });

      let existsNember = 0;

      for (let i = 0; i < appraisersIds.length; i++) {
        for (let j = 0; j < membersIds.length; j++) {
          if (appraisersIds[i] === membersIds[j]) {
            existsNember = 1;
          }
        }
      }

      if (existsNember === 1) {
        await trx.rollback();
        return res.status(401).json({
          error: true,
          message: `The ${nameArray} reviewer cannot have an article to be reviewed by the same committee.`,
        });
      }

      const committieeArticles = articles.map((article) => ({
        committiee_id: committieeId,
        article_id: article.id,
      }));

      await trx('committiee_appraisers').insert(committieeApraisers);
      await trx('committiee_events').insert({
        event_id: event,
        committiee_id: committieeId,
      });
      await trx('committiee_articles').insert(committieeArticles);

      /*
       * Atualizando vários registros de uma única vez
       */
      const actorsUpdate = appraisersIds.map(async (id) => {
        const update = await trx('actors')
          .update({
            type: 'avaliador',
          })
          .where('id', '=', id);
        return update;
      });

      await Promise.all(actorsUpdate);

      await trx.commit();

      res.status(201).json({
        error: false,
        message: 'success',
      });
    } catch (err) {
      console.log(`Error in STORE of COMMITTIEE controllers ${err}`);
      await trx.rollback();
      return res.status(500).json({
        error: true,
        message: 'Error',
      });
    }
  }
}
