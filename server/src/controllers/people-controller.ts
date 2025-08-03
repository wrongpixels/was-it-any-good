import express, { Request, Response } from 'express';
import { Person } from '../models';
import CustomError from '../util/customError';
import {
  IndexMediaData,
  MediaRoleResponse,
  PersonResponse,
} from '../../../shared/types/models';
import {
  AuthorMedia,
  authorOrder,
  SortedRoles,
} from '../../../shared/types/roles';
import { MediaType } from '../../../shared/types/media';
import { toPlain } from '../util/model-helpers';
const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const people: PersonResponse[] = await Person.scope('withMedia').findAll(
      {}
    );

    res.json(people);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  async (req: Request, res: Response<PersonResponse | null>, next) => {
    try {
      const id: string = req.params.id;
      if (!id) {
        throw new CustomError('Wrong id format', 400);
      }
      const person: Person | null =
        await Person.scope('withMedia').findByPk(id);
      if (!person) {
        res.json(null);
        return;
      }
      const personData: PersonResponse = toPlain<Person>(person);
      res.json({ ...personData, sortedRoles: sortRoles(personData) });
    } catch (error) {
      next(error);
    }
  }
);

const getIndexMedia = (role: MediaRoleResponse): IndexMediaData | undefined => {
  if (role.mediaType === MediaType.Film) {
    return role.film?.indexMedia;
  }
  if (role.mediaType === MediaType.Show) {
    return role.show?.indexMedia;
  }
  return undefined;
};
const sortRoles = (person: PersonResponse): SortedRoles => {
  const authorMedia: AuthorMedia[] = [];
  person.roles?.forEach((r: MediaRoleResponse) => {
    const indexMedia: IndexMediaData | undefined = getIndexMedia(r);
    if (indexMedia) {
      const entry = authorMedia.find(
        (a: AuthorMedia) => a.authorType === r.role
      );
      if (entry) {
        entry.indexMedia.push(indexMedia);
      } else {
        authorMedia.push({ authorType: r.role, indexMedia: [indexMedia] });
      }
    }
  });
  authorMedia.sort((a, b) => {
    const countB = b.indexMedia.length;
    const countA = a.indexMedia.length;
    if (countA !== countB) {
      return countB - countA;
    }
    return (
      authorOrder.indexOf(a.authorType) - authorOrder.indexOf(b.authorType)
    );
  });
  const mainRoles = authorMedia.map((role) => role.authorType);
  return { mediaByRole: authorMedia, mainRoles };
};

export default router;
