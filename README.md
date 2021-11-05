# Logza.io
Simple web interface for docker container

### Clone
git clone https://github.com/moti-malka/Logza.io.git

### Install 
``pip install -r ./requirements.txt``

### Run 
``./env/bin/python run.py``
Create Personal access token for GitHub [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) is how.
Permissions: 
```buildoutcfg
Select the read:packages scope to download container images and read their metadata.
Select the write:packages scope to download and upload container images and read and write their metadata.
Select the delete:packages scope to delete container images.
```
```buildoutcfg
export CR_PAT=YOUR_TOKEN
echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin

docker run -it --rm -p 5000:3000 -v /var/run/docker.sock:/var/run/docker.sock  ghcr.io/moti-malka/logza.io:dockerfile
```
Reference [here](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
