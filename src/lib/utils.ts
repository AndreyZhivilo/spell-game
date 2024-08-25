import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  timeout: number
): (...args: Parameters<T>) => void {
  // Сохраняем id таймера в замыкании
  let timer: NodeJS.Timeout | null = null;

  // Возвращаем функцию
  return function perform(
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ): void {
    // Если таймер есть, то функция уже была вызвана,
    // и значит новый вызов следует пропустить.
    if (timer) return;

    // Если таймера нет, значит мы можем вызвать функцию:
    fn.apply(this, args);

    timer = setTimeout(() => {
      // По окончании очищаем таймер:
      clearTimeout(timer!);
      timer = null;
    }, timeout);
  };
}
