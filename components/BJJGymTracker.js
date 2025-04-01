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
  const [customExercises, setCustomExercises] = useState(() => {
    const saved = localStorage.getItem("customExercises");
    return saved ? JSON.parse(saved) : [];
  });
  const [newExercise, setNewExercise] = useState("");
  const [bjjTechniques] = useState([
    { name: "Guard Pass", video: "https://www.youtube.com/embed/4I9qDW67jrk" },
    { name: "Triangle Choke", video: "https://www.youtube.com/embed/Pwva2Rfd8uo" },
    { name: "Takedown Basics", video: "https://www.youtube.com/embed/Vqd7y8rdBac" }
  ]);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [weightEntries, setWeightEntries] = useState(() => {
    const saved = localStorage.getItem("weightEntries");
    return saved ? JSON.parse(saved) : [];
  });
  const [weightInput, setWeightInput] = useState("");
  const [exerciseLogs, setExerciseLogs] = useState(() => {
    const saved = localStorage.getItem("exerciseLogs");
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [trainingLog, setTrainingLog] = useState(() => {
    const saved = localStorage.getItem("trainingLog");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [goalWeight, setGoalWeight] = useState(88);
  const [restTimer, setRestTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [tags, setTags] = useState(() => {
    const saved = localStorage.getItem("calendarTags");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("weightEntries", JSON.stringify(weightEntries));
    localStorage.setItem("exerciseLogs", JSON.stringify(exerciseLogs));
    localStorage.setItem("trainingLog", JSON.stringify(trainingLog));
    localStorage.setItem("customExercises", JSON.stringify(customExercises));
    localStorage.setItem("calendarTags", JSON.stringify(tags));
  }, [weightEntries, exerciseLogs, trainingLog, customExercises, tags]);

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
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} min-h-screen font-sans px-4 py-8 md:px-12`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Jay BJJ</h1>
          <button onClick={toggleDarkMode} className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white">Toggle Dark Mode</button>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium">🔥 Weekly Streak: {streakCount()} training days</p>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4">Training Calendar</h2>
          <Calendar
            onChange={(date) => {
              setSelectedDate(date);
              handleTrainingDay(date);
            }}
            value={selectedDate}
            tileContent={({ date }) => {
              const formatted = date.toLocaleDateString();
              const tag = tags[formatted];
              return tag ? <span className="block text-xs mt-1 text-blue-600">{tag}</span> : null;
            }}
            tileClassName={({ date }) =>
              trainingLog.includes(date.toLocaleDateString()) ? "bg-blue-100 text-blue-800 font-semibold" : null
            }
          />
          {renderTagControls(selectedDate)}
        </div>

        {/* Additional UI rendering here */}
      </div>
    </div>
  );
}
