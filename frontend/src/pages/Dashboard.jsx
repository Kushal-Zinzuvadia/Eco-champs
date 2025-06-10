import React from 'react'

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to EcoChamps 🌱</h1>
      <p>Your current eco-score: <span className="font-semibold">120</span></p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-xl shadow-md bg-white">
          <h2 className="text-xl font-semibold mb-2">Recent Logs</h2>
          <p>You have recycled 3 items this week. Great job! ♻️</p>
        </div>
        <div className="p-4 rounded-xl shadow-md bg-white">
          <h2 className="text-xl font-semibold mb-2">Active Challenges</h2>
          <p>2 active challenges: "Plastic-Free Week", "Compost Challenge"</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard
