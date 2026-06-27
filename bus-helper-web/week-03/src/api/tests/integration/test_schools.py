import pytest
import respx
import httpx

@pytest.mark.integration
@respx.mock
def test_get_schools(client, neis_school_row):
    respx.get("https://open.neis.go.kr/hub/schoolInfo").mock(
        return_value=httpx.Response(200, json={
            "schoolInfo": [{}, {"row": [neis_school_row]}]
        })
    )
    resp = client.get("/api/schools?q=테스트")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["schools"]) == 1
    assert data["schools"][0]["school_name"] == "테스트초등학교"

@pytest.mark.integration
def test_get_schools_missing_q(client):
    resp = client.get("/api/schools")
    assert resp.status_code == 422

@pytest.mark.integration
@respx.mock
def test_get_schools_neis_error(client):
    respx.get("https://open.neis.go.kr/hub/schoolInfo").mock(
        side_effect=httpx.ConnectError("connection failed")
    )
    resp = client.get("/api/schools?q=테스트")
    assert resp.status_code == 502
