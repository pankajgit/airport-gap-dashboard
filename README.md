# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Setup

npm create vite@latest airport-gap-dashboard -- --template react-ts

cd airport-gap-dashboard

npm install

npm install react-router@7 axios
npm install tailwindcss @tailwindcss/vite

npm run dev

## App

                 ┌─────────────────────┐
                 │      React App      │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │    React Router     │
                 └──────────┬──────────┘
                            │
             ┌──────────────┴──────────────┐
             │                             │
             ▼                             ▼
        Public Routes                Protected Routes
             │                             │
       ┌─────▼─────┐               ┌──────▼──────┐
       │   Login   │               │ MainLayout  │
       └───────────┘               └──────┬──────┘
                                          │
                              ┌───────────┼───────────┐
                              │           │           │
                              ▼           ▼           ▼
                          Dashboard    Airports   Favorites
------------------------------------------------------------------------------------------
Page
 │
 ▼
Custom Hook
 │
 ▼
Service
 │
 ▼
Axios Client
 │
 ▼
Airport Gap API

## Example 
AirportsPage
     ↓
useAirports()
     ↓
airportService.getAirports()
     ↓
axiosClient.get("/airports")
     ↓
https://airportgap.com/api/airports

------------------------------------------------------------------------------------------
┌─────────────────────────────────────────────────────────────┐
│ Airport Gap                                  Welcome, User  │
├───────────────┬─────────────────────────────────────────────┤
│               │                                             │
│ ✈ Airport Gap │ Dashboard                                   │
│               │ Welcome to your Airport Gap dashboard.      │
│ 📊 Dashboard  │                                             │
│ ✈️ Airports   │ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────┐   │
│ ⭐ Favorites  │ │Airports│ │Favorite│ │Distance│ │Report│   │
│ 📈 Reports    │ │   0    │ │   0    │ │   0    │ │  0   │   │
│               │ └────────┘ └────────┘ └────────┘ └──────┘   │
│               │                                             │
│ 🚪 Logout     │ Getting Started                             │
│               │                                             │
├───────────────┴─────────────────────────────────────────────┤
│ © 2026 Airport Gap Dashboard       Frontend Learning Project│
└─────────────────────────────────────────────────────────────┘

## Authentication architecture

AuthContext
     ↓
authReducer
     ↓
useAuth()
     ↓
authService
     ↓
Axios
     ↓
POST /tokens

## Authentication

LoginPage
    │
    ▼
useAuth()
    │
    ▼
AuthContext
    │
    ▼
authService
    │
    ▼
Axios Client
    │
    ▼
POST /tokens
    │
    ▼
Airport Gap API


## architecture - Airport Page

AirportsPage.tsx
Displays the table and pagination controls
     ↓
useAirports.ts
Manages page, loading, error and airport data
     ↓
airportService.ts
Requests the selected API page
     ↓
Airport Gap API
Returns the airports and pagination links

