'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import { format } from 'date-fns';
import { parse } from 'date-fns';
import { startOfWeek } from 'date-fns';
import { getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card } from '@/components/ui/card';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

interface CalendarEvent extends Event {
    id: string;
    type: 'meeting' | 'inspection' | 'drill';
    location?: string;
}

export default function HseCalendar({ projectId }: { projectId: string }) {
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    useEffect(() => {
        // Fetch meetings
        fetch(`/api/projects/${projectId}/safety/meetings`)
            .then(res => res.json())
            .then(meetings => {
                const meetingEvents: CalendarEvent[] = meetings.map((m: any) => ({
                    id: m.id,
                    title: `Meeting: ${m.topic}`,
                    start: new Date(m.date),
                    end: new Date(new Date(m.date).getTime() + 60 * 60 * 1000), // 1 hour
                    type: 'meeting',
                    location: m.location,
                }));
                setEvents(prev => [...prev, ...meetingEvents]);
            });

        // Fetch inspections
        fetch(`/api/projects/${projectId}/inspections`)
            .then(res => res.json())
            .then(data => {
                const inspectionEvents: CalendarEvent[] = data.data.map((i: any) => ({
                    id: i.id,
                    title: `Inspection: ${i.type}`,
                    start: new Date(i.date),
                    end: new Date(new Date(i.date).getTime() + 30 * 60 * 1000), // 30 mins
                    type: 'inspection',
                    location: i.location,
                }));
                setEvents(prev => [...prev, ...inspectionEvents]);
            });

        // Fetch drills
        fetch(`/api/projects/${projectId}/emergency/drills`)
            .then(res => res.json())
            .then(drills => {
                const drillEvents: CalendarEvent[] = drills.map((d: any) => ({
                    id: d.id,
                    title: `Drill: ${d.type}`,
                    start: new Date(d.date),
                    end: new Date(new Date(d.date).getTime() + d.duration * 60 * 1000),
                    type: 'drill',
                }));
                setEvents(prev => [...prev, ...drillEvents]);
            });
    }, [projectId]);

    const eventStyleGetter = (event: CalendarEvent) => {
        let backgroundColor = '#3174ad';

        switch (event.type) {
            case 'meeting':
                backgroundColor = '#10b981'; // green
                break;
            case 'inspection':
                backgroundColor = '#f59e0b'; // amber
                break;
            case 'drill':
                backgroundColor = '#ef4444'; // red
                break;
        }

        return {
            style: {
                backgroundColor,
                borderRadius: '5px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block',
            },
        };
    };

    return (
        <Card className="p-4">
            <h2 className="text-2xl font-bold mb-4">HSE Calendar</h2>
            <div className="mb-4 flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Meetings</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-amber-500 rounded"></div>
                    <span>Inspections</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Drills</span>
                </div>
            </div>
            <div style={{ height: '600px' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    eventPropGetter={eventStyleGetter}
                    views={['month', 'week', 'day']}
                    defaultView="month"
                />
            </div>
        </Card>
    );
}
