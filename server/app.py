# Run a test server.
from logging import debug
import os

from api import app
from api import socketio

PORT = os.getenv("PORT", 3000)
print(PORT)

# TODO Use flask run
# app.run(host='0.0.0.0', port=PORT, debug=True)
socketio.run(app, debug=True, host='0.0.0.0', port=PORT)

