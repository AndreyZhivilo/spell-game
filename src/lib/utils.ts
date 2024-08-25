import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  timeout: number
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout | null = null;

  return function perform(
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ): void {
    if (timer) return;

    fn.apply(this, args);

    timer = setTimeout(() => {
      clearTimeout(timer!);
      timer = null;
    }, timeout);
  };
}

export function countDistance(x1: number, x2: number, y1: number, y2: number) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}
