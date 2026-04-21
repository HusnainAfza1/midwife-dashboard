// components/dashboard/requests-table.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
type StatusType = "approved" | "disable" | "error" | string;

interface StatusBadgeProps {
  status: StatusType;
}

const requests = [
  { name: "Horizon UI PRO", status: "approved", date: "18 Apr 2021", progress: 75 },
  { name: "Horizon UI Free", status: "disable", date: "18 Apr 2021", progress: 50 },
  { name: "Marketplace", status: "error", date: "20 May 2021", progress: 90 },
  { name: "Weekly Updates", status: "approved", date: "12 Jul 2021", progress: 60 },
];

function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<string, { variant: "destructive" | "default" | "secondary" | "outline"; text: string }> = {
    approved: { variant: "default", text: "Approved" },
    disable: { variant: "destructive", text: "Disable" },
    error: { variant: "secondary", text: "Error" },
  };

  const { variant, text } = variants[status as keyof typeof variants] || { variant: "default", text: status };

  return <Badge variant={variant}>{text}</Badge>;
}

export function RequestsTable() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>New search requests</CardTitle>
        <Button variant="ghost" size="sm">View all</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NAME</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>PROGRESS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request, index) => (
              <TableRow key={index}>
                <TableCell>{request.name}</TableCell>
                <TableCell>
                  <StatusBadge status={request.status} />
                </TableCell>
                <TableCell>{request.date}</TableCell>
                <TableCell>
                  <Progress value={request.progress} className="w-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}