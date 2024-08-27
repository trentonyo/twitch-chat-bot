# auth_code_server.py
import http.server
import socketserver
import urllib.parse
import sys
import time
import os

PORT = int(os.getenv('CATCH_PORT'))

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