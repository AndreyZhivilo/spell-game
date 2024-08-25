import { useState, useRef } from 'react';
import type { IHero, IPlayerConfig } from '../types/index.ts';
import { throttle } from '../lib/utils.ts';

export function useHero({
  id,
  heroSpeed,
  x,
  y,
  color,
  direction,
}: IPlayerConfig): IHero {
  const [shootInterval, setShootInterval] = useState(1000);
  const [speed, setSpeed] = useState(heroSpeed);
  const [bulletColor, setBulletColor] = useState(color);
  const [score, setScore] = useState(0);
  const position = useRef({ x, y, direction });
  const lastShotTime = useRef(0);
  const changeDirection = throttle(() => {
    position.current.direction =
      position.current.direction === 'up' ? 'down' : 'up';
  }, 300);

  return {
    id,
    x,
    y,
    radius: 20,
    dy: speed,
    color,
    lastShotTime,
    position: position.current,
    shootInterval,
    bulletColor,
    speed,
    score,
    setScore,
    setShootInterval,
    setBulletColor,
    setSpeed,
    changeDirection,
  };
}
