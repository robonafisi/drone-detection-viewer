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
    datasets: [
      {
        label: "Probability",
        data: [],
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    // Replace with your server URL if not localhost
    const socket = io("https://e82e-98-97-27-170.ngrok-free.app/", {
        transports: ["websocket"],
    })
    // const socket = io("https://f425-98-97-27-170.ngrok-free.app", {
    //     path: "/socket.io/",
    //   });
      

    // Log connection status
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
      socket.emit("start_stream"); // Start the stream after connecting
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    // Log data from the server
    socket.on("data", (newData: { probability: number }) => {
      console.log("Received data:", newData); // Log incoming data to verify

      setData((prevData) => {
        const newLabels = [...prevData.labels, new Date().toLocaleTimeString()];
        const newDataset = [...prevData.datasets[0].data, newData.probability];

        if (newLabels.length > 20) {
          newLabels.shift();
          newDataset.shift();
        }

        return {
          labels: newLabels,
          datasets: [
            {
              ...prevData.datasets[0],
              data: newDataset,
            },
          ],
        };
      });
    });

    // Handle errors
    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ width: "80vw", height: "60vh", margin: "0 auto" }}>
      <h2>Real-Time Probability Graph</h2>
      <Line
        data={data}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Real-Time Probability Graph" },
          },
        }}
      />
    </div>
  );
};

export default RealtimeGraph;
