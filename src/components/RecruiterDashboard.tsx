import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { 
  UsersIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  DocumentTextIcon,
  StarIcon
} from "@heroicons/react/24/outline";

export function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", name: "Overview", icon: ChartBarIcon },
    { id: "candidates", name: "Candidates", icon: UsersIcon },
    { id: "analytics", name: "Analytics", icon: ChartBarIcon },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Recruiter Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage candidates and track your hiring pipeline with AI-powered insights.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "candidates" && <CandidatesTab />}
      {activeTab === "analytics" && <AnalyticsTab />}
    </div>
  );
}

function OverviewTab() {
  const dashboardStats = useQuery(api.analytics.getDashboardStats);
  const topCandidates = useQuery(api.candidates.getTopCandidates);
  const recentActivity = useQuery(api.analytics.getRecentActivity);

  if (!dashboardStats) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Candidates"
          value={dashboardStats.totalCandidates}
          icon={<UsersIcon className="h-6 w-6 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Active Interviews"
          value={dashboardStats.activeInterviews}
          icon={<ClockIcon className="h-6 w-6 text-yellow-600" />}
          color="yellow"
        />
        <StatCard
          title="Completed Interviews"
          value={dashboardStats.completedInterviews}
          icon={<CheckCircleIcon className="h-6 w-6 text-green-600" />}
          color="green"
        />
        <StatCard
          title="Average Score"
          value={`${dashboardStats.avgScore}%`}
          icon={<StarIcon className="h-6 w-6 text-purple-600" />}
          color="purple"
        />
      </div>

      {/* Status Distribution */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Candidate Status Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(dashboardStats.statusDistribution).map(([status, count]) => (
            <div key={status} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600 capitalize">{status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Candidates and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Candidates */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Candidates</h3>
          <div className="space-y-4">
            {topCandidates?.slice(0, 5).map((candidate) => (
              <div key={candidate._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{candidate.name}</div>
                  <div className="text-sm text-gray-600">{candidate.skills.slice(0, 3).join(", ")}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-blue-600">{candidate.overallScore}%</div>
                  <div className="text-xs text-gray-500 capitalize">{candidate.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity?.slice(0, 5).map((activity) => (
              <div key={activity._id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <UsersIcon className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.recruiterName}</span>{" "}
                    {activity.actionType.replace("_", " ")} candidate{" "}
                    <span className="font-medium">{activity.candidateName}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CandidatesTab() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const candidates = useQuery(api.candidates.list, { 
    status: (statusFilter as any) || undefined 
  });
  const updateStatus = useMutation(api.candidates.updateStatus);

  const handleStatusChange = async (candidateId: string, newStatus: string) => {
    try {
      await updateStatus({ 
        id: candidateId as any, 
        status: newStatus as any 
      });
      toast.success("Candidate status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      applied: "bg-blue-100 text-blue-800",
      screening: "bg-yellow-100 text-yellow-800",
      interview: "bg-purple-100 text-purple-800",
      hired: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">Candidates</h3>
          <div className="flex space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="applied">Applied</option>
              <option value="screening">Screening</option>
              <option value="interview">Interview</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidates List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skills
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {candidates?.map((candidate) => (
                <tr key={candidate._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                      <div className="text-sm text-gray-500">{candidate.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 3 && (
                        <span className="text-xs text-gray-500">+{candidate.skills.length - 3} more</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {candidate.experience} years
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {candidate.overallScore ? (
                      <div className="text-sm font-medium text-gray-900">{candidate.overallScore}%</div>
                    ) : (
                      <span className="text-sm text-gray-500">Not scored</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(candidate.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {candidate.resumeUrl && (
                        <a 
                          href={candidate.resumeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900"
                        >
                          <DocumentTextIcon className="h-4 w-4" />
                        </a>
                      )}
                      <select
                        value={candidate.status}
                        onChange={(e) => handleStatusChange(candidate._id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="applied">Applied</option>
                        <option value="screening">Screening</option>
                        <option value="interview">Interview</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  const skillsAnalytics = useQuery(api.analytics.getSkillsAnalytics);
  const scoreDistribution = useQuery(api.analytics.getScoreDistribution);

  return (
    <div className="space-y-8">
      {/* Skills Analytics */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Top Skills in Candidate Pool</h3>
        <div className="space-y-4">
          {skillsAnalytics?.map((item, index) => (
            <div key={item.skill} className="flex items-center">
              <div className="w-24 text-sm text-gray-600">{item.skill}</div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(item.count / (skillsAnalytics[0]?.count || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-12 text-sm text-gray-900 text-right">{item.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Score Distribution */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Score Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {scoreDistribution?.map((item) => (
            <div key={item.range} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{item.count}</div>
              <div className="text-sm text-gray-600">{item.range}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hiring Funnel */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Hiring Funnel</h3>
        <div className="space-y-4">
          {[
            { stage: "Applications", count: 150, color: "bg-blue-500" },
            { stage: "Screening", count: 75, color: "bg-yellow-500" },
            { stage: "Interviews", count: 30, color: "bg-purple-500" },
            { stage: "Offers", count: 12, color: "bg-green-500" },
            { stage: "Hired", count: 8, color: "bg-green-600" },
          ].map((stage, index) => (
            <div key={stage.stage} className="flex items-center">
              <div className="w-20 text-sm text-gray-600">{stage.stage}</div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-200 rounded-full h-4">
                  <div 
                    className={`${stage.color} h-4 rounded-full flex items-center justify-end pr-2`}
                    style={{ width: `${(stage.count / 150) * 100}%` }}
                  >
                    <span className="text-white text-xs font-medium">{stage.count}</span>
                  </div>
                </div>
              </div>
              <div className="w-16 text-sm text-gray-900 text-right">
                {Math.round((stage.count / 150) * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    yellow: "bg-yellow-50 border-yellow-200",
    green: "bg-green-50 border-green-200",
    purple: "bg-purple-50 border-purple-200",
  };

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color as keyof typeof colorClasses] || "bg-gray-50 border-gray-200"}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-4">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-600">{title}</div>
        </div>
      </div>
    </div>
  );
}
