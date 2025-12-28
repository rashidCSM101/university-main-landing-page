/// <reference types="vite/client" />

declare module 'lenis' {
  interface LenisOptions {
    duration?: number;
    easing?: (t: number) => number;
    orientation?: 'vertical' | 'horizontal';
    gestureOrientation?: 'vertical' | 'horizontal' | 'both';
    smoothWheel?: boolean;
    wheelMultiplier?: number;
    touchMultiplier?: number;
    infinite?: boolean;
    wrapper?: HTMLElement | Window;
    content?: HTMLElement;
  }

  export default class Lenis {
    constructor(options?: LenisOptions);
    on(event: string, callback: (e: any) => void): void;
    off(event: string, callback: (e: any) => void): void;
    raf(time: number): void;
    scrollTo(
      target: string | number | HTMLElement,
      options?: {
        offset?: number;
        lerp?: number;
        duration?: number;
        easing?: (t: number) => number;
        immediate?: boolean;
        lock?: boolean;
        onComplete?: () => void;
      }
    ): void;
    destroy(): void;
    start(): void;
    stop(): void;
  }
}
