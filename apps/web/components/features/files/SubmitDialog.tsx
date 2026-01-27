'use client';

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface SubmitDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    fileId: string
    projectId: string
    onSuccess?: () => void
}

export function SubmitDialog({ open, onOpenChange, fileId, projectId, onSuccess }: SubmitDialogProps) {
    const [selectedWorkflow, setSelectedWorkflow] = useState<string>('')

    // Fetch available workflows
    const { data: workflows, isLoading } = useQuery({
        queryKey: ['workflows', projectId],
        queryFn: async () => {
            // Mock response for now if endpoint doesn't exist yet, or use generic
            // For MVP, we might hardcode or use a specific endpoint
            try {
                // Assuming we created a way to get workflows, or just hardcode for MVP
                // const response = await apiClient.get(/projects/${projectId}/workflows);
                // return response.data;

                // MOCK for MVP as we didn't expose GET /workflows yet
                return [
                    { id: 'wf-1', name: 'Standard Approval (WIP -> SHARED -> PUBLISHED)' }
                ]
            } catch (e) {
                return []
            }
        },
        enabled: open
    })

    const submitMutation = useMutation({
        mutationFn: async () => {
            // First create a submittal draft
            const submittalRes = await apiClient.post('/construction/submittals', {
                projectId,
                type: 'SHOP_DRAWING', // Defaulting for MVP
                title: 'Document Submission',
                fileId,
            })

            const submittalId = submittalRes.data.id

            // Then start workflow
            // Note: In a real app we'd usually just select workflow during create
            // checking submittal.service.ts startWorkflow logic
            await apiClient.post(`/construction/submittals/${submittalId}/start-workflow`, {
                workflowId: selectedWorkflow || 'wf-1' // Fallback to mock ID if select logic fails
            })
        },
        onSuccess: () => {
            toast.success("Document submitted for approval")
            onOpenChange(false)
            onSuccess?.()
        },
        onError: () => {
            toast.error("Failed to submit document")
        }
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Submit for Approval</DialogTitle>
                    <DialogDescription>
                        Select an approval workflow to start the review process.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="workflow">Workflow</Label>
                        <Select onValueChange={setSelectedWorkflow} value={selectedWorkflow}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select workflow" />
                            </SelectTrigger>
                            <SelectContent>
                                {workflows?.map((wf: any) => (
                                    <SelectItem key={wf.id} value={wf.id}>{wf.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        onClick={() => submitMutation.mutate()}
                        disabled={!selectedWorkflow || submitMutation.isPending}
                    >
                        {submitMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
