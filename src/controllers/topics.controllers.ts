import { Request, Response } from 'express';
import db from '../database/database';
import { Topic } from '../interfaces';

export default class TopicsControllers {
  async index(req: Request, res: Response) {
    try {
      const topics: Topic[] = await db('TOPICS');

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
    const { type }: Topic = req.body;
    try {
      await db('TOPICS').insert({
        type,
      });
      res.status(201).send();
    } catch (err) {
      console.log(`Error in STORE of TOPICS controller ${err}`);
      return res.status(500).json({
        error: true,
        message: 'Error',
      });
    }
  }
}
