import pytest
import respx
import httpx

@pytest.mark.integration
@respx.mock
def test_get_meals(client, neis_meal_row):
    respx.get("https://open.neis.go.kr/hub/mealServiceDietInfo").mock(
        return_value=httpx.Response(200, json={
            "mealServiceDietInfo": [{}, {"row": [neis_meal_row]}]
        })
    )
    resp = client.get("/api/meals?edu_office_code=B10&school_code=7010057&from_date=20240101&to_date=20240101")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["meals"]) == 1
    assert data["meals"][0]["date"] == "20240101"

@pytest.mark.integration
def test_get_meals_invalid_date(client):
    resp = client.get("/api/meals?edu_office_code=B10&school_code=7010057&from_date=2024-01-01&to_date=2024-01-01")
    assert resp.status_code == 422
