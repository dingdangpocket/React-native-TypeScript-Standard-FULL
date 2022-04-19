/**
 * @file: FacadePerspectiveRenderer.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { makeDebug } from '@euler/utils';

interface CanvasInfo {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

interface Style {
  bgColor: string;
}

export interface Overlay {
  name: string;
  imagePath: string;
  coords: [number, number, number, number];
  color?: string;
}

function queryCanvas(selector: string): CanvasInfo {
  const canvas = document.querySelector(selector) as HTMLCanvasElement;
  return { canvas, width: canvas.clientWidth, height: canvas.clientHeight };
}

const DefaultStyle: Style = {
  bgColor: 'rgba(255, 255, 255, 0)',
};

const CarFacadeViewsImageUrl = require('@euler/assets/img/car-facade-views.png');
const debug = makeDebug('facaderenderer');

export class FacadePerspectiveRenderer {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private offscreenCanvas: HTMLCanvasElement | null = null;
  private offscreenCanvasInfo: CanvasInfo | null = null;
  private width!: number;
  private height!: number;
  private readonly style: Style;

  constructor(
    private readonly selector: string,
    private readonly offsetScreenCanvasSelector: string,
    private readonly scope?: any,
  ) {
    this.style = { ...DefaultStyle };
  }

  setStyle(style: Partial<Style>): this {
    Object.assign(this.style, style);
    return this;
  }

  clear(color: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  getImageAsDataURL(): string {
    return this.canvas.toDataURL().replace(/[\r\n]/g, '');
  }

  async initialize() {
    try {
      debug('[facaderenderer] initializing... ');
      const canvasInfo = queryCanvas(this.selector);
      debug('[facaderenderer] canvas info: ', canvasInfo);
      this.canvas = canvasInfo.canvas;
      this.width = canvasInfo.width;
      this.height = canvasInfo.height;
      this.ctx = await this.initializeRenderingContext();
    } catch (e) {
      debug('[facaderenderer] error initialize: ', e);
    }
  }

  async initializeRenderingContext() {
    const pixelRatio = window.devicePixelRatio;
    const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')!;
    this.canvas.width = this.width * pixelRatio;
    this.canvas.height = this.height * pixelRatio;
    ctx.scale(pixelRatio, pixelRatio);
    return ctx;
  }

  async render(overlays: Overlay[]) {
    // render loading message...
    this.renderLoading();

    debug('loading image %s... ', CarFacadeViewsImageUrl);

    let img: HTMLImageElement | undefined = undefined;
    let maxAttempts = 3;
    while (maxAttempts--) {
      try {
        img = await this.loadCanvasImage(CarFacadeViewsImageUrl);
      } catch (e) {
        debug('failed to load canvas image: ', e);
      }
    }

    if (!img) {
      debug('cannot load image, render failed. ');
      return;
    }

    debug('image loaded, elapsed %sms... ');
    const scale = this.width / img.width;
    this.clear(this.style.bgColor);
    this.ctx.drawImage(img, 0, 0, this.width, this.height);
    this.ctx.save();
    this.ctx.scale(scale, scale);
    for (const overlay of overlays) {
      await this.renderOverlay(overlay);
    }
    debug('render completed');
    this.ctx.restore();
  }

  renderLoading() {
    const text = '加载中';
    this.ctx.save();
    this.ctx.fillStyle = '#eaeaea';
    this.ctx.textAlign = 'center';
    this.ctx.font = '40px Helvetica Neue, Helvetica, Arial, Sans-Serif';
    this.ctx.translate(this.width / 2, this.height / 2);
    this.ctx.fillText(text, 0, 0);
    this.ctx.restore();
  }

  async renderOverlay(overlay: Overlay) {
    debug('rendering overlay: ', overlay);
    const [x, y, w, h] = overlay.coords;
    debug('loading overlay image... ');
    try {
      let img = await this.loadCanvasImage(overlay.imagePath);
      debug('overlay image loaded');
      if (overlay.color) {
        img = await this.renderOverlayImageWithTintColor(
          overlay,
          img,
          overlay.color,
        );
      }
      this.ctx.drawImage(img, 0, 0, img.width, img.height, x, y, w, h);
    } catch (e) {
      debug('error render overlay image: ', e);
    }
  }

  async renderOverlayImageWithTintColor(
    overlay: Overlay,
    img: HTMLImageElement,
    color: string,
  ) {
    debug('rendering overlay image with tint color: ', color);
    const pixelRatio = 1; // Taro.getSystemInfoSync().pixelRatio;
    const offscreenCtx = await this.requireOffscreenCanvasRenderingContext(
      info => {
        info.canvas.width = img.width * pixelRatio;
        info.canvas.height = img.height * pixelRatio;
      },
    );
    offscreenCtx.scale(pixelRatio, pixelRatio);
    offscreenCtx.save();
    offscreenCtx.drawImage(img, 0, 0, img.width, img.height);
    offscreenCtx.globalCompositeOperation = 'source-in';
    offscreenCtx.fillStyle = color;
    offscreenCtx.fillRect(0, 0, img.width, img.height);
    offscreenCtx.restore();
    const dataURL = this.offscreenCanvas!.toDataURL();
    debug('dataurl length of %s: %d', overlay.name, dataURL.length);
    return await this.loadCanvasImage(dataURL);
  }

  async loadCanvasImage(url: string) {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve(img);
      };
      img.onerror = e => {
        reject(e);
      };
      img.src = url;
    });
  }

  async requireOffscreenCanvasRenderingContext(
    callback?: (canvas: CanvasInfo) => void,
  ) {
    if (!this.offscreenCanvas) {
      const offscreenCanvasInfo = queryCanvas(this.offsetScreenCanvasSelector);
      this.offscreenCanvas = offscreenCanvasInfo.canvas;
      this.offscreenCanvasInfo = offscreenCanvasInfo;
    }
    callback?.(this.offscreenCanvasInfo!);
    const offscreenCtx = this.offscreenCanvas.getContext('2d');
    return offscreenCtx!;
  }
}
