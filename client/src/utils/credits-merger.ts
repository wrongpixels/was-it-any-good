import { CreditResponse, MergedCredits } from '../../../shared/types/models';
import { AuthorType } from '../../../shared/types/roles';

const crewRolePriority: Record<AuthorType, number> = {
  [AuthorType.Creator]: 0,
  [AuthorType.Director]: 1,
  [AuthorType.Writer]: 2,
  [AuthorType.ExecProducer]: 3,
  [AuthorType.Producer]: 4,
  [AuthorType.MusicComposer]: 5,
  [AuthorType.Actor]: 98,
  [AuthorType.Unknown]: 99,
};

//to merge individual credits within the same media for the each person.
//we display them in order according to the priority

export const mergeCredits = (
  credits: CreditResponse[]
): MergedCredits[] | undefined => {
  const mergedMap: Map<number, MergedCredits> = new Map<
    number,
    MergedCredits
  >();

  credits.forEach((c: CreditResponse) => {
    const personId: number = c.person.id;
    const currentRole: AuthorType = c.role;

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
        order: mergedMap.size,
      });
    }
  });

  mergedMap.forEach((entry: MergedCredits) => {
    entry.mergedRoles.sort((a, b) => {
      return (crewRolePriority[a] ?? 99) - (crewRolePriority[b] ?? 99);
    });
  });

  const mergedList: MergedCredits[] = Array.from(mergedMap.values());
  mergedList.sort((a, b) => {
    const aPriority = crewRolePriority[a.mergedRoles[0]] ?? 99;
    const bPriority = crewRolePriority[b.mergedRoles[0]] ?? 99;
    return aPriority - bPriority;
  });

  return mergedList.length > 0 ? mergedList : undefined;
};

export const isMerged = (
  c: MergedCredits | CreditResponse
): c is MergedCredits =>
  c && 'mergedRoles' in c && Array.isArray((c as MergedCredits).mergedRoles);
