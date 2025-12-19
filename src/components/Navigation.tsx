import { Link, useLocation } from "react-router-dom";
import { SignOutButton } from "../SignOutButton";
import { 
  CpuChipIcon as BrainIcon,
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  UserIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  BriefcaseIcon
} from "@heroicons/react/24/outline";

interface NavigationProps {
  userType: "candidate" | "recruiter";
}

export function Navigation({ userType }: NavigationProps) {
  const location = useLocation();

  const candidateNavItems = [
    { name: "Dashboard", href: "/candidate", icon: HomeIcon },
    { name: "Profile", href: "/candidate/profile", icon: UserIcon },
    { name: "Interview", href: "/candidate/interview", icon: ChatBubbleLeftRightIcon },
  ];

  const recruiterNavItems = [
    { name: "Dashboard", href: "/recruiter", icon: HomeIcon },
    { name: "Candidates", href: "/recruiter/candidates", icon: UsersIcon },
    { name: "Job Postings", href: "/recruiter/jobs", icon: BriefcaseIcon },
    { name: "Analytics", href: "/recruiter/analytics", icon: ChartBarIcon },
  ];

  const navItems = userType === "candidate" ? candidateNavItems : recruiterNavItems;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BrainIcon className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">HireMind AI</span>
            </Link>
            
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      isActive
                        ? "border-b-2 border-blue-500 text-gray-900"
                        : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-4 capitalize">
              {userType} Portal
            </span>
            <SignOutButton />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`block pl-3 pr-4 py-2 text-base font-medium ${
                  isActive
                    ? "bg-blue-50 border-r-4 border-blue-500 text-blue-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
