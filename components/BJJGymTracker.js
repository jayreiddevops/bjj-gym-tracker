import { useState } from "react";
import { Line } from "react-chartjs-2";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function BJJGymTracker() {
  const [weightEntries, setWeightEntries] = useState([]);
  const [weightInput, setWeightInput] = useState("");
  const [exerciseLogs, setExerciseLogs] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [trainingLog, setTrainingLog] = useState([]);

  const handleAddWeight = () => {
    if (!weightInput) return;
    const entry = {
      date: new Date().toLocaleDateString(),
      weight: parseFloat(weightInput),
    };
    setWeightEntries([entry, ...weightEntries]);
    setWeightInput("");
  };

  const handleExerciseLog = (exercise, weight) => {
    const date = new Date().toLocaleDateString();
    setExerciseLogs((prev) => ({
      ...prev,
      [exercise]: [...(prev[exercise] || []), { date, weight: parseFloat(weight) }],
    }));
  };

  const handleTrainingDay = (date) => {
    const formattedDate = date.toLocaleDateString();
    if (!trainingLog.includes(formattedDate)) {
      setTrainingLog([...trainingLog, formattedDate]);
    }
  };

  const renderExerciseLogger = (exercise) => {
    const [input, setInput] = useState("");
    return (
      <div className="flex items-center space-x-2 mt-2">
        <input
          type="number"
          placeholder="kg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border px-2 py-1 rounded w-24"
        />
        <button
          onClick={() => {
            handleExerciseLog(exercise, input);
            setInput("");
          }}
          className="bg-gray-800 text-white px-3 py-1 rounded"
        >
          Log
        </button>
      </div>
    );
  };

  const generateChartData = () => {
    return {
      labels: weightEntries.map((entry) => entry.date).reverse(),
      datasets: [
        {
          label: "Bodyweight (kg)",
          data: weightEntries.map((entry) => entry.weight).reverse(),
          borderColor: "#1f2937",
          backgroundColor: "#1f2937",
        },
      ],
    };
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans px-4 py-8 md:px-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center tracking-tight">Jay BJJ</h1>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Training Calendar</h2>
          <Calendar
            onChange={(date) => {
              setSelectedDate(date);
              handleTrainingDay(date);
            }}
            value={selectedDate}
            tileClassName={({ date, view }) =>
              trainingLog.includes(date.toLocaleDateString()) ? "bg-blue-100 text-blue-800 font-semibold" : null
            }
          />
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Tuesday - Lower Body</h2>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Back Squats - 4x5 {renderExerciseLogger("Back Squats")}</li>
              <li>RDLs - 3x8-10 {renderExerciseLogger("RDLs")}</li>
              <li>Walking Lunges - 2x20 {renderExerciseLogger("Walking Lunges")}</li>
              <li>Kettlebell Swings - 3x15 {renderExerciseLogger("Kettlebell Swings")}</li>
              <li>Woodchoppers/Leg Raises - 3x10-12 {renderExerciseLogger("Core Work")}</li>
              <li>Planks - 3x45 sec</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Friday - Upper Body</h2>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Pull-Ups/Lat Pulldown - 4x8-10 {renderExerciseLogger("Pull-Ups")}</li>
              <li>Bench Press - 3x6-8 {renderExerciseLogger("Bench Press")}</li>
              <li>Rows - 3x10 {renderExerciseLogger("Rows")}</li>
              <li>Overhead Press - 3x8 {renderExerciseLogger("Overhead Press")}</li>
              <li>Farmer's Carries - 3x30-40m {renderExerciseLogger("Farmer's Carries")}</li>
              <li>AMRAP Finisher</li>
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

        {weightEntries.length > 0 && (
          <div className="mt-12 bg-gray-100 p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Progress Chart</h2>
            <Line data={generateChartData()} />
          </div>
        )}
      </div>
    </div>
  );
}
