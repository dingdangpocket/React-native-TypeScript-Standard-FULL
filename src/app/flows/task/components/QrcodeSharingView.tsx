import { QrcodeSharing } from '@euler/app/flows/task/components/QrcodeSharingView.shared';
import { Colors } from '@euler/components';
import { FontFamily } from '@euler/components/typography';
import { MediaService } from '@euler/lib/media/MediaService';
import { onErrorIgnore, safeMarkDevFlag } from '@euler/utils';
import {
  Canvas,
  CustomPaintProps,
  Font,
  Image,
  ImageFormat,
  Path,
  Rect,
  RoundedRect,
  Skia,
  Text,
  useCanvasRef,
  useImage,
} from '@shopify/react-native-skia';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Image as RNImage } from 'react-native';
import TextSize from 'react-native-text-size';

const fontCache = new Map<string, Font>();

const FontMap: Record<string, any> = {
  [FontFamily.NotoSans
    .Thin]: require('../../../../../assets/fonts/NotoSansSC_100Thin.ttf'),
  [FontFamily.NotoSans
    .Light]: require('../../../../../assets/fonts/NotoSansSC_300Light.ttf'),
  [FontFamily.NotoSans
    .Regular]: require('../../../../../assets/fonts/NotoSansSC_400Regular.ttf'),
  [FontFamily.NotoSans
    .Medium]: require('../../../../../assets/fonts/NotoSansSC_500Medium.ttf'),
  [FontFamily.NotoSans
    .Bold]: require('../../../../../assets/fonts/NotoSansSC_700Bold.ttf'),
  [FontFamily.NotoSans
    .Black]: require('../../../../../assets/fonts/NotoSansSC_900Black.ttf'),
};

const kUseSkia = true;

const measureText = async (
  _context: any,
  text: string,
  fontFamily: string,
  fontSize: number,
) => {
  if (kUseSkia) {
    let font: Font | undefined = undefined;
    if (fontCache.has(fontFamily)) {
      font = fontCache.get(fontFamily)!;
    } else {
      const path = FontMap[fontFamily];
      const uri =
        typeof path === 'string' ? path : RNImage.resolveAssetSource(path).uri;
      const data = await Skia.Data.fromURI(uri);
      const typeface = Skia.Typeface.MakeFreeTypeFaceFromData(data);
      font = Skia.Font(typeface!, fontSize);
      fontCache.set(fontFamily, font);
      console.log('add new skia font to cache: ', fontFamily);
    }
    const rect = font.measureText(text);
    return { width: rect.width, height: rect.height };
  }

  return await TextSize.measure({
    text,
    fontFamily,
    fontSize,
    allowFontScaling: false,
    includeFontPadding: false,
  });
};

const makePathData = (path: QrcodeSharing.CornerPath) => {
  return path.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');
};

const kShowTextBounds = safeMarkDevFlag(false);

const TextRenderer = ({
  familyName,
  size,
  layout,
  ...props
}: {
  familyName: string;
  size: number;
  value: string;
  layout: QrcodeSharing.BoundingRect;
} & CustomPaintProps) => {
  const font = fontCache.get(familyName);
  if (!font) {
    console.log('cannot find font in the cache: ', familyName);
    return null;
  }
  return (
    <>
      {kShowTextBounds && (
        <Rect
          x={layout.x1}
          y={layout.y1}
          width={layout.width}
          height={layout.height}
          style="stroke"
          color={'green'}
        />
      )}
      <Text
        font={font}
        size={size}
        x={layout.x1}
        y={layout.y1 + layout.height - 3}
        {...props}
      />
    </>
  );
};

export const QrcodeSharingView = forwardRef<
  QrcodeSharing.QrcodeSharingAPI,
  QrcodeSharing.QrcodeSharingViewProps
>((props, ref) => {
  const style = QrcodeSharing.DefaultStyle;

  const { model, width, height } = props;
  const [layout, setLayout] = useState<QrcodeSharing.LayoutMetrics>();
  const canvasRef = useCanvasRef();

  useImperativeHandle(
    ref,
    () => ({
      toDataURI: async (
        type?: 'image/png' | 'image/jpeg',
        quality?: number,
      ) => {
        const format =
          type === 'image/png' ? ImageFormat.PNG : ImageFormat.JPEG;

        if (quality != null) {
          if (quality < 0 || quality > 1) {
            throw new Error(
              'quality parameter must be a number between 0 and 1',
            );
          }
          quality *= 100;
        }

        const base64 = canvasRef.current
          ?.makeImageSnapshot()
          ?.encodeToBase64(format, quality);

        if (base64 == null) return base64;
        return `data:${type};base64,${base64}`;
      },
      save: async (dataUri: string) => {
        const result = await MediaService.shared.saveToLibrary({
          type: 'dataUri',
          dataUri,
        });
        if (result.status === 'unauthorized') {
          throw new Error('Unauthorized access to media library');
        }
      },
    }),
    [canvasRef],
  );

  useEffect(() => {
    QrcodeSharing.computeLayoutMetrics(
      null,
      model,
      style,
      width,
      height,
      measureText,
    )
      .then(result => {
        setLayout(result);
      })
      .catch(onErrorIgnore);
  }, [height, model, style, width]);

  const qrcodeImage = useImage(model.qrcodeUrl);

  if (!layout) return null;

  return (
    <Canvas
      ref={canvasRef}
      css={`
        width: ${width}px;
        height: ${height}px;
        background-color: #fff;
      `}
    >
      {/* background */}
      <Rect x={0} y={0} width={width} height={height} color="#ffffff" />

      {/* qrcode image */}
      {qrcodeImage ? (
        <Image
          source={qrcodeImage}
          x={layout.qrcode.boundingRect.x1}
          y={layout.qrcode.boundingRect.y1}
          width={layout.qrcode.boundingRect.width}
          height={layout.qrcode.boundingRect.height}
        />
      ) : (
        <Rect
          x={layout.qrcode.boundingRect.x1}
          y={layout.qrcode.boundingRect.y1}
          width={layout.qrcode.boundingRect.width}
          height={layout.qrcode.boundingRect.height}
          color={Colors.Gray10}
        />
      )}
      {/* qrcode container corners */}
      {layout.qrcode.container.corners.map((corner, i) => (
        <Path
          key={i}
          path={makePathData(corner)}
          style="stroke"
          color={style.qrcode.cornerSymbol.borderColor}
          strokeWidth={style.qrcode.cornerSymbol.borderWidth}
        />
      ))}
      {/* title */}
      <TextRenderer
        layout={layout.title}
        familyName={style.title.textStyle.font.family}
        size={style.title.textStyle.font.size}
        color={style.title.textStyle.color}
        value={model.title}
      />
      {/* subtitle */}
      <TextRenderer
        layout={layout.subTitle}
        familyName={style.subTitle.textStyle.font.family}
        size={style.subTitle.textStyle.font.size}
        color={style.subTitle.textStyle.color}
        value={model.subTitle}
      />
      {/* button rect */}
      <RoundedRect
        x={layout.button.frame.x1}
        y={layout.button.frame.y1}
        width={layout.button.frame.width}
        height={layout.button.frame.height}
        rx={layout.button.frame.height / 2}
        ry={layout.button.frame.height / 2}
        color={style.button.bgColor}
      />
      {/* button text */}
      <TextRenderer
        layout={layout.button.text}
        familyName={style.button.text.font.family}
        size={style.button.text.font.size}
        color={style.button.text.color}
        value={model.licensePlateNo}
      />
      {/* footer text */}
      <TextRenderer
        layout={layout.footer}
        familyName={style.footer.textStyle.font.family}
        size={style.footer.textStyle.font.size}
        color={style.footer.textStyle.color}
        value={model.storeName}
      />
    </Canvas>
  );
});
