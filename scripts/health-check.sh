#!/bin/bash

# TripDekho Platform Health Check Script
# This script checks if all services are running properly

set -e

echo "🏥 TripDekho Health Check Starting..."
echo "=================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="${BACKEND_URL:-http://localhost:5000}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
TIMEOUT=5

# Function to check service
check_service() {
    local name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "Checking $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout $TIMEOUT "$url" 2>/dev/null || echo "000")
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✓ OK${NC} (HTTP $response)"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $response)"
        return 1
    fi
}

# Function to check port
check_port() {
    local name=$1
    local host=$2
    local port=$3
    
    echo -n "Checking $name port... "
    
    if nc -z -w$TIMEOUT "$host" "$port" 2>/dev/null; then
        echo -e "${GREEN}✓ Open${NC}"
        return 0
    else
        echo -e "${RED}✗ Closed${NC}"
        return 1
    fi
}

# Initialize counters
PASSED=0
FAILED=0

echo ""
echo "🌐 API Health Checks"
echo "--------------------"

# Backend health
if check_service "Backend API Health" "$BACKEND_URL/api/health" 200; then
    ((PASSED++))
else
    ((FAILED++))
fi

# API docs
if check_service "API Documentation" "$BACKEND_URL/api-docs" 200; then
    ((PASSED++))
else
    ((FAILED++))
fi

# Frontend
if check_service "Frontend" "$FRONTEND_URL" 200; then
    ((PASSED++))
else
    ((FAILED++))
fi

echo ""
echo "🔌 Port Checks"
echo "--------------"

# MongoDB
if check_port "MongoDB" "localhost" 27017; then
    ((PASSED++))
else
    ((FAILED++))
fi

# Redis
if check_port "Redis" "localhost" 6379; then
    ((PASSED++))
else
    ((FAILED++))
fi

echo ""
echo "🔍 API Endpoint Tests"
echo "---------------------"

# Test public endpoints
endpoints=(
    "GET:/api/v1/health"
    "GET:/api/v1/trips"
)

for endpoint in "${endpoints[@]}"; do
    IFS=':' read -r method path <<< "$endpoint"
    endpoint_name="$method $path"
    
    if check_service "$endpoint_name" "$BACKEND_URL$path" 200; then
        ((PASSED++))
    else
        ((FAILED++))
    fi
done

echo ""
echo "📊 Summary"
echo "=========="
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"

echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All health checks passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some health checks failed!${NC}"
    exit 1
fi
