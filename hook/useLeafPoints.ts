import {useEffect, useRef, useState} from 'react';
import {Size} from './useElementSize';

type Point = {x: number; y: number; timing: number; angle: number; gap: number; index: number; scale: number};

const addText = (context: CanvasRenderingContext2D, text: string, size: Size) => {
  context.fillStyle = 'red';
  context.clearRect(0, 0, size.width, size.height);
  context.font = '13vw "Playfair Display"';
  context.fillText(text.toUpperCase(), 0, size.height * 0.81);
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
const LEAF_COUNT = 20;

const createPoint = (coordinate: Coordinate, scale: number, bouquetIndex: number, leafIndex: number): Point => ({
  ...coordinate,
  timing: Math.floor(Math.random() * TIMING_RANDOMESS) + TIMING_MINIMUM,
  angle: Math.floor(Math.random() * POSSIBLE_ANGLE),
  gap: ((bouquetIndex % 2) * 2 - 1) * Math.floor(Math.random() * GAP_ANGLE),
  scale: scale + Math.random() * scale,
  index: bouquetIndex * FLOWER_BY_BOUQUET + leafIndex + 1,
});

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
    const newPoints = [...new Array(FLOWER_BY_BOUQUET)].map((_, leafIndex) =>
      createPoint(coordinate, scale, bouquetIndex, leafIndex)
    );

    return [...result, ...newPoints];
  }, []);
};

const FLOWER_BY_BOUQUET = 4;
const useLeafPoints = (subtitleSize: Size, subtitle: string): [React.Ref<HTMLCanvasElement>, Point[]] => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [leafPoints, setLeafPoints] = useState<Point[]>([]);

  useEffect(() => {
    if (0 !== subtitleSize.width && null !== canvasRef.current) {
      const generatePoints = async () => {
        if (null === canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (null === context) return;

        addText(context, subtitle, subtitleSize);

        await wait(500);

        addText(context, subtitle, subtitleSize);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const coordinates = getCoordinatesInText(imageData);

        const scale = canvas.width / 3000;
        const points = createBouquets(coordinates, scale);

        setLeafPoints(points);
      };
      generatePoints();
    }
  }, [subtitleSize.width, subtitleSize.height, canvasRef, setLeafPoints]);

  return [canvasRef, leafPoints];
};

export {useLeafPoints};
export type {Point};
