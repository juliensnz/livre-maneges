import {useEffect, useRef, useState} from 'react';
import {StyleProps} from '../components/Flowered';
import Leafs from '../components/Leafs';
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
  leafIndex: number;
};

const addText = (context: CanvasRenderingContext2D, text: string, size: Size, style: StyleProps) => {
  context.fillStyle = 'red';
  context.clearRect(0, 0, size.width, size.height);
  context.font = `${style.fontSize} "${style.fontFamily}"`;
  context.textBaseline = 'middle';
  context.fillText(text.toUpperCase(), 0, size.height / 1.75);
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

const LEAF_COUNT = 30;

const FLOWER_BY_BOUQUET = 4;

const createPoint = (coordinate: Coordinate, scale: number, bouquetIndex: number, leafIndex: number): Point => {
  const index = bouquetIndex * FLOWER_BY_BOUQUET + leafIndex + 1;
  console.log(Math.floor((Math.random() * index) / 10));
  return {
    ...coordinate,
    timing: Math.floor(Math.random() * TIMING_RANDOMESS) + TIMING_MINIMUM,
    growthLength: Math.floor(Math.random() * GROWTH_LENGTH + 4),
    growthDelay: Math.floor((Math.random() * index) / 10) * 5,
    angle: Math.floor(Math.random() * POSSIBLE_ANGLE),
    gap: ((bouquetIndex % 2) * 2 - 1) * Math.floor(Math.random() * GAP_ANGLE),
    scale: scale + Math.random() * scale,
    leafIndex: Math.floor(Math.random() * Leafs.length),
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

const useLeafPoints = (subtitle: string, size: Size, style: StyleProps): Point[] => {
  const [leafPoints, setLeafPoints] = useState<Point[]>([]);

  useEffect(() => {
    const generatePoints = async () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (null === context) return;
      canvas.width = size.width;
      canvas.height = size.height;

      addText(context, subtitle, size, style);

      await wait(200);

      addText(context, subtitle, size, style);
      const imageData = context.getImageData(0, 0, size.width, size.height);
      const coordinates = getCoordinatesInText(imageData);
      const scale = size.width / 3000;
      const points = createBouquets(coordinates, scale);

      console.log('set leaf points');
      setLeafPoints(points);
    };

    if (size.width === 0) return;
    if (leafPoints.length !== 0) return;

    generatePoints();
  }, [setLeafPoints, size, style]);

  return leafPoints;
};

export {useLeafPoints};
export type {Point};
