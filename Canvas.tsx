import React, { FC, useEffect, useRef, useState } from "react";

export interface CanvasProps {
  width: number;
  height: number;
  setup?: (ctx: CanvasRenderingContext2D) => void;
  render: (
    ctx: CanvasRenderingContext2D,
    deltaTime: number,
    time: number,
    canvas: HTMLCanvasElement
  ) => void;
  clearBeforeRender?: boolean;
}

// Maybe move to its own Hook File!
export const useAnimationFrame = (
  callback: (deltaTime: number, time: number) => void
) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const animate = (time: number) => {
    const previousTime = previousTimeRef.current;
    if (previousTime !== undefined) {
      const deltaTime = time - previousTime;
      callback(deltaTime, time);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }); // Make sure the effect runs only once
};

const Canvas: FC<CanvasProps> = ({
  width,
  height,
  setup,
  render,
  clearBeforeRender = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [setupDone, setSetupDone] = useState(false);
  useAnimationFrame((deltaTime, time) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    let ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    if (setup && !setupDone) {
      setSetupDone(true);
      setup(ctx);
    }
    if (clearBeforeRender) {
      ctx.clearRect(0, 0, width, height);
    }
    render(ctx, deltaTime, time, canvas);
  });
  return <canvas ref={canvasRef} height={height} width={width} />;
};

export default Canvas;
