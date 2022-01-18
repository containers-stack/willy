import docker
from docker.utils import kwargs_from_env


class Sdk():
    # docker_client = docker.APIClient(base_url='unix://var/run/docker.sock')
  docker_client = docker.APIClient(version='auto', **kwargs_from_env())
    # docker_client = docker.from_env()
