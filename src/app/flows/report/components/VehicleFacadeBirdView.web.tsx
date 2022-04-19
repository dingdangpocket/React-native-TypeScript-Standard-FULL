import { Overlay } from '@euler/app/flows/report/components/VehicleFacadeBirdView.shared';
import { FacadePerspectiveRenderer } from '@euler/app/flows/report/functions/FacadePerspectiveRenderer';
import { onErrorIgnore } from '@euler/utils';
import { memo, useEffect, useMemo, useRef } from 'react';

let CanvasIDSeed = 0;

export const VehicleFacadeBirdView = memo(
  ({ size, overlays }: { size: number; overlays: Overlay[] }) => {
    const id = useMemo(() => ++CanvasIDSeed, []);
    const canvasId = `facade-image-canvas-${id}`;
    const offscreenCanvasId = `facade-image-offscreen-canvas-${id}`;
    const renderer = useRef<FacadePerspectiveRenderer>();
    useEffect(() => {
      (async () => {
        if (!renderer.current) {
          renderer.current = new FacadePerspectiveRenderer(
            `#${canvasId}`,
            `#${offscreenCanvasId}`,
          );
          await renderer.current.initialize();
          renderer.current.setStyle({ bgColor: '#ffffff' });
        }
        await renderer.current.render(overlays);
      })().catch(onErrorIgnore);
    }, [canvasId, offscreenCanvasId, overlays]);
    return (
      <div>
        <canvas id={canvasId} style={{ width: size, height: size }} />
        <canvas
          id={offscreenCanvasId}
          style={{
            width: size,
            height: size,
            position: 'absolute',
            left: '-9999rem',
            top: '-9999rem',
          }}
        />
      </div>
    );
  },
);
