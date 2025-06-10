// src/pages/Challenges.jsx
import React, { useEffect, useState } from "react";

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    // TODO: Fetch challenges from API
    const sampleData = [
      { title: "Plastic-Free Week", description: "Avoid all single-use plastic for 7 days." },
      { title: "Compost Challenge", description: "Compost kitchen waste daily for 5 days." }
    ];
    setChallenges(sampleData);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Eco Challenges 🏆</h1>

      <div className="space-y-4">
        {challenges.map((challenge, index) => (
          <div key={index} className="p-4 rounded-xl shadow bg-white">
            <h2 className="text-xl font-semibold">{challenge.title}</h2>
            <p className="text-gray-600">{challenge.description}</p>
            <button className="mt-2 px-4 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
              Join Challenge
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Challenges;