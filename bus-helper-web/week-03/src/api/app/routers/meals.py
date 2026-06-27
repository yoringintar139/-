from fastapi import APIRouter, Query, HTTPException
from ..neis_client import get_meals
from ..schemas import MealsResponse

router = APIRouter()

@router.get("/api/meals", response_model=MealsResponse)
async def get_meals_route(
    edu_office_code: str = Query(...),
    school_code: str = Query(...),
    from_date: str = Query(..., pattern=r"^\d{8}$"),
    to_date: str = Query(..., pattern=r"^\d{8}$"),
):
    try:
        meals = await get_meals(edu_office_code, school_code, from_date, to_date)
        return MealsResponse(meals=meals)
    except Exception as e:
        raise HTTPException(502, "Failed to fetch meals from NEIS")
