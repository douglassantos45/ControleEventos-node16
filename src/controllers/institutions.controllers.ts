import { Request, Response } from 'express';
import db from '../database/database';

export default class InstitutionsController {
  async index(req: Request, res: Response) {
    try {
      const institutions = await db('INSTITUTIONS');
      res.status(200).json({
        error: false,
        data: institutions,
      });
    } catch (err) {
      console.log(`Error in INDEX of INSTITUTIONS controller ${err}`);
      return res.status(500).json({
        error: true,
        message: 'Error',
      });
    }
  }

  async store(req: Request, res: Response) {
    const data = req.body;
    try {
      await db('INSTITUTIONS').insert(data);
      res.status(201).send();
    } catch (err) {
      console.log(`Error in STORE of INSTITUTIONS controller ${err}`);
      return res.status(500).json({
        error: true,
        message: 'Error',
      });
    }
  }
}
