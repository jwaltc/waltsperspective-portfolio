#!/usr/bin/env python3
"""
serve.py — HTTP server with Range request support.
Required for video currentTime scrubbing in browser.
Usage: python3 serve.py [port]
"""
import http.server
import os
import sys

PORT = int(os.environ.get('PORT', sys.argv[1] if len(sys.argv) > 1 else 3000))


class RangeRequestHandler(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        path = self.translate_path(self.path)
        f = None
        if os.path.isdir(path):
            return super().send_head()

        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(404, "File not found")
            return None

        fs = os.fstat(f.fileno())
        file_size = fs[6]

        range_header = self.headers.get('Range')
        if range_header:
            # Parse "bytes=start-end"
            try:
                byte_range = range_header.strip().replace('bytes=', '')
                parts = byte_range.split('-')
                start = int(parts[0]) if parts[0] else 0
                end   = int(parts[1]) if parts[1] else file_size - 1
                end   = min(end, file_size - 1)
                length = end - start + 1

                f.seek(start)
                self.send_response(206, 'Partial Content')
                self.send_header('Content-Type', self.guess_type(path))
                self.send_header('Content-Range', f'bytes {start}-{end}/{file_size}')
                self.send_header('Content-Length', str(length))
                self.send_header('Accept-Ranges', 'bytes')
                self.send_header('Last-Modified', self.date_time_string(fs.st_mtime))
                self.end_headers()
                return f
            except Exception:
                f.close()
                self.send_error(400, "Bad Range header")
                return None
        else:
            # Normal full-file response
            self.send_response(200)
            self.send_header('Content-Type', self.guess_type(path))
            self.send_header('Content-Length', str(file_size))
            self.send_header('Accept-Ranges', 'bytes')
            self.send_header('Last-Modified', self.date_time_string(fs.st_mtime))
            self.end_headers()
            return f

    def log_message(self, format, *args):
        # Quieter logs — only print non-206 responses to reduce noise
        code = args[1] if len(args) > 1 else '?'
        if code not in ('206',):
            super().log_message(format, *args)


if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with http.server.ThreadingHTTPServer(('', PORT), RangeRequestHandler) as httpd:
        print(f'✓ Serving with Range support on http://localhost:{PORT}')
        httpd.serve_forever()
