import { Request, Response } from 'express';
import db from '../database/database';

export default class CommittieesControllers {
  async store(req: Request, res: Response) {
    const { coordenatorId, appraisers, events, articles } = req.body;
    const trx = await db.transaction();
    try {
      const committieeId = await trx('committiees').insert({
        coordenator_id: coordenatorId,
      });

      const committieeApraisers = appraisers.map((appraiser) => {
        return {
          committiee_id: committieeId,
          appraiser_id: appraiser.id,
        };
      });

      const committieeEvents = events.map((event) => {
        return {
          committiee_id: committieeId,
          event: event.id,
        };
      });

      const committieeArticles = articles.map((article) => {
        return {
          committiee_id: committieeId,
          article_id: article.id,
        };
      });

      const [appraiser] = await trx('committiee_apraisers')
        .join(
          'articles',
          'articles.member_id',
          '=',
          'committiee_apraisers.appraiser_id',
        )
        .select(['articles.member_id']);

      console.log(appraiser);

      /* await trx('committiee_apraisers').insert(committieeApraisers);
      await trx('committiee_events').insert(committieeEvents);
      await trx('committiee_articles').insert(committieeArticles); */

      await trx.rollback();

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
