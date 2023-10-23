from typing import Optional, TypedDict


class _ApiMember(TypedDict):
    id: str
    createdAt: str
    updatedAt: str

    verifiedAt: Optional[str]
    bannedAt: Optional[str]

    firstName: Optional[str]
    lastName: Optional[str]
    fullName: Optional[str]

    email: str
    isAnonymous: bool

    profilePictureUrl: Optional[str]
    projectId: str

class Member: 
    def __init__(self, api_member: _ApiMember):
        self.id = api_member["id"]
        self.created_at = api_member["createdAt"]
        self.updated_at = api_member["updatedAt"]
        self.verified_at = api_member["verifiedAt"]
        self.banned_at = api_member["bannedAt"]
        self.first_name = api_member["firstName"]
        self.last_name = api_member["lastName"]
        self.full_name = api_member["fullName"]
        self.email = api_member["email"]
        self.is_anonymous = api_member["isAnonymous"]
        self.profile_picture_url = api_member["profilePictureUrl"]
        self.project_id = api_member["projectId"]
