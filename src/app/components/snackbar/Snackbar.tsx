import { Img } from '@euler/components/adv-image/AdvancedImage';
import { useIsMobileLayout } from '@euler/utils';
import { useBehaviorSubject } from '@euler/utils/hooks';
import { AntDesign } from '@expo/vector-icons';
import { AnimatePresence, MotiView } from 'moti';
import { memo, useEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BehaviorSubject } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { useTheme } from 'styled-components';
import styled from 'styled-components/native';
import { SnackbarStylePresets, SnackbarStyles } from './style-presets';
type SnackbarContent = {
  /** title text to be displayed in the bar content area */
  title: string;
  /** can specify an image to be displayed on left side */
  image?: string;
  /** delay (ms) presenting of the bar */
  delay?: number;
  /** auto dismiss timeout (ms) of the bar */
  dismiss?: number;
  /** a close button will be show when specified as true */
  closable?: boolean;
  /** allow customize the look & feel of the bar */
  styles?: SnackbarStyles;
  /** action buttons for the bar */
  actions?: { title: string; onPress?: () => void }[];
  /** allow responding to bar press */
  onPress?: () => void;
};

const ContentContainer = styled.TouchableOpacity`
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  elevation: 1;
`;

const Snackbar = ({
  styles,
  ...props
}: SnackbarContent & { onDismiss?: () => void }) => {
  const { top, left, right } = useSafeAreaInsets();
  const isMobile = useIsMobileLayout();
  const theme = useTheme();
  return (
    <MotiView
      pointerEvents={'box-none'}
      transition={{ type: 'timing', duration: 300, delay: props.delay }}
      from={{ translateY: -50, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      exit={{ translateY: -50, opacity: 0 }}
      css={`
        position: absolute;
        left: ${left + 15}px;
        right: ${isMobile ? right + 15 : right + 100}px;
        top: ${isMobile ? top + 5 : top + 50}px;
        flex-direction: row;
        justify-content: flex-end;
        background-color: ${theme.components.snackbar.backgroundColor};
        border-radius: 10px;
      `}
      style={[SnackbarStylePresets.default.bar, styles?.bar]}
    >
      <ContentContainer
        css={`
          flex: 1;
          max-width: 400px;
          flex-direction: row;
          align-items: center;
          min-height: 44px;
          background-color: ${theme.components.snackbar.backgroundColor};
          border-radius: 10px;
        `}
        style={[
          SnackbarStylePresets.default.contentContainer,
          styles?.contentContainer,
        ]}
        activeOpacity={props.onPress ? undefined : 1}
        onPress={() => {
          props.onDismiss?.();
          props.onPress?.();
        }}
      >
        {props.image ? (
          <Img
            uri={props.image}
            style={[SnackbarStylePresets.default.image, styles?.image]}
          />
        ) : null}
        <Text
          css={`
            color: ${theme.components.snackbar.textColor};
            flex: 1;
          `}
          style={[SnackbarStylePresets.default.text, styles?.text]}
        >
          {props.title}
        </Text>
        {props.actions?.map((action, index) => (
          <TouchableOpacity
            key={index}
            css={`
              align-self: stretch;
              justify-content: center;
              margin-left: 5px;
            `}
            onPress={() => {
              props.onDismiss?.();
              action.onPress?.();
            }}
          >
            <Text
              css={`
                color: ${theme.link};
              `}
            >
              {action.title}
            </Text>
          </TouchableOpacity>
        ))}
        {props.closable && (
          <TouchableOpacity
            onPress={props.onDismiss}
            style={[
              SnackbarStylePresets.default.closeButton?.style,
              styles?.closeButton?.style,
            ]}
            hitSlop={{ left: 8, right: 8, top: 8, bottom: 8 }}
          >
            <AntDesign
              name="closecircle"
              size={
                styles?.closeButton?.size ??
                SnackbarStylePresets.default.closeButton?.size ??
                24
              }
              color={
                styles?.closeButton?.color ??
                SnackbarStylePresets.default.closeButton?.color ??
                'black'
              }
            />
          </TouchableOpacity>
        )}
      </ContentContainer>
    </MotiView>
  );
};

const snackbar$ = new BehaviorSubject<SnackbarContent | undefined>(undefined);

export const WiredSnackbar = memo(() => {
  const [content, setContent] = useBehaviorSubject(snackbar$);

  useEffect(() => {
    if (content == null) {
      return;
    }

    const timer = setTimeout(() => {
      setContent(undefined);
    }, content.dismiss ?? 3000);

    return () => clearTimeout(timer);
  }, [content, setContent]);

  return (
    <AnimatePresence>
      {content != null && (
        <Snackbar {...content} onDismiss={() => setContent(undefined)} />
      )}
    </AnimatePresence>
  );
});

export const presentSnackbar = (options: SnackbarContent) => {
  snackbar$
    .pipe(
      filter(value => value == null),
      first(),
    )
    .subscribe({
      next() {
        snackbar$.next(options);
      },
    });
};

export default Snackbar;
