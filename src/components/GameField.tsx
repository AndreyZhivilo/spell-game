import { useRef, useEffect, useState } from 'react';
import { useHero } from '../hooks/useHero.ts';
import { HitCount } from './hitCount.tsx';
import { PlayerControls } from "./playerControls.tsx"
import type { IHero, IMousePosition } from '../types/index.ts';
import { FIELD_WIDTH, FIELD_HEIGHT, BULLET_SPEED, COLORS } from '../lib/constants.ts'
import { useBullets } from '../hooks/useBullets.ts';
import { PickSpellColor } from './PickSpellColor.tsx';



export function GameField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePosition = useRef<IMousePosition>({ x: 0, y: 0 });
  const mouseClick = useRef<IMousePosition>({ x: 0, y: 0 })
  const [fereeze, setFreeze] = useState(false);
  const timeRef = useRef(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [activePlayer, setActivePlayer] = useState(0)

  const hero1 = useHero({
    heroSpeed: 2,
    x: FIELD_WIDTH / 3,
    y: FIELD_HEIGHT / 2,
    color: 'red',
    direction: 'up',
  });

  const hero2 = useHero({
    heroSpeed: 2,
    x: (2 * FIELD_WIDTH) / 3,
    y: FIELD_HEIGHT / 2,
    color: 'blue',
    direction: 'down',
  });
  // Параметры кругов
  const circles: IHero[] = [hero1, hero2];
  const bullets = useBullets()

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;


    const draw = (time: number) => {
      // console.log('click', mouseClick.current)

      ctx.clearRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);

      // Отрисовка и обновление кругов
      circles.forEach((circle, index) => {
        ctx.beginPath();
        ctx.arc(
          circle.position.x,
          circle.position.y,
          circle.radius,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = circle.color;
        ctx.fill();
        ctx.closePath();

        // Вертикальное движение круга
        if (circle.position.direction === 'up') {
          circle.position.y += circle.dy;
        } else {
          circle.position.y -= circle.dy;
        }

        // Отскок от верхней и нижней границ
        if (
          circle.position.y + circle.radius > FIELD_HEIGHT ||
          circle.position.y - circle.radius < 0
        ) {
          circle.changeDirection()

        }
        // Отскакивание от курсора
        const dx = circle.position.x - mousePosition.current.x;
        const dy = circle.position.y - mousePosition.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < circle.radius + 20) {
          circle.changeDirection()
        }

        // Стрельба
        if (time - circle.lastShotTime.current > circle.shootInterval) {
          const target = circles[(index + 1) % 2];
          const angle = Math.atan2(
            target.position.y - circle.position.y,
            target.position.x - circle.position.x
          );
          bullets.current.push({
            x: circle.position.x,
            y: circle.position.y,
            radius: 5,
            dx: Math.cos(angle) * BULLET_SPEED,
            color: circle.bulletColor,
            shooterId: index,
          });
          circle.lastShotTime.current = time;
        }
        // Проверяем клик
        const dxClick = circle.position.x - mouseClick.current.x;
        const dyClick = circle.position.y - mouseClick.current.y;
        const clickDistance = Math.sqrt(dxClick * dxClick + dyClick * dyClick);

        if (clickDistance < circle.radius) {

          setFreeze(true)
          mouseClick.current.x = 0
          mouseClick.current.y = 0
          setActivePlayer(index)
          setModalOpen(true)
        }

      });




      // Отрисовка и обновление пуль
      bullets.current = bullets.current.filter((bullet) => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fillStyle = bullet.color;
        ctx.fill();
        ctx.closePath();

        bullet.x += bullet.dx;

        // Проверка попадания
        const targetIndex = (bullet.shooterId + 1) % 2;
        const target = circles[targetIndex];
        const dx = bullet.x - target.position.x;
        const dy = bullet.y - target.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < target.radius + bullet.radius) {
          if (bullet.shooterId === 0) {
            hero1.setScore((prevScore) => prevScore + 1);
          } else {
            hero2.setScore((prevScore) => prevScore + 1);
          }
          return false; // Удаляем пулю при попадании
        }

        // Удаление пуль, вышедших за пределы холста
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
    hero2.bulletColor
  ]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <HitCount count={hero1.score} />
        <HitCount count={hero2.score} />
      </div>
      <canvas
        ref={canvasRef}
        width={FIELD_WIDTH}
        height={FIELD_HEIGHT}
        className="bg-white rounded-xl mx-auto mb-5"
      />

      <div className="grid grid-cols-2 gap-5">

        <PlayerControls
          speed={hero1.speed}
          setSpeed={hero1.setSpeed}
          setShootInterval={hero1.setShootInterval}
          shootInterval={hero1.shootInterval}
        />
        <PlayerControls
          speed={hero2.speed}
          setSpeed={hero2.setSpeed}
          setShootInterval={hero2.setShootInterval}
          shootInterval={hero2.shootInterval}
        />
      </div>
      <PickSpellColor
        open={modalOpen}
        items={COLORS}
        onClose={() => {
          setModalOpen(false)
          setFreeze(false)
        }}
        current={circles[activePlayer].bulletColor}
        onSelect={(e) => circles[activePlayer].setBulletColor(e)}
      />
    </div>
  );
}
