// Jay BJJ Tracker with PureGym Video Demos + Workout Logging
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

const exerciseDemos = {
  "Back Squats": "https://www.youtube.com/embed/ultWZbUMPL8",
  "RDLs": "https://www.youtube.com/embed/1uDiW5--rAE",
  "Walking Lunges": "https://www.youtube.com/embed/wrwwXE_x-pQ",
  "Kettlebell Swings": "https://www.youtube.com/embed/YSxHifyI9QM",
  "Core Work": "https://www.youtube.com/embed/ASdvN_XEl_c",
  "Pull-Ups": "https://www.youtube.com/embed/eGo4IYlbE5g",
  "Bench Press": "https://www.youtube.com/embed/4Y2ZdHCOXok",
  "Rows": "https://www.youtube.com/embed/FWJR5Ve8bnQ",
  "Overhead Press": "https://www.youtube.com/embed/0JfYxMRsUCQ",
  "Farmer's Carries": "https://www.youtube.com/embed/tAW5z9puX_Q"
};

export default function BJJGymTracker() {
  const [weightEntries, setWeightEntries] = useState([]);
  const [weightInput, setWeightInput] = useState("");
  const [exerciseLogs, setExerciseLogs] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [trainingLog, setTrainingLog] = useState([]);
  const [selectedDemo, setSelectedDemo] = useState(null);

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mt-2">
        <input
          type="number"
          placeholder="kg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border px-2 py-1 rounded w-24 mb-2 sm:mb-0"
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
        {exerciseDemos[exercise] && (
          <button
            onClick={() => setSelectedDemo(exercise)}
            className="text-sm text-blue-600 underline mt-2 sm:mt-0"
          >
            ▶ Demo
          </button>
        )}
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

  const generateExerciseChartData = (exercise) => {
    const logs = (exerciseLogs[exercise] || []).reverse();
    return {
      labels: logs.map((log) => log.date),
      datasets: [
        {
          label: `${exercise} (kg)`,
          data: logs.map((log) => log.weight),
          borderColor: "#3b82f6",
          backgroundColor: "#93c5fd",
        },
      ],
    };
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans px-4 py-8 md:px-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center tracking-tight">Jay BJJ</h1>

        {selectedDemo && (
          <div className="mb-8 bg-gray-100 p-4 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-2">{selectedDemo} Demo</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                className="w-full h-64 md:h-96"
                src={exerciseDemos[selectedDemo]}
                title={selectedDemo}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <button
              onClick={() => setSelectedDemo(null)}
              className="mt-4 text-red-500 underline"
            >
              Close Demo
            </button>
          </div>
        )}

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Training Calendar</h2>
          <Calendar
            onChange={(date) => {
              setSelectedDate(date);
              handleTrainingDay(date);
            }}
            value={selectedDate}
            tileClassName={({ date }) =>
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

        {Object.keys(exerciseLogs).length > 0 && (
          <div className="mt-12 bg-gray-100 p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-6">Exercise Progress</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {Object.keys(exerciseLogs).map((exercise, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl shadow">
                  <h3 className="text-lg font-semibold mb-2">{exercise}</h3>
                  <Line data={generateExerciseChartData(exercise)} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
