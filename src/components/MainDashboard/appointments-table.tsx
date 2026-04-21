// components/dashboard/appointments-table.tsx
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

const appointments = [
  { name: "Client Name", date: "12/2/2025", time: "12 AM" },
  { name: "Horizon UI Free", date: "12/2/2025", time: "12 AM" },
  { name: "Weekly Update", date: "12/2/2025", time: "12 AM" },
  { name: "Venus 3D Asset", date: "12/2/2025", time: "12 AM" },
  { name: "Marketplace", date: "12/2/2025", time: "12 AM" },
];

export function AppointmentsTable() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Today's Upcomming Appointments</CardTitle>
        <Button variant="ghost" size="sm">View all</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NAME</TableHead>
              <TableHead>Appointment Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Meeting Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment, index) => (
              <TableRow key={index}>
                <TableCell>{appointment.name}</TableCell>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>
                  <Button variant="link" size="sm">Join Now</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}