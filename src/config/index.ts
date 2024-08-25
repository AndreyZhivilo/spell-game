import { FIELD_WIDTH, FIELD_HEIGHT } from '../lib/constants.ts';
import type { IPlayerConfig } from '../types/index.ts';

export const player1Config: IPlayerConfig = {
  id: 1,
  heroSpeed: 2,
  x: FIELD_WIDTH / 3,
  y: FIELD_HEIGHT / 2,
  color: 'red',
  direction: 'up',
};

export const player2Config: IPlayerConfig = {
  id: 2,
  heroSpeed: 2,
  x: (2 * FIELD_WIDTH) / 3,
  y: FIELD_HEIGHT / 2,
  color: 'blue',
  direction: 'down',
};
