import docker


class Sdk():
    docker_client = docker.APIClient(base_url='unix://var/run/docker.sock')
