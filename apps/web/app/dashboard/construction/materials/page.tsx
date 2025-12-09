'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, FileText } from 'lucide-react';

interface Material {
    id: string;
    referenceNumber: string;
    title: string;
    manufacturer: string;
    status: string;
    specRequired: { [key: string]: string };
    specSubmitted: { [key: string]: string };
}

export default function MaterialApprovalsPage() {
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

    const materials: Material[] = [
        {
            id: '1',
            referenceNumber: 'MA-001',
            title: 'Reinforcement Steel - Grade 60',
            manufacturer: 'PT Steel Indonesia',
            status: 'UNDER_REVIEW',
            specRequired: {
                'Tensile Strength': '420 MPa',
                'Yield Strength': '350 MPa',
                'Elongation': '12% min',
                'Certificate': 'SNI 2052:2017',
            },
            specSubmitted: {
                'Tensile Strength': '425 MPa',
                'Yield Strength': '355 MPa',
                'Elongation': '13%',
                'Certificate': 'SNI 2052:2017',
            },
        },
    ];

    const compareSpec = (required: string, submitted: string) => {
        return required === submitted ? (
            <Check className="w-4 h-4 text-green-600" />
        ) : (
            <X className="w-4 h-4 text-red-600" />
        );
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Material Approvals</h1>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Approvals</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {materials.map((mat) => (
                            <div
                                key={mat.id}
                                className="flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-gray-50"
                                onClick={() => setSelectedMaterial(mat)}
                            >
                                <div>
                                    <span className="text-sm font-mono text-gray-500">{mat.referenceNumber}</span>
                                    <h4 className="font-semibold">{mat.title}</h4>
                                    <p className="text-sm text-gray-500">{mat.manufacturer}</p>
                                </div>
                                <Badge>{mat.status}</Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {selectedMaterial && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Specification Comparison
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Parameter</TableHead>
                                        <TableHead>Required</TableHead>
                                        <TableHead>Submitted</TableHead>
                                        <TableHead className="text-center">Match</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Object.keys(selectedMaterial.specRequired).map((key) => (
                                        <TableRow key={key}>
                                            <TableCell className="font-medium">{key}</TableCell>
                                            <TableCell>{selectedMaterial.specRequired[key]}</TableCell>
                                            <TableCell>{selectedMaterial.specSubmitted[key]}</TableCell>
                                            <TableCell className="text-center">
                                                {compareSpec(selectedMaterial.specRequired[key], selectedMaterial.specSubmitted[key])}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="flex gap-2 mt-4">
                                <Button className="flex-1" variant="default">Approve</Button>
                                <Button className="flex-1" variant="outline">Approve with Notes</Button>
                                <Button className="flex-1" variant="destructive">Reject</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
