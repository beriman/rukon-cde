import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Plus, Trash2, Save } from 'lucide-react';

interface IdsRule {
    id?: string;
    ifcEntity: string;
    propertySet: string;
    property: string;
    requirement: string;
    value?: string;
}

interface IdsSpecification {
    id: string;
    name: string;
    rules: IdsRule[];
}

export function IdsEditor({ projectId }: { projectId: string }) {
    const [mockSpec, setMockSpec] = useState<IdsSpecification>({
        id: 'spec-1',
        name: 'Standard Wall Requirements',
        rules: [
            { id: '1', ifcEntity: 'IfcWall', propertySet: 'Pset_WallCommon', property: 'FireRating', requirement: 'PRESENT' },
            { id: '2', ifcEntity: 'IfcWall', propertySet: 'Pset_WallCommon', property: 'LoadBearing', requirement: 'MATCHES', value: 'TRUE' }
        ]
    });

    const [newRule, setNewRule] = useState<IdsRule>({
        ifcEntity: 'IfcWall',
        propertySet: 'Pset_Common',
        property: '',
        requirement: 'PRESENT',
        value: ''
    });

    // In a real implementation, we would fetch specs from API here
    // useEffect(() => { fetchSpecs(projectId) ... }, [projectId]);

    const handleAddRule = () => {
        const rule: IdsRule = { ...newRule, id: Math.random().toString(36).substr(2, 9) };
        setMockSpec(prev => ({ ...prev, rules: [...prev.rules, rule] }));
        // Reset form
        setNewRule({ ifcEntity: 'IfcWall', propertySet: 'Pset_Common', property: '', requirement: 'PRESENT', value: '' });
    };

    const handleDeleteRule = (id: string) => {
        setMockSpec(prev => ({ ...prev, rules: prev.rules.filter(r => r.id !== id) }));
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-sm font-medium flex justify-between items-center">
                    IDS Specification: {mockSpec.name}
                    <Button size="sm" variant="outline"><Save className="w-3 h-3 mr-1" /> Save Spec</Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-4 space-y-4">
                {/* Rule List */}
                <div className="space-y-2">
                    {mockSpec.rules.map(rule => (
                        <div key={rule.id} className="flex items-center justify-between p-2 border rounded bg-slate-50 text-sm">
                            <div className="flex gap-2">
                                <span className="font-mono text-blue-600">{rule.ifcEntity}</span>
                                <span className="text-slate-400">|</span>
                                <span className="font-mono text-slate-700">{rule.propertySet}.{rule.property}</span>
                                <span className="text-slate-400">|</span>
                                <span className={rule.requirement === 'PRESENT' ? 'text-green-600 font-semibold' : 'text-orange-600 font-semibold'}>
                                    {rule.requirement} {rule.value ? `= ${rule.value}` : ''}
                                </span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteRule(rule.id!)} className="h-6 w-6 p-0 text-red-500 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Add Rule Form */}
                <div className="border rounded p-3 bg-slate-50 grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-3">
                        <label className="text-xs mb-1 block">IFC Entity</label>
                        <Select value={newRule.ifcEntity} onValueChange={v => setNewRule({ ...newRule, ifcEntity: v })}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="IfcWall">IfcWall</SelectItem>
                                <SelectItem value="IfcSlab">IfcSlab</SelectItem>
                                <SelectItem value="IfcWindow">IfcWindow</SelectItem>
                                <SelectItem value="IfcDoor">IfcDoor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="col-span-3">
                        <label className="text-xs mb-1 block">Property Set</label>
                        <Input
                            className="h-8 text-xs"
                            value={newRule.propertySet}
                            onChange={e => setNewRule({ ...newRule, propertySet: e.target.value })}
                            placeholder="Pset_..."
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="text-xs mb-1 block">Property</label>
                        <Input
                            className="h-8 text-xs"
                            value={newRule.property}
                            onChange={e => setNewRule({ ...newRule, property: e.target.value })}
                            placeholder="Name"
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="text-xs mb-1 block">Check</label>
                        <Select value={newRule.requirement} onValueChange={v => setNewRule({ ...newRule, requirement: v })}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PRESENT">Present</SelectItem>
                                <SelectItem value="MATCHES">Matches</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="col-span-2 flex gap-1">
                        {newRule.requirement === 'MATCHES' && (
                            <Input
                                className="h-8 text-xs flex-1"
                                value={newRule.value}
                                onChange={e => setNewRule({ ...newRule, value: e.target.value })}
                                placeholder="Value"
                            />
                        )}
                        <Button size="sm" className="h-8 text-xs w-full" onClick={handleAddRule} disabled={!newRule.property}>
                            <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
