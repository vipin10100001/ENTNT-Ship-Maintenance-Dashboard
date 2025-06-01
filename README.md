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

To provide a clear overview of the project's organization:

.
├── public/

│   ├── favicon.svg         # Application icon

│   └── vite.svg            # Vite default icon (can be removed or replaced)

├── src/

│   ├── api/                # Simulated API functions (interact with localStorage)

│   │   ├── authApi.js

│   │   ├── componentApi.js

│   │   ├── jobApi.js

│   │   └── shipApi.js

│   ├── components/         # Reusable UI components

│   │   ├── Layout/         # Main application layout, sidebar, header

│   │   │   ├── Layout.jsx

│   │   │   └── ...

│   │   ├── common/         # Common small components (buttons, modals, forms)

│   │   │   ├── Button.jsx

│   │   │   ├── Modal.jsx

│   │   │   └── ...         # (Add other common components as needed)

│   │   └── Dashboard/      # Components specific to the dashboard view

│   │       ├── StatCard.jsx

│   │       └── ...         # (Add other dashboard-specific components as needed)

│   ├── contexts/           # React Contexts for global state management

│   │   ├── AuthContext.jsx

│   │   ├── NotificationContext.jsx

│   │   └── ThemeContext.jsx

│   ├── pages/              # Top-level components for different application routes

│   │   ├── DashboardPage.jsx

│   │   ├── ShipPage.jsx

│   │   ├── ShipDetailPage.jsx

│   │   ├── JobsPage.jsx

│   │   ├── JobCalendarPage.jsx

│   │   ├── ComponentForm.jsx # Likely for Add/Edit Ship/Component

│   │   ├── LoginPage.jsx

│   │   └── NotFoundPage.jsx

│   ├── styles/             # Global CSS styles

│   │   └── main.css
│   ├── utils/              # Utility functions and helper modules

│   │   ├── localStorageUtils.js # Handles localStorage interactions and initial data

│   │   ├── roles.js             # Defines user roles and permissions

│   │   └── dateUtils.js         # (If you have date formatting/handling, e.g., for JobCalendar)

│   ├── App.jsx             # Main application component, sets up routing

│   ├── main.jsx            # Entry point for the React application

│   └── vite-env.d.ts       # Vite environment type definitions

├── .eslintrc.cjs           # ESLint configuration file

├── .gitignore              # Files/folders to ignore in Git

├── index.html              # Main HTML file

├── package.json            # Project dependencies and scripts

├── package-lock.json       # Exact dependency versions

├── README.md               # Project documentation (this file)

└── vite.config.js          # Vite build configuration


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
