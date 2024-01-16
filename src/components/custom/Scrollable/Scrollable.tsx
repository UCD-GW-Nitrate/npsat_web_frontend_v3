import type { PropsWithChildren, UIEvent } from 'react';
import { useState } from 'react';

const Scrollable = ({ children }: PropsWithChildren) => {
  const [left, setLeft] = useState(true);
  const [right, setRight] = useState(false);

  const handleScroll = (e: UIEvent<HTMLElement>) => {
    const isRight =
      e.currentTarget.scrollWidth - e.currentTarget.scrollLeft ===
      e.currentTarget.clientWidth;
    const isLeft =
      e.currentTarget.scrollWidth - e.currentTarget.scrollLeft ===
      e.currentTarget.scrollWidth;

    if (isRight && !right) {
      setRight(true);
    } else if (right) {
      setRight(false);
    }
    if (isLeft && !left) {
      setLeft(true);
    } else if (left) {
      setLeft(false);
    }
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
        onScroll={handleScroll}
      >
        {children}
      </div>
    </div>
  );
};

export default Scrollable;
