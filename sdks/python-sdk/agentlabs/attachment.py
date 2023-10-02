from os.path import basename

class Attachment:
    @staticmethod
    def from_path(path: str) -> "Attachment":
        with open(path, "rb") as f:
            filename = basename(path)
            buffer = f.read()
            return Attachment(buffer, name=filename)

    def __init__(self, buffer: bytes, name: str):
        self.buffer = buffer
        self.name = name
