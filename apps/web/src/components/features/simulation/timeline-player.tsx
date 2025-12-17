'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, SkipBack, SkipForward, FastForward } from 'lucide-react';

interface TimelinePlayerProps {
    startDate: Date;
    endDate: Date;
    onDateChange: (date: Date) => void;
    isPlaying: boolean;
    onPlayPause: () => void;
}

export function TimelinePlayer({ startDate, endDate, onDateChange, isPlaying, onPlayPause }: TimelinePlayerProps) {
    const [currentDate, setCurrentDate] = useState<Date>(startDate);
    const [speed, setSpeed] = useState<number>(1); // Days per tick

    // Sync internal state if props change drastically
    useEffect(() => {
        if (currentDate < startDate) setCurrentDate(startDate);
        if (currentDate > endDate) setCurrentDate(endDate);
    }, [startDate, endDate]);

    // Animation Loop
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentDate((prev) => {
                    const next = new Date(prev);
                    next.setDate(next.getDate() + speed);
                    if (next > endDate) {
                        onPlayPause(); // Stop at end
                        return endDate;
                    }
                    return next;
                });
            }, 100); // 10 updates per second
        }
        return () => clearInterval(interval);
    }, [isPlaying, speed, endDate, onPlayPause]);

    // Notify parent of changes
    useEffect(() => {
        onDateChange(currentDate);
    }, [currentDate, onDateChange]);

    const handleSliderChange = (vals: number[]) => {
        const newDate = new Date(startDate.getTime() + vals[0]);
        setCurrentDate(newDate);
    };

    const totalDuration = endDate.getTime() - startDate.getTime();
    const currentProgress = currentDate.getTime() - startDate.getTime();

    return (
        <Card className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[600px] z-10 bg-black/80 text-white border-slate-700 backdrop-blur-md">
            <CardContent className="p-4 flex flex-col gap-4">
                {/* Date Display */}
                <div className="flex justify-between items-center">
                    <div className="text-xl font-mono font-bold text-blue-400">
                        {currentDate.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="flex gap-2">
                        <Select value={String(speed)} onValueChange={(v) => setSpeed(Number(v))}>
                            <SelectTrigger className="w-[80px] h-8 bg-slate-800 border-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1x</SelectItem>
                                <SelectItem value="5">5x</SelectItem>
                                <SelectItem value="10">10x</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Slider */}
                <Slider
                    value={[currentProgress]}
                    min={0}
                    max={totalDuration}
                    step={24 * 60 * 60 * 1000} // 1 day steps
                    onValueChange={handleSliderChange}
                    className="cursor-pointer"
                />

                {/* Controls */}
                <div className="flex justify-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setCurrentDate(startDate)}>
                        <SkipBack className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="default"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-500"
                        onClick={onPlayPause}
                    >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setCurrentDate(endDate)}>
                        <SkipForward className="h-5 w-5" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
