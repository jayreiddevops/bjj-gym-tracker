
import { useState, useEffect } from "react";
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

const TAGS = ["BJJ", "Gym", "Mobility", "Rest"];

export default function BJJGymTracker() {
  const [customExercises, setCustomExercises] = useState([]);
  const [newExercise, setNewExercise] = useState("");
  const [bjjTechniques] = useState([
    { name: "Guard Pass", video: "https://www.youtube.com/embed/4I9qDW67jrk" },
    { name: "Triangle Choke", video: "https://www.youtube.com/embed/Pwva2Rfd8uo" },
    { name: "Takedown Basics", video: "https://www.youtube.com/embed/Vqd7y8rdBac" }
  ]);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [weightEntries, setWeightEntries] = useState([]);
  const [weightInput, setWeightInput] = useState("");
  const [exerciseLogs, setExerciseLogs] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [trainingLog, setTrainingLog] = useState([]);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [goalWeight, setGoalWeight] = useState(88);
  const [restTimer, setRestTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [tags, setTags] = useState({});

  useEffect(() => {
    if (timeLeft === 0 && restTimer) {
      clearInterval(restTimer);
      setRestTimer(null);
    }
  }, [timeLeft, restTimer]);

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
    startRestTimer(60);
  };

  const handleTrainingDay = (date) => {
    const formattedDate = date.toLocaleDateString();
    if (!trainingLog.includes(formattedDate)) {
      setTrainingLog([...trainingLog, formattedDate]);
    }
  };

  const handleTagSelect = (date, tag) => {
    const formatted = date.toLocaleDateString();
    setTags(prev => ({
      ...prev,
      [formatted]: tag
    }));
  };

  const startRestTimer = (seconds) => {
    setTimeLeft(seconds);
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    setRestTimer(timer);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleAddCustomExercise = () => {
    if (!newExercise) return;
    const updated = [...customExercises, newExercise];
    setCustomExercises(updated);
    setNewExercise("");
  };

  const streakCount = () => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const datesThisWeek = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d.toLocaleDateString();
    });
    return datesThisWeek.filter(date => trainingLog.includes(date)).length;
  };

  const renderTagControls = (date) => {
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {TAGS.map((tag) => (
          <button
            key={tag}
            className="text-xs px-2 py-1 bg-blue-200 rounded"
            onClick={() => handleTagSelect(date, tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={\`\${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} min-h-screen font-sans px-4 py-8 md:px-12\`}>
      <div className="max-w-5xl mx-auto">

        {timeLeft > 0 && (
          <div className="mb-4 p-4 bg-yellow-100 text-yellow-900 rounded-lg text-center font-semibold">
            ⏱️ Rest Time: {timeLeft} seconds remaining
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">🎯 Weight Goal Tracker</h2>
          <div className="flex items-center space-x-4 mb-4">
            <input
              type="number"
              value={goalWeight}
              onChange={(e) => setGoalWeight(parseFloat(e.target.value))}
              className="border px-4 py-2 rounded w-28"
              placeholder="Goal (kg)"
            />
            <span className="text-sm text-gray-600">Set your target weight</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full"
              style={{ width: \`\${goalWeight && weightEntries[0] ? 100 - ((weightEntries[0].weight - goalWeight) / weightEntries[0].weight) * 100 : 0}%\` }}
            ></div>
          </div>
          {weightEntries[0] && (
            <p className="text-sm mt-2">Current: {weightEntries[0].weight} kg</p>
          )}
        </div>
      </div>
    </div>
  );
}
