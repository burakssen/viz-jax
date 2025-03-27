import { useEffect, useRef, useState } from "react";
import axios from "axios";

async function fetchData() {
  try {
    const response = await axios.get<{ dim: { x: number; y: number }; data: number[] }>(
      "http://127.0.0.1:5001/step"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<{ dim: { x: number; y: number }; data: number[] } | null>(null);

  useEffect(() => {
    const fetchLoop = async () => {
      const newData = await fetchData();
      if (newData) {
        setData(newData);
      }
    };

    const intervalId = setInterval(fetchLoop, 1000 / 30); // 30 FPS data fetch rate
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!data) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { dim, data: gridData } = data;
    const cellSize = 2;

    canvas.width = dim.x * cellSize;
    canvas.height = dim.y * cellSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < dim.y; y++) {
      for (let x = 0; x < dim.x; x++) {
        const value = gridData[y * dim.x + x];
        const gray = Math.floor(value * 255); // Convert to grayscale
        ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }, [data]);

  return <canvas ref={canvasRef} style={{ border: "solid 1px" }} />;
}

export default App;
