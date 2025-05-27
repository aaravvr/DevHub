import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { format } from 'date-fns'

// Takes in a project to display
function ProjectCard({ project }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/projects/' + project._id, { state: { project } })
  }

  // Essentially handles how the project is rendered
  // Should be able to add CSS here to improve upon it
 return (
  <section>
  <div className="card w-96 bg-base-100 card-lg shadow-sm">
  <div className="card-body">
    <h2 className="card-title">{project.title}</h2>
    <p>By {project.creator.username}</p>
    <p className="project-date">
      {format(new Date(project.createdAt), 'PPPp')}
    </p>
    <div className="justify-end card-actions">
      <button className="btn btn-primary" onClick={handleClick}>Join</button>
    </div>
  </div>
</div>

  <div className="project-divider" />

  <div className="project-snippet">{project.desc.slice(0, 100)}...</div>

</section>
 )
}

export default ProjectCard