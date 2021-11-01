from flask import Flask
import docker
import sys
import json
import re

app = Flask(__name__)

@app.route('/', methods=['GET'])
def containers():
    client = docker.from_env()
    continers = []
    for container in client.containers.list():
        continers.append(container.id)
    return json.dumps(continers)

@app.route('/logs/<id>', methods=['GET'])
def log(id):
    
    logs = ''
    
    client = docker.APIClient(base_url='unix://var/run/docker.sock')
    
    continer_log_stream = client.logs(id, timestamps=True, stream=True, follow=False)

    try:
        while True:
            line = next(continer_log_stream).decode("utf-8")
            logs += line
    except StopIteration:
      print(f'log stream ended for {id}', file=sys.stdout)

    return str(logs)
