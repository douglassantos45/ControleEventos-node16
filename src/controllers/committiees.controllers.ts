/* eslint-disable max-len */
/* eslint-disable no-plusplus */
import { Request, Response } from 'express';
import db from '../database/database';
import {
  Actor,
  Article,
  Committiee,
  CommittieeAvaliator,
  CommittieeArticle,
  CommittieeEvent,
  AuthorArticle,
} from '../interfaces';

export default class CommittieesControllers {
  async index(req: Request, res: Response) {
    try {
      const committiees: Committiee[] = await db('COMMITTIEES');

      const committieesAvaliators: CommittieeAvaliator[] = await db(
        'COMMITTIEE_AVALIATOR',
      )
        .join(
          'COMMITTIEES',
          'COMMITTIEES.id',
          '=',
          'COMMITTIEE_AVALIATOR.committieeId',
        )
        .join('ACTORS', 'ACTORS.id', '=', 'COMMITTIEE_AVALIATOR.actorId')
        .join('USERS', 'USERS.id', '=', 'ACTORS.userId')
        .select([
          { committieeId: 'COMMITTIEES.id' },
          { actorsId: 'ACTORS.userId' },
          'ACTORS.*',
          'USERS.*',
        ]);

      const committieesEvents: CommittieeEvent[] = await db(
        'COMMITTIEES_EVENTS',
      )
        .join('EVENTS', 'EVENTS.id', '=', 'COMMITTIEES_EVENTS.eventId')
        .join('ACTORS', 'ACTORS.id', '=', 'EVENTS.coordenatorId')
        .join('USERS', 'USERS.id', '=', 'ACTORS.userId')
        .select([
          { userName: 'USERS.name' },
          { eventName: 'EVENTS.name' },
          { committieeId: 'COMMITTIEES_EVENTS.committieeId' },
          'COMMITTIEES_EVENTS.*',
        ]);

      const coordenatorCommittiees = await db('COMMITTIEES')
        .join('ACTORS', 'ACTORS.id', '=', 'committiees.coordenatorId')
        .join('USERS', 'USERS.id', '=', 'ACTORS.userId')
        .select([{ committieeId: 'committiees.id' }, 'USERS.name']);

      const committieeResponse = committiees.map((committiee) => {
        const avaliators = committieesAvaliators.filter(
          (committieeAvaliator) => {
            if (committiee.id === committieeAvaliator.committieeId) {
              return { committieeAvaliator };
            }
          },
        );

        const committieeEvent = committieesEvents.filter((event) => {
          if (event.committieeId === committiee.id) {
            return { event };
          }
        });

        const [event] = committieeEvent.map((ev) => ({
          name: ev.eventName as string,
          coordenator: ev.userName as string,
        }));

        const [coordenatorCommittiee] = coordenatorCommittiees.map(
          (coordenator: Actor) => ({
            name: coordenator.name,
          }),
        );

        return {
          committiee: {
            id: committiee.id,
            coordenator: coordenatorCommittiee.name,
            Avaliators: avaliators.map((avaliator) => ({
              name: avaliator.name,
              type: avaliator.type,
            })),
            event,
          },
        };
      });

      res.status(200).json(committieeResponse);
    } catch (err) {
      console.log(`Error in INDEX of COMMITTIEE controllers ${err}`);
      return res.status(500).json({
        error: true,
        message: 'Error',
      });
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const [committiee]: Committiee[] = await db('COMMITTIEES').where(
        'COMMITTIEES.id',
        '=',
        id,
      );

      if (!committiee) {
        return res.status(404).json({
          error: false,
          message: 'Committiee not found!',
        });
      }

      const committieesAvaliators: CommittieeAvaliator[] = await db(
        'COMMITTIEE_AVALIATOR',
      )
        .join(
          'COMMITTIEES',
          'COMMITTIEES.id',
          '=',
          'COMMITTIEE_AVALIATOR.committieeId',
        )
        .join('ACTORS', 'ACTORS.id', '=', 'COMMITTIEE_AVALIATOR.actorId')
        .join('USERS', 'USERS.id', '=', 'ACTORS.userId')
        .select([
          { committieeId: 'COMMITTIEES.id' },
          { actorsId: 'ACTORS.userId' },
          'ACTORS.*',
          'USERS.*',
        ]);

      const [committieesEvents]: CommittieeEvent[] = await db(
        'COMMITTIEES_EVENTS',
      )
        .join('EVENTS', 'EVENTS.id', '=', 'COMMITTIEES_EVENTS.eventId')
        .join('ACTORS', 'ACTORS.id', '=', 'EVENTS.coordenatorId')
        .join('USERS', 'USERS.id', '=', 'ACTORS.userId')
        .where('COMMITTIEES_EVENTS.committieeId', '=', id)
        .select([
          { userName: 'USERS.name' },
          { eventName: 'EVENTS.name' },
          'COMMITTIEES_EVENTS.*',
          'EVENTS.*',
        ]);

      const committieeArticles: CommittieeArticle[] = await db(
        'COMMITTIEE_ARTICLES',
      )
        .join('ARTICLES', 'ARTICLES.id', '=', 'COMMITTIEE_ARTICLES.articleId')
        .join('ACTORS', 'ACTORS.id', '=', 'ARTICLES.actorId')
        .join('USERS', 'USERS.id', '=', 'ACTORS.userId')
        .join(
          'COMMITTIEES',
          'COMMITTIEES.id',
          '=',
          'COMMITTIEE_ARTICLES.committieeId',
        )
        .select([
          { committieeId: 'COMMITTIEE_ARTICLES.committieeId' },
          'ARTICLES.title',
          'USERS.name',
        ]);

      const { userName, eventName, federation, start, end } = committieesEvents;

      const avaliators = committieesAvaliators.filter((committieeAvaliator) => {
        if (committiee.id === committieeAvaliator.committieeId) {
          return { committieeAvaliator };
        }
      });

      const articles = committieeArticles.filter((article) => {
        if (committiee.id === article.committieeId) {
          return { article };
        }
      });

      const committieeResponse = {
        committiee: {
          id: committiee.id,
          coordenator: userName,
          avaliators: avaliators.map((avaliator) => ({
            name: avaliator.name,
            type: avaliator.type,
          })),
          articles: articles.map((article) => ({
            subimission: article.name,
            title: article.title,
          })),
          event: {
            name: eventName,
            federation,
            start,
            end,
          },
        },
      };

      res.status(200).json(committieeResponse);
    } catch (err) {
      console.log(`Error in INDEX of COMMITTIEE controllers ${err}`);
      return res.status(500).json({
        error: true,
        message: 'Error',
      });
    }
  }

  async store(req: Request, res: Response) {
    const { coordenatorId, avaliatorsId, articlesId } = req.body;
    const eventId = Number(req.params.id);

    const trx = await db.transaction();

    try {
      const committieeId: Committiee[] = await trx('COMMITTIEES').insert({
        coordenatorId,
      });
      const committieeAvaliators: CommittieeAvaliator[] = avaliatorsId.map(
        (avaliator: CommittieeAvaliator) => ({
          committieeId,
          actorId: avaliator.id,
        }),
      );

      const authorArticles: AuthorArticle[] = await trx('ARTICLE_EVENTS')
        .join('EVENTS', 'EVENTS.id', '=', 'ARTICLE_EVENTS.eventId')
        .join(
          'AUTHOR_ARTICLES',
          'AUTHOR_ARTICLES.articleId',
          '=',
          'ARTICLE_EVENTS.articleId',
        )
        .join('ARTICLES', 'ARTICLES.id', '=', 'AUTHOR_ARTICLES.articleId')
        .join('ACTORS', 'ACTORS.id', '=', 'ARTICLES.actorId')
        .join('USERS', 'USERS.id', '=', 'ACTORS.userId')
        .where('EVENTS.id', '=', eventId)
        .select(['USERS.name', 'ARTICLES.actorId']);

      const avaliatorsIds: number[] = committieeAvaliators.map(
        (avaliator: CommittieeAvaliator) => avaliator.actorId,
      );

      const authorsIds = authorArticles.map(
        (articleAvaliator) => articleAvaliator.actorId,
      );

      const nameArray: string[] = [];

      authorArticles.map((author) => {
        const authorName = avaliatorsIds.map((avaliatorId) => {
          if (avaliatorId === author.actorId) {
            const { name } = author;
            return nameArray.push(name);
          }
        });
        return authorName;
      });

      let existsNember = 0;

      for (let i = 0; i < avaliatorsIds.length; i++) {
        for (let j = 0; j < authorsIds.length; j++) {
          if (avaliatorsIds[i] === authorsIds[j]) {
            existsNember = 1;
          }
        }
      }

      if (existsNember === 1) {
        await trx.rollback();
        return res.status(401).json({
          error: true,
          message: `The ${nameArray} reviewer cannot have an article to be reviewed by the same committiee.`,
        });
      }

      const committieeArticles: CommittieeArticle = articlesId.map(
        (article: Article) => ({
          committieeId,
          articleId: article.id,
        }),
      );

      await trx('COMMITTIEE_AVALIATOR').insert(committieeAvaliators);
      await trx('COMMITTIEES_EVENTS').insert({
        eventId,
        committieeId,
      });
      await trx('COMMITTIEE_ARTICLES').insert(committieeArticles);

      /*
       * Atualizando v??rios registros de uma ??nica vez
       */
      const actorsUpdate = avaliatorsIds.map(async (id: number) => {
        const update = await trx('ACTORS')
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
