'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SECTIONS = [
    { id: 'project_info', title: '1. Project Information' },
    { id: 'goals', title: '2. BIM Goals & Uses' },
    { id: 'roles', title: '3. Roles & Responsibilities' },
    { id: 'process', title: '4. Process Maps' }
];

export function BEPEditor() {
    const [activeSection, setActiveSection] = useState('project_info');
    const [content, setContent] = useState({
        project_info: '',
        goals: '',
        roles: '',
        process: ''
    });

    const handleContentChange = (val: string) => {
        setContent(prev => ({ ...prev, [activeSection]: val }));
    };

    const handleSave = () => {
        console.log('Saving BEP:', content);
    };

    return (
        <div className="flex h-[600px] border rounded bg-white shadow-sm max-w-6xl mx-auto">
            {/* Sidebar */}
            <div className="w-64 border-r bg-slate-50 p-4">
                <h3 className="font-bold mb-4 text-lg">BEP Sections</h3>
                <nav className="space-y-1">
                    {SECTIONS.map(sec => (
                        <button
                            key={sec.id}
                            onClick={() => setActiveSection(sec.id)}
                            className={`w-full text-left px-3 py-2 rounded text-sm ${activeSection === sec.id ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-slate-200'}`}
                        >
                            {sec.title}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <div className="p-4 border-b flex justify-between items-center bg-white">
                    <h2 className="font-semibold text-xl">{SECTIONS.find(s => s.id === activeSection)?.title}</h2>
                    <Button onClick={handleSave}>Save Document</Button>
                </div>
                <div className="flex-1 p-6 bg-slate-50 overflow-auto">
                    <Card className="h-full">
                        <CardContent className="h-full pt-6">
                            <textarea
                                className="w-full h-full p-4 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={`Enter content for ${activeSection}...`}
                                value={content[activeSection as keyof typeof content]}
                                onChange={(e) => handleContentChange(e.target.value)}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
