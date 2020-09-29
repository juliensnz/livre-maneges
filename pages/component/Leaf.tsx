import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

import {Size, Point} from '../hook';

const Svg = styled.svg`
  overflow: visible;
  margin-left: 120px;
  margin-top: 160px;
  position: absolute;
  top: 0;
  left: 0;
`;

const RotateLeaf = styled.path<{index: number; angle: number; gap: number; timing: number; isVisible: boolean}>`
  @keyframes rotateLeaf${(props) => props.index} {
    from {
      transform: rotate(${(props) => props.angle}deg);
    }
    to {
      transform: rotate(${(props) => props.angle + props.gap}deg);
    }
  }
  animation: ${(props) => props.timing}s ease-in-out 0.5s infinite alternate ${(props) => `rotateLeaf${props.index}`};

  transform: rotate(${(props) => (props.isVisible ? props.angle : 0)}deg);
  transition: transform 2s ease-in-out;
  transform-origin: 500px 35px;
`;

const ScaleLeaf = styled.g<{index: number; scale: number; timing: number; isVisible: boolean}>`
  @keyframes scaleLeaf${(props) => props.index} {
    from {
      transform: scale(${(props) => props.scale / 2});
    }
    to {
      transform: scale(${(props) => props.scale});
    }
  }
  animation: ${(props) => props.timing}s linear 1s infinite alternate scaleLeaf ${(props) => props.index};

  transform: scale(${(props) => (props.isVisible ? props.scale : 0)});
  transition: transform ${Math.floor(Math.random() * 10 + 5)}s ease-in-out;
  transition-delay: ${(props) => Math.floor(Math.random() * props.index + 2)}s;
  transform-origin: 500px 35px;
`;

const TranslateLeaf = styled.g<{point: Point; scale: number; isVisible: boolean}>`
  transform: translate(${(props) => props.point.x - 500}px, ${(props) => props.point.y - 35}px);
`;

type LeafProps = {
  point: Point;
};

const Leaf = ({point}: LeafProps) => {
  const [isVisible, display] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      display(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <TranslateLeaf isVisible={isVisible} point={point} scale={point.scale} key={point.x + point.y + point.index}>
      <ScaleLeaf isVisible={isVisible} index={point.index} scale={point.scale} timing={point.timing}>
        <RotateLeaf
          isVisible={isVisible}
          index={point.index}
          angle={point.angle}
          timing={point.timing}
          gap={point.gap}
          xmlns="http://www.w3.org/2000/svg"
          d="M521.83,32a9.22,9.22,0,0,0-12.71-2.9A662.58,662.58,0,0,1,446.74,63.4c-.9-12.89-6.72-47.82-42.87-58.83-26.39-8-65.55-3-65.55-3s15.12,36.83,31.55,53.24c18.19,18.19,40,20.28,55.79,18.57C400.07,85,375.22,95.08,353.3,103.62c-.71-12.13-5.95-48.39-42.92-59.65-26.39-8-65.56-3-65.56-3S260,77.78,276.38,94.19c17,17,37.07,19.91,52.49,18.85l-.49.19c-15.78,6-29.41,11.26-38.92,15.46s-18.53,8.69-27.26,13.44c-4.71-11.34-21.53-43.67-60-42.23-27.57,1-62.95,18.57-62.95,18.57s26.34,29.87,47.23,40a63.41,63.41,0,0,0,40.77,5.3,364.57,364.57,0,0,0-45.63,38c-7.29-12-27.57-38-63.68-32.58-27.53,4.17-61,25.49-61,25.49s29.77,26.38,51.85,34c19.86,6.82,37.29,3.15,50.44-2.92a407.29,407.29,0,0,0-35.95,49.06C111.92,265.3,85.6,248.58,53,263.26,27,274.92,0,304.34,0,304.34s36.55,16.38,60.36,17.3a69.66,69.66,0,0,0,43.73-13.05c-6.52,12.79-12.15,25.29-17,37.22-14.75,9.1-35.88,27.29-37.87,57.68-1.81,27.86,12,62.63,12,62.63S93.62,437.7,105.85,416c17.22-30.62,7.81-56.69.86-69.3,3.58-8.5,7.6-17.27,12.06-26.2A61.5,61.5,0,0,0,134,354.94c15.21,17.4,51.12,35,51.12,35s8.23-38.26,2.26-64.88c-6.55-29.23-30.17-40.35-45.94-44.57a386.11,386.11,0,0,1,33.21-44.42,64.1,64.1,0,0,0,8.76,45.4C195.62,301.26,228,324.43,228,324.43s13.82-37,12-64.58c-2-30.38-23.53-45.15-38.29-51.75a342.67,342.67,0,0,1,53.15-40.43c-7.75,14.22-15.18,37.08-3.88,62.59,9.48,21.38,38.3,48.8,38.3,48.8s18.28-35.3,20-63.15c2.13-34-21.74-51.94-35.17-59.28q11-5.83,22.75-11.08c8.43-3.71,20.6-8.41,34.71-13.81C321.5,143.14,312,160.2,313.9,183.13c2,23.3,20.25,58.63,20.25,58.63s28.81-27.38,39.56-53.13c13.2-31.63-3.75-56.46-14-67.7,19.31-7.53,40.91-16.22,63.36-26.19-9.3,11.35-17.45,27.62-15.65,49,2,23.3,20.24,58.63,20.24,58.63S456.45,175,467.2,149.22C480.61,117.1,462.9,92,452.69,81a687.82,687.82,0,0,0,66.25-36.27A9.22,9.22,0,0,0,521.83,32Z"
        />
      </ScaleLeaf>
    </TranslateLeaf>
  );
};

type LeafCollectionProps = {
  size: Size;
  leafPoints: Point[];
};

const LeafCollection = ({size, leafPoints}: LeafCollectionProps) => {
  return (
    <Svg width={`${size.width}px`} height={`${size.height}px`}>
      {leafPoints.map((point, index) => (
        <Leaf key={point.index} point={point} />
      ))}
    </Svg>
  );
};

export {LeafCollection};
