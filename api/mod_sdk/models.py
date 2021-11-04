import docker


class Sdk():
    # Container id
    docker_client = docker.APIClient(base_url='unix://var/run/docker.sock')
