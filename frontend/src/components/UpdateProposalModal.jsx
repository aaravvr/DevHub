import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance';

function UpdateProposalModal({ show, proposal, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    mediaUrl: '',
    githubUrl: '',
    branchName: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (proposal) {
      setFormData({
        title: proposal.title || '',
        desc: proposal.desc || '',
        mediaUrl: proposal.mediaUrl || '',
        githubUrl: proposal.githubUrl || '',
        branchName: proposal.branchName || '',
      });
    }
  }, [proposal]);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosInstance.put(`/api/proposals/${proposal._id}`, formData);
      toast.success('Proposal updated successfully');
      onClose();
    } catch (err) {
      console.log('ERROR', err);
      console.log(axiosInstance.defaults.headers);
      toast.error('Failed to update proposal.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[#1f2937] text-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Proposal</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Title</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full border px-3 py-2 rounded bg-[#111827] text-white border-gray-600" required disabled={submitting}/>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Description</label>
            <textarea rows="4" value={formData.desc} onChange={(e) => setFormData({ ...formData, desc: e.target.value })} className="w-full border px-3 py-2 rounded bg-[#111827] text-white border-gray-600" required disabled={submitting}/>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Media URL (optional)</label>
            <input type="text" value={formData.mediaUrl} onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })} className="w-full border px-3 py-2 rounded bg-[#111827] text-white border-gray-600" disabled={submitting}/>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">GitHub URL</label>
            <input type="text" value={formData.githubUrl} onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })} className="w-full border px-3 py-2 rounded bg-[#111827] text-white border-gray-600" required disabled={submitting}/>
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-semibold">Branch Name</label>
            <input type="text" value={formData.branchName} onChange={(e) => setFormData({ ...formData, branchName: e.target.value })} className="w-full border px-3 py-2 rounded bg-[#111827] text-white border-gray-600" disabled={submitting}/>
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-4 px-4 py-2 rounded border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateProposalModal;
