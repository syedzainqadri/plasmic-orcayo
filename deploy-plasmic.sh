#!/bin/bash

# Comprehensive Plasmic Deployment Script
# Automates the setup and deployment of Plasmic for different environments

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}==============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}==============================================${NC}"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command_exists docker-compose; then
        print_error "Docker Compose is not installed. Please install Docker Compose."
        exit 1
    fi
    
    print_status "Docker: $(docker --version)"
    print_status "Docker Compose: $(docker-compose --version)"
}

# Function to generate a secure API key
generate_secure_key() {
    openssl rand -hex 32
}

# Function to setup environment files
setup_environment() {
    print_header "Setting up Environment Files"
    
    # Create .env from example if it doesn't exist
    if [ ! -f ".env" ]; then
        print_status "Creating .env file from example..."
        cp .env.example .env
        
        # Generate a secure session secret
        SESSION_SECRET=$(generate_secure_key)
        sed -i.bak "s|SESSION_SECRET=.*|SESSION_SECRET=$SESSION_SECRET|" .env
        rm -f .env.bak
        
        # Generate a secure CMS integration API key
        CMS_API_KEY=$(generate_secure_key)
        sed -i.bak "s|CMS_INTEGRATION_API_KEY=.*|CMS_INTEGRATION_API_KEY=$CMS_API_KEY|" .env
        rm -f .env.bak
        
        print_status "Generated secure SESSION_SECRET and CMS_INTEGRATION_API_KEY in .env"
        print_status "Please review .env and update any values as needed"
    else
        print_status ".env file already exists, skipping creation"
    fi
}

# Function to build and start services
start_services() {
    local environment=$1
    local compose_file="docker-compose.${environment}.yml"
    
    if [ ! -f "$compose_file" ]; then
        print_error "Docker Compose file $compose_file does not exist!"
        exit 1
    fi
    
    print_header "Starting Plasmic Services - $environment mode"
    
    # Build and start services
    docker-compose -f "$compose_file" build --no-cache
    docker-compose -f "$compose_file" up -d
    
    print_status "Services started successfully!"
    print_status "Waiting for services to be ready..."
    
    # Wait for the app to be ready
    sleep 10
    
    # Check if services are running
    if docker-compose -f "$compose_file" ps | grep -q "Up"; then
        print_status "All services are running"
        
        # Show service status
        docker-compose -f "$compose_file" ps
        
        print_status ""
        print_status "Access your Plasmic instance at:"
        print_status "  Frontend: http://localhost:3003"
        print_status "  Backend:  http://localhost:3004"
        print_status "  Host:     http://localhost:3005"
    else
        print_error "Some services failed to start"
        docker-compose -f "$compose_file" logs
        exit 1
    fi
}

# Function to stop services
stop_services() {
    local environment=$1
    local compose_file="docker-compose.${environment}.yml"
    
    print_header "Stopping Plasmic Services - $environment mode"
    
    if [ -f "$compose_file" ]; then
        docker-compose -f "$compose_file" down
        print_status "Services stopped successfully"
    else
        print_error "Docker Compose file $compose_file does not exist!"
        exit 1
    fi
}

# Function to run database migrations
run_migrations() {
    local environment=$1
    local compose_file="docker-compose.${environment}.yml"
    
    print_header "Running Database Migrations - $environment mode"
    
    if [ "$environment" = "local" ]; then
        docker-compose -f "$compose_file" exec app sh -c "cd /app/platform/wab && yarn typeorm migration:run"
    else
        print_warning "Running migrations in production mode - this may take time..."
        docker-compose -f "$compose_file" exec app sh -c "cd /app/platform/wab && yarn typeorm migration:run"
    fi
    
    print_status "Database migrations completed"
}

# Function to run database seeding
run_seeding() {
    print_header "Running Database Seeding"
    
    # Run the seed command - this populates the database with default users and projects
    docker-compose -f docker-compose.local.yml exec app sh -c "cd /app/platform/wab && yarn seed"
    
    print_status "Database seeding completed"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND] [ENVIRONMENT]"
    echo ""
    echo "Commands:"
    echo "  setup              Setup environment files and dependencies"
    echo "  start [env]        Start services (env: local, prod)"
    echo "  stop [env]         Stop services (env: local, prod)"
    echo "  restart [env]      Restart services (env: local, prod)"
    echo "  migrate [env]      Run database migrations (env: local, prod)"
    echo "  seed               Run database seeding (local environment only)"
    echo "  logs [env]         Show service logs (env: local, prod)"
    echo "  status [env]       Show service status (env: local, prod)"
    echo "  build [env]        Build services without starting (env: local, prod)"
    echo ""
    echo "Examples:"
    echo "  $0 setup              # Setup environment"
    echo "  $0 start local        # Start local development"
    echo "  $0 start prod         # Start production"
    echo "  $0 stop local         # Stop local development"
    echo ""
    echo "Default environment is 'local' if not specified."
}

# Main script logic
main() {
    # Check for help flag
    if [[ "$1" == "-h" || "$1" == "--help" ]]; then
        show_usage
        exit 0
    fi
    
    # Check if no arguments provided
    if [ $# -eq 0 ]; then
        show_usage
        exit 1
    fi
    
    command="$1"
    environment="${2:-local}"  # Default to 'local' if not specified
    
    case "$command" in
        "setup")
            check_prerequisites
            setup_environment
            ;;
        "start")
            check_prerequisites
            setup_environment  # Ensure environment is set up first
            start_services "$environment"
            ;;
        "stop")
            stop_services "$environment"
            ;;
        "restart")
            stop_services "$environment"
            start_services "$environment"
            ;;
        "migrate")
            run_migrations "$environment"
            ;;
        "seed")
            if [ "$environment" != "local" ]; then
                print_warning "Database seeding is intended for local development only"
                read -p "Are you sure you want to seed in $environment environment? (y/N): " -n 1 -r
                echo
                if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                    print_status "Database seeding cancelled"
                    exit 0
                fi
            fi
            run_seeding
            ;;
        "logs")
            if [ -f "docker-compose.${environment}.yml" ]; then
                docker-compose -f "docker-compose.${environment}.yml" logs -f
            else
                print_error "Docker Compose file docker-compose.${environment}.yml does not exist!"
                exit 1
            fi
            ;;
        "status")
            if [ -f "docker-compose.${environment}.yml" ]; then
                docker-compose -f "docker-compose.${environment}.yml" ps
            else
                print_error "Docker Compose file docker-compose.${environment}.yml does not exist!"
                exit 1
            fi
            ;;
        "build")
            if [ -f "docker-compose.${environment}.yml" ]; then
                docker-compose -f "docker-compose.${environment}.yml" build
            else
                print_error "Docker Compose file docker-compose.${environment}.yml does not exist!"
                exit 1
            fi
            ;;
        *)
            print_error "Unknown command: $command"
            show_usage
            exit 1
            ;;
    esac
}

# Run the main function with all arguments
main "$@"