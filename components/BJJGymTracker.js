import { useState } from "react";

export default function BJJGymTracker() {
  const [weightEntries, setWeightEntries] = useState([]);
  const [weightInput, setWeightInput] = useState("");

  const handleAddWeight = () => {
    if (!weightInput) return;
    const entry = {
      date: new Date().toLocaleDateString(),
      weight: parseFloat(weightInput),
    };
    setWeightEntries([entry, ...weightEntries]);
    setWeightInput("");
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans px-4 py-8 md:px-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center tracking-tight">BJJ Strength & Conditioning</h1>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Tuesday - Lower Body</h2>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Back Squats - 4x5</li>
              <li>RDLs - 3x8-10</li>
              <li>Walking Lunges - 2x20 steps</li>
              <li>Kettlebell Swings - 3x15</li>
              <li>Woodchoppers/Leg Raises - 3x10-12</li>
              <li>Planks - 3x45 sec</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Friday - Upper Body</h2>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Pull-Ups or Lat Pulldown - 4x8-10</li>
              <li>Bench Press - 3x6-8</li>
              <li>Rows - 3x10</li>
              <li>Overhead Press - 3x8</li>
              <li>Farmer's Carries - 3x30-40m</li>
              <li>AMRAP Finisher: Snatches, Jumps, Burpees, Swings</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 bg-gray-100 p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">Weight Tracker</h2>
          <div className="flex items-center space-x-4 mb-6">
            <input
              type="number"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="border-2 border-gray-300 px-4 py-2 rounded-lg w-28 focus:outline-none focus:border-blue-500"
              placeholder="kg"
            />
            <button
              onClick={handleAddWeight}
              className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Add
            </button>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            {weightEntries.map((entry, idx) => (
              <li key={idx} className="font-medium">
                {entry.date}: {entry.weight} kg
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
