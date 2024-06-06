#!/bin/bash

# Get the LAN IP address
ip=$(ipconfig getifaddr en0)

# Check if the IP address was retrieved
if [ -z "$ip" ]; then
  echo "Could not determine LAN IP address. Make sure you are connected to the network."
  exit 1
fi

# Start the Parcel development server with the LAN IP address
parcel serve src/index.html --host $ip

