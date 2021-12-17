import { Request, Response } from 'express';
import db from '../database/database';

export default class CommittieesControllers {
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

      const articlesAppraiserId = await trx('articles')
        .join('events', 'events.id', '=', 'articles.event_id')
        .join('actors', 'actors.id', '=', 'articles.member_id')
        .join('users', 'users.id', '=', 'actors.user_id')
        .where('events.id', '=', event)
        .select(['articles.member_id', 'users.name']);

      const appraisersIds = committieeApraisers.map((com) => com.appraiser_id);

      const [appraiserId] = articlesAppraiserId.map((articlesAppraiser) => {
        console.log(articlesAppraiser);
        const [appraiser] = appraisersIds.filter(
          (appraiserId) => articlesAppraiser.member_id === appraiserId,
        );

        return appraiser;
      });

      const userName = articlesAppraiserId.map((aP) => {
        const name = aP.name;
        return name;
      });

      if (appraiserId) {
        await trx.rollback();
        return res.status(401).json({
          error: true,
          message: `The ${userName} reviewer cannot have an article to be reviewed by the same committee.`,
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
