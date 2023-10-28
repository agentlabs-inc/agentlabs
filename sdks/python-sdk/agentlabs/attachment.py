import os
from typing import TypedDict, Optional

MAX_ATTACHMENT_SIZE = 1024 * 1024 * 10

class AttachmentItem:
    def __init__(self):
        pass

class _UploadedAttachment(TypedDict):
    id: str

class Attachment:
    @staticmethod
    def from_local_file(path: str, mime_type: Optional[str] = None) -> AttachmentItem:
        return _LocalFileAttachment(path, mime_type)

    @staticmethod
    def from_buffer(data: bytes, filename: str, mime_type: Optional[str] = None) -> AttachmentItem:
        return _BufferFileAttachment(data, filename, mime_type)

class _LocalFileAttachment(AttachmentItem):
    data: bytes

    def __init__(self, path: str, mime_type: Optional[str]):
        self.path = path
        self.filename = os.path.basename(path)
        self.mime_type = mime_type

    def load(self):
        file = open(self.path, 'rb')
        data = file.read()

        if len(data) > MAX_ATTACHMENT_SIZE:
            raise Exception("Attachment too big, max size is 10MB")

        self.data = data

class _BufferFileAttachment(AttachmentItem):
    data: bytes

    def __init__(self, data: bytes, filename: str, mime_type: Optional[str]):
        self.filename = filename
        self.data = data
        self.mime_type = mime_type
    
    def load(self):
        if len(self.data) > MAX_ATTACHMENT_SIZE:
            raise Exception("Attachment too big, max size is 10MB")

        pass
