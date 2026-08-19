from sqlalchemy import Column, Integer, String, Float, Boolean, TIMESTAMP, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base


class Pond(Base):
    __tablename__ = "ponds"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    location = Column(String(150))
    species = Column(String(100))
    area_sqm = Column(Float)
    created_at = Column(TIMESTAMP, server_default=func.now())

    readings = relationship("SensorReading", back_populates="pond", cascade="all, delete")
    feeding_logs = relationship("FeedingLog", back_populates="pond", cascade="all, delete")
    alerts = relationship("Alert", back_populates="pond", cascade="all, delete")


class SensorReading(Base):
    __tablename__ = "sensor_readings"
    id = Column(Integer, primary_key=True, index=True)
    pond_id = Column(Integer, ForeignKey("ponds.id"))
    temperature = Column(Float)
    ph = Column(Float)
    dissolved_oxygen = Column(Float)
    ammonia = Column(Float)
    recorded_at = Column(TIMESTAMP, server_default=func.now())

    pond = relationship("Pond", back_populates="readings")


class FeedingLog(Base):
    __tablename__ = "feeding_logs"
    id = Column(Integer, primary_key=True, index=True)
    pond_id = Column(Integer, ForeignKey("ponds.id"))
    feed_type = Column(String(100))
    quantity_kg = Column(Float)
    fed_at = Column(TIMESTAMP, server_default=func.now())
    notes = Column(String(255))

    pond = relationship("Pond", back_populates="feeding_logs")


class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    pond_id = Column(Integer, ForeignKey("ponds.id"))
    alert_type = Column(String(100))
    message = Column(String(255))
    severity = Column(String(20), default="medium")
    is_resolved = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    pond = relationship("Pond", back_populates="alerts")
