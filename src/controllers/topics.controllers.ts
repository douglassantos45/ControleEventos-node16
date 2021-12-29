import { Requeest, Response } from 'express';
import db from '../database/database';

export default class Topics {
  async index(req: Request, res: Response) {
    try {
      const topics = await db('topics');

      res.status(200).json({
        error: false,
        data: topics,
      });
    } catch (err) {
      console.log(`Error in INDEX of TOPICS controller ${err}`);
      return res.status(500).json({
        error: true,
        message: 'Error',
      });
    }
  }

  async store(req: Request, res: Response) {
    try {
      res.send('Store');
    } catch (err) {
      console.log(`Error in STORE of TOPICS controller ${err}`);
      return res.status(500).json({
        error: true,
        message: 'Error',
      });
    }
  }
}
