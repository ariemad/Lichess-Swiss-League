#!/bin/bash

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$script_dir"

# DEFINE VARIABLES START #######################

# Specify the command to start the process
start_command="node ./Usage_Examples/NoStopSwiss.js"

# Specify the path to the PID file
pid_file="$script_dir/pidfile.pid"

# DEFINE VARIABLES END #########################

# Check if the script was called with a 'start' argument
if [ "$1" != "start" ]; then
  echo "Usage: $0 start"
  exit 1
fi

# ADD NVM TO PATH START  ##############################################

# Path to the NVM directory
nvm_dir="$HOME/.nvm"

# Search for the Node.js version directories within the NVM directory
node_version_dirs=$(find "$nvm_dir/versions/node" -maxdepth 1 -type d -name "v*" -exec echo {} \;)

# Initialize an empty string to store the final PATH
new_path=""

# Loop through the found Node.js version directories
for version_dir in $node_version_dirs; do
  # Check if the 'bin' directory exists in this version directory
  if [ -d "$version_dir/bin" ]; then
    # Append the 'bin' directory to the new PATH
    new_path="$new_path:$version_dir/bin"
  fi
done

# Remove any leading ':' and append it to the existing PATH
export PATH="${new_path#:}:$PATH"

# ADD NVM TO PATH END ################################################

# Change the working directory to the directory where the script is located

# Function to check if a process is running
is_process_running() {
  local pid="$1"
  if kill -0 "$pid" 2>/dev/null; then
    return 0  # Process is running
  else
    return 1  # Process is not running
  fi
}

# Check if the PID file exists and if the PID inside it is running
if [ -f "$pid_file" ]; then
  pid=$(cat "$pid_file")
  if is_process_running "$pid"; then
    echo "Process with PID $pid is already running."
    exit 0
  else
    echo "Process with PID $pid is not running. Starting it..."
  fi
fi

# Start the process
$start_command &
new_pid="$!"

# Save the new PID to the PID file
echo "$new_pid" > "$pid_file"

echo "Process started with PID $new_pid."
