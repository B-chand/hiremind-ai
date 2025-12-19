import { Link } from "react-router-dom";
import { 
  CpuChipIcon as BrainIcon, 
  UsersIcon, 
  ChartBarIcon, 
  DocumentTextIcon,
  SparklesIcon,
  CheckCircleIcon 
} from "@heroicons/react/24/outline";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BrainIcon className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">HireMind AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Intelligent Recruitment
              <span className="text-blue-600 block">Powered by AI</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your hiring process with AI-driven candidate screening, automated interviews, 
              and data-driven insights. Find the perfect candidates faster than ever before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Free Trial
              </Link>
              <Link
                to="/auth"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Revolutionize Your Hiring Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform streamlines every step of recruitment, from initial screening to final selection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<DocumentTextIcon className="h-8 w-8 text-blue-600" />}
              title="AI Resume Parsing"
              description="Automatically extract and analyze key information from resumes with 95% accuracy."
            />
            <FeatureCard
              icon={<BrainIcon className="h-8 w-8 text-blue-600" />}
              title="Smart Candidate Scoring"
              description="AI-powered scoring system evaluates candidates based on skills, experience, and cultural fit."
            />
            <FeatureCard
              icon={<UsersIcon className="h-8 w-8 text-blue-600" />}
              title="Automated Interviews"
              description="Conduct initial interviews with AI, saving time while maintaining quality assessment."
            />
            <FeatureCard
              icon={<ChartBarIcon className="h-8 w-8 text-blue-600" />}
              title="Advanced Analytics"
              description="Get insights into your hiring pipeline with comprehensive analytics and reporting."
            />
            <FeatureCard
              icon={<SparklesIcon className="h-8 w-8 text-blue-600" />}
              title="Bias Reduction"
              description="AI algorithms help reduce unconscious bias in the hiring process for fairer recruitment."
            />
            <FeatureCard
              icon={<CheckCircleIcon className="h-8 w-8 text-blue-600" />}
              title="Salary Recommendations"
              description="Get data-driven salary recommendations based on market rates and candidate qualifications."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Leading Companies
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">85%</div>
              <div className="text-gray-600">Faster Hiring Process</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">92%</div>
              <div className="text-gray-600">Candidate Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">67%</div>
              <div className="text-gray-600">Reduction in Bias</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10k+</div>
              <div className="text-gray-600">Successful Hires</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of companies already using HireMind AI to find the best talent faster and more efficiently.
          </p>
          <Link
            to="/auth"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <BrainIcon className="h-6 w-6 text-blue-400 mr-2" />
            <span className="text-lg font-semibold">HireMind AI</span>
          </div>
          <div className="text-center text-gray-400 mt-4">
            © 2024 HireMind AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
