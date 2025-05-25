import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'

import ProjectForm from '../components/ProjectForm'
import ProjectCard from '../components/ProjectCard'
import Spinner from '../components/Spinner'


import { getAllProjects, reset } from '../features/projects/projectSlice'

function HomePage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Basically gets us the required states from the global state
  // ? just continues if auth exists, else doesn't look for user
  const user = useSelector((state) => state.auth?.user || null)
  const {projects, isLoading, isError, message} = useSelector((state) => state.projects)

  
  useEffect(() => {

    dispatch(getAllProjects())

    return () => {
      dispatch(reset())
    }

  }, [dispatch]) 

  // useEffect(() => {
  //   return () => {

  //     dispatch(reset())
  //   }
  // }, [dispatch])

  // Added this error handling seperately due to infinite loop issue
  // Ideally can be combined with useEffect above
  useEffect(() => {
    // Shows error to user
    if(isError && <p className="error">{message}</p>) {
      console.log(message)
    }
  }, [isError, message])


  if (isLoading) {
    return <Spinner />
  }

  //console.log("Fetched projects", projects.projects ? projects.projects[0] : null)
  const projectList = projects.projects || []

  return (
    <>
      <section className="hero bg-base-200 py-8">
        <div className="hero-content text-center flex-col">
          <h1 className="text-3xl font-bold mb-2">DevHub</h1>
          <p className="text-lg text-gray-600">Current Projects</p>
        </div>
      </section>

      <ProjectForm />
      <section className="p-6">
        { isLoading ? (
          <Spinner />
        ) : projectList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.projects.map((project) => (
              <div key={project._id} className="card bg-base-100 shadow-md">
                <div className="card-body">
                  <ProjectCard project={project}/>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <h3 className="text-xl text-gray-500 text-center mt-4">No Projects Currently.</h3>
        )}
      </section>
    </>
  )
}

export default HomePage