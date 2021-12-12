import { Request, Response } from 'express';
import db from '../database/database';

export default class UserController {
  async index(req: Request, res: Response) {
    try {
      const users = await db('actors')
        .join('users', 'users.id', '=', 'actors.user_id')
        .select(['actors.type', 'users.*']);

      res.status(200).json({
        error: false,
        data: users,
      });
    } catch (err) {
      console.log(`Error in Index of USER controller ${err}`);
      res.status(500).json({
        error: true,
        message: 'Error',
      });
    }
  }

  async store(req: Request, res: Response) {
    const data = req.body;
    try {
      console.log(data);
      res.status(201).json({
        error: false,
        message: 'success',
      });
    } catch (err) {
      console.log(`Error in STORE of USER controller ${err}`);
      res.status(500).json({
        error: true,
        message: 'Error',
      });
    }
  }

  async update(req: Request, res: Response) {
    const data = req.body;
    try {
      console.log(data);
      res.status(201).json({
        error: false,
        message: 'success',
      });
    } catch (err) {
      console.log(`Error in UPDATE of USER controller ${err}`);
      res.status(500).json({
        error: true,
        message: 'Error',
      });
    }
  }

  async remove(req: Request, res: Response) {
    const { id } = req.params;
    try {
      res.status(200).json({
        error: false,
        message: 'success',
      });
    } catch (err) {
      console.log(`Erro in REMOVE of USER controller ${err}`);
      res.status(500).json({
        error: true,
        message: 'Error',
      });
    }
  }
}
