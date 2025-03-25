declare module "lpf" {
    export function init(data: number[]): void;
    export function next(value: number): number;
    export let smoothing: number;
  }
  