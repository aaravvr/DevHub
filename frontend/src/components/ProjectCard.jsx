import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

//import { format } from 'date-fns'

// Takes in a project to display
function ProjectCard({ project }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/project/' + project._id, { state: { project } })
  }

  // Essentially handles how the project is rendered
  // Should be able to add CSS here to improve upon it
 return (
  <div className="project-card" onClick={handleClick}>
  <div className="project-meta">
    <h2 className="project-title">{project.title}</h2>
    <p className="project-sub">By {project.creator.username}</p>
    <p className="project-date">
      {project.createdAt}
    </p>
  </div>

  <div className="project-divider" />

  <div className="project-snippet">{project.desc.slice(0, 100)}...</div>

  {/*console.log('Render button:', { isOwn, currUserRole: currUser.role, projectUserRole: project.user.role })*/}
  {/* {isOwn || hasPermission ? (
    <div className="project-buttons">
      <button
        className="project-btn delete"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(project._id)
        }}
      >
        Delete
      </button>
    </div>
    // <div className='project-buttons'>
    //   <button className='project-btn-delete' onClick={(e) => { e.stopPropagation(); onDelete(project._id);}}>Delete</button>
    // </div>
  ) : null} */}
</div>
 )
}

export default ProjectCard