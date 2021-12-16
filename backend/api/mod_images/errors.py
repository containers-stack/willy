# B"H

# define Python user-defined exceptions
class Error(Exception):
    """Base class for other exceptions"""
    pass


class ImageIdNotFound(Error):
    """Raised when the input id not found"""
    pass


class ImageIdMuchTooManny(Error):
    """Raised when the input value is too large"""
    pass


class ImageIdDoNotMuch(Error):
    """Raised when the input value is too large"""
    pass
