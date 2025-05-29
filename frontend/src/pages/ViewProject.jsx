import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Spinner from '../components/Spinner'
import { getProjectById, resetSelectedProject } from '../features/projects/projectSlice'

function ViewProject({ project }) {
  const { id } = useParams()
  const location = useLocation()
  const dispatch = useDispatch()

  // State and reducer for localProject, which is fetched from previous page immediately
  const [localProject, setLocalProject] = useState(location.state?.project)

  // Seletected project is from react fetch calls, which takes longer than local
  const { selectedProject, isLoading, isError, message } = useSelector((state) => state.projects)

  useEffect(() => {
    if (!localProject) {
      dispatch(getProjectById(id))
    }

    return () => {
      dispatch(resetSelectedProject())
    }
  }, [id, localProject, dispatch])

  // Show local if available (loads faster), else wait and get selectedProject
  // Makes rendering smoother without delays
  const projectToShow = localProject || selectedProject

  if (isLoading) return <Spinner />
  if (isError) return <p className="error">{message}</p>
  if (!projectToShow) return <p>Project entry not found.</p>


  return (
    <div className="container mx-auto p-6">
      {/* Project Title and Creator */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold">{projectToShow.title}</h2>
          <p className="text-sm text-gray-500">
            Created by{' '}
            <a
              href={`/users/${projectToShow.creator._id}`}
              className="font-semibold text-indigo-500 hover:underline"
            >
              {projectToShow.creator.username}
            </a>
          </p>
        </div>
      </div>

      {/* Project Description */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h3 className="card-title text-xl font-semibold">Description</h3>
          <p className="text-gray-700">{projectToShow.desc}</p>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h3 className="card-title text-xl font-semibold">Tech Stack</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {projectToShow.tech_stack.map((tech, index) => (
              <span key={index} className="badge badge-primary">{tech}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h3 className="card-title text-xl font-semibold">Tags</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {projectToShow.tags.map((tag, index) => (
              <span key={index} className="badge badge-primary">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Forgot to add collaborators in model. Removed for now */}
      {/* Collaborators */}
      {/* <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h3 className="card-title text-xl font-semibold">Collaborators</h3>
          <ul className="list-disc list-inside">
            {project.collaborators.map((collaborator, index) => (
              <li key={index}>{collaborator}</li>
            ))}
          </ul>
        </div>
      </div> */}

      {/* GitHub Repository */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h3 className="card-title text-xl font-semibold">Repository</h3>
          <a href={projectToShow.github_repo.url} target="_blank" rel="noopener noreferrer" className="link link-primary">
            {projectToShow.github_repo.url}
          </a>
        </div>
      </div>

      {/* Will add file structure visual later */}
      {/* File Tree */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-xl font-semibold">File Structure</h3>
          <pre className="bg-base-200 p-4 rounded">
            {projectToShow.github_repo.repo}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default ViewProject;