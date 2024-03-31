import type { PropsWithChildren, UIEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import { useWindowSize } from '@/hooks/useWindowResize';

const Scrollable = ({ children }: PropsWithChildren) => {
  const [left, setLeft] = useState(false);
  const [right, setRight] = useState(false);
  const [width] = useWindowSize();
  const scroll = useRef<HTMLDivElement>(null);

  const changeBorderShadow = (isLeft: boolean, isRight: boolean) => {
    if (isRight && !right) {
      setRight(true);
    } else if (!isRight && right) {
      setRight(false);
    }
    if (isLeft && !left) {
      setLeft(true);
    } else if (!isLeft && left) {
      setLeft(false);
    }
  };

  const handleResize = () => {
    let isRight = false;
    let isLeft = false;

    if (scroll.current) {
      isRight =
        scroll.current.scrollWidth - scroll.current.scrollLeft - 1 <=
        scroll.current.clientWidth;
      isLeft =
        scroll.current.scrollWidth - scroll.current.scrollLeft ===
        scroll.current.scrollWidth;
    }

    changeBorderShadow(isLeft, isRight);
  };

  useEffect(() => {
    handleResize();
  }, [width]);

  const handleScroll = (e: UIEvent<HTMLElement>) => {
    const isRight =
      e.currentTarget.scrollWidth - e.currentTarget.scrollLeft - 1 <=
      e.currentTarget.clientWidth;
    const isLeft =
      e.currentTarget.scrollWidth - e.currentTarget.scrollLeft ===
      e.currentTarget.scrollWidth;

    changeBorderShadow(isLeft, isRight);
  };

  return (
    <div style={{ position: 'relative', overflowX: 'hidden', width: '100%' }}>
      <div
        style={{
          boxShadow: `15px 0 12px -12px ${
            !left ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0)'
          } inset`,
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: 30,
          zIndex: 99,
          transition: 'box-shadow .3s',
        }}
      />
      <div
        style={{
          boxShadow: `-15px 0 12px -12px ${
            !right ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0)'
          } inset`,
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: 30,
          zIndex: 99,
          transition: 'box-shadow 0.3s',
        }}
      />
      <div
        style={{
          overflowX: 'scroll',
        }}
        ref={scroll}
        onScroll={handleScroll}
      >
        {children}
      </div>
    </div>
  );
};

export default Scrollable;
