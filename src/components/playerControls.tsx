import React from "react"
import { Slider } from "./ui/slider.tsx"


export function PlayerControls({
    speed,
    shootInterval,
    setSpeed,
    setShootInterval
}: {
    speed: number
    shootInterval: number
    setSpeed: React.Dispatch<React.SetStateAction<number>>
    setShootInterval: React.Dispatch<React.SetStateAction<number>>
}) {
    return (
        <div className='bg-white rounded-xl p-5 flex flex-col'>
            <div className="mb-5">
                <div className="mb-2">
                    Скорость - {speed}
                </div>
                <Slider
                    defaultValue={[2]}
                    max={10}
                    step={1}
                    onValueChange={([e]) => setSpeed(e)}
                />
            </div>
            <div className="mb-5">
                <div className="mb-2">
                    Интервал стрельбы - {shootInterval}
                </div>
                <Slider
                    defaultValue={[100]}
                    max={900}
                    step={100}
                    onValueChange={([e]) => setShootInterval(1000 - e)}
                />
            </div>
        </div>
    )
}