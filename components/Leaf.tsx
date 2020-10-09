import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

import {Size} from '../hooks/useElementSize';
import {Point} from '../hooks/useLeafPoints';
import Leafs from './Leafs';

const Board = styled.div<{size: Size}>`
  overflow: visible;
  margin-left: 120px;
  margin-top: 160px;
  width: ${(props) => props.size.width}px;
  height: ${(props) => props.size.height}px;
  position: absolute;
  top: 0;
  left: 0;
`;

const bouquet = Leafs;

const RotateLeaf = styled.g<{index: number; angle: number; gap: number; timing: number; isVisible: boolean}>`
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
  transform-origin: 50px 95px;
`;

const ScaleLeaf = styled.g<{index: number; scale: number; timing: number; isVisible: boolean}>`
  transform: scale(${(props) => (props.isVisible ? props.scale : 0)});
  transition: transform ${Math.floor(Math.random() * 10)}s ease-in-out;
  transition-delay: ${(props) => Math.floor(Math.random() * props.index + 2)}s;
  transform-origin: 50px 95px;
`;

const TranslateLeaf = styled.svg<{point: Point; scale: number}>`
  position: absolute;
  overflow: visible;
  transform: translate(${(props) => props.point.x - 50}px, ${(props) => props.point.y - 95}px);
`;

type LeafProps = {
  point: Point;
  size: Size;
};

const Leaf = ({point, size}: LeafProps) => {
  const [isVisible, display] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      display(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <TranslateLeaf
      width={100}
      height={100}
      viewBox="0 0 100 100"
      point={point}
      scale={point.scale}
      key={point.x + point.y + point.index}
    >
      <ScaleLeaf isVisible={isVisible} index={point.index} scale={point.scale} timing={point.timing}>
        <RotateLeaf isVisible={isVisible} index={point.index} angle={point.angle} timing={point.timing} gap={point.gap}>
          {bouquet[Math.floor(Math.random() * bouquet.length)]}
        </RotateLeaf>
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
    <Board size={size}>
      {leafPoints.map((point, index) => (
        <Leaf key={point.index} point={point} size={size} />
      ))}
    </Board>
  );
};

export {LeafCollection};
