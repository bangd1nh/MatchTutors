import { StudentDashboard } from "@/components/studentDashboard/StudentDashboard";
import { useStudentDashboard } from "@/hooks/useStudentDashboard";
import { Loader2 } from "lucide-react";

export default function StudentDashboardPage() {
    const { data, isLoading, error } = useStudentDashboard();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-lg">Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">Error loading dashboard data: {error.message}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No dashboard data available.</p>
            </div>
        );
    }

    return <StudentDashboard data={data} />;
}