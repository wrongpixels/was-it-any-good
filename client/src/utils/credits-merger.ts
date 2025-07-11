import { CreditResponse, MergedCredits } from '../../../shared/types/models';
import { AuthorType } from '../../../shared/types/roles';

const mergeCredits = (
  credits: CreditResponse[]
): MergedCredits[] | undefined => {
  const mergedMap: Map<number, MergedCredits> = new Map<
    number,
    MergedCredits
  >();

  credits.forEach((c: CreditResponse) => {
    const personId: number = c.person.id;
    const currentRole: string = c.role;

    if (!personId) {
      return;
    }

    if (mergedMap.has(personId)) {
      const existingEntry: MergedCredits = mergedMap.get(personId)!;
      if (currentRole && !existingEntry.mergedRoles.includes(currentRole)) {
        existingEntry.mergedRoles.push(currentRole);
      }
    } else {
      mergedMap.set(personId, {
        person: c.person,
        mergedRoles: currentRole ? [currentRole] : [],
      });
    }
  });

  mergedMap.forEach((entry: MergedCredits) => {
    entry.mergedRoles.sort((a, b) => {
      if (a === AuthorType.Director && b !== AuthorType.Director) {
        return -1;
      }
      if (b === AuthorType.Director && a !== AuthorType.Director) {
        return 1;
      }
      return a.localeCompare(b);
    });
  });

  const mergedList: MergedCredits[] = Array.from(mergedMap.values());
  mergedList.sort((a: MergedCredits, b: MergedCredits) => {
    const aIsDirector: boolean = a.mergedRoles.includes(AuthorType.Director);
    const bIsDirector: boolean = b.mergedRoles.includes(AuthorType.Director);
    if (aIsDirector && !bIsDirector) {
      return -1;
    }
    if (!aIsDirector && bIsDirector) {
      return 1;
    }
    return 0;
  });
  return mergedList.length > 0 ? mergedList : undefined;
};

export const isMerged = (
  c: MergedCredits | CreditResponse
): c is MergedCredits => {
  return 'mergedRoles' in c;
};

export default mergeCredits;
