# AquaWatch – Smart Aquaculture Management System

AquaWatch is a web-based Smart Aquaculture Management System developed to help fish farmers monitor and manage aquaculture ponds efficiently. It provides a centralized platform for monitoring pond conditions, water quality, feeding activities, alerts, environmental conditions, analytics, and reports.

## Features

- Smart aquaculture dashboard
- Pond management
- Water quality monitoring
- Temperature monitoring
- Dissolved Oxygen monitoring
- pH monitoring
- Ammonia monitoring
- Active alerts and alert management
- Feeding logs and analysis
- Water quality score
- Temperature, pH, and oxygen trends
- Weather information
- Analytics and reports
- Automatic data refresh
- Modern responsive user interface

## Technology Stack

### Frontend
- React.js
- JavaScript
- React Router
- React Icons
- Recharts
- Framer Motion
- HTML5
- CSS3

### Backend
- Python
- FastAPI
- SQLAlchemy
- REST API

### Database
- SQLite

## Project Structure

```text
AquaWatch/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── requirements.txt
│   └── init.sql
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md

Installation and Setup

Prerequisites

Make sure the following are installed:

Python 3.x

Node.js

npm

Git

VS Code


Step 1: Clone the Repository

git clone https://github.com/Tejaswinikandulapati/Aquawatch.git
cd Aquawatch

Step 2: Backend Setup

Open the terminal and run:

cd backend

Install Python dependencies:

pip install -r requirements.txt

Install PyMySQL if required:

python -m pip install PyMySQL

Start the FastAPI backend:

uvicorn main:app --reload

Backend URL:

http://127.0.0.1:8000

FastAPI documentation:

http://127.0.0.1:8000/docs

Step 3: Frontend Setup

Open another terminal and go to the frontend folder:

cd frontend

Install frontend dependencies:

npm install

Start the React application:

npm start

Frontend URL:

http://localhost:3000

Step 4: Run the Application

Keep both terminals running:

Backend  → http://127.0.0.1:8000
Frontend → http://localhost:3000

Open the frontend URL in your browser to use AquaWatch.

API Endpoints

The frontend communicates with the FastAPI backend using REST APIs.

/api/ponds
/api/readings
/api/alerts
/api/feeding-logs
/api/dashboard-summary
/api/simulate/{pond_id}
/api/alerts/{alert_id}/resolve

Dashboard

The dashboard displays:

Total Ponds

Active Alerts

Average Temperature

Dissolved Oxygen

pH Level

Water Quality Score

Temperature Trend

pH Trend

Dissolved Oxygen Trend

Weekly Feeding Analysis

Pond Overview

Weather Information

Environmental Summary


Water Quality Monitoring

AquaWatch monitors important water-quality parameters such as:

Temperature

pH

Dissolved Oxygen

Ammonia


This helps users understand pond conditions and identify potential problems.

Alert Management

The system displays active alerts when important pond or water-quality conditions require attention. Users can view and resolve alerts through the application.

Feeding Management

The feeding module allows users to view feeding records and analyze feeding activities.

Analytics

The system provides charts and trends to help users understand aquaculture data and make better management decisions.

Objective

The main objective of AquaWatch is to provide a simple, centralized, and user-friendly platform for managing aquaculture operations. It reduces manual monitoring and helps fish farmers make better decisions using digital data.

Benefits

Easy pond monitoring

Centralized aquaculture information

Better water-quality management

Quick identification of problems

Easy feeding management

Visual data analysis

Reduced manual work

Better decision making


Future Enhancements

IoT sensor integration

Real-time sensor monitoring

Mobile application

AI-based fish health prediction

Cloud deployment

Advanced analytics

Email and SMS notifications

Automated feeding system


Project Information

Project Name: AquaWatch – Smart Aquaculture Management System

Project Type: Web-Based Application

Frontend: React.js

Backend: FastAPI

Database: SQLite

Programming Languages: Python and JavaScript

Conclusion

AquaWatch provides a modern and user-friendly solution for smart aquaculture management. It combines pond monitoring, water-quality analysis, feeding management, alerts, analytics, and reporting into one centralized platform, helping aquaculture farmers monitor their operations efficiently and make better decisions.
