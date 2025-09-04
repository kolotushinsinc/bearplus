#!/bin/bash

# BearPlus Logistics Platform Deployment Script
# Usage: ./deploy.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="bearplus"
COMPOSE_FILE="docker-compose.yml"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to check if required files exist
check_requirements() {
    print_status "Checking requirements..."
    
    if [ ! -f "$COMPOSE_FILE" ]; then
        print_error "docker-compose.yml not found"
        exit 1
    fi
    
    if [ ! -f ".env.example" ]; then
        print_error ".env.example not found"
        exit 1
    fi
    
    print_success "All required files found"
}

# Function to setup environment
setup_env() {
    print_status "Setting up environment..."
    
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from .env.example..."
        cp .env.example .env
        print_warning "Please edit .env file with your actual configuration"
    else
        print_success ".env file already exists"
    fi
}

# Function to build images
build() {
    print_status "Building Docker images..."
    docker-compose build --no-cache
    print_success "Images built successfully"
}

# Function to start services
start() {
    print_status "Starting BearPlus services..."
    docker-compose up -d
    
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        print_success "Services started successfully"
        show_status
    else
        print_error "Some services failed to start"
        docker-compose logs
        exit 1
    fi
}

# Function to stop services
stop() {
    print_status "Stopping BearPlus services..."
    docker-compose down
    print_success "Services stopped"
}

# Function to restart services
restart() {
    print_status "Restarting BearPlus services..."
    docker-compose restart
    print_success "Services restarted"
}

# Function to show logs
logs() {
    if [ -z "$2" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$2"
    fi
}

# Function to show status
show_status() {
    print_status "Service Status:"
    docker-compose ps
    
    echo ""
    print_status "Service URLs:"
    echo "🌐 Main Application: http://localhost:3000"
    echo "🏢 CRM System: http://localhost:3001"
    echo "🔧 API Server: http://localhost:5000"
    echo "📊 RabbitMQ Management: http://localhost:15672 (admin/password123)"
    echo "🗄️  MongoDB: localhost:27017"
    echo "💾 Redis: localhost:6379"
    echo ""
    print_status "With Nginx proxy:"
    echo "🌐 Main Application: http://localhost"
    echo "🏢 CRM System: http://crm.localhost"
    echo "🔍 Health Check: http://health.localhost/health"
}

# Function to clean up
cleanup() {
    print_status "Cleaning up..."
    docker-compose down -v --remove-orphans
    docker system prune -f
    print_success "Cleanup completed"
}

# Function to backup database
backup() {
    print_status "Creating database backup..."
    timestamp=$(date +%Y%m%d_%H%M%S)
    backup_file="backup_${timestamp}.gz"
    
    docker-compose exec mongodb mongodump --authenticationDatabase admin -u admin -p password123 --db bearplus --gzip --archive=/tmp/${backup_file}
    docker cp $(docker-compose ps -q mongodb):/tmp/${backup_file} ./backups/
    
    print_success "Backup created: ./backups/${backup_file}"
}

# Function to restore database
restore() {
    if [ -z "$2" ]; then
        print_error "Please specify backup file: ./deploy.sh restore backup_file.gz"
        exit 1
    fi
    
    backup_file="$2"
    if [ ! -f "./backups/$backup_file" ]; then
        print_error "Backup file not found: ./backups/$backup_file"
        exit 1
    fi
    
    print_status "Restoring database from $backup_file..."
    docker cp ./backups/$backup_file $(docker-compose ps -q mongodb):/tmp/
    docker-compose exec mongodb mongorestore --authenticationDatabase admin -u admin -p password123 --db bearplus --gzip --archive=/tmp/$backup_file --drop
    
    print_success "Database restored from $backup_file"
}

# Function to run development mode
dev() {
    print_status "Starting development mode..."
    
    # Check if node_modules exist
    if [ ! -d "server/node_modules" ]; then
        print_status "Installing server dependencies..."
        cd server && npm install && cd ..
    fi
    
    if [ ! -d "client/node_modules" ]; then
        print_status "Installing client dependencies..."
        cd client && npm install && cd ..
    fi
    
    if [ ! -d "crm-client/node_modules" ]; then
        print_status "Installing CRM client dependencies..."
        cd crm-client && npm install && cd ..
    fi
    
    # Start only database services
    docker-compose up -d mongodb rabbitmq redis
    
    print_status "Database services started. Now run:"
    print_success "npm run dev"
}

# Function to run tests
test() {
    print_status "Running tests..."
    
    # Start test database
    docker-compose up -d mongodb
    
    # Run server tests
    cd server && npm test && cd ..
    
    print_success "Tests completed"
}

# Function to show help
show_help() {
    echo "BearPlus Logistics Platform Deployment Script"
    echo ""
    echo "Usage: ./deploy.sh [command]"
    echo ""
    echo "Commands:"
    echo "  build     - Build all Docker images"
    echo "  start     - Start all services"
    echo "  stop      - Stop all services"
    echo "  restart   - Restart all services"
    echo "  status    - Show service status and URLs"
    echo "  logs      - Show logs (optionally specify service name)"
    echo "  dev       - Start development mode (databases only)"
    echo "  test      - Run tests"
    echo "  backup    - Create database backup"
    echo "  restore   - Restore database from backup"
    echo "  cleanup   - Stop services and clean up resources"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh start"
    echo "  ./deploy.sh logs server"
    echo "  ./deploy.sh restore backup_20240116_120000.gz"
}

# Create necessary directories
mkdir -p backups
mkdir -p server/uploads

# Main script logic
case "$1" in
    "build")
        check_docker
        check_requirements
        setup_env
        build
        ;;
    "start")
        check_docker
        check_requirements
        setup_env
        start
        ;;
    "stop")
        stop
        ;;
    "restart")
        restart
        ;;
    "logs")
        logs "$@"
        ;;
    "status")
        show_status
        ;;
    "cleanup")
        cleanup
        ;;
    "backup")
        backup
        ;;
    "restore")
        restore "$@"
        ;;
    "dev")
        check_docker
        dev
        ;;
    "test")
        test
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    "")
        print_warning "No command specified. Use './deploy.sh help' for available commands."
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac