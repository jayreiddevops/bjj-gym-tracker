
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
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">BJJ Strength & Conditioning Tracker</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-2">Tuesday - Lower Body</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Back Squats - 4x5</li>
            <li>RDLs - 3x8-10</li>
            <li>Walking Lunges - 2x20 steps</li>
            <li>Kettlebell Swings - 3x15</li>
            <li>Woodchoppers/Leg Raises - 3x10-12</li>
            <li>Planks - 3x45 sec</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Friday - Upper Body</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Pull-Ups or Lat Pulldown - 4x8-10</li>
            <li>Bench Press - 3x6-8</li>
            <li>Rows - 3x10</li>
            <li>Overhead Press - 3x8</li>
            <li>Farmer's Carries - 3x30-40m</li>
            <li>AMRAP Finisher: Snatches, Jumps, Burpees, Swings</li>
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Weight Tracker</h2>
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="number"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            className="border px-2 py-1 rounded w-24"
            placeholder="kg"
          />
          <button
            onClick={handleAddWeight}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Add
          </button>
        </div>
        <ul className="space-y-1">
          {weightEntries.map((entry, idx) => (
            <li key={idx} className="text-sm">
              {entry.date}: {entry.weight} kg
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
