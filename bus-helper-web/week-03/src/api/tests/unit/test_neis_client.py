import pytest
import respx
import httpx
from app.neis_client import search_schools, get_meals

@pytest.mark.unit
@respx.mock
async def test_search_schools_returns_list(neis_school_row):
    respx.get("https://open.neis.go.kr/hub/schoolInfo").mock(
        return_value=httpx.Response(200, json={
            "schoolInfo": [{}, {"row": [neis_school_row]}]
        })
    )
    result = await search_schools("테스트")
    assert len(result) == 1
    assert result[0].school_name == "테스트초등학교"

@pytest.mark.unit
@respx.mock
async def test_get_meals_returns_list(neis_meal_row):
    respx.get("https://open.neis.go.kr/hub/mealServiceDietInfo").mock(
        return_value=httpx.Response(200, json={
            "mealServiceDietInfo": [{}, {"row": [neis_meal_row]}]
        })
    )
    result = await get_meals("B10", "7010057", "20240101", "20240101")
    assert len(result) == 1
    assert result[0].date == "20240101"

@pytest.mark.unit
@respx.mock
async def test_search_schools_empty():
    respx.get("https://open.neis.go.kr/hub/schoolInfo").mock(
        return_value=httpx.Response(200, json={"RESULT": {"CODE": "INFO-200", "MESSAGE": "데이터없음"}})
    )
    result = await search_schools("존재하지않는학교xyz")
    assert result == []
