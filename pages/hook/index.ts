import {useEffect, useRef, useState} from 'react';

type Size = {width: number; height: number};

const useElementSize = (): [React.Ref<HTMLHeadingElement>, Size, (newSize: Size) => void] => {
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const [subtitleSize, setSubtitleSize] = useState({width: 0, height: 0});

  useEffect(() => {
    const handleResize = () => {
      if (null !== subtitleRef.current) {
        if (subtitleRef.current.offsetHeight !== subtitleSize.height) {
          setSubtitleSize({height: subtitleRef.current.offsetHeight, width: subtitleRef.current.offsetWidth});
        }
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [subtitleRef]);

  return [subtitleRef, subtitleSize, setSubtitleSize];
};

type Point = {x: number; y: number; timing: number; angle: number; gap: number; index: number; scale: number};

const useLeafPoints = (subtitleSize: Size, subtitle: string): [React.Ref<HTMLCanvasElement>, Point[]] => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [leafPoints, setLeafPoints] = useState<Point[]>([]);
  useEffect(() => {
    if (0 !== subtitleSize.width && null !== canvasRef.current) {
      const canvas = canvasRef.current;

      const timer = setTimeout(() => {
        const context = canvas.getContext('2d');
        if (null === context) return;
        context.fillStyle = 'red';
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = '13vw "Playfair Display"';
        context.fillText(subtitle.toUpperCase(), 0, subtitleSize.height * 0.81);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let count = 0;
        const points: Point[] = [];
        context.fillStyle = 'green';
        const t0 = performance.now();
        const horizontalStep = Math.floor(imageData.width / 200);
        const verticalStep = Math.floor(imageData.height / 200);
        for (let x = 0; x < imageData.width; x += horizontalStep === 0 ? 1 : horizontalStep) {
          for (let y = 0; y < imageData.height; y += verticalStep === 0 ? 1 : verticalStep) {
            const alpha = imageData.data[(x + y * canvas.width) * 4 + 3];
            if (alpha === 255) {
              if (count % 50 === 0) {
                points.push({x, y, timing: 0, angle: 0, gap: 0, index: 0, scale: 0});
                // context.fillRect(x, y, 2, 2);
              }
              count++;
            }
          }
        }

        context.fillStyle = 'green';
        const scale = canvas.width / 20000;
        const selectedPoints = [...new Array(20)].map(
          (_, index): Point => {
            const point = points[Math.floor(Math.random() * points.length)];
            // context.fillRect(point.x, point.y, 5, 5);

            return {
              ...point,
              timing: Math.floor(Math.random() * 4) + 4,
              angle: Math.floor(Math.random() * 360),
              gap: ((index % 2) * 2 - 1) * Math.floor(Math.random() * 60),
              scale: scale + Math.random() * scale,
              index,
            };
          }
        );

        const t1 = performance.now();
        console.log(t1 - t0);
        console.log(points.length);
        setLeafPoints(selectedPoints);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [subtitleSize.width, subtitleSize.height, canvasRef, setLeafPoints]);

  return [canvasRef, leafPoints];
};

export {useLeafPoints, useElementSize};
export type {Point, Size};
