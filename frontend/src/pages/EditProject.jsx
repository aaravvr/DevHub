import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProjectById, updateProject } from '../features/projects/projectSlice'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'

export default function EditProject() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedProject, isLoading } = useSelector((state) => state.projects)

  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    access_type: 'public',
    tech: '',
    tech_stack: [],
    tag: '',
    tags: [],
    features_wanted: [{ title: '', description: '' }],
    github_repo: '',
  })

  useEffect(() => {
    dispatch(getProjectById(id))
  }, [dispatch, id])

  useEffect(() => {
    if (selectedProject) {
      setFormData({
        title: selectedProject.title,
        desc: selectedProject.desc,
        access_type: selectedProject.access_type,
        tech: '',
        tech_stack: selectedProject.tech_stack || [],
        tag: '',
        tags: selectedProject.tags || [],
        features_wanted: selectedProject.features_wanted || [{ title: '', description: '' }],
        github_repo: selectedProject.github_repo?.url || '',
      })
    }
  }, [selectedProject])

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const addToArray = (field, valueField) => {
    if (formData[valueField]) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], prev[valueField]],
        [valueField]: '',
      }))
    }
  }

  const removeFromArray = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleFeatureChange = (index, key, value) => {
    const updated = [...formData.features_wanted]
    updated[index][key] = value
    setFormData({ ...formData, features_wanted: updated })
  }

  const addFeature = () => {
    setFormData({ ...formData, features_wanted: [...formData.features_wanted, { title: '', description: '' }] })
  }

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features_wanted: formData.features_wanted.filter((_, i) => i !== index),
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const updatedData = {
      title: formData.title,
      desc: formData.desc,
      access_type: formData.access_type,
      tech_stack: formData.tech_stack,
      tags: formData.tags,
      features_wanted: formData.features_wanted,
      github_repo: { url: formData.github_repo },
    }

    dispatch(updateProject({ id, data: updatedData }))
      .unwrap()
      .then(() => {
        toast.success('Project updated successfully')
        navigate('/my-projects')
      })
      .catch((err) => toast.error(err))
  }

  if (isLoading || !selectedProject) return <Spinner />

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4 flex justify-center">
      <form onSubmit={onSubmit} className="space-y-4 w-full max-w-2xl">
        <h2 className="text-2xl font-bold">Edit Project</h2>

        <input className="input input-bordered w-full" name="title" placeholder="Title" value={formData.title} onChange={onChange} />
        <textarea className="textarea textarea-bordered w-full" name="desc" placeholder="Description" value={formData.desc} onChange={onChange} />

        <select name="access_type" value={formData.access_type} onChange={onChange} className="select select-bordered w-full">
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        <div className="flex gap-2">
          <input className="input input-bordered flex-1" name="tech" placeholder="Add Tech" value={formData.tech} onChange={onChange} />
          <button type="button" className="btn" onClick={() => addToArray('tech_stack', 'tech')}>Add</button>
        </div>

        <div className="flex gap-2">
          <input className="input input-bordered flex-1" name="tag" placeholder="Add Tag" value={formData.tag} onChange={onChange} />
          <button type="button" className="btn" onClick={() => addToArray('tags', 'tag')}>Add</button>
        </div>

        {formData.features_wanted.map((feature, index) => (
          <div key={index} className="space-y-2">
            <input className="input input-bordered w-full" placeholder="Feature Title" value={feature.title} onChange={(e) => handleFeatureChange(index, 'title', e.target.value)} />
            <input className="input input-bordered w-full" placeholder="Feature Description" value={feature.description} onChange={(e) => handleFeatureChange(index, 'description', e.target.value)} />
            <button type="button" className="btn btn-error btn-sm" onClick={() => removeFeature(index)}>Remove</button>
          </div>
        ))}

        <button type="button" className="btn" onClick={addFeature}>Add Feature</button>

        <input className="input input-bordered w-full" name="github_repo" placeholder="GitHub Repo URL" value={formData.github_repo} onChange={onChange} />

        <button type="submit" className="btn btn-primary w-full">Update Project</button>
      </form>
    </div>
  )
}
