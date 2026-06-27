from pydantic import BaseModel

class School(BaseModel):
    school_name: str
    school_code: str
    edu_office_code: str
    address: str = ""

class Meal(BaseModel):
    date: str
    menu_items: list[str]
    calories: str = ""

class SchoolSearchResponse(BaseModel):
    schools: list[School]

class MealsResponse(BaseModel):
    meals: list[Meal]
