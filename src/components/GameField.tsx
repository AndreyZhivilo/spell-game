import { useRef, useEffect, useState } from 'react';
import { useHero } from '../hooks/useHero.ts';
import { HitCount } from './hitCount.tsx';
import { PlayerControls } from "./playerControls.tsx"
import type { IHero, IMousePosition } from '../types/index.ts';
import { FIELD_WIDTH, FIELD_HEIGHT, BULLET_SPEED, COLORS } from '../lib/constants.ts'
import { useBullets } from '../hooks/useBullets.ts';
import { PickSpellColor } from './PickSpellColor.tsx';
import { player1Config, player2Config } from '../config/index.ts'
import { countDistance } from '../lib/utils.ts';
import { Button } from './ui/button.tsx';



export function GameField() {
  const [gameStarted, setGameStarted] = useState(false)
  const [fereeze, setFreeze] = useState(false);
  const [modalOpen, setModalOpen] = useState(false)
  const [activePlayer, setActivePlayer] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePosition = useRef<IMousePosition>({ x: 0, y: 0 });
  const mouseClick = useRef<IMousePosition>({ x: 0, y: 0 })
  const timeRef = useRef(0)

  // Создаем героев и заклинания
  const hero1 = useHero(player1Config);
  const hero2 = useHero(player2Config);
  const heros: IHero[] = [hero1, hero2];
  const bullets = useBullets()

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;


    const draw = (time: number) => {

      ctx.clearRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);

      // Отрисовка и обновление кругов
      heros.forEach((hero, index) => {
        ctx.beginPath();
        ctx.arc(
          hero.position.x,
          hero.position.y,
          hero.radius,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = hero.color;
        ctx.fill();
        ctx.closePath();

        // Вертикальное движение героя
        if (hero.position.direction === 'up') {
          hero.position.y += hero.dy;
        } else {
          hero.position.y -= hero.dy;
        }

        // Отскок от верхней и нижней границ
        if (
          hero.position.y + hero.radius > FIELD_HEIGHT ||
          hero.position.y - hero.radius < 0
        ) {
          hero.changeDirection()

        }
        // Отскакивание от курсора
        const distance = countDistance(
          hero.position.x,
          mousePosition.current.x,
          hero.position.y,
          mousePosition.current.y)

        if (distance < hero.radius + 20) {
          hero.changeDirection()
        }

        // Стрельба
        if (time - hero.lastShotTime.current > hero.shootInterval) {
          const target = heros[(index + 1) % 2];
          const angle = Math.atan2(
            target.position.y - hero.position.y,
            target.position.x - hero.position.x
          );
          bullets.current.push({
            x: hero.position.x,
            y: hero.position.y,
            radius: 5,
            dx: Math.cos(angle) * BULLET_SPEED,
            color: hero.bulletColor,
            shooterId: index,
          });
          hero.lastShotTime.current = time;
        }
        // Проверяем клик
        const dxClick = hero.position.x - mouseClick.current.x;
        const dyClick = hero.position.y - mouseClick.current.y;
        const clickDistance = Math.sqrt(dxClick * dxClick + dyClick * dyClick);

        if (clickDistance < hero.radius) {

          setFreeze(true)
          mouseClick.current.x = 0
          mouseClick.current.y = 0
          setActivePlayer(index)
          setModalOpen(true)
        }

      });




      // Отрисовка и обновление заклинаний
      bullets.current = bullets.current.filter((bullet) => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fillStyle = bullet.color;
        ctx.fill();
        ctx.closePath();

        bullet.x += bullet.dx;

        // Проверка попадания
        const targetIndex = (bullet.shooterId + 1) % 2;
        const target = heros[targetIndex];
        const distance = countDistance(bullet.x, target.position.x, bullet.y, target.position.y)


        if (distance < target.radius + bullet.radius) {
          if (bullet.shooterId === 0) {
            hero1.setScore((prevScore) => prevScore + 1);
          } else {
            hero2.setScore((prevScore) => prevScore + 1);
          }
          return false; // Удаляем заклинание при попадании
        }

        // Удаление заклинаний, вышедших за пределы холста
        return bullet.x > 0 && bullet.x < FIELD_WIDTH;
      });
      if (!fereeze) {
        // eslint-disable-next-line no-shadow
        animationFrameId = window.requestAnimationFrame((time: number) => {
          timeRef.current = time
          draw(timeRef.current)
        }
        );
      }
    };

    draw(timeRef.current);

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePosition.current.x = event.clientX - rect.left;
      mousePosition.current.y = event.clientY - rect.top;
    };

    const handleMouseClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseClick.current.x = event.clientX - rect.left;
      mouseClick.current.y = event.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleMouseClick);


    return () => {
      window.cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleMouseClick);
    };
  }, [
    hero1.speed,
    hero2.speed,
    fereeze,
    hero1.shootInterval,
    hero2.shootInterval,
    hero1.bulletColor,
    hero2.bulletColor,
    gameStarted
  ]);
  if (!gameStarted) return (
    <div className="w-full h-full flex items-center justify-center">
      <Button onClick={() => setGameStarted(true)} variant="destructive" size='lg'>Начинаем игру!</Button>
    </div>
  )
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-5">
        {heros.map(hero => {
          return (
            <HitCount count={hero.score} key={hero.id} />
          )
        })}
      </div>
      <canvas
        ref={canvasRef}
        width={FIELD_WIDTH}
        height={FIELD_HEIGHT}
        className="bg-white rounded-xl mx-auto mb-5"
      />

      <div className="grid grid-cols-2 gap-5">
        {heros.map(hero => {
          return (
            <PlayerControls
              speed={hero.speed}
              setSpeed={hero.setSpeed}
              setShootInterval={hero.setShootInterval}
              shootInterval={hero.shootInterval}
              key={hero.id}
            />)
        })}
      </div>
      <PickSpellColor
        isOpen={modalOpen}
        items={COLORS}
        onClose={() => {
          setModalOpen(false)
          setFreeze(false)
        }}
        current={heros[activePlayer].bulletColor}
        onSelect={(e) => heros[activePlayer].setBulletColor(e)}
      />
    </div>
  );
}
