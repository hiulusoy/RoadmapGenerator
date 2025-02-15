# RoadmapGenerator

![RoadmapGenerator Screenshot](https://github.com/user-attachments/assets/443d39e8-7e99-495b-b65d-611fb0e160f4)

**Version:** 0.0.1
**Author:** hiulusoy

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Running the Application](#running-the-application)
- [Docker Deployment](#docker-deployment)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

**RoadmapGenerator** is an innovative application designed to empower users in creating, managing, and visualizing personalized learning roadmaps. With its intuitive Angular-based frontend, robust Node.js backend (powered by Express and MongoDB), and cutting-edge machine learning integration, RoadmapGenerator offers a comprehensive solution for educational planning and progress tracking.

## Key Features

- Intelligent Roadmap Creation
- User Authentication
- Collaborative Roadmaps
- Responsive Design
- Progress Tracking
- Resource Integration
- Customization
- API Integration

## Technologies Used

- Frontend: Angular 13+, NgRx
- Backend: Node.js, Express.js, TypeScript
- Database: MongoDB with Mongoose ODM
- Authentication: JWT
- Machine Learning: Python with scikit-learn, TensorFlow
- API Documentation: Swagger/OpenAPI
- Testing: Jest, Jasmine, Karma
- Containerization: Docker and Docker Compose

## Prerequisites

- Node.js (v18+)
- npm
- Angular CLI
- MongoDB (v4.4+)
- Python (v3.8+)

## Installation and Setup

```bash
# Clone the repository
git clone https://github.com/hiulusoy/RoadmapGenerator.git
cd RoadmapGenerator

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Set up Python environment for ML agents
cd ../ml_agents
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt

# Create backend .env file
cd ../server
echo "PORT=3000
MONGODB_URI=mongodb://localhost:27017/roadmapgenerator
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development" > .env

# Create ML agents .env file
cd ../ml_agents
echo "OPENAI_API_KEY=your_openai_api_key
MODEL_PATH=/path/to/your/ml/model" > .env

# Build Docker image
docker build -t roadmapgenerator .

# Run Docker container
docker run -p 4200:4200 -p 3000:3000 roadmapgenerator

# Using Docker Compose
docker-compose up


# Run backend
cd server
npm run dev

# Run frontend (in a new terminal)
cd client
ng serve

# Run ML agents (in a new terminal)
cd ml_agents
python app.py

# Access the application at http://localhost:4200


RoadmapGenerator/
├── client/                 # Angular frontend
├── server/                 # Node.js backend
├── ml_agents/              # Python ML scripts
├── docs/                   # Documentation
├── tests/                  # Test suites
├── .gitignore
├── docker-compose.yml
├── Dockerfile
└── README.md
