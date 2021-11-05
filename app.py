# Run a test server.
import os

from api import app

PORT = os.getenv("PORT", 3000)
print(PORT)

# TODO Use flask run
app.run(host='0.0.0.0', port=PORT, debug=True)

