import os
from typing import TypedDict, Optional

class AttachmentItem:
    def __init__(self):
        pass

class _UploadedAttachment(TypedDict):
    id: str

class Attachment:
    @staticmethod
    def from_local_file(path: str, mime_type: Optional[str] = None) -> AttachmentItem:
        return _LocalFileAttachment(path, mime_type)

class _LocalFileAttachment(AttachmentItem):
    data: bytes

    def __init__(self, path: str, mime_type: Optional[str]):
        self.path = path
        self.filename = os.path.basename(path)
        self.mime_type = mime_type

    def load(self):
        file = open(self.path, 'rb')

        self.data = file.read()
