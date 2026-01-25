# Welcome to CivicResolve 🤝

**Empowering Communities to Build Better Cities.**

Hi there! Welcome to the repository for **CivicResolve**.

We believe that great neighborhoods start with engaged citizens. Yet, reporting simple issues like a broken streetlight or a pothole can often feel complicated or unresponsive. **CivicResolve** changes that. usage

It's a platform built to bridge the gap between residents and local authorities. We make it incredibly easy for people to report issues (pinpointing them exactly on a map 📍) and just as easy for authorities to track, manage, and resolve them.

---

## 🚀 What's Under the Hood?

We've built this using a robust, modern stack to ensure it's fast, reliable, and secure.

### The Brains (Backend) 🧠
*   **Java 21 & Spring Boot**: For a solid, high-performance foundation.
*   **MySQL**: To keep all our data organized and safe.
*   **Spring Security & JWT**: Because privacy and security matter.
*   **Email Notifications**: To keep everyone in the loop with real-time updates.

### The Face (Frontend) 🎨
*   **React (Vite)**: For a snappy, smooth user experience.
*   **Interactive Maps**: Powered by Leaflet & Google Maps, because a picture (and a location) is worth a thousand words.
*   **Bootstrap**: For a clean, accessible design that looks good on any device.
*   **Google Login**: So users can get started in seconds without remembering another password.

---

## 🛠️ Getting Started

Want to spin this up on your own machine? Awesome! Here is how to get everything running.

### You'll need these first:
*   **Java 21** installed.
*   **Node.js** (for the frontend magic).
*   **MySQL** running on your computer.

### 1. Setting up the Backend ⚙️

1.  **Go to the folder:**
    Open your terminal and head to: `Backend/civicresolve-backend`

2.  **Connect the Database:**
    *   Create a new database in MySQL called `civicresolve`.
    *   Find the `application.properties` file in `src/main/resources`.
    *   Update the username and password to match your local MySQL setup.
    *   *(Tip: We use port `3307` by default. If your MySQL is on `3306`, just tweak that line!)*

3.  **Run it:**
    *   Fire it up with: `./mvnw spring-boot:run`
    *   You should see the Spring logo pop up – that means we're in business!

### 2. Setting up the Frontend 🖥️

1.  **Go to the folder:**
    Head over to: `Frontend/civicresolve-frontend`

2.  **Install the goodies:**
    Run `npm install react-leaflet-cluster --legacy-peer-deps` to grab all the dependencies.

3.  **Keys & Secrets:**
    *   Create a file named `.env` right in this folder.
    *   Add your API keys like this:
        ```env
        VITE_GOOGLE_MAPS_API_KEY=your_key_here
        VITE_GOOGLE_CLIENT_ID=your_client_id_here
        ```
    *   *(If you're just testing, reach out and we can help you with test keys!)*

4.  **Launch it:**
    Run `npm run dev` and open the link it gives you (usually `http://localhost:5173`).

---

## 🎉 You're All Set!

You should now have the full application running locally.
*   **Frontend:** `http://localhost:5173`
*   **Backend:** `http://localhost:8080`

Explore the app, report a test issue, and see how we're trying to make city management smoother for everyone.

**Happy Coding!** ✨
