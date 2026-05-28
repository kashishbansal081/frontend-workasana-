import { useEffect, useState } from "react";
import SideBar from "../../components/Layout/SideBar";
import { Bar, Pie } from "react-chartjs-2";
import {API} from "../../services/Api";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./reports.css";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

export default function ReportsPage() {
  const [lastWeekData, setLastWeekData] = useState([]);
  const [pendingData, setPendingData] = useState({});
  const [closedData, setClosedData] = useState({
    byTeam: [],
    byOwner: [],
    byProject: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 useEffect(() => {
  const token = localStorage.getItem("token");

  Promise.all([
    fetch(API.reports.lastWeek, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json()),

    fetch(API.reports.pending, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json()),

    fetch(API.reports.closedTasks, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json()),
  ])
    .then(([lastWeek, pending, closed]) => {
      setLastWeekData(lastWeek);
      setPendingData(pending);
      setClosedData(closed);
      setLoading(false);
    })
    .catch(() => {
      setError("Failed to load reports");
      setLoading(false);
    });
}, []);

  const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const getLabel = (item) => item.name || item._id;

  const colors = [
    "#4CAF50",
    "#2196F3",
    "#FF9800",
    "#9C27B0",
    "#F44336",
    "#00BCD4",
    "#8BC34A",
  ];

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const lastWeekChart = {
    labels: lastWeekData.map((d) => dayMap[d._id - 1]),
    datasets: [
      {
        label: "Tasks Completed",
        data: lastWeekData.map((d) => d.count),
        backgroundColor: "#4CAF50",
        borderRadius: 8,
      },
    ],
  };

  const pendingChart = {
    labels: ["Pending Tasks", "Total Time"],
    datasets: [
      {
        data: [
          pendingData.pendingTasks || 0,
          pendingData.totalPendingTime || 0,
        ],
        backgroundColor: ["#F44336", "#FFCA28"],
      },
    ],
  };

  const teamChart = {
    labels: closedData.byTeam.map(getLabel),
    datasets: [
      {
        label: "Tasks by Team",
        data: closedData.byTeam.map((d) => d.count),
        backgroundColor: closedData.byTeam.map(
          (_, i) => colors[i % colors.length]
        ),
        borderRadius: 8,
      },
    ],
  };

  const ownerChart = {
    labels: closedData.byOwner.map(getLabel),
    datasets: [
      {
        label: "Tasks by Owner",
        data: closedData.byOwner.map((d) => d.count),
        backgroundColor: closedData.byOwner.map(
          (_, i) => colors[i % colors.length]
        ),
        borderRadius: 8,
      },
    ],
  };

  if (error) return <h2 style={{ padding: "20px" }}>{error}</h2>;

  return (
    <div className="reports-container">
      <SideBar />

      <div className="reports-content">
        <h1 className="title">📊 Workasana Reports</h1>

        {loading && <h2 style={{ padding: "20px" }}>Loading reports...</h2>}
        

        <div className="summary-cards">
          <div className="summary-card">
            <h4>Total Tasks Completed</h4>
            <p>{lastWeekData.reduce((acc, d) => acc + d.count, 0)}</p>
          </div>

          <div className="summary-card">
            <h4>Pending Tasks</h4>
            <p>{pendingData.pendingTasks || 0}</p>
          </div>

          <div className="summary-card">
            <h4>Total Pending Time</h4>
            <p>{pendingData.totalPendingTime || 0}</p>
          </div>
        </div>

        <div className="charts-grid">
          <div className="card">
            <h3>Total Work Done Last Week</h3>
            <div className="chart-box">
              <Bar data={lastWeekChart} options={commonOptions} />
            </div>
          </div>

          <div className="card">
            <h3>Total Pending Work</h3>
            <div className="chart-box">
              <Pie data={pendingChart} options={commonOptions} />
            </div>
          </div>

          <div className="card">
            <h3>Tasks Closed by Team</h3>
            <div className="chart-box">
              <Bar data={teamChart} options={commonOptions} />
            </div>
          </div>

          <div className="card">
            <h3>Tasks Closed by Owner</h3>
            <div className="chart-box">
              <Bar data={ownerChart} options={commonOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}