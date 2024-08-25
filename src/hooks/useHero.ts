import { useState, useRef } from 'react';
import { IHero } from '../types/index.ts';
import { throttle } from '../lib/utils.ts';

export function useHero({
  heroSpeed,
  x,
  y,
  color,
  direction,
}: {
  heroSpeed: number;
  x: number;
  y: number;
  color: string;
  direction: 'up' | 'down';
}): IHero {
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
