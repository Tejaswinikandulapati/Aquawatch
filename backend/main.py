from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import random

import models
import schemas
from database import engine, get_db, Base, SessionLocal


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="AquaWatch - Smart Aquaculture Management System",
    description="Smart Aquaculture Management System API",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# CREATE DATABASE TABLES
# =========================================================

Base.metadata.create_all(bind=engine)


# =========================================================
# CREATE DEMO DATA
# =========================================================

def create_demo_data():

    db = SessionLocal()

    try:

        # -------------------------------------------------
        # Check whether data already exists
        # -------------------------------------------------

        existing_ponds = db.query(models.Pond).count()

        if existing_ponds > 0:
            print("Demo data already exists.")
            return

        # -------------------------------------------------
        # CREATE PONDS
        # -------------------------------------------------

        pond1 = models.Pond(
            name="Blue Pearl Pond",
            location="Eluru",
            species="Tilapia",
            area_sqm=1200
        )

        pond2 = models.Pond(
            name="Aqua Green Pond",
            location="Vijayawada",
            species="Rohu",
            area_sqm=950
        )

        pond3 = models.Pond(
            name="Fresh Water Pond",
            location="Rajahmundry",
            species="Catfish",
            area_sqm=1500
        )

        db.add_all([
            pond1,
            pond2,
            pond3
        ])

        db.commit()

        db.refresh(pond1)
        db.refresh(pond2)
        db.refresh(pond3)

        # -------------------------------------------------
        # SENSOR READINGS
        # -------------------------------------------------

        readings = [

            models.SensorReading(
                pond_id=pond1.id,
                temperature=27.5,
                ph=7.4,
                dissolved_oxygen=5.8,
                ammonia=0.20
            ),

            models.SensorReading(
                pond_id=pond2.id,
                temperature=28.2,
                ph=7.1,
                dissolved_oxygen=6.1,
                ammonia=0.15
            ),

            models.SensorReading(
                pond_id=pond3.id,
                temperature=26.8,
                ph=7.8,
                dissolved_oxygen=5.2,
                ammonia=0.30
            )
        ]

        db.add_all(readings)

        # -------------------------------------------------
        # FEEDING LOGS
        # -------------------------------------------------

        feeding_logs = [

            models.FeedingLog(
                pond_id=pond1.id,
                feed_type="Floating Pellets",
                quantity_kg=12.5,
                notes="Morning feeding"
            ),

            models.FeedingLog(
                pond_id=pond2.id,
                feed_type="Fish Feed",
                quantity_kg=10.0,
                notes="Morning feeding"
            ),

            models.FeedingLog(
                pond_id=pond3.id,
                feed_type="Floating Pellets",
                quantity_kg=15.0,
                notes="Evening feeding"
            )
        ]

        db.add_all(feeding_logs)

        # -------------------------------------------------
        # DEMO ALERT
        # -------------------------------------------------

        alert = models.Alert(
            pond_id=pond3.id,
            alert_type="Oxygen Alert",
            message="Dissolved oxygen level is slightly low.",
            severity="medium",
            is_resolved=False
        )

        db.add(alert)

        db.commit()

        print("======================================")
        print("Demo data created successfully!")
        print("3 ponds added")
        print("3 sensor readings added")
        print("3 feeding logs added")
        print("1 alert added")
        print("======================================")

    except Exception as e:

        db.rollback()

        print("Error creating demo data:")
        print(e)

    finally:

        db.close()


# Create demo data when backend starts
create_demo_data()


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():

    return {
        "message": "AquaWatch API is running",
        "database": "SQLite",
        "status": "success"
    }


# =========================================================
# PONDS
# =========================================================

@app.get(
    "/api/ponds",
    response_model=List[schemas.PondOut]
)
def get_ponds(
    db: Session = Depends(get_db)
):

    return db.query(models.Pond).all()


@app.post(
    "/api/ponds",
    response_model=schemas.PondOut
)
def create_pond(
    pond: schemas.PondCreate,
    db: Session = Depends(get_db)
):

    new_pond = models.Pond(
        **pond.dict()
    )

    db.add(new_pond)

    db.commit()

    db.refresh(new_pond)

    return new_pond


@app.get(
    "/api/ponds/{pond_id}",
    response_model=schemas.PondOut
)
def get_pond(
    pond_id: int,
    db: Session = Depends(get_db)
):

    pond = (
        db.query(models.Pond)
        .filter(
            models.Pond.id == pond_id
        )
        .first()
    )

    if not pond:

        raise HTTPException(
            status_code=404,
            detail="Pond not found"
        )

    return pond


# =========================================================
# SENSOR READINGS
# =========================================================

@app.get(
    "/api/readings",
    response_model=List[schemas.SensorReadingOut]
)
def get_readings(
    pond_id: int = None,
    db: Session = Depends(get_db)
):

    query = db.query(
        models.SensorReading
    )

    if pond_id:

        query = query.filter(
            models.SensorReading.pond_id == pond_id
        )

    return (
        query
        .order_by(
            models.SensorReading.recorded_at.desc()
        )
        .limit(50)
        .all()
    )


@app.post(
    "/api/readings",
    response_model=schemas.SensorReadingOut
)
def add_reading(
    reading: schemas.SensorReadingBase,
    db: Session = Depends(get_db)
):

    # Check pond exists
    pond = (
        db.query(models.Pond)
        .filter(
            models.Pond.id == reading.pond_id
        )
        .first()
    )

    if not pond:

        raise HTTPException(
            status_code=404,
            detail="Pond not found"
        )

    new_reading = models.SensorReading(
        **reading.dict()
    )

    db.add(new_reading)

    db.commit()

    db.refresh(new_reading)

    # -------------------------------------------------
    # GENERATE ALERTS
    # -------------------------------------------------

    alerts = []

    # pH
    if reading.ph < 6.5 or reading.ph > 8.5:

        alerts.append(
            models.Alert(
                pond_id=reading.pond_id,
                alert_type="pH Alert",
                message=(
                    f"pH reading {reading.ph} "
                    "is outside safe range."
                ),
                severity="high",
                is_resolved=False
            )
        )

    # Dissolved Oxygen
    if reading.dissolved_oxygen < 4.0:

        alerts.append(
            models.Alert(
                pond_id=reading.pond_id,
                alert_type="Oxygen Alert",
                message=(
                    f"Dissolved oxygen is low: "
                    f"{reading.dissolved_oxygen} mg/L"
                ),
                severity="high",
                is_resolved=False
            )
        )

    # Ammonia
    if reading.ammonia > 0.5:

        alerts.append(
            models.Alert(
                pond_id=reading.pond_id,
                alert_type="Ammonia Alert",
                message=(
                    f"Ammonia level is high: "
                    f"{reading.ammonia} mg/L"
                ),
                severity="medium",
                is_resolved=False
            )
        )

    if alerts:

        db.add_all(alerts)

        db.commit()

    return new_reading


# =========================================================
# SIMULATE SENSOR READING
# =========================================================

@app.post(
    "/api/simulate/{pond_id}",
    response_model=schemas.SensorReadingOut
)
def simulate_reading(
    pond_id: int,
    db: Session = Depends(get_db)
):

    # Check pond
    pond = (
        db.query(models.Pond)
        .filter(
            models.Pond.id == pond_id
        )
        .first()
    )

    if not pond:

        raise HTTPException(
            status_code=404,
            detail="Pond not found"
        )

    reading = schemas.SensorReadingBase(

        pond_id=pond_id,

        temperature=round(
            random.uniform(24, 32),
            1
        ),

        ph=round(
            random.uniform(6.5, 8.5),
            2
        ),

        dissolved_oxygen=round(
            random.uniform(4.0, 7.0),
            2
        ),

        ammonia=round(
            random.uniform(0.0, 0.5),
            2
        )
    )

    return add_reading(
        reading,
        db
    )


# =========================================================
# FEEDING LOGS
# =========================================================

@app.get(
    "/api/feeding-logs",
    response_model=List[schemas.FeedingLogOut]
)
def get_feeding_logs(
    pond_id: int = None,
    db: Session = Depends(get_db)
):

    query = db.query(
        models.FeedingLog
    )

    if pond_id:

        query = query.filter(
            models.FeedingLog.pond_id == pond_id
        )

    return (
        query
        .order_by(
            models.FeedingLog.fed_at.desc()
        )
        .limit(50)
        .all()
    )


@app.post(
    "/api/feeding-logs",
    response_model=schemas.FeedingLogOut
)
def add_feeding_log(
    log: schemas.FeedingLogBase,
    db: Session = Depends(get_db)
):

    new_log = models.FeedingLog(
        **log.dict()
    )

    db.add(new_log)

    db.commit()

    db.refresh(new_log)

    return new_log


# =========================================================
# ALERTS
# =========================================================

@app.get(
    "/api/alerts",
    response_model=List[schemas.AlertOut]
)
def get_alerts(
    resolved: bool = None,
    db: Session = Depends(get_db)
):

    query = db.query(
        models.Alert
    )

    if resolved is not None:

        query = query.filter(
            models.Alert.is_resolved == resolved
        )

    return (
        query
        .order_by(
            models.Alert.created_at.desc()
        )
        .all()
    )


@app.put(
    "/api/alerts/{alert_id}/resolve",
    response_model=schemas.AlertOut
)
def resolve_alert(
    alert_id: int,
    db: Session = Depends(get_db)
):

    alert = (
        db.query(models.Alert)
        .filter(
            models.Alert.id == alert_id
        )
        .first()
    )

    if not alert:

        raise HTTPException(
            status_code=404,
            detail="Alert not found"
        )

    alert.is_resolved = True

    db.commit()

    db.refresh(alert)

    return alert


# =========================================================
# DASHBOARD SUMMARY
# =========================================================

@app.get(
    "/api/dashboard-summary"
)
def dashboard_summary(
    db: Session = Depends(get_db)
):

    total_ponds = (
        db.query(
            models.Pond
        ).count()
    )

    active_alerts = (
        db.query(
            models.Alert
        )
        .filter(
            models.Alert.is_resolved == False
        )
        .count()
    )

    avg_temp = (
        db.query(
            func.avg(
                models.SensorReading.temperature
            )
        )
        .scalar()
    )

    avg_oxygen = (
        db.query(
            func.avg(
                models.SensorReading.dissolved_oxygen
            )
        )
        .scalar()
    )

    avg_ph = (
        db.query(
            func.avg(
                models.SensorReading.ph
            )
        )
        .scalar()
    )

    avg_ammonia = (
        db.query(
            func.avg(
                models.SensorReading.ammonia
            )
        )
        .scalar()
    )

    return {

        "total_ponds": total_ponds,

        "active_alerts": active_alerts,

        "avg_temperature": (
            round(avg_temp, 2)
            if avg_temp is not None
            else None
        ),

        "avg_dissolved_oxygen": (
            round(avg_oxygen, 2)
            if avg_oxygen is not None
            else None
        ),

        "avg_ph": (
            round(avg_ph, 2)
            if avg_ph is not None
            else None
        ),

        "avg_ammonia": (
            round(avg_ammonia, 2)
            if avg_ammonia is not None
            else None
        )
    }


# =========================================================
# WATER QUALITY SUMMARY
# =========================================================

@app.get(
    "/api/water-quality"
)
def water_quality(
    db: Session = Depends(get_db)
):

    latest = (
        db.query(
            models.SensorReading
        )
        .order_by(
            models.SensorReading.recorded_at.desc()
        )
        .first()
    )

    if not latest:

        return {
            "score": 0,
            "status": "No Data",
            "temperature": None,
            "ph": None,
            "dissolved_oxygen": None,
            "ammonia": None
        }

    score = 100

    # pH
    if latest.ph < 6.5 or latest.ph > 8.5:
        score -= 30

    # Oxygen
    if latest.dissolved_oxygen < 4:
        score -= 30

    # Ammonia
    if latest.ammonia > 0.5:
        score -= 30

    # Temperature
    if latest.temperature < 24 or latest.temperature > 32:
        score -= 10

    score = max(
        0,
        min(100, score)
    )

    if score >= 80:
        status = "Excellent"
    elif score >= 60:
        status = "Good"
    elif score >= 40:
        status = "Moderate"
    else:
        status = "Poor"

    return {

        "score": score,

        "status": status,

        "temperature": latest.temperature,

        "ph": latest.ph,

        "dissolved_oxygen":
            latest.dissolved_oxygen,

        "ammonia":
            latest.ammonia
    }