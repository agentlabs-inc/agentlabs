class Attachment:
    @staticmethod
    def from_path(path: str) -> "Attachment":
        with open(path, "rb") as f:
            buffer = f.read()
            return Attachment(buffer)

    def __init__(self, buffer: bytes):
        self._buffer = buffer
