# Data Model (ER Diagram)

## Entities 

**User**
- id
- full_name
- username
- email
- password_hash
- github_username
- role (e.g., student, employee, admin)
- tech_stack (e.g., Python, Java, React)
- bio
- avatar_url
- createdAt
- updatedAt

**Project**
- id
- title
- description
- access_type (public, private)
- github_repo
- creator_id
- collaborators (list of user ids)
- tech_stack
- tags
- features_wanted (object describing feature and properties wanted for project)
- createdAt
- updatedAt

## Relationships
- One **User** can create many **Projects** (1:N)
- One **Project** has exactly one **creator** (foreign key: `creator_id`)
- One **Project** can have many **collaborators** (N)
- One **User** can collaborate on many **Projects** (N)