import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from "chart.js";
import io from "socket.io-client";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    fill: boolean;
    borderColor: string;
    tension: number;
  }[];
}

const RealtimeGraph = () => {
  const [data, setData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  // Color mapping for each ID
  const idColors: { [key: number]: string } = {
    0: "#00FFFF", // Cyan
    1: "#FF00FF", // Magenta
    2: "#FFFF00", // Yellow
  };

  useEffect(() => {
    const socket = io("wss://e82e-98-97-27-170.ngrok-free.app/", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
      socket.emit("start_stream"); // Start the stream after connecting
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("data", (newData: { probability: number, id: number }) => {
      console.log("Received data:", newData);

      setData((prevData) => {
        const newLabels = [...prevData.labels, new Date().toLocaleTimeString()];
        if (newLabels.length > 20) newLabels.shift(); // Keep the last 20 timestamps

        // Check if dataset for this id already exists
        const datasets = [...prevData.datasets];
        const existingDatasetIndex = datasets.findIndex((dataset) => dataset.label === `ID: ${newData.id}`);

        const color = idColors[newData.id] || "#FFFFFF"; // Default to white if id is not 0, 1, or 2

        if (existingDatasetIndex === -1) {
          // If no dataset exists for this ID, create a new dataset
          datasets.push({
            label: `ID: ${newData.id}`,
            data: [newData.probability],
            fill: false,
            borderColor: color,
            tension: 0.1,
          });
        } else {
          // If dataset exists, update the data for that ID
          const updatedData = [...datasets[existingDatasetIndex].data, newData.probability];
          if (updatedData.length > 20) {
            updatedData.shift(); // Keep the last 20 data points
          }

          datasets[existingDatasetIndex] = {
            ...datasets[existingDatasetIndex],
            data: updatedData,
          };
        }

        return {
          labels: newLabels,
          datasets: datasets,
        };
      });
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ width: "80vw", height: "60vh", margin: "0 auto", backgroundColor: "black" }}>
      <h2 style={{ color: "white" }}>Real-Time Data Graph</h2>
      <Line
        data={data}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Real-Time Data by ID" },
          },
          scales: {
            x: {
              ticks: {
                color: "white", // White color for x-axis labels
              },
            },
            y: {
              ticks: {
                color: "white", // White color for y-axis labels
              },
            },
          },
        }}
      />
    </div>
  );
};

export default RealtimeGraph;
