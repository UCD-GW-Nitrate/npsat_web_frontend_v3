import type { RectCell } from '@visx/heatmap/lib/heatmaps/HeatmapRect';
import type { Bins } from '@visx/mock-data/lib/generators/genBins';
import { defaultStyles, useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { useCallback, useState } from 'react';

export interface DifferenceHeatmapBinProps {
  bin: RectCell<Bins, unknown>;
}

const DifferenceHeatmapBin = ({ bin }: DifferenceHeatmapBinProps) => {
  const [highlighted, setHighlighted] = useState(false);

  const tooltipStyles = {
    ...defaultStyles,
    backgroundColor: 'rgba(53,71,125,0.8)',
    color: 'white',
    width: 120,
    height: 30,
    padding: 12,
  };
  type TooltipData = string;

  const { containerRef, containerBounds, TooltipInPortal } = useTooltipInPortal(
    {
      scroll: true,
      detectBounds: false,
    },
  );
  const {
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<TooltipData>({
    // initial tooltip state
    tooltipOpen: false,
    tooltipLeft: bin.width / 3,
    tooltipTop: bin.height / 3,
    tooltipData: 'hello',
  });

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<SVGRectElement>) => {
      // coordinates should be relative to the container in which Tooltip is rendered
      const containerX =
        ('clientX' in event ? event.clientX : 0) - containerBounds.left;
      const containerY =
        ('clientY' in event ? event.clientY : 0) - containerBounds.top;
      showTooltip({
        tooltipLeft: containerX,
        tooltipTop: containerY,
        tooltipData: 'hello',
      });
    },
    [showTooltip, containerBounds],
  );

  return (
    <rect
      width={bin.width}
      height={bin.height}
      x={bin.x}
      y={bin.y}
      fill={bin.color}
      fillOpacity={bin.opacity}
      style={
        highlighted
          ? {
              strokeWidth: 1,
              stroke: 'black',
            }
          : {}
      }
      onMouseEnter={() => {
        setHighlighted(true);
      }}
      onMouseLeave={() => {
        setHighlighted(false);
        hideTooltip();
      }}
      onPointerMove={handlePointerMove}
      ref={containerRef}
    >
      {tooltipOpen && (
        <>
          <TooltipInPortal
            key={Math.random()} // needed for bounds to update correctly
            left={tooltipLeft}
            top={tooltipTop}
            style={tooltipStyles}
          >
            <strong>data: </strong> {(bin.bin as any).count}
          </TooltipInPortal>
        </>
      )}
    </rect>
  );
};

export default DifferenceHeatmapBin;
