import pytest
import respx
import httpx
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture
def neis_school_row():
    return {
        "SCHUL_NM": "테스트초등학교",
        "SD_SCHUL_CODE": "7010057",
        "ATPT_OFCDC_SC_CODE": "B10",
        "ORG_RDNMA": "서울특별시 종로구",
    }

@pytest.fixture
def neis_meal_row():
    return {
        "MLSV_YMD": "20240101",
        "DDISH_NM": "밥<br/>된장국<br/>김치",
        "CAL_INFO": "650 Kcal",
    }
