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

    const timer = setTimeout(() => {
      handleResize();
    }, 1000);

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [subtitleRef]);

  return [subtitleRef, subtitleSize, setSubtitleSize];
};

export {useElementSize};
export type {Size};
