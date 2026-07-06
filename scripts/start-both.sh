#!/bin/bash

# TripDekho Platform - Unix/Mac/Linux Startup Script
# Starts both backend (Node.js) and frontend (Next.js) applications
#
# Usage:
#   ./start-both.sh
#   ./start-both.sh dev
#   ./start-both.sh prod
#   ./start-both.sh test

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
RESET='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKEND_PATH="$PROJECT_ROOT/backend"
FRONTEND_PATH="$PROJECT_ROOT/frontend"
MODE="${1:-dev}"
BACKEND_PORT=5000
FRONTEND_PORT=3000

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️ [$1]${RESET} $2"
}

log_success() {
    echo -e "${GREEN}✅ [$1]${RESET} $2"
}

log_error() {
    echo -e "${RED}❌ [$1]${RESET} $2"
}

log_warning() {
    echo -e "${YELLOW}⚠️ [$1]${RESET} $2"
}

log_start() {
    echo -e "${CYAN}▶️ [$1]${RESET} $2"
}

log_stop() {
    echo -e "${RED}⏹️ [$1]${RESET} $2"
}

# Check prerequisites
check_prerequisites() {
    log_info "System" "Running pre-flight checks..."

    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "System" "Node.js is not installed"
        echo "Please install Node.js from https://nodejs.org/"
        return 1
    fi
    NODE_VERSION=$(node --version)
    log_success "System" "Node.js $NODE_VERSION found"

    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "System" "npm is not installed"
        return 1
    fi
    NPM_VERSION=$(npm --version)
    log_success "System" "npm $NPM_VERSION found"

    # Check backend path
    if [[ ! -d "$BACKEND_PATH" ]]; then
        log_error "System" "Backend directory not found: $BACKEND_PATH"
        return 1
    fi

    # Check frontend path
    if [[ ! -d "$FRONTEND_PATH" ]]; then
        log_error "System" "Frontend directory not found: $FRONTEND_PATH"
        return 1
    fi

    # Check backend .env
    if [[ ! -f "$BACKEND_PATH/.env" ]]; then
        log_warning "System" "Backend .env file not found"
    fi

    # Check dependencies
    if [[ ! -d "$BACKEND_PATH/node_modules" ]]; then
        log_warning "System" "Backend dependencies not installed"
        log_info "System" "Installing backend dependencies..."
        (cd "$BACKEND_PATH" && npm install > /dev/null 2>&1)
        log_success "System" "Backend dependencies installed"
    fi

    if [[ ! -d "$FRONTEND_PATH/node_modules" ]]; then
        log_warning "System" "Frontend dependencies not installed"
        log_info "System" "Installing frontend dependencies..."
        (cd "$FRONTEND_PATH" && npm install > /dev/null 2>&1)
        log_success "System" "Frontend dependencies installed"
    fi

    return 0
}

# Cleanup function
cleanup() {
    echo ""
    log_warning "System" "Shutting down services..."
    
    # Kill background jobs
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    
    # Wait for processes to finish
    wait $BACKEND_PID 2>/dev/null
    wait $FRONTEND_PID 2>/dev/null
    
    log_stop "System" "All services stopped"
    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Main execution
main() {
    echo ""
    echo -e "${CYAN}${BOLD}╔════════════════════════════════════════════════════════════╗${RESET}"
    echo -e "${CYAN}${BOLD}║     TripDekho Platform - Full Stack Startup Manager         ║${RESET}"
    echo -e "${CYAN}${BOLD}╚════════════════════════════════════════════════════════════╝${RESET}"
    echo ""

    # Run pre-flight checks
    if ! check_prerequisites; then
        echo ""
        log_error "System" "Pre-flight checks failed"
        exit 1
    fi

    log_success "System" "All pre-flight checks passed"
    log_info "System" "Starting services in ${CYAN}${MODE}${RESET} mode"
    echo ""

    # Start backend
    log_start "Backend" "Starting in $MODE mode..."
    if [[ "$MODE" == "prod" ]]; then
        (cd "$BACKEND_PATH" && npm start) &
    else
        (cd "$BACKEND_PATH" && npm run dev) &
    fi
    BACKEND_PID=$!

    # Wait a bit before starting frontend
    sleep 3

    # Start frontend
    log_start "Frontend" "Starting in $MODE mode..."
    if [[ "$MODE" == "prod" ]]; then
        (cd "$FRONTEND_PATH" && npm start) &
    else
        (cd "$FRONTEND_PATH" && npm run dev) &
    fi
    FRONTEND_PID=$!

    # Display summary
    echo ""
    echo -e "${CYAN}${BOLD}╔════════════════════════════════════════════════════════════╗${RESET}"
    echo -e "${CYAN}${BOLD}║          TripDekho Platform is Ready!                      ║${RESET}"
    echo -e "${CYAN}${BOLD}╚════════════════════════════════════════════════════════════╝${RESET}"
    echo ""

    echo -e "${GREEN}✅ Backend API${RESET}    : http://localhost:$BACKEND_PORT"
    echo -e "${GREEN}✅ Frontend App${RESET}   : http://localhost:$FRONTEND_PORT"
    echo -e "${GREEN}✅ API Docs${RESET}      : http://localhost:$BACKEND_PORT/api/v1/docs"
    echo ""

    if [[ "$MODE" == "dev" ]]; then
        echo -e "${YELLOW}📝 Tips for Development:${RESET}"
        echo "   - Backend hot-reloads on file changes (via nodemon)"
        echo "   - Frontend hot-reloads on file changes (via Next.js)"
        echo "   - Check logs above for any issues"
        echo ""
    fi

    log_info "System" "Press Ctrl+C to stop all services"
    echo ""

    # Wait for processes
    wait $BACKEND_PID $FRONTEND_PID
}

# Run main function
main
