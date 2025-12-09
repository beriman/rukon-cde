'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, FileText, TrendingUp } from 'lucide-react';

export default function CommercialPage() {
    const [step, setStep] = useState(1);
    const [claimData, setClaimData] = useState({
        period: '',
        baseAmount: 0,
        voAmount: 0,
    });

    const summary = {
        totalClaimed: 250000,
        totalCertified: 235000,
        totalPaid: 100000,
        outstandingPayment: 135000,
    };

    const claims = [
        { id: '1', number: 3, period: 'Month 3', amount: 150000, status: 'CERTIFIED', certifiedAmount: 140000 },
        { id: '2', number: 4, period: 'Month 4', amount: 100000, status: 'SUBMITTED' },
    ];

    const vos = [
        { id: '1', voNumber: 'VO-001', title: 'Additional Floor Area', costImpact: 50000, status: 'APPROVED' },
        { id: '2', voNumber: 'VO-002', title: 'Change in Finishes', costImpact: 25000, status: 'PROPOSED' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Payment & Billing</h1>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Claimed</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${summary.totalClaimed.toLocaleString()}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Certified</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">${summary.totalCertified.toLocaleString()}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Paid</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">${summary.totalPaid.toLocaleString()}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">${summary.outstandingPayment.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="claims">
                <TabsList>
                    <TabsTrigger value="claims">Progress Claims</TabsTrigger>
                    <TabsTrigger value="vo">Variation Orders</TabsTrigger>
                    <TabsTrigger value="new">New Claim</TabsTrigger>
                </TabsList>

                <TabsContent value="claims" className="space-y-4">
                    {claims.map(claim => (
                        <Card key={claim.id}>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-lg">Claim #{claim.number}</h3>
                                            <span className={`px-2 py-1 rounded text-xs ${claim.status === 'CERTIFIED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {claim.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{claim.period}</p>
                                        {claim.certifiedAmount && (
                                            <p className="text-sm text-gray-500">Certified: ${claim.certifiedAmount.toLocaleString()}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold">${claim.amount.toLocaleString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="vo" className="space-y-4">
                    {vos.map(vo => (
                        <Card key={vo.id}>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            <span className="font-mono text-sm text-gray-500">{vo.voNumber}</span>
                                        </div>
                                        <h3 className="font-semibold mt-1">{vo.title}</h3>
                                        <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${vo.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {vo.status}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Cost Impact</p>
                                        <p className="text-xl font-bold text-red-600">+${vo.costImpact.toLocaleString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="new">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Progress Claim - Step {step}/3</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {step === 1 && (
                                <div className="space-y-4">
                                    <div>
                                        <Label>Claim Period</Label>
                                        <Input
                                            placeholder="e.g., Month 5"
                                            value={claimData.period}
                                            onChange={(e) => setClaimData({ ...claimData, period: e.target.value })}
                                        />
                                    </div>
                                    <Button onClick={() => setStep(2)} className="w-full">Next: Enter Amounts</Button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4">
                                    <div>
                                        <Label>Base Amount (Contract Work)</Label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={claimData.baseAmount}
                                            onChange={(e) => setClaimData({ ...claimData, baseAmount: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <Label>Variation Order Amount</Label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={claimData.voAmount}
                                            onChange={(e) => setClaimData({ ...claimData, voAmount: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                                        <Button onClick={() => setStep(3)} className="flex-1">Next: Review</Button>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded">
                                        <p className="text-sm text-gray-500">Period</p>
                                        <p className="font-semibold">{claimData.period}</p>
                                        <p className="text-sm text-gray-500 mt-2">Base Amount</p>
                                        <p className="font-semibold">${claimData.baseAmount.toLocaleString()}</p>
                                        <p className="text-sm text-gray-500 mt-2">VO Amount</p>
                                        <p className="font-semibold">${claimData.voAmount.toLocaleString()}</p>
                                        <p className="text-sm text-gray-500 mt-2">Total</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            ${(claimData.baseAmount + claimData.voAmount).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
                                        <Button className="flex-1">Submit Claim</Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
