#!/bin/bash

# BearPlus Application Stop Script
echo "🛑 Stopping BearPlus Application..."

# Function to stop a service by PID file
stop_service() {
    local service_name=$1
    local pid_file="$service_name.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo "🛑 Stopping $service_name (PID: $pid)..."
            kill $pid
            # Wait for graceful shutdown
            sleep 2
            # Force kill if still running
            if ps -p $pid > /dev/null 2>&1; then
                echo "⚠️  Force stopping $service_name..."
                kill -9 $pid
            fi
            echo "✅ $service_name stopped"
        else
            echo "⚠️  $service_name was not running"
        fi
        rm -f "$pid_file"
    else
        echo "⚠️  No PID file found for $service_name"
    fi
}

# Stop all services
stop_service "server"
stop_service "client" 
stop_service "crm-client"

# Stop any remaining Node.js processes on our ports
echo "🧹 Cleaning up any remaining processes..."

# Kill processes on our ports
for port in 5005 5173 3000; do
    pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        echo "🛑 Stopping process on port $port (PID: $pid)..."
        kill $pid 2>/dev/null || true
    fi
done

# Stop MongoDB container if it exists
if command -v docker >/dev/null 2>&1; then
    if [ "$(docker ps -q -f name=bearplus-mongo)" ]; then
        echo "🛑 Stopping MongoDB container..."
        docker stop bearplus-mongo
        echo "✅ MongoDB container stopped"
    fi
fi

echo ""
echo "✅ All BearPlus services have been stopped"
echo ""
echo "🔧 To start again, run: ./start.sh"