import api from "./api";

const createIssue = (formData) => {
  // Do NOT set Content-Type manually for FormData, let browser set boundary
  return api.post("/issues", formData);
};

const getAllIssues = () => {
  return api.get("/issues");
};

const getMyIssues = () => {
  return api.get("/issues/my");
};

const updateStatus = (id, status, remark) => {
  return api.put(`/issues/${id}/status`, null, {
    params: {
      status,
      remark: remark || "",
    },
  });
};

const getIssueById = (id) => {
  return api.get(`/issues/${id}`);
};

const updateIssue = (id, formData) => {
  return api.put(`/issues/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const deleteIssue = (id) => {
  return api.delete(`/issues/${id}`);
};

const assignIssue = (issueId, contractorId) => {
  return api.put(`/issues/${issueId}/assign/${contractorId}`);
};

const getCategories = () => {
  // Ideally from backend, but hardcoding for now as per Enum
  // Or if there is an endpoint.
  // Backend has Category enum: ROADS, GARBAGE, WATER, ELECTRICITY, OTHER
  return Promise.resolve([
    "POTHOLE",
    "GARBAGE",
    "WATER_LEAKAGE",
    "STREET_LIGHT",
    "OTHER",
  ]);
};

const IssueService = {
  createIssue,
  getAllIssues,
  getMyIssues,
  updateStatus,
  getCategories,
  getIssueById,
  updateIssue,
  updateIssue,
  deleteIssue,
  assignIssue,
};

export default IssueService;
