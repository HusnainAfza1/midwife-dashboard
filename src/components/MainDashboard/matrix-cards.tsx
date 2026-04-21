// components/dashboard/metrics-cards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, Calendar, FileText, DollarSign 
} from "lucide-react";    

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode; // Use React.ReactNode instead of JSX.Element
  trend?: number | null;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend = null }) => {
  return (
    <Card>
      <CardContent className="p-6 flex items-center space-x-4">
        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {trend !== null && (
            <p className={`text-xs ${trend > 0 ? "text-green-500" : "text-red-500"}`}>
              {trend > 0 ? "+" : ""}
              {trend}% since last month
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export function MetricsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard 
        title="Active Midwives" 
        value="2935" 
        icon={<Users className="text-blue-500" />} 
      />
      <MetricCard 
        title="Total bookings" 
        value="320" 
        icon={<Calendar className="text-blue-500" />} 
      />
      <MetricCard 
        title="New requests from Project B" 
        value="200" 
        icon={<FileText className="text-blue-500" />} 
      />
      <MetricCard 
        title="Monthly revenue" 
        value="$574.34" 
        icon={<DollarSign className="text-blue-500" />} 
        trend={23}
      />
    </div>
  );
}