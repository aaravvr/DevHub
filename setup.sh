#!/bin/bash

echo "🚀 Starting DevHub Setup..."

# Step 1: Install Backend Dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Create .env if not exists
if [ ! -f .env ]; then
  echo "🔐 Creating backend .env file..."
  cat <<EOT >> .env
PORT=5001
MONGO_URI=mongodb+srv://kaushaljayapragash:greg@devhubcluster.rykqcyp.mongodb.net/devhub_test?retryWrites=true&w=majority&appName=DevHubCluster
JWT_SECRET=abcd
EOT
  echo "📝 Please update backend/.env with actual values."
fi
cd ..

# Step 3: Set up root-level package.json for combined dev script
echo "⚙️ Setting up root-level dev script..."
npm install concurrently --save-dev

if [ ! -f package.json ]; then
  echo "📄 Creating root-level package.json..."
  cat <<EOT >> package.json
{
  "name": "devhub-root",
  "version": "1.0.0",
  "scripts": {
    "dev": "concurrently \\"npm run dev --prefix backend\\" \\"npm run dev --prefix frontend\\""
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
EOT
fi

# Step 2: Install Frontend Dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

# Create .env if not exists
if [ ! -f .env ]; then
  echo "🔐 Creating frontend .env file..."
  cat <<EOT >> .env
VITE_API_URL=http://localhost:5001/api
EOT
  echo "📝 Please update frontend/.env with actual values if needed."
fi
cd ..

echo "✅ Setup complete! To start both servers:"
echo "👉 npm run dev"