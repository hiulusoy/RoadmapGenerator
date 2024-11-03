# RoadmapGenerator

**Version:** 1.1.23  
**Author:** memoryLeak.io  
**License:** COMMERCIAL

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
  - [Backend `.env` File](#backend-env-file)
  - [ML Agents `.env` File](#ml-agents-env-file)
- [Running the Application Locally](#running-the-application-locally)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Docker Setup](#docker-setup)
  - [Building the Docker Image](#building-the-docker-image)
  - [Running the Docker Container](#running-the-docker-container)
  - [Using Docker Compose](#using-docker-compose)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Contact](#contact)

## Overview

**RoadmapGenerator** is a comprehensive application designed to help users create, manage, and visualize personalized learning roadmaps. It features an Angular-based frontend for an interactive user interface and a Node.js backend powered by Express and MongoDB for robust data management. Additionally, it integrates with machine learning agents to enhance functionality and provide intelligent insights.

## Features

- **User Authentication:** Secure user login and registration.
- **Roadmap Management:** Create, update, delete, and view learning roadmaps.
- **Collaborative Features:** Multiple users can collaborate on the same roadmap.
- **Responsive Design:** Optimized for various screen sizes and devices.
- **Real-time Updates:** Instant updates using WebSockets (if implemented).
- **Analytics:** Visualize progress and milestones with charts and graphs.
- **Machine Learning Integration:** Utilize ML agents for advanced features and insights.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js:** Version 18 or higher. [Download Node.js](https://nodejs.org/)
- **npm:** Comes bundled with Node.js.
- **Angular CLI:** Required for running the frontend. Install globally using:
  
  ```bash
  npm install -g @angular/cli

