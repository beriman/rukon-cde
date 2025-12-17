import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CostTableProps {
    data: any[]; // DailyCashFlow[]
}

export function CostTable({ data }: CostTableProps) {
    return (
        <ScrollArea className="h-[300px] border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Daily Cost (Rp)</TableHead>
                        <TableHead className="text-right">Cumulative Cost (Rp)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row) => (
                        <TableRow key={row.date}>
                            <TableCell className="font-mono text-xs">{row.date}</TableCell>
                            <TableCell className="text-right text-xs">{row.dailyCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                            <TableCell className="text-right text-xs font-medium">{row.cumulativeCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                        </TableRow>
                    ))}
                    {data.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No data available</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </ScrollArea>
    );
}
