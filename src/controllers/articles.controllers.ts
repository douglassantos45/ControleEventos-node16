import { Request, Response } from 'express';
import db from '../database/database';

export default class ArticlesController {
  async store(req: Request, res: Response) {
    const { title, memberId, eventId, topics } = req.body;
    const trx = await db.transaction();
    try {
      const articlesIds = await trx('articles').insert({
        title,
        memberId,
        eventId,
      });

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