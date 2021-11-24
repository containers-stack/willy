# B"H
from json import JSONEncoder


# Define a Dashboard model
class Dashboard:
    # Sum of Containers
    containers = int
    # Sum of Images
    images = int
    # Sum of Volumes
    vol = int
    # Sum of Networks
    net = int
    # Sum of running containers
    running = int
    # Sum of paused containers
    paused = int
    # Sum of stopped containers
    stopped = int
    # Sum of host memory
    hostMemory = int
    # Sum of host cors
    hostcors = int
    # Events
    events = []


    # New instance instantiation procedure
    def __init__(self, containers,images,vol,net,running,paused,stopped,hostMemory,hostcors,events):
        self.containers = containers
        self.images     = images
        self.vol        = vol
        self.net        = net
        self.running    = running
        self.paused     = paused
        self.stopped    = stopped
        self.hostMemory = hostMemory
        self.hostcors   = hostcors
        self.events     = events


    def __repr__(self):
        return '<Dashboard %r>' % self.name


# Define a Event model
class Event:
    
    # Event From
    eventFrom = str
    
    # Event Action
    eventAction = str
    
    # Event Id
    eventContainerId = str

    # Event name
    eventContainerName = str
    
    # Event date
    eventTime = int


    # New instance instantiation procedure
    def __init__(self, eventFrom, eventAction, eventContainerId, eventTime, eventContainerName):
        self.eventFrom           = eventFrom
        self.eventAction         = eventAction
        self.eventContainerId    = eventContainerId
        self.eventContainerName  = eventContainerName
        self.eventTime           = eventTime
        
    
    def __repr__(self):
        return '<Events %r>' % self.name


# subclass JSONEncoder
class DashboardEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__


