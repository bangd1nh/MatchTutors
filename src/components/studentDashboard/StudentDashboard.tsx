import { NextSessionCard } from "./NextSessionCard"
import { QuickStats } from "./QuickStats"
import { Timeline } from "./Timeline"
import { TopCourses } from "./TopCourses"
import type { StudentDashboardDTO } from "@/types/studentDashboard"

interface StudentDashboardProps {
  data: StudentDashboardDTO
}

export function StudentDashboard({ data }: StudentDashboardProps) {
  return (
    <main className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Top Row: Next Session + Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <NextSessionCard session={data.nextSession} />
          </div>
          <div className="lg:col-span-2">
            <QuickStats stats={data.quickStats} sessionStats={data.sessionStats} />
          </div>
        </div>

        {/* Middle Row: Timeline */}
        <div className="mb-6">
          <Timeline items={data.timeline} />
        </div>

        {/* Bottom Row: Top Courses */}
        <div>
          <TopCourses courses={data.topCourses} />
        </div>
      </div>
    </main>
  )
}
