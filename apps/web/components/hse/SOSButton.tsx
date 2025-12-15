'use client';

import { useState } from 'react';
import { AlertTriangle, Phone, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export default function SOSButton({ projectId }: { projectId: string }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [emergencySent, setEmergencySent] = useState(false);

    const handleEmergency = async () => {
        const response = await fetch(`/api/projects/${projectId}/emergency/sos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                location: 'Auto-detected or user location',
                timestamp: new Date().toISOString(),
            }),
        });

        if (response.ok) {
            setEmergencySent(true);
            setShowConfirm(false);
        }
    };

    return (
        <>
            <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-6 px-8 rounded-full shadow-lg animate-pulse"
                onClick={() => setShowConfirm(true)}
            >
                <AlertTriangle className="mr-2 h-6 w-6" />
                EMERGENCY SOS
            </Button>

            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600 text-xl">⚠️ Confirm Emergency Alert</DialogTitle>
                        <DialogDescription>
                            This will immediately notify all emergency contacts and safety personnel.
                            Only press confirm if this is a real emergency.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <Card className="bg-red-50">
                            <CardContent className="pt-6">
                                <p className="font-semibold mb-2">Emergency contacts will be notified:</p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        Safety Manager: +62 xxx
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Site Supervisor: +62 xxx
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        Emergency Services: 112
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                        <div className="flex gap-4">
                            <Button
                                variant="destructive"
                                className="flex-1 font-bold"
                                onClick={handleEmergency}
                            >
                                CONFIRM EMERGENCY
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {emergencySent && (
                <Card className="mt-4 border-green-500 bg-green-50">
                    <CardContent className="pt-6">
                        <p className="text-green-700 font-semibold">
                            ✅ Emergency alert sent successfully!
                        </p>
                        <p className="text-sm text-green-600 mt-2">
                            All emergency contacts have been notified. Help is on the way.
                        </p>
                    </CardContent>
                </Card>
            )}
        </>
    );
}
