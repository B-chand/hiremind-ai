import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { 
  DocumentArrowUpIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  UserIcon
} from "@heroicons/react/24/outline";

export function CandidatePortal() {
  const [activeTab, setActiveTab] = useState("profile");
  const loggedInUser = useQuery(api.auth.loggedInUser);

  const tabs = [
    { id: "profile", name: "Profile", icon: UserIcon },
    { id: "interview", name: "Interview", icon: ChatBubbleLeftRightIcon },
    { id: "status", name: "Application Status", icon: CheckCircleIcon },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Candidate Portal</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {loggedInUser?.name || loggedInUser?.email || "Candidate"}!
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
      {activeTab === "profile" && <ProfileTab />}
      {activeTab === "interview" && <InterviewTab />}
      {activeTab === "status" && <StatusTab />}
    </div>
  );
}

function ProfileTab() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    experience: "",
    education: "",
    salaryExpectation: "",
  });

  const createCandidate = useMutation(api.candidates.create);
  const generateUploadUrl = useMutation(api.candidates.generateUploadUrl);
  const uploadResume = useMutation(api.candidates.uploadResume);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const candidateId = await createCandidate({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
        experience: parseInt(formData.experience) || 0,
        education: formData.education,
        projects: [], // Could be expanded to include project form
        salaryExpectation: formData.salaryExpectation ? parseInt(formData.salaryExpectation) : undefined,
      });

      toast.success("Profile created successfully!");
      console.log("Created candidate:", candidateId);
    } catch (error) {
      toast.error("Failed to create profile");
      console.error(error);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Generate upload URL
      const uploadUrl = await generateUploadUrl();
      
      // Upload file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await result.json();
      toast.success("Resume uploaded successfully!");
      
      // Note: In a real app, you'd associate this with a candidate
      console.log("Uploaded resume with storage ID:", storageId);
    } catch (error) {
      toast.error("Failed to upload resume");
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Complete Your Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills (comma-separated) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., JavaScript, React, Node.js, Python"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Education *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Bachelor's in Computer Science"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary Expectation (USD)
            </label>
            <input
              type="number"
              placeholder="e.g., 75000"
              value={formData.salaryExpectation}
              onChange={(e) => setFormData({ ...formData, salaryExpectation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Resume
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}

function InterviewTab() {
  const [selectedInterview, setSelectedInterview] = useState<string | null>(null);
  
  // Mock interview data - in real app, this would come from Convex
  const mockInterview = {
    id: "1",
    status: "pending",
    questions: [
      {
        question: "Tell me about your experience with React and TypeScript.",
        answer: "",
      },
      {
        question: "Describe a challenging project you've worked on and how you overcame obstacles.",
        answer: "",
      },
      {
        question: "How do you approach learning new technologies?",
        answer: "",
      },
    ],
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(mockInterview.questions.length).fill(""));

  const handleAnswerChange = (index: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < mockInterview.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    toast.success("Interview submitted successfully!");
    // In real app, submit answers to Convex
  };

  return (
    <div className="max-w-4xl">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Interview</h2>
        
        {!selectedInterview ? (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready for your AI interview?</h3>
            <p className="text-gray-600 mb-6">
              Our AI will ask you a series of questions to assess your skills and experience.
            </p>
            <button
              onClick={() => setSelectedInterview("1")}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
              Start Interview
            </button>
          </div>
        ) : (
          <div>
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestionIndex + 1} of {mockInterview.questions.length}</span>
                <span>{Math.round(((currentQuestionIndex + 1) / mockInterview.questions.length) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / mockInterview.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Current Question */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {mockInterview.questions[currentQuestionIndex].question}
              </h3>
              <textarea
                rows={6}
                value={answers[currentQuestionIndex]}
                onChange={(e) => handleAnswerChange(currentQuestionIndex, e.target.value)}
                placeholder="Type your answer here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {currentQuestionIndex === mockInterview.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Submit Interview
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusTab() {
  // Mock application status data
  const applicationStatus = {
    status: "interview",
    submittedAt: "2024-01-15",
    lastUpdated: "2024-01-18",
    score: 88,
    feedback: "Strong technical skills with good communication. Recommended for next round.",
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied":
        return <ClockIcon className="h-6 w-6 text-yellow-500" />;
      case "screening":
        return <ExclamationTriangleIcon className="h-6 w-6 text-orange-500" />;
      case "interview":
        return <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-500" />;
      case "hired":
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      default:
        return <ClockIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "applied":
        return "Application Submitted";
      case "screening":
        return "Under Review";
      case "interview":
        return "Interview Stage";
      case "hired":
        return "Congratulations! You're hired";
      default:
        return "Unknown Status";
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Status</h2>
        
        <div className="space-y-6">
          {/* Current Status */}
          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            {getStatusIcon(applicationStatus.status)}
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                {getStatusText(applicationStatus.status)}
              </h3>
              <p className="text-gray-600">
                Last updated: {new Date(applicationStatus.lastUpdated).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Application Timeline</h3>
            
            <div className="flow-root">
              <ul className="-mb-8">
                <li>
                  <div className="relative pb-8">
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                          <CheckCircleIcon className="h-5 w-5 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            Application submitted
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          {new Date(applicationStatus.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                
                <li>
                  <div className="relative pb-8">
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                          <CheckCircleIcon className="h-5 w-5 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            AI screening completed
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          {new Date(applicationStatus.lastUpdated).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Score and Feedback */}
          {applicationStatus.score && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Assessment Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {applicationStatus.score}%
                    </div>
                    <div className="text-sm text-gray-600">Overall Score</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Feedback</h4>
                  <p className="text-gray-600 text-sm">
                    {applicationStatus.feedback}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
