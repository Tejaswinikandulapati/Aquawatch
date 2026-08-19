from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PondBase(BaseModel):
    name: str
    location: Optional[str] = None
    species: Optional[str] = None
    area_sqm: Optional[float] = None


class PondCreate(PondBase):
    pass


class PondOut(PondBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class SensorReadingBase(BaseModel):
    pond_id: int
    temperature: float
    ph: float
    dissolved_oxygen: float
    ammonia: float


class SensorReadingOut(SensorReadingBase):
    id: int
    recorded_at: datetime

    class Config:
        from_attributes = True


class FeedingLogBase(BaseModel):
    pond_id: int
    feed_type: str
    quantity_kg: float
    notes: Optional[str] = None


class FeedingLogOut(FeedingLogBase):
    id: int
    fed_at: datetime

    class Config:
        from_attributes = True


class AlertBase(BaseModel):
    pond_id: int
    alert_type: str
    message: str
    severity: Optional[str] = "medium"


class AlertOut(AlertBase):
    id: int
    is_resolved: bool
    created_at: datetime

    class Config:
        from_attributes = True
