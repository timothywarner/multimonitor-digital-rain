import webbrowser
import os
import http.server
import socketserver
import threading
import time
import sys

def start_server():
    PORT = 8000
    Handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving Matrix effect at http://localhost:{PORT}/matrix.html")
        httpd.serve_forever()

# Start the server in a separate thread
server_thread = threading.Thread(target=start_server, daemon=True)
server_thread.start()

# Wait a moment for the server to start
time.sleep(1)

# Open the default browser
webbrowser.open('http://localhost:8000/matrix.html')

print("Press Ctrl+C to exit...")
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("\nShutting down...")
    sys.exit(0) 