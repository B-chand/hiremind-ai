import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { 
  PlusIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  BriefcaseIcon
} from "@heroicons/react/24/outline";

export function JobPostings() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingJob, setEditingJob] = useState<string | null>(null);
  
  const jobPostings = useQuery(api.jobPostings.list, {});
  const createJob = useMutation(api.jobPostings.create);
  const updateJob = useMutation(api.jobPostings.update);
  const toggleActive = useMutation(api.jobPostings.toggleActive);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requiredSkills: "",
    experienceLevel: "",
    salaryMin: "",
    salaryMax: "",
    location: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingJob) {
        await updateJob({
          id: editingJob as any,
          title: formData.title,
          description: formData.description,
          requiredSkills: formData.requiredSkills.split(",").map(s => s.trim()),
          experienceLevel: formData.experienceLevel,
          salaryRange: {
            min: parseInt(formData.salaryMin),
            max: parseInt(formData.salaryMax),
          },
          location: formData.location,
        });
        toast.success("Job posting updated!");
        setEditingJob(null);
      } else {
        await createJob({
          title: formData.title,
          description: formData.description,
          requiredSkills: formData.requiredSkills.split(",").map(s => s.trim()),
          experienceLevel: formData.experienceLevel,
          salaryRange: {
            min: parseInt(formData.salaryMin),
            max: parseInt(formData.salaryMax),
          },
          location: formData.location,
        });
        toast.success("Job posting created!");
        setShowCreateForm(false);
      }
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        requiredSkills: "",
        experienceLevel: "",
        salaryMin: "",
        salaryMax: "",
        location: "",
      });
    } catch (error) {
      toast.error("Failed to save job posting");
    }
  };

  const handleToggleActive = async (jobId: string) => {
    try {
      await toggleActive({ id: jobId as any });
      toast.success("Job status updated!");
    } catch (error) {
      toast.error("Failed to update job status");
    }
  };

  const startEdit = (job: any) => {
    setFormData({
      title: job.title,
      description: job.description,
      requiredSkills: job.requiredSkills.join(", "),
      experienceLevel: job.experienceLevel,
      salaryMin: job.salaryRange.min.toString(),
      salaryMax: job.salaryRange.max.toString(),
      location: job.location,
    });
    setEditingJob(job._id);
    setShowCreateForm(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Postings</h1>
          <p className="text-gray-600 mt-2">Manage your job postings and track applications</p>
        </div>
        <button
          onClick={() => {
            setShowCreateForm(true);
            setEditingJob(null);
            setFormData({
              title: "",
              description: "",
              requiredSkills: "",
              experienceLevel: "",
              salaryMin: "",
              salaryMax: "",
              location: "",
            });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Job Posting
        </button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {editingJob ? "Edit Job Posting" : "Create New Job Posting"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level *
                </label>
                <select
                  required
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select level</option>
                  <option value="Entry Level (0-2 years)">Entry Level (0-2 years)</option>
                  <option value="Mid Level (2-5 years)">Mid Level (2-5 years)</option>
                  <option value="Senior Level (5+ years)">Senior Level (5+ years)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills (comma-separated) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., JavaScript, React, Node.js"
                value={formData.requiredSkills}
                onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Salary (USD) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.salaryMin}
                  onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Salary (USD) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.salaryMax}
                  onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., San Francisco, CA (Remote OK)"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingJob(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingJob ? "Update Job" : "Create Job"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Job Postings List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {jobPostings?.map((job) => (
          <div key={job._id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <BriefcaseIcon className="h-4 w-4 mr-1" />
                  {job.experienceLevel}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  job.isActive 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {job.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{job.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <MapPinIcon className="h-4 w-4 mr-2" />
                {job.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {job.requiredSkills.slice(0, 4).map((skill) => (
                  <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {skill}
                  </span>
                ))}
                {job.requiredSkills.length > 4 && (
                  <span className="text-xs text-gray-500">+{job.requiredSkills.length - 4} more</span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex space-x-2">
                <button
                  onClick={() => startEdit(job)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button className="text-green-600 hover:text-green-900">
                  <EyeIcon className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => handleToggleActive(job._id)}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  job.isActive
                    ? "bg-red-100 text-red-800 hover:bg-red-200"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
              >
                {job.isActive ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {jobPostings?.length === 0 && (
        <div className="text-center py-12">
          <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings yet</h3>
          <p className="text-gray-600 mb-6">Create your first job posting to start attracting candidates.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Create Job Posting
          </button>
        </div>
      )}
    </div>
  );
}
