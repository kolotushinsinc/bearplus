#!/bin/bash

# BearPlus Application Startup Script
echo "🐻 Starting BearPlus Application..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

if ! command_exists docker; then
    echo "⚠️  Docker is not installed. You'll need to set up MongoDB manually."
    echo "   Install Docker from https://www.docker.com/get-started"
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'.' -f1 | sed 's/v//')
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Create environment files if they don't exist
echo "🔧 Setting up environment configuration..."

if [ ! -f server/.env ]; then
    echo "📝 Creating server environment file..."
    cp server/.env.example server/.env
    echo "⚠️  Please configure server/.env with your settings before running the application"
fi

if [ ! -f client/.env ]; then
    echo "📝 Creating client environment file..."
    cat > client/.env << EOL
VITE_API_URL=https://api.bearplus.ru/api/api
VITE_APP_NAME=BearPlus
VITE_APP_VERSION=1.0.0
EOL
fi

if [ ! -f crm-client/.env ]; then
    echo "📝 Creating CRM client environment file..."
    cat > crm-client/.env << EOL
REACT_APP_API_URL=https://api.bearplus.ru/api/api
REACT_APP_NAME=BearPlus CRM
EOL
fi

# Install dependencies
echo "📦 Installing dependencies..."

echo "  📦 Installing server dependencies..."
cd server && npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install server dependencies"
    exit 1
fi

echo "  📦 Installing client dependencies..."
cd ../client && npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install client dependencies"
    exit 1
fi

echo "  📦 Installing CRM client dependencies..."
cd ../crm-client && npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install CRM client dependencies"
    exit 1
fi

cd ..

# Start MongoDB with Docker if available
if command_exists docker; then
    echo "🐳 Starting MongoDB with Docker..."
    if [ ! "$(docker ps -q -f name=bearplus-mongo)" ]; then
        if [ "$(docker ps -aq -f status=exited -f name=bearplus-mongo)" ]; then
            echo "🔄 Starting existing MongoDB container..."
            docker start bearplus-mongo
        else
            echo "🆕 Creating new MongoDB container..."
            docker run -d \
                --name bearplus-mongo \
                -p 27017:27017 \
                -e MONGO_INITDB_ROOT_USERNAME=admin \
                -e MONGO_INITDB_ROOT_PASSWORD=password \
                -e MONGO_INITDB_DATABASE=bearplus \
                -v bearplus-mongo-data:/data/db \
                mongo:latest
        fi
    else
        echo "✅ MongoDB is already running"
    fi
    
    # Wait for MongoDB to be ready
    echo "⏳ Waiting for MongoDB to be ready..."
    sleep 5
else
    echo "⚠️  Docker not available. Please ensure MongoDB is running on localhost:27017"
fi

# Function to start a service and track its PID
start_service() {
    local service_name=$1
    local command=$2
    local directory=$3
    
    echo "🚀 Starting $service_name..."
    cd "$directory"
    $command &
    local pid=$!
    echo $pid > "../$service_name.pid"
    echo "✅ $service_name started (PID: $pid)"
    cd ..
}

# Start all services
echo "🚀 Starting all services..."

start_service "server" "npm run dev" "server"
sleep 3

start_service "client" "npm run dev" "client"
sleep 2

start_service "crm-client" "npm start" "crm-client"

echo ""
echo "🎉 BearPlus application is starting up!"
echo ""
echo "🌐 Services will be available at:"
echo "   📊 Main Client:  http://localhost:5173"
echo "   🏢 CRM Client:   http://localhost:3000"
echo "   🖥️  API Server:   https://api.bearplus.ru/api"
echo "   🍃 MongoDB:      mongodb://localhost:27017"
echo ""
echo "📋 To stop all services, run: ./stop.sh"
echo "📋 To view logs, check the terminal outputs above"
echo ""
echo "⏳ Please wait 30-60 seconds for all services to fully start..."

# Wait for services to start
sleep 10

# Check if services are running
check_service() {
    local name=$1
    local url=$2
    
    if curl -s "$url" > /dev/null 2>&1; then
        echo "✅ $name is running"
    else
        echo "⚠️  $name may still be starting..."
    fi
}

echo "🔍 Checking service status..."
check_service "API Server" "https://api.bearplus.ru/api/api/health"
check_service "Main Client" "http://localhost:5173"
check_service "CRM Client" "http://localhost:3000"

echo ""
echo "🐻 BearPlus startup complete! Happy shipping! 📦"