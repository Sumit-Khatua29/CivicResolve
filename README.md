# Welcome to CivicResolve 🤝

**Empowering Communities to Build Better Cities.**

Hi there! Welcome to the repository for **CivicResolve**.

We believe that great neighborhoods start with engaged citizens. Yet, reporting simple issues like a broken streetlight or a pothole can often feel complicated or unresponsive. **CivicResolve** changes that.

It's a comprehensive platform built to bridge the gap between residents and local authorities. We make it incredibly easy for people to report issues (pinpointing them exactly on a map 📍) and just as easy for authorities to track, assign, and resolve them.

---

## 🌟 Key Features

### 👤 For Citizens
*   **Easy Issue Reporting**: Report issues with titles, descriptions, and categories.
*   **Visual Evidence**: Upload "Before" images to validate reports.
*   **Geolocation**: Pinpoint the exact location of the issue using an interactive map.
*   **Track Progress**: View the status of reported issues in real-time.
*   **Feedback**: Rate the resolution quality after an issue is fixed.
*   **Secure Access**: Login via Email/Password or Google OAuth. Includes "Forgot Password" functionality.

### 🛡️ For Administrators
*   **Dashboard**: A powerful overview of all reported issues.
*   **Issue Management**: Review, approve, or reject reports.
*   **Contractor Assignment**: Assign approved issues to registered contractors based on location (Pincode).
*   **User Management**: Manage citizen and contractor accounts.
*   **Analytics**: Visualize data on reported issues and resolution rates.

### 👷 For Contractors
*   **Job Board**: View issues assigned to their specific area.
*   **Workflow Management**: Update status from "In Progress" to "Resolved".
*   **Proof of Work**: Upload "After" images to demonstrate resolution.
*   **Profile**: Manage professional details and service areas.

---

## 🚀 What's Under the Hood?

We've built this using a robust, modern stack to ensure it's fast, reliable, and secure.

### The Brains (Backend) 🧠
*   **Java 21 & Spring Boot 3**: For a solid, high-performance foundation.
*   **Spring Data JPA (Hibernate)**: For efficient database interactions.
*   **Spring Security & JWT**: To ensure secure, stateless authentication.
*   **Java Mail Sender**: For sending welcome emails, status updates, and password reset links.
*   **MySQL**: To keep all our data organized and safe.

### The Face (Frontend) 🎨
*   **React (Vite)**: For a snappy, smooth user experience.
*   **React Bootstrap**: For a responsive, clean UI.
*   **Framer Motion**: For smooth animations and transitions.
*   **Leaflet & React-Leaflet**: For interactive maps and clustering.
*   **Chart.js**: For visualizing administrative data.
*   **Google OAuth**: For seamless social login.

---

## 🛠️ Getting Started

Want to spin this up on your own machine? Awesome! Here is how to get everything running.

### Prerequisites
*   **Java 21** installed.
*   **Node.js 18+** installed.
*   **MySQL** running on your computer.

### 1. Setting up the Backend ⚙️

1.  **Navigate to the backend folder:**
    ```bash
    cd Backend/civicresolve-backend
    ```

2.  **Configure the Database:**
    *   Create a new database in MySQL called `civicresolve`.
    *   Open `src/main/resources/application.properties`.
    *   Update `spring.datasource.username` and `spring.datasource.password` with your credentials.
    *   *Note: The server runs on port `8080` by default.*

3.  **Run the Application:**
    ```bash
    ./mvnw spring-boot:run
    ```

### 2. Setting up the Frontend 🖥️

1.  **Navigate to the frontend folder:**
    ```bash
    cd Frontend/civicresolve-frontend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # If you encounter peer dependency issues:
    npm install --legacy-peer-deps
    ```

3.  **Environment Variables:**
    *   Create a `.env` file in the root of the frontend folder.
    *   Add your keys:
        ```env
        VITE_GOOGLE_CLIENT_ID=your_google_client_id
        # Add other keys as required
        ```

4.  **Launch the App:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

---

## 🔒 Security & Privacy
*   We use **BCrypt** to hash user passwords.
*   **JWT Tokens** are used for session management.
*   **Role-Based Access Control (RBAC)** ensures users only access what they're supposed to.

---

## 📸 Screenshots

*(Add screenshots of your Dashboard, Login Page, and Issue Map here)*

---

**Happy Coding!** ✨
