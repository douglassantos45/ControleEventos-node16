import { Request, Response } from 'express';
import db from '../database/database';
import { Institution } from '../interfaces';

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
    const { name, city, country }: Institution = req.body;
    try {
      await db('INSTITUTIONS').insert({
        name,
        city,
        country,
      });
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
