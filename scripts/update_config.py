# update_config.py
import json
import sys
import os

config = {'twitch': {}}
# Read the config.json file
try:
    with open('config.json', 'r') as input:
        config = json.loads(input.read())
except FileNotFoundError:
    print('No config.json found, creating a new one')

# Capture the environment variables safely
config['twitch']['authorization_code'] = sys.argv[1]
config['twitch']['username'] = sys.argv[2]
config['twitch']['client_id'] = sys.argv[3]
config['twitch']['client_secret'] = sys.argv[4]
config['twitch']['channel'] = sys.argv[5]
config['twitch']['token_endpoint'] = 'https://id.twitch.tv/oauth2/token'

# Write the updated config.json file
with open('config.json', 'w') as output:
    output.write(json.dumps(config, indent=2))