import { JSX } from 'react';
import { OverrideParams } from '../../../shared/types/search-browse';

export interface BrowsePageTitleOptions {
  title: string;
  subtitle?: string;
  icon?: JSX.Element;
  tabTitle?: string;
}

export interface QueryOpts {
  newTerm?: string;
  newPage?: number;
  overrideParams?: OverrideParams;
}

export enum BadgeType {
  RankBadge,
  AddedBadge,
  None,
}
