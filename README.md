
# 🌍 EcoChamps

EcoChamps is a gamified sustainability platform that encourages eco-friendly habits through challenges, community interaction, and personal progress tracking.

---

## 🚀 Project Goal

To promote sustainable living by helping users:
- Log eco-friendly actions
- Participate in challenges
- Track their environmental impact
- Engage with a like-minded community

---

## 🏗️ Architecture Overview

```
[ React Frontend ]  <-->  [ Node.js + Express API ]  <-->  [ MongoDB Database ]
                                 |
                          [ Optional: Socket.io ]
```

---

## 🔑 Core Features

### 🧍 User Management
- JWT-based signup/login
- User profile with:
  - Eco-score
  - Earned badges
  - Activity log
- OAuth with Google (optional)

### 🗑️ Waste Logging
- Log actions (e.g., recycled, composted, avoided plastic)
- Attach photos and comments
- Eco-point scoring system

### 🧩 Weekly Challenges
- Platform-defined or user-created
- Examples: “Avoid plastic for 3 days”
- Join and track progress
- Submit proof (photos/checklists)

### 🏆 Gamification
- Earn eco-points for every action
- Unlock badges like:
  - “Plastic-Free Hero”
  - “Recycler Pro”
- Global and friend leaderboards

### 🧠 Insights & Analytics
- Personal dashboard:
  - Waste breakdown charts
  - Challenge completion stats
- Environmental impact estimates (e.g., CO2 saved)

### 🗣️ Community & Feed
- Share logged actions publicly
- Like and comment on others’ posts
- Highlight top contributors weekly

---

## 🛠️ Backend API (Express.js)

### 🔐 Auth
- `POST /auth/signup` – Register a new user  
- `POST /auth/login` – Login and receive JWT  

### 🗑️ Waste Logs
- `POST /logs` – Add new log  
- `GET /logs/:userId` – Get all logs by user  
- `DELETE /logs/:id` – Delete a specific log  

### 🧩 Challenges
- `GET /challenges` – View all challenges  
- `POST /challenges/join/:id` – Join a challenge  
- `POST /challenges/:id/complete` – Mark challenge as completed  
- `POST /challenges` – Create challenge (admin/user)  

### 🏆 Leaderboard
- `GET /leaderboard` – Global or filtered leaderboard  

---

## 💻 Frontend (React)

### 📄 Pages
- **Dashboard** – Eco-score, analytics, and charts  
- **Challenge Feed** – Browse current/past challenges  
- **Log Waste** – Submit eco actions with proof  
- **Community Feed** – View and interact with posts  
- **Profile** – View badges, logs, and progress  

### 🧰 Libraries
- React Router
- Axios
- Chart.js / Recharts
- Context API / Redux (if scaling needed)
- TailwindCSS / Material UI

---

## 🔄 Bonus Features (Optional / MVP+)

- Push/email notifications for challenges  
- Real-time leaderboard via **Socket.io**  
- AI photo validation (e.g., recycling item detection)  
- Admin dashboard for managing global challenges  

---

## 🧪 Getting Started (Basic Setup)

```bash
# Clone the repository
git clone https://github.com/your-username/eco-champs.git

# Navigate to backend and install dependencies
cd backend
npm install

# Start backend server
npm start

# Navigate to frontend and install dependencies
cd ../frontend
npm install

# Start frontend app
npm run dev
```

---

## 📄 License

MIT License
