import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import io from 'socket.io-client';

// Register the necessary Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

// Define the structure of your chart data
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
    labels: [], // Time labels for x-axis
    datasets: [
      {
        label: 'Probability',
        data: [], // Initial empty data for the graph
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  });

  // Establish WebSocket connection to stream data
  useEffect(() => {
    const socket = io('http://your-data-source-url'); // Replace with your data source URL

    socket.on('data', (newData: { probability: number }) => {
      setData((prevData) => {
        const newLabels = [...prevData.labels, new Date().toLocaleTimeString()]; // Add current time as label
        const newDataset = [...prevData.datasets[0].data, newData.probability]; // Append new probability value

        // Limit the number of data points on the graph (e.g., show only the last 20 points)
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

    // Cleanup when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ width: '80vw', height: '60vh', margin: '0 auto' }}>
      <h2>Real-Time Probability Graph</h2>
      <Line
        data={data}
        options={{
          maintainAspectRatio: false, // Allow the graph to fill the container
          responsive: true, // Ensure responsiveness
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Real-Time Probability Graph',
            },
          },
        }}
      />
    </div>
  );
};

export default RealtimeGraph;

