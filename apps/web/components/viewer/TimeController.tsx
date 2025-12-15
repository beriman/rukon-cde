import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Card } from '../ui/card';

interface TimeControllerProps {
    startDate: Date;
    endDate: Date;
    onTimeChange: (date: Date) => void;
}

export function TimeController({ startDate, endDate, onTimeChange }: TimeControllerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentDate, setCurrentDate] = useState(startDate);
    const requestRef = useRef<number>();

    const minTime = startDate.getTime();
    const maxTime = endDate.getTime();

    useEffect(() => {
        onTimeChange(currentDate);
    }, [currentDate, onTimeChange]);

    const animate = () => {
        setCurrentDate(prev => {
            const nextTime = prev.getTime() + (24 * 60 * 60 * 1000); // +1 day per frame (fast!)
            if (nextTime >= maxTime) {
                setIsPlaying(false);
                return new Date(maxTime);
            }
            return new Date(nextTime);
        });
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (isPlaying) {
            requestRef.current = requestAnimationFrame(animate);
        } else {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isPlaying, maxTime]);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        setCurrentDate(new Date(val));
    };

    return (
        <Card className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl p-4 bg-white/95 backdrop-blur shadow-xl z-20 flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm font-medium">
                <span>{startDate.toLocaleDateString()}</span>
                <span className="text-primary text-lg font-bold">{currentDate.toLocaleDateString()}</span>
                <span>{endDate.toLocaleDateString()}</span>
            </div>

            <input
                type="range"
                min={minTime}
                max={maxTime}
                value={currentDate.getTime()}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />

            <div className="flex justify-center gap-2 mt-2">
                <Button variant="outline" size="icon" onClick={() => setCurrentDate(startDate)}>
                    <SkipBack className="w-4 h-4" />
                </Button>
                <Button onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isPlaying ? 'Pause' : 'Play Simulation'}
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentDate(endDate)}>
                    <SkipForward className="w-4 h-4" />
                </Button>
            </div>
        </Card>
    );
}
