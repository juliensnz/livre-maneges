import {useEffect, useRef, useState} from 'react';

type Size = {width: number; height: number};

const useElementSize = (elementRef: React.RefObject<HTMLSpanElement>): [Size, Size] => {
  const [elementSize, setElementSize] = useState({width: 0, height: 0});
  const [initialElementSize, setInitialElementSize] = useState({width: 0, height: 0});
  const initalized = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      if (null !== elementRef.current) {
        if (elementRef.current.offsetHeight !== elementSize.height) {
          setElementSize({height: elementRef.current.offsetHeight, width: elementRef.current.offsetWidth});

          if (!initalized.current) {
            setInitialElementSize({height: elementRef.current.offsetHeight, width: elementRef.current.offsetWidth});
            initalized.current = true;
          }
        }
      }
    };
    const timer = setTimeout(() => {
      handleResize();
    }, 1000);

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [elementRef]);

  return [elementSize, initialElementSize];
};

export {useElementSize};
export type {Size};
