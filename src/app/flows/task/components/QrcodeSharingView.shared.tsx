import { FontFamily } from '@euler/components/typography';
import { Optional } from '@euler/typings';

export namespace QrcodeSharing {
  export interface QrcodeSharingAPI {
    toDataURI(
      type?: 'image/png' | 'image/jpeg',
      quality?: number,
    ): Promise<string | null | undefined>;
    save(dataURI: string): Promise<void>;
  }

  export type QrcodeSharingViewProps = {
    model: QrcodeSharing.Model;
    width: number;
    height: number;
  };

  export type Size = { width: number; height: number };
  export type BoundingRect = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } & Size;

  export type CornerPath = [
    [number, number],
    [number, number],
    [number, number],
  ];

  export type FontStyle = {
    size: number;
    family: string;
  };

  export type TextStyle = {
    color: string;
    font: FontStyle;
  };

  export type ButtonStyle = {
    size: Size;
    cornerRadius: number;
    bgColor: string;
    text: TextStyle;
    marginTop: number;
  };

  export type Style = {
    canvas: {
      padding: number;
    };
    qrcode: {
      margin: number;
      cornerSymbol: {
        size: number;
        borderColor: string;
        borderWidth: number;
      };
    };
    title: {
      textStyle: TextStyle;
      marginTop: number;
    };
    subTitle: {
      textStyle: TextStyle;
      marginTop: number;
    };
    footer: {
      textStyle: TextStyle;
      marginTop: number;
    };
    button: ButtonStyle;
  };

  export type StyleProp = {
    [p in keyof Style]?: Style[p] extends {
      [key in keyof Style[p]]: Style[p][key];
    }
      ? Optional<Style[p]>
      : Style[p];
  };

  export type Model = {
    title: string;
    qrcodeUrl: string;
    subTitle: string;
    licensePlateNo: string;
    storeName: string;
  };

  export interface LayoutMetrics {
    size: Size;
    qrcode: {
      container: {
        boundingRect: BoundingRect;
        corners: [CornerPath, CornerPath, CornerPath, CornerPath];
      };
      boundingRect: BoundingRect;
    };
    title: BoundingRect;
    subTitle: BoundingRect;
    button: {
      frame: BoundingRect;
      text: BoundingRect;
    };
    footer: BoundingRect;
  }

  export const DefaultStyle: Style = {
    canvas: {
      padding: 20,
    },
    qrcode: {
      margin: 15,
      cornerSymbol: {
        size: 10,
        borderColor: '#d8d8d8',
        borderWidth: 1.5,
      },
    },
    title: {
      textStyle: {
        color: '#1B64BE',
        font: { size: 23, family: FontFamily.NotoSans.Bold },
      },
      marginTop: 30,
    },
    subTitle: {
      textStyle: {
        color: '#1B1919',
        font: { size: 19, family: FontFamily.NotoSans.Regular },
      },
      marginTop: 15,
    },
    footer: {
      textStyle: {
        color: '#B1B1B1',
        font: { size: 16, family: FontFamily.NotoSans.Light },
      },
      marginTop: 40,
    },
    button: {
      size: { width: 182, height: 36 },
      cornerRadius: 18,
      bgColor: '#0277FD',
      text: {
        color: '#ffffff',
        font: { size: 19, family: FontFamily.NotoSans.Light },
      },
      marginTop: 20,
    },
  };

  export async function computeLayoutMetrics<T = any>(
    context: T,
    model: QrcodeSharing.Model,
    style: QrcodeSharing.Style,
    canvasWidth: number,
    canvasHeight: number,
    measureText: (
      context: T,
      text: string,
      fontFamily: string,
      fontSize: number,
    ) => Promise<{ width: number; height: number }>,
  ): Promise<QrcodeSharing.LayoutMetrics> {
    // calculate title size
    const titleSize = await measureText(
      context,
      model.title,
      style.title.textStyle.font.family,
      style.title.textStyle.font.size,
    );

    const subTitleSize = await measureText(
      context,
      model.subTitle,
      style.subTitle.textStyle.font.family,
      style.subTitle.textStyle.font.size,
    );

    const buttonTextSize = await measureText(
      context,
      model.licensePlateNo,
      style.button.text.font.family,
      style.button.text.font.size,
    );

    const footerTextSize = await measureText(
      context,
      model.storeName,
      style.footer.textStyle.font.family,
      style.footer.textStyle.font.size,
    );

    const qrcodeContainerSize =
      canvasHeight -
      style.canvas.padding * 2 -
      footerTextSize.height -
      style.footer.marginTop -
      style.button.size.height -
      style.button.marginTop -
      subTitleSize.height -
      style.subTitle.marginTop -
      titleSize.height -
      style.title.marginTop;

    const qrcodeSize = qrcodeContainerSize - style.qrcode.margin * 2;

    const makeCenteredBoundingRect = (y: number, w: number, h: number) => {
      return makeBoundingRect((canvasWidth - w) / 2, y, w, h);
    };

    const makeCornerPath = (
      boundingRect: QrcodeSharing.BoundingRect,
      hPos: 'left' | 'right',
      vPos: 'top' | 'bottom',
    ): QrcodeSharing.CornerPath => {
      const { x1, y1, x2, y2 } = boundingRect;
      const d = style.qrcode.cornerSymbol.size;
      if (hPos === 'left') {
        if (vPos === 'top') {
          return [
            [x1, y1 + d],
            [x1, y1],
            [x1 + d, y1],
          ];
        } else {
          return [
            [x1, y2 - d],
            [x1, y2],
            [x1 + d, y2],
          ];
        }
      } else {
        if (vPos === 'top') {
          return [
            [x2 - d, y1],
            [x2, y1],
            [x2, y1 + d],
          ];
        } else {
          return [
            [x2 - d, y2],
            [x2, y2],
            [x2, y2 - d],
          ];
        }
      }
    };

    const yOffset = style.canvas.padding;

    const qrcodeContainerBoundingRect = makeCenteredBoundingRect(
      yOffset,
      qrcodeContainerSize,
      qrcodeContainerSize,
    );

    const qrcodeBoundingRect = makeCenteredBoundingRect(
      yOffset + style.qrcode.margin,
      qrcodeSize,
      qrcodeSize,
    );

    const titleBoundingRect = makeCenteredBoundingRect(
      qrcodeContainerBoundingRect.y2 + style.title.marginTop,
      titleSize.width,
      titleSize.height,
    );

    const subTitleBoundingRect = makeCenteredBoundingRect(
      titleBoundingRect.y2 + style.subTitle.marginTop,
      subTitleSize.width,
      subTitleSize.height,
    );

    const buttonBoundingRect = makeCenteredBoundingRect(
      subTitleBoundingRect.y2 + style.button.marginTop,
      style.button.size.width,
      style.button.size.height,
    );

    const buttonTextBoundingRect = makeCenteredBoundingRect(
      buttonBoundingRect.y1 +
        (style.button.size.height - buttonTextSize.height) / 2,
      buttonTextSize.width,
      buttonTextSize.height,
    );

    const footerBoundingRect = makeCenteredBoundingRect(
      buttonBoundingRect.y2 + style.footer.marginTop,
      footerTextSize.width,
      footerTextSize.height,
    );

    return {
      size: {
        width: canvasWidth,
        height: canvasHeight,
      },
      qrcode: {
        container: {
          boundingRect: qrcodeContainerBoundingRect,
          corners: [
            makeCornerPath(qrcodeContainerBoundingRect, 'left', 'top'),
            makeCornerPath(qrcodeContainerBoundingRect, 'left', 'bottom'),
            makeCornerPath(qrcodeContainerBoundingRect, 'right', 'top'),
            makeCornerPath(qrcodeContainerBoundingRect, 'right', 'bottom'),
          ],
        },
        boundingRect: qrcodeBoundingRect,
      },
      title: titleBoundingRect,
      subTitle: subTitleBoundingRect,
      button: {
        frame: buttonBoundingRect,
        text: buttonTextBoundingRect,
      },
      footer: footerBoundingRect,
    };
  }
}

function makeBoundingRect(
  x: number,
  y: number,
  w: number,
  h: number,
): QrcodeSharing.BoundingRect {
  return { x1: x, y1: y, x2: x + w, y2: y + h, width: w, height: h };
}
