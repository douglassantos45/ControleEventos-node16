import { Request, Response } from 'express';
import db from '../database/database';

import { Actor } from '../interfaces/index';

export default class UserController {
  async index(req: Request, res: Response) {
    try {
      const users = await db('ACTORS')
        .join('USERS', 'USERS.id', '=', 'ACTORS.userId')
        .select(['ACTORS.type', 'USERS.*']);

      res.status(200).json({
        error: false,
        data: users.map((user: Actor) => ({
          id: user.id,
          name: user.name,
          email: user.mail,
          phone: user.phone,
          cep: user.cep,
          street: user.street,
          type: user.type,
        })),
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
    const { name, genus, cep, street, phone, mail, password, type } = req.body;
    const trx = await db.transaction();

    try {
      const usersId = await trx('USERS').insert({
        name,
        genus,
        cep,
        street,
        phone,
        mail,
        password,
      });

      await trx('ACTORS').insert({
        type,
        userId: usersId,
      });

      await trx.commit();
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
    const { id } = req.params;

    const data = req.body;
    try {
      const [user] = await db('USERS').where('id', '=', id);

      if (!user) {
        return res.status(404).json({
          error: false,
          message: 'User not found!',
        });
      }

      await db('USERS').where('id', '=', id).update(data);

      return res.status(201).json({
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
      const [user] = await db('USERS').where('id', '=', id);

      if (!user) {
        return res.status(404).json({
          error: false,
          message: 'User not found!',
        });
      }

      await db('USERS').where('id', '=', id).del();

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
