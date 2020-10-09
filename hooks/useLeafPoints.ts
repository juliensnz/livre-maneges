import {useEffect, useRef, useState} from 'react';
import {Size} from './useElementSize';

type Point = {
  x: number;
  y: number;
  growthLength: number;
  growthDelay: number;
  timing: number;
  angle: number;
  gap: number;
  index: number;
  scale: number;
};

const addText = (context: CanvasRenderingContext2D, text: string) => {
  context.fillStyle = 'red';
  context.clearRect(0, 0, 1000, 300);
  context.font = '213px "Playfair Display"';
  context.fillText(text.toUpperCase(), -5, 155);
};

const wait = async (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

const POSSIBLE_ANGLE = 0;
const GAP_ANGLE = 30;
const TIMING_MINIMUM = 4;
const TIMING_RANDOMESS = 4;
const GROWTH_LENGTH = 8;
const GROWTH_DELAY = 2;

const LEAF_COUNT = 30;

const FLOWER_BY_BOUQUET = 4;

const createPoint = (coordinate: Coordinate, scale: number, bouquetIndex: number, leafIndex: number): Point => {
  const index = bouquetIndex * FLOWER_BY_BOUQUET + leafIndex + 1;
  return {
    ...coordinate,
    timing: Math.floor(Math.random() * TIMING_RANDOMESS) + TIMING_MINIMUM,
    growthLength: Math.floor(Math.random() * GROWTH_LENGTH + 4),
    growthDelay: Math.floor(Math.random() * index + GROWTH_DELAY),
    angle: Math.floor(Math.random() * POSSIBLE_ANGLE),
    gap: ((bouquetIndex % 2) * 2 - 1) * Math.floor(Math.random() * GAP_ANGLE),
    scale: scale + Math.random() * scale,
    index,
  };
};

const NUMBER_OF_COLORS = 4;
type Coordinate = {x: number; y: number};
const getCoordinatesInText = (imageData: ImageData): Coordinate[] => {
  const horizontalStep = Math.floor(imageData.width / 200);
  const verticalStep = Math.floor(imageData.height / 200);
  let count = 0;
  const points = [];
  for (let x = 0; x < imageData.width; x += horizontalStep === 0 ? 1 : horizontalStep) {
    for (let y = 0; y < imageData.height; y += verticalStep === 0 ? 1 : verticalStep) {
      const alpha = imageData.data[(x + y * imageData.width) * NUMBER_OF_COLORS + 3];
      if (alpha === 255) {
        if (count % 25 === 0) {
          points.push({x, y});
        }
        count++;
      }
    }
  }

  return points;
};

const createBouquets = (coordinates: Coordinate[], scale: number) => {
  return [...new Array(LEAF_COUNT)].reduce((result: Point[], _, bouquetIndex): Point[] => {
    const coordinate = coordinates[Math.floor(Math.random() * coordinates.length)];
    const newPoints = [...new Array(Math.floor(Math.random() * (FLOWER_BY_BOUQUET - 1)) + 2)].map((_, leafIndex) =>
      createPoint(coordinate, scale, bouquetIndex, leafIndex)
    );

    return [...result, ...newPoints];
  }, []);
};

const useLeafPoints = (subtitle: string): [React.Ref<HTMLCanvasElement>, Point[]] => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [leafPoints, setLeafPoints] = useState<Point[]>([]);

  useEffect(() => {
    if (null !== canvasRef.current) {
      const generatePoints = async () => {
        if (null === canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (null === context) return;

        addText(context, subtitle);

        await wait(500);

        addText(context, subtitle);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const coordinates = getCoordinatesInText(imageData);

        const scale = canvas.width / 3000;
        const points = createBouquets(coordinates, scale);

        setLeafPoints(points);
      };
      generatePoints();
    }
  }, [canvasRef, setLeafPoints]);

  return [canvasRef, leafPoints];
};

export {useLeafPoints};
export type {Point};
