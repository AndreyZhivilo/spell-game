import { MutableRefObject } from 'react';

export interface IHero {
  x: number;
  y: number;
  radius: number;
  dy: number;
  color: string;
  lastShotTime: MutableRefObject<number>;
  shootInterval: number;
  bulletColor: string;
  speed: number;
  position: {
    x: number;
    y: number;
    direction: 'up' | 'down';
  };
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setSpeed: React.Dispatch<React.SetStateAction<number>>;
  setShootInterval: React.Dispatch<React.SetStateAction<number>>;
  setBulletColor: React.Dispatch<React.SetStateAction<string>>;
  changeDirection: () => void;
}

export interface IBullet {
  x: number;
  y: number;
  radius: number;
  dx: number;
  color: string;
  shooterId: number;
}

export interface IMousePosition {
  x: number;
  y: number;
}

export interface IColor {
  name: string;
  label: string;
}
