'use client'

import { useEffect, useState } from "react";

const STR_OK = "ok";
const STR_BAD = "bad";
const INTERVAL_REDRAW_MILLSECONDS = 1000;
const INTERVAL_FADE_MILLSECONDS = 700;
const PANEL_COUNT = 100;
const PANELS_TO_REDRAW_AT_ONCE = 10;
const PANELS_PER_ROW = 10;
const OPAQUE_STEP = 0.1;
const BACKEND_URL_DEFAULT = 'http://localhost:8080';

// Read the backend URL from the environment variable
const backendUrl = process.env.BACKEND_URL ? process.env.BACKEND_URL : BACKEND_URL_DEFAULT;

async function getResponse() {
  try {
    return await fetch(backendUrl);
  } catch {
    return null;
  }
}

export default function Home() {
  const [cells, setCells] = useState(Array.from({ length: PANEL_COUNT }, (_, index) => (index + 1).toString()));
  const [opacity, setOpacity] = useState(Array(PANEL_COUNT).fill(1));

  useEffect(() => {
    const updateCell = () => {
      (async () => {
        const response = await getResponse();

        setCells((prevCells) => {
          const newCells = [...prevCells];

          const randomIndex = Math.floor(Math.random() * PANEL_COUNT);
          newCells[randomIndex] = (response !== null && response.ok) ? STR_OK : STR_BAD;

          setOpacity((prevOpacity) => {
            const newOpacity = [...prevOpacity];
            newOpacity[randomIndex] = 1;
            return newOpacity;
          });
          
          return newCells;
        });

      })();
    };

    const intervals: NodeJS.Timeout[] = [];
    for (let i = 0; i < PANELS_TO_REDRAW_AT_ONCE; i++) {
      intervals.push(setInterval(updateCell, INTERVAL_REDRAW_MILLSECONDS));
    }

    return () => {
      intervals.forEach(clearInterval);
    };
  }, []);

  useEffect(() => {
    const interval2 = setInterval(() => {
      (async () => {
        setOpacity((prevOpacity) => {
          const newOpacity = [...prevOpacity];
          newOpacity.forEach((op, index) => {
            const cellValue = cells[index];
            const isOk = cellValue === STR_OK;
            const isBad = cellValue === STR_BAD;
            newOpacity[index] = (isOk || isBad) ? Math.max(op - OPAQUE_STEP, 0) : op;
          });
          return newOpacity;
        });
      })();
    }, INTERVAL_FADE_MILLSECONDS);
    return () => clearInterval(interval2);
  }, [cells]);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${PANELS_PER_ROW}, 1fr)`, gap: '10px' }}>
        {cells.map((cell, index) => (
          <div
            key={index}
            style={{
              padding: '20px',
              backgroundColor: cell === STR_OK ? 'green' : cell === STR_BAD ? 'red' : '#f6f6f6',
              opacity: opacity[index],
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {cell}
          </div>
        ))}
      </div>
    </div>
  );
}