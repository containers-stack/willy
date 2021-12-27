# B"H

# define Python user-defined exceptions
class Error(Exception):
    """Base class for other exceptions"""
    pass


class ContainerIdNotFound(Error):
    """Raised when the input id not found"""
    pass


class ContainerIdMuchTooManny(Error):
    """Raised when the input value is too large"""
    pass


class ContainerIdDoNotMuch(Error):
    """Raised when the input value is too large"""
    pass
