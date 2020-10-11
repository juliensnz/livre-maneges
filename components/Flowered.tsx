import React, {ReactNode, useRef} from 'react';
import styled from 'styled-components';
import {useElementSize} from '../hooks/useElementSize';
import {Point, useLeafPoints} from '../hooks/useLeafPoints';
import {LeafCollection} from './Leaf';

const Container = styled.div``;

type StyleProps = {
  fontFamily: string;
  fontSize: string;
  fontWeight:
    | '-moz-initial'
    | 'inherit'
    | 'initial'
    | 'revert'
    | 'unset'
    | 'bold'
    | 'normal'
    | (number & {})
    | 'bolder'
    | 'lighter'
    | undefined;
  textTransform:
    | 'none'
    | 'inherit'
    | 'initial'
    | '-moz-initial'
    | 'revert'
    | 'unset'
    | 'capitalize'
    | 'full-size-kana'
    | 'full-width'
    | 'lowercase'
    | 'uppercase'
    | undefined;
};

type FloweredProps = {
  style: StyleProps;
  children?: string | ReactNode;
};

const Flowered = React.forwardRef<HTMLDivElement, FloweredProps>(({style, children}: FloweredProps, forwardedRef) => {
  const childrenRef = useRef<HTMLSpanElement>(null);
  const [childrenSize, initialChildrenSize] = useElementSize(childrenRef);

  const text = typeof children === 'string' ? children : '';
  const points = useLeafPoints(text, initialChildrenSize, style);

  return (
    <div ref={forwardedRef}>
      <LeafCollection
        size={initialChildrenSize}
        points={points}
        scale={childrenSize.width / initialChildrenSize.width}
      />
      <span ref={childrenRef} style={style}>
        {children}
      </span>
    </div>
  );
});

export {Flowered};
export type {StyleProps};
