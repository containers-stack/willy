# Run a test server.
from logging import debug
import os

from api import app
from api import socketio

PORT = os.getenv("PORT", 5000)

# TODO Use flask run
#app.run(host='0.0.0.0', port=PORT, debug=True)


