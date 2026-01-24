import api from "./api";

const getPendingContractors = () => {
  return api.get("/admin/contractors/pending");
};

const getApprovedContractors = () => {
  return api.get("/admin/contractors");
};

const approveContractor = (id) => {
  return api.put(`/admin/contractors/${id}/approve`);
};

const deleteContractor = (id) => {
  return api.delete(`/admin/contractors/${id}`);
};

const AdminService = {
  getPendingContractors,
  getApprovedContractors,
  approveContractor,
  deleteContractor,
};

export default AdminService;
