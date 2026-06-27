from fastapi import APIRouter, Query, HTTPException
from ..neis_client import search_schools
from ..schemas import SchoolSearchResponse

router = APIRouter()

@router.get("/api/schools", response_model=SchoolSearchResponse)
async def get_schools(q: str = Query(..., min_length=1)):
    try:
        schools = await search_schools(q)
        return SchoolSearchResponse(schools=schools)
    except Exception as e:
        raise HTTPException(502, "Failed to fetch schools from NEIS")
