# ENTNT Ship Maintenance Dashboard

This is a single-page application (SPA) built with React.js that simulates a Ship Maintenance Dashboard. It allows different types of users (Admin, Inspector, Engineer) to manage ships, components, and maintenance jobs, with data persistence handled via `localStorage`.

## Features

### Core Functionality
* **User Authentication (Simulated):**
    * Hardcoded user accounts with predefined roles (`admin`, `inspector`, `engineer`) for demonstration purposes.
    * Login/Logout functionality.
    * User sessions persist across browser sessions using `localStorage`.
* **Role-Based Access Control (RBAC):**
    * **Admin:** Full access to manage Ships, Components, and Jobs, including adding/editing/deleting all entities. Can also manage user roles (if implemented).
    * **Inspector:** View all ships, components, and jobs. Can add/edit/delete jobs. Cannot modify ship or component details.
    * **Engineer:** View all ships, components, and jobs. Can only update the `status` of existing jobs to 'Completed'. Cannot add/edit/delete ships, components, or jobs.
* **Dashboard Overview:**
    * Key Performance Indicators (KPIs) for maintenance operations (e.g., total ships, total jobs, completed jobs, overdue jobs).
    * Lists of recent jobs and critical alerts (e.g., jobs approaching due dates or overdue).
* **Ship Management:**
    * List all registered ships.
    * View detailed information for each ship.
    * Ability to add new ships.
    * Ability to edit existing ship details.
    * Ability to delete ships.
* **Component Management:**
    * List components associated with each ship.
    * View detailed information for each component.
    * Ability to add new components to a ship.
    * Ability to edit existing component details.
    * Ability to delete components.
* **Job Management:**
    * List all maintenance jobs.
    * View detailed information for each job.
    * Ability to add new jobs (associated with a specific ship and component).
    * Ability to edit existing job details (e.g., description, due date, assigned to, priority).
    * Ability to update job status (e.g., 'Pending', 'In Progress', 'Completed', 'Overdue').
    * Ability to delete jobs.
* **Data Persistence:** All application data (users, ships, components, jobs, sessions) is stored and retrieved from the browser's `localStorage` to simulate backend persistence without external databases.
* **Client-Side Routing:** Utilizes `react-router-dom` for seamless navigation between different sections of the dashboard without full page reloads.
* **Form Management:** Handles form submissions, input validation, and displays error messages for user feedback.

### Enhanced Features (Bonus & Recommended)

* **Dark Mode Toggle:** Users can switch between light and dark themes for improved readability and user preference.
* **Notifications System:** Displays transient success, error, and info messages for user actions (e.g., "Ship added successfully!").
* **Job Calendar View:** A dedicated page to visualize jobs on a calendar, showing which days have scheduled maintenance.
* **Full Mobile Responsiveness:** The UI adapts gracefully across various screen sizes, from mobile phones and tablets to desktop monitors, ensuring a consistent user experience.
* **Export Reports (Planned/Conceptual):** While not fully implemented with external libraries, the design considers a future feature to export data (e.g., jobs list) to a file format like CSV or PDF.

## Technology Stack

* **React.js:** Frontend library for building the user interface.
* **React Router DOM:** For client-side routing.
* **`localStorage`:** For simulated data persistence.
* **CSS3:** For styling and responsive design.
* **ESLint:** For code quality and consistency (as observed in the provided screenshot for linting issues).

## Getting Started

### Prerequisites

* Node.js (LTS version recommended)
* npm or Yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd entnt-ship-maintenance-dashboard
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will typically open in your browser at `http://localhost:5173` (or another port if 5173 is in use).

### Hardcoded User Credentials (for Testing)

The application uses hardcoded user data stored in your browser's `localStorage` for simulated authentication. You can use the following credentials to test different roles:

| Role      | Email               | Password   |
| :-------- | :------------------ | :--------- |
| **Admin** | `admin@entnt.in`    | `admin123` |
| **Inspector** | `inspector@entnt.in`| `inspec123`|
| **Engineer** | `engineer@entnt.in` | `eng123`   |

**Note:** If you clear your browser's `localStorage` for the application, the initial user data will be re-populated upon the next load (handled by `localStorageUtils.js`).

## Project Structure
.
├── public/                 # Static assets
├── src/
│   ├── api/                # Simulated API calls (interacting with localStorage)
│   ├── components/         # Reusable UI components (buttons, forms, cards, Layout)
│   │   ├── Layout/         # Main application layout including sidebar
│   │   └── ...
│   ├── contexts/           # React Contexts for global state (Auth, Theme, Notification)
│   ├── pages/              # Top-level components for different routes (Dashboard, Ships, Jobs, Login, etc.)
│   ├── styles/             # Global CSS styles and variables (main.css)
│   ├── utils/              # Utility functions (e.g., localStorageUtils.js, dateUtils.js)
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Entry point for React application
│   └── vite-env.d.ts
├── .eslintrc.cjs           # ESLint configuration
├── vite.config.js          # Vite build configuration
├── package.json
├── README.md               # This file
└── ...


## How Data Persistence Works

All application data (users, ships, components, jobs) is managed via `localStorage`.
* The `localStorageUtils.js` file handles the initialization of default data if no data exists in `localStorage` yet.
* CRUD operations (Create, Read, Update, Delete) throughout the application directly update and retrieve data from `localStorage`.
* User sessions (logged-in status, current user) are also stored in `localStorage` to maintain authentication across browser sessions.

## Future Enhancements

* Integration with a real backend API and database for scalable data management.
* More sophisticated reporting and analytics.
* User management UI for Admin to add/edit users within the app.
* Advanced filtering, sorting, and pagination for lists.
* Enhanced notification types and controls.
* Integration of a robust charting library for dashboard visualizations.

---This project serves as a foundational example of a ship maintenance dashboard, demonstrating key concepts in React development, state management, and user interface design. It can be extended and adapted for more complex use cases or integrated with real backend services in the future.