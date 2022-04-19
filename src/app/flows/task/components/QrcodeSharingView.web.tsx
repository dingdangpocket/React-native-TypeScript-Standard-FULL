import { QrcodeSharing } from '@euler/app/flows/task/components/QrcodeSharingView.shared';
import { Colors } from '@euler/components';
import { makeDebug, onErrorIgnore, safeMarkDevFlag } from '@euler/utils';
import { dataURItoBlob } from '@euler/utils/dataURIToBlob';
import FileSaver from 'file-saver';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const kShowTextBounds = safeMarkDevFlag(false);
const debug = makeDebug('qrcode-sharing-web');

type RenderingContext = {
  context: CanvasRenderingContext2D;
};

const getFont = (fontFamily: string, fontSize: number) => {
  return `normal ${fontSize}px ${fontFamily}`;
};

const measureText = async (
  { context }: RenderingContext,
  text: string,
  fontFamily: string,
  fontSize: number,
) => {
  context.save();
  context.font = getFont(fontFamily, fontSize);
  const textMetrics = context.measureText(text);
  let height =
    textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
  if (!height) {
    height = fontSize * 1.44;
  }
  const width = textMetrics.width;
  context.restore();
  return { width, height };
};

export const QrcodeSharingView = forwardRef<
  QrcodeSharing.QrcodeSharingAPI,
  QrcodeSharing.QrcodeSharingViewProps
>((props, ref) => {
  const { model, width, height } = props;
  const style = QrcodeSharing.DefaultStyle;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useImperativeHandle(ref, () => ({
    toDataURI: async (type?: 'image/png' | 'image/jpeg', quality?: number) => {
      if (quality != null) {
        if (quality < 0 || quality > 1) {
          throw new Error('quality parameter must be a number between 0 and 1');
        }
      }
      return canvasRef.current?.toDataURL(type, quality);
    },
    save: async (dataURI: string) => {
      const blob = dataURItoBlob(dataURI);
      FileSaver.saveAs(blob, 'test.jpg');
    },
  }));

  useEffect(() => {
    if (!canvasRef.current) return;

    const context = canvasRef.current.getContext('2d')!;
    const pixelRatio = window.devicePixelRatio ?? 1;
    canvasRef.current.width = width * pixelRatio;
    canvasRef.current.height = height * pixelRatio;
    context.scale(pixelRatio, pixelRatio);

    QrcodeSharing.computeLayoutMetrics(
      { context },
      model,
      style,
      width,
      height,
      measureText,
    )
      .then(layout => {
        debug('rendering layout computed: ', layout);
        render(context, model, layout, style).catch(onErrorIgnore);
      })
      .catch(onErrorIgnore);
  }, [height, model, style, width]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        width,
        height,
      }}
    />
  );
});

async function render(
  ctx: CanvasRenderingContext2D,
  model: QrcodeSharing.Model,
  layout: QrcodeSharing.LayoutMetrics,
  style: QrcodeSharing.Style,
) {
  let image: HTMLImageElement | undefined = undefined;
  try {
    image = await loadImage(model.qrcodeUrl);
  } catch {}

  // background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, layout.size.width, layout.size.height);

  // qrcode image
  renderQrcode(ctx, image, layout, style);

  // title
  renderText(ctx, model.title, layout.title, style.title.textStyle);

  // subtitle
  renderText(ctx, model.subTitle, layout.subTitle, style.subTitle.textStyle);

  // button with text
  renderButton(
    ctx,
    model.licensePlateNo,
    layout.button.frame,
    style.button.bgColor,
    style.button.text,
  );

  // footer
  renderText(ctx, model.storeName, layout.footer, style.footer.textStyle);
}

function renderButton(
  ctx: CanvasRenderingContext2D,
  text: string,
  layout: QrcodeSharing.BoundingRect,
  bgColor: string,
  textStyle: QrcodeSharing.TextStyle,
  useArc = true,
) {
  ctx.save();

  ctx.fillStyle = bgColor;
  ctx.beginPath();

  const [x1, y1, x2, y2, w, h, rx, ry] = [
    layout.x1,
    layout.y1,
    layout.x2,
    layout.y2,
    layout.width,
    layout.height,
    layout.height / 2,
    layout.height / 2,
  ];

  ctx.beginPath();

  ctx.moveTo(x1 + rx, y1);
  ctx.lineTo(x2 - rx, y1);
  if (useArc) {
    ctx.arcTo(x2, y1, x2, y1 + ry, rx);
  } else {
    ctx.quadraticCurveTo(x2, y1, x2, y1 + ry);
  }

  ctx.lineTo(x2, y2 - ry);
  if (useArc) {
    ctx.arcTo(x2, y2, x2 - rx, y2, rx);
  } else {
    ctx.quadraticCurveTo(x2, y2, x2 - rx, y2);
  }

  ctx.lineTo(x1 + rx, y2);
  if (useArc) {
    ctx.arcTo(x1, y2, x1, y2 - ry, rx);
  } else {
    ctx.quadraticCurveTo(x1, y2, x1, y2 - ry);
  }

  ctx.lineTo(x1, y1 + ry);
  if (useArc) {
    ctx.arcTo(x1, y1, x1 + rx, y1, rx);
  } else {
    ctx.quadraticCurveTo(x1, y1, x1 + rx, y1);
  }

  ctx.fill();

  const [cx, cy] = [x1 + w / 2, y1 + h / 2];
  ctx.translate(cx, cy);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = getFont(textStyle.font.family, textStyle.font.size);
  ctx.fillStyle = textStyle.color;
  ctx.fillText(text, 0, 0, w);

  ctx.restore();
}

function renderText(
  ctx: CanvasRenderingContext2D,
  s: string,
  layout: QrcodeSharing.BoundingRect,
  style: QrcodeSharing.TextStyle,
) {
  if (kShowTextBounds) {
    ctx.save();
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 1;
    ctx.rect(layout.x1, layout.y1, layout.width, layout.height);
    ctx.stroke();
    ctx.restore();
  }

  ctx.save();

  const [cx, cy] = [
    layout.x1 + layout.width / 2,
    layout.y1 + layout.height / 2,
  ];
  ctx.translate(cx, cy);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = getFont(style.font.family, style.font.size);
  ctx.fillStyle = style.color;
  ctx.fillText(s, 0, 0, layout.width);

  ctx.restore();
}

function renderQrcode(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | null | undefined,
  layout: QrcodeSharing.LayoutMetrics,
  style: QrcodeSharing.Style,
) {
  // draw image or placeholder
  if (image) {
    ctx.drawImage(
      image,
      layout.qrcode.boundingRect.x1,
      layout.qrcode.boundingRect.y1,
      layout.qrcode.boundingRect.width,
      layout.qrcode.boundingRect.height,
    );
  } else {
    ctx.save();
    ctx.fillStyle = Colors.Gray10;
    ctx.fillRect(
      layout.qrcode.boundingRect.x1,
      layout.qrcode.boundingRect.y1,
      layout.qrcode.boundingRect.width,
      layout.qrcode.boundingRect.height,
    );
    ctx.restore();
  }

  // draw corners
  ctx.save();

  ctx.strokeStyle = style.qrcode.cornerSymbol.borderColor;
  ctx.lineWidth = style.qrcode.cornerSymbol.borderWidth;

  for (const corner of layout.qrcode.container.corners) {
    ctx.beginPath();
    ctx.moveTo(corner[0][0], corner[0][1]);
    ctx.lineTo(corner[1][0], corner[1][1]);
    ctx.lineTo(corner[2][0], corner[2][1]);
    ctx.stroke();
  }

  ctx.restore();
}

async function loadImage(url: string) {
  debug('loading image: %s... ', url);
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      debug('load image successful');
      resolve(img);
    };
    img.onerror = e => {
      debug('load image failure: ', e);
      reject(e || new Error('load image failed'));
    };
    img.src = url;
  });
}
