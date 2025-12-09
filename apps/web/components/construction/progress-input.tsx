'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProgressInputProps {
    workPackageId: string;
    currentProgress?: number;
    onSubmit: (percentage: number, notes: string) => void;
}

export function ProgressInput({ workPackageId, currentProgress = 0, onSubmit }: ProgressInputProps) {
    const [percentage, setPercentage] = useState(currentProgress);
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(percentage, notes);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-md">
            <div className="space-y-2">
                <Label htmlFor="progress">Progress (%)</Label>
                <div className="flex items-center gap-4">
                    <Input
                        id="progress"
                        type="number"
                        min="0"
                        max="100"
                        value={percentage}
                        onChange={(e) => setPercentage(Number(e.target.value))}
                    />
                    <span className="text-sm text-gray-500 font-medium">{percentage}%</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={percentage}
                    onChange={(e) => setPercentage(Number(e.target.value))}
                    className="w-full"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Progress details..."
                />
            </div>

            <Button type="submit">Update Progress</Button>
        </form>
    );
}
