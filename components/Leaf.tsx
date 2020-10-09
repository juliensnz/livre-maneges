import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

import {Size} from '../hooks/useElementSize';
import {Point} from '../hooks/useLeafPoints';
import Leafs from './Leafs';

const Container = styled.div`
  width: 1000px;
  height: 283px;
  transform-origin: top left;
  overflow: visible;
  margin-left: 120px;
  margin-top: 160px;
  position: absolute;
  top: 0;
  left: 0;
`;
const Board = styled.div`
  width: 1000px;
  height: 283px;
  transform-origin: top left;
  overflow: visible;
  position: absolute;
  top: 0;
  left: 0;
`;

const bouquet = Leafs;

const RotateLeaf = styled.g<Point & {isVisible: boolean}>`
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

const ScaleLeaf = styled.g<Point & {isVisible: boolean}>`
  transform: scale(${(props) => (props.isVisible ? props.scale : 0)});
  transition: transform ${(props) => props.growthLength}s ease-in-out;
  transition-delay: ${(props) => props.growthLength}s;
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
      <ScaleLeaf isVisible={isVisible} {...point}>
        <RotateLeaf isVisible={isVisible} {...point}>
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
    <Container style={{transform: `translate(0, ${(95 / 1250) * size.width}px)`}}>
      <Board style={{transform: `scale(${size.width / 1000})`}}>
        {leafPoints.map((point, index) => (
          <Leaf key={point.index} point={point} size={size} />
        ))}
      </Board>
    </Container>
  );
};

export {LeafCollection};
