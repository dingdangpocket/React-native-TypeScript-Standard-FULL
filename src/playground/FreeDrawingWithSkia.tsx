import { wrapNavigatorScreen } from '@euler/functions';
import { MediaService } from '@euler/lib/media/MediaService';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Canvas,
  ExtendedTouchInfo,
  ICanvas,
  ImageFormat,
  IPaint,
  IPath,
  PaintStyle,
  Path,
  Skia,
  SkiaView,
  StrokeCap,
  StrokeJoin,
  TouchInfo,
  useCanvasRef,
  useDrawCallback,
  useTouchHandler,
} from '@shopify/react-native-skia';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { LayoutRectangle, Text, TouchableOpacity, View } from 'react-native';

type CurrentPath = {
  path: IPath;
  paint: IPaint;
  color?: string;
};

const makePaint = (strokeWidth: number, color: string) => {
  const paint = Skia.Paint();
  paint.setStrokeWidth(strokeWidth);
  paint.setStrokeMiter(5);
  paint.setStyle(PaintStyle.Stroke);
  paint.setStrokeCap(StrokeCap.Round);
  paint.setStrokeJoin(StrokeJoin.Round);
  paint.setAntiAlias(true);
  const result = paint.copy();
  result.setColor(Skia.Color(color));
  console.log(color);
  return result;
};

const kStrokeColor = '#000000';

export const FreeDrawingWithSkia = wrapNavigatorScreen(
  () => {
    const canvas = useRef<ICanvas>();
    const skiaView = useCanvasRef();
    const touchState = useRef(false);
    const currentPath = useRef<CurrentPath>();
    const [layout, setLayout] = useState<LayoutRectangle>();
    const [paths, setPaths] = useState<CurrentPath[]>([]);
    const stroke = useMemo(() => makePaint(3, kStrokeColor), []);

    const navigation = useNavigation<StackNavigationProp<any>>();

    useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <View
            css={`
              flex-direction: row;
              align-items: center;
              padding: 0 8px;
            `}
          >
            <TouchableOpacity
              onPress={() => {
                setPaths([]);
              }}
              css={`
                padding: 0 8px;
              `}
            >
              <Text>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                const image = skiaView.current?.makeImageSnapshot();
                const base64 = image?.encodeToBase64(ImageFormat.PNG, 100);
                if (base64) {
                  const dataUri = `data:image/png;base64,${base64}`;
                  const result = await MediaService.shared.saveToLibrary({
                    type: 'dataUri',
                    dataUri,
                  });
                  if (result.status === 'ok') {
                    alert('save successful');
                  } else {
                    alert('save failure: ' + result.status);
                  }
                }
              }}
              css={`
                padding: 0 8px;
              `}
            >
              <Text>Save</Text>
            </TouchableOpacity>
          </View>
        ),
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onDrawingStart = useCallback(
      (touchInfo: TouchInfo) => {
        if (currentPath.current) return;
        const { x, y } = touchInfo;
        currentPath.current = {
          path: Skia.Path.Make(),
          paint: stroke.copy(),
        };

        touchState.current = true;
        currentPath.current.path?.moveTo(x, y);

        if (currentPath.current) {
          canvas.current?.drawPath(
            currentPath.current.path,
            currentPath.current.paint,
          );
        }
      },
      [stroke],
    );

    const onDrawingActive = useCallback((touchInfo: ExtendedTouchInfo) => {
      const { x, y } = touchInfo;
      if (!currentPath.current?.path) return;
      if (touchState.current) {
        currentPath.current.path.lineTo(x, y);
        if (currentPath.current) {
          canvas.current?.drawPath(
            currentPath.current.path,
            currentPath.current.paint,
          );
        }
      }
    }, []);

    const onDrawingFinished = useCallback(() => {
      if (!currentPath.current) return;
      setPaths([
        ...paths,
        {
          path: currentPath.current?.path.copy(),
          paint: currentPath.current?.paint.copy(),
          color: kStrokeColor,
        },
      ]);
      currentPath.current = undefined;
      touchState.current = false;
    }, [paths]);

    const touchHandler = useTouchHandler({
      onActive: onDrawingActive,
      onStart: onDrawingStart,
      onEnd: onDrawingFinished,
    });

    const onDraw = useDrawCallback((c, info) => {
      touchHandler(info.touches);

      if (currentPath.current) {
        canvas.current?.drawPath(
          currentPath.current.path,
          currentPath.current.paint,
        );
      }

      if (!canvas.current) {
        canvas.current = c;
      }
    }, []);

    return (
      <View
        onLayout={e => setLayout(e.nativeEvent.layout)}
        css={`
          flex: 1;
        `}
      >
        {layout != null && (
          <>
            <SkiaView
              onDraw={onDraw}
              style={{ height: layout.height, width: layout.width, zIndex: 10 }}
            />
            <Canvas
              ref={skiaView}
              style={{
                height: layout.height,
                width: layout.width,
                position: 'absolute',
                left: 0,
                top: 0,
                backgroundColor: '#fff',
              }}
            >
              {paths.map((path, i) => (
                <Path
                  key={i}
                  path={path.path}
                  paint={{ current: path.paint }}
                />
              ))}
            </Canvas>
          </>
        )}
      </View>
    );
  },
  {
    title: 'Drawing With Skia',
  },
);
