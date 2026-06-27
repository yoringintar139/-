import httpx
from .config import settings
from .schemas import School, Meal

async def search_schools(name: str) -> list[School]:
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{settings.neis_base_url}/schoolInfo",
            params={"KEY": settings.neis_api_key, "Type": "json", "pIndex": 1, "pSize": 10, "SCHUL_NM": name},
            timeout=10.0,
        )
        resp.raise_for_status()
        data = resp.json()
        school_info = data.get("schoolInfo", [])
        rows = school_info[1].get("row", []) if len(school_info) > 1 else []
        return [
            School(
                school_name=r["SCHUL_NM"],
                school_code=r["SD_SCHUL_CODE"],
                edu_office_code=r["ATPT_OFCDC_SC_CODE"],
                address=r.get("ORG_RDNMA", ""),
            )
            for r in rows
        ]

async def get_meals(edu_office_code: str, school_code: str, from_date: str, to_date: str) -> list[Meal]:
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{settings.neis_base_url}/mealServiceDietInfo",
            params={
                "KEY": settings.neis_api_key,
                "Type": "json",
                "ATPT_OFCDC_SC_CODE": edu_office_code,
                "SD_SCHUL_CODE": school_code,
                "MLSV_FROM_YMD": from_date,
                "MLSV_TO_YMD": to_date,
            },
            timeout=10.0,
        )
        resp.raise_for_status()
        data = resp.json()
        meal_info = data.get("mealServiceDietInfo", [])
        rows = meal_info[1].get("row", []) if len(meal_info) > 1 else []
        return [
            Meal(
                date=r["MLSV_YMD"],
                menu_items=[item.strip() for item in r["DDISH_NM"].replace("<br/>", "\n").split("\n") if item.strip()],
                calories=r.get("CAL_INFO", ""),
            )
            for r in rows
        ]
