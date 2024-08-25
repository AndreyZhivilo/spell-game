import { useRef } from 'react';
import { IBullet } from '../types/index.ts';

export function useBullets() {
  const bullets = useRef<IBullet[]>([]);
  return bullets;
}
