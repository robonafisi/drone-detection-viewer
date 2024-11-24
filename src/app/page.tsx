'use client';

import { useState } from 'react';
import Image from "next/image";
import RealtimeGraph from '../app/components/realtimegraph';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState('/DowntownSF.png');

  const handleImageChange = (event: { target: { value: any; }; }) => {
    const value = event.target.value;
    if (value === 'option1') {
      setSelectedImage('/Pier39.png');
    } else if (value === 'option2') {
      setSelectedImage('/DowntownSF.png');
    } else if (value === 'option3') {
      setSelectedImage('/OaklandPort.png');
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl text-white">Drone Detection Viewer</h1>
        </div>
        <div>
          {/* Radio Buttons */}
          <div className="flex gap-4 mb-4">
            <label>
              <input
                type="radio"
                name="image"
                value="option1"
                className="mr-2"
                onChange={handleImageChange}
                checked={selectedImage === '/Pier39.png'}
              />
              Pier 39
            </label>
            <label>
              <input
                type="radio"
                name="image"
                value="option2"
                className="mr-2"
                onChange={handleImageChange}
                checked={selectedImage === '/DowntownSF.png'}
              />
              Downtown San Francisco
            </label>
            <label>
              <input
                type="radio"
                name="image"
                value="option3"
                className="mr-2"
                onChange={handleImageChange}
                checked={selectedImage === '/OaklandPort.png'}
              />
              Port of Oakland
            </label>
          </div>
          {/* Displayed Image */}
          <Image src={selectedImage} alt="Selected View" width={1000} height={1000} />
        </div>
        <div>
          <h1 className="text-center">Real-Time Probability Graph</h1>
          <RealtimeGraph />
        </div>
      </main>
    </div>
  );
}
