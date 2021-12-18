/* eslint-disable no-plusplus */
import { Request, Response } from 'express';
import db from '../database/database';

export default class CommittieesControllers {
  async store(req: Request, res: Response) {
    const coordenatorId = req.body.id;
    const { appraisers, event, articles } = req.body;
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
            const name = member.name;
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
