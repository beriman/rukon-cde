'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface CreateProjectDialogProps {
    organizationId: string;
}

export function CreateProjectDialog({ organizationId }: CreateProjectDialogProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const queryClient = useQueryClient();

    const createProjectMutation = useMutation({
        mutationFn: async (data: { name: string; code: string; organizationId: string }) => {
            const response = await api.post('/projects', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            setOpen(false);
            setName('');
            setCode('');
            toast.success('Project created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create project');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createProjectMutation.mutate({ name, code, organizationId });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create Project</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create Project</DialogTitle>
                        <DialogDescription>
                            Create a new project to start managing your documents and workflows.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="code" className="text-right">
                                Code
                            </Label>
                            <Input
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={createProjectMutation.isPending}>
                            {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
