# DevHub Frontend Guidelines

## Pages
- `/` -> HomePage (view all projects) – Kaushal
- `/create` -> CreateProject – Kaushal
- `/profile` -> Profile - Aarav
- `/:id` -> ViewProject - Kaushal
- `/myprojects` -> UserProjects - Kaushal

## Components
- `ProjectForm.jsx` -> CreateProject - Aarav
- `ProjectCard.jsx` -> HomePage, UserProjects - Kaushal
- `Navbar.jsx` -> All Pages - Kaushal
- `Spinner.jsx` -> All Pages - Aarav (simple loading animation)
- `PrivateRoute.jsx` -> CreateProject, Profile, UserProjects (anything requiring authorization) - Aarav


## Project Data Structure
- `title` (string)
- `desc` (textarea)
- `access_type` (public/private)
- `tech_stack` (array, comma separated or checkboxes)
- `tags` (array)
- `features_wanted` (array of {title, desc})
- `github_repo.url` (string)

Submit via `POST /api/projects` using `axiosInstance`

### Example Payload:
```json
{
  "title": "DevHub",
  "desc": "Platform for developer collaboration",
  "access_type": "public",
  "tech_stack": ["React", "Node.js"],
  "tags": ["open-source", "student-developed"],
  "features_wanted": [
    { "title": "Chat", "desc": "Live collaboration chat"}, 
    { "title": "Competitions", "desc": "Coding competitions with voting"}
  ],
  "github_repo": {
    "url": "https://github.com/greg/devhub"
  }
}