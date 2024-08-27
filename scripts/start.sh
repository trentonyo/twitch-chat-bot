#!/bin/bash

# Load the .env file
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Authorization URL
AUTH_URL="https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=chat:read%20chat:edit"

# Open the URL in the default browser
echo "Opening browser for authorization..."
open "${AUTH_URL}"

# Run Python server to capture the code
echo "Running local server to capture the authorization code..."
python3 -c "
import http.server
import socketserver
import urllib.parse
import sys
import time

PORT = ${CATCH_PORT}

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        query = urllib.parse.urlparse(self.path).query
        params = urllib.parse.parse_qs(query)
        code = params.get('code', None)
        if code:
            code = code[0]
            with open('auth_code.txt', 'w') as f:
                f.write(code)
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b'Authorization code captured. You may close this window.')
            time.sleep(5)
            sys.exit(0)
        else:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b'No authorization code found in the URL.')
            time.sleep(5)
            sys.exit(1)

with socketserver.TCPServer(('', PORT), Handler) as httpd:
    print(f'Serving on port {PORT}...')
    httpd.serve_forever()
"

# Read the captured code
echo "Waiting for authorization code..."
while [ ! -f auth_code.txt ]; do sleep 1; done
AUTH_CODE=$(cat auth_code.txt)
echo "Authorization code captured: $AUTH_CODE"

# Clean up
rm auth_code.txt

## Exchange the authorization code for an access token NOTE: NOT USED IN THIS IMPLEMENTATION
#RESPONSE=$(curl -X POST "https://id.twitch.tv/oauth2/token" \
#    -H "Content-Type: application/json" \
#    -d '{
#      "client_id": "'"${CLIENT_ID}"'",
#      "client_secret": "'"${CLIENT_SECRET}"'",
#      "code": "'"${AUTH_CODE}"'",
#      "grant_type": "authorization_code",
#      "redirect_uri": "'"${REDIRECT_URI}"'"
#    }')
#
#echo "Response: $RESPONSE"

# Assumes RESPONSE has the JSON string result from the earlier curl command
python3 -c "
import json
import sys

config = {}
# Read the config.json file
with open('config.json', 'r') as input:
   config = json.loads(input.read())

# Capture the RESPONSE environment variable safely
response = sys.argv[1]
config['twitch']['authorization_code'] = response

# Write the updated config.json file
with open('config.json', 'w') as output:
   output.write(json.dumps(config, indent=2))
 " "$AUTH_CODE"

npm start