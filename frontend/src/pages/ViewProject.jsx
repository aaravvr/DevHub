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

  // Get sorted file tree from project
  const fileTree = projectToShow?.fileTree;

  // Tree node with opening actions 
  function TreeNode({ node }) {
    const [open, setOpen] = useState(false);

    // Checks if folder has children (is a tree)
    const isFolder = node.type === 'tree';

    // Opening and closing actions
    const toggleOpen = () => {
      if (isFolder) setOpen(!open);
    };

    return (
      <div className="ml-4">
        {/* Folder/file fonts with onClick */}
        <div
          className={`cursor-pointer ${isFolder ? 'font-bold text-white' : 'text-gray-300'}`}
          onClick={toggleOpen}
        >
          {/* Folder icons for better UI*/}
          {isFolder ? (open ? '📬' : '📪') : '✉️'} {node.name}
        </div>
        {/* Recursively render children if folder opened */}
        {isFolder && open && node.children && (
          <div className="ml-4">
            {node.children.map((child, index) => (
              <TreeNode key={index} node={child} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Renders stored fileTree using tree nodes
  function renderTree(tree) {
    return tree.map((node, index) => <TreeNode key={index} node={node} />);
  }

  if (isLoading) return <Spinner />
  if (isError) return <p className="error">{message}</p>
  if (!projectToShow) return <p>Project entry not found.</p>


  return (
    <div className="container mx-auto p-6">

      {/* Project Title, Creator, and Description */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold">{projectToShow.title}</h2>
          <p className="text-sm text-gray-500">
            Created by <span className="font-semibold">{projectToShow.creator.username}</span>
          </p>
          <p className="text-white text-lg mt-4">{projectToShow.desc}</p>
        </div>
      </div>

      {/* Features */}
      {projectToShow.features_wanted?.length > 0 && (
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title text-xl font-semibold mb-2">Features Wanted</h3>
            <ul className="space-y-4">
              {projectToShow.features_wanted.map((feature, index) => (
                <li key={index} className="bg-base-200 p-4 rounded-lg">
                  <p className="text-white text-lg font-semibold mb-1">{feature.title}</p>
                  <p className="text-white text-sm">{feature.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

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

      {/* File Tree */}
      {/* Use existing fileTree in database to render */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-xl font-semibold">File Structure</h3>
          <div className="bg-base-200 p-4 rounded overflow-x-auto text-sm font-mono min-w-full">
            {fileTree
              ? Array.isArray(fileTree) && fileTree.length > 0
                ? renderTree(fileTree)
                : 'No files found in the repository.'
              : 'Loading file structure...'}
          </div>
        </div>
      </div>

      {/* Container for tags and tech together */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">

        {/* Tech Stack */}
        <div className="card bg-base-100 shadow-xl flex-1">
          <div className="card-body text-sm">
            <h3 className="card-title text-md font-semibold">Tech Stack</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {projectToShow.tech_stack.map((tech, index) => (
                <span key={index} className="badge badge-primary text-xs">{tech}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="card bg-base-100 shadow-xl flex-1">
          <div className="card-body text-sm">
            <h3 className="card-title text-md font-semibold">Tags</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {projectToShow.tags.map((tag, index) => (
                <span key={index} className="badge badge-primary text-xs">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Repository */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h3 className="card-title text-xl font-semibold">Repository URL</h3>
          <a href={projectToShow.github_repo.url} target="_blank" rel="noopener noreferrer" className="link link-primary">
            {projectToShow.github_repo.url}
          </a>
        </div>
      </div>

    </div>
  );
}

export default ViewProject;