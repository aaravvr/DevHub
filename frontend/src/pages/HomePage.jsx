import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

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
  const { projects, isLoading, isError, message } = useSelector((state) => state.projects)

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

  // Added this error handling separately due to infinite loop issue
  // Ideally can be combined with useEffect above
  useEffect(() => {
    // Shows error to user
    if (isError && message) {
      console.error('❌ Project fetch error:', message)
    }
  }, [isError, message])

  if (isLoading) {
    return <Spinner />
  }

  //console.log("Fetched projects", projects.projects ? projects.projects[0] : null)
  const projectList = projects.projects || []

  return (
    <>
      <section className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white py-12 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">🚀 DevHub</h1>
          <p className="text-lg text-indigo-100">Discover and showcase your latest projects</p>
        </div>
      </section>

      <ProjectForm />

      <section className="px-6 py-12 max-w-7xl mx-auto">
        {isLoading ? (
          <Spinner />
        ) : projectList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectList.map((project) => (
              <div key={project._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition">
                <div className="card-body">
                  <ProjectCard project={project} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <h3 className="text-xl text-gray-500 text-center mt-8">No Projects Currently.</h3>
        )}
      </section>
    </>
  )
}

export default HomePage
