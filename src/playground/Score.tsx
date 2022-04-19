import { ScoreGaugeView } from '@euler/app/components/score/ScoreGauge';
import { wrapNavigatorScreen } from '@euler/functions';
import { SafeAreaView } from 'react-native-safe-area-context';

const ScoreCanvas = () => {
  return (
    <SafeAreaView
      css={`
        flex: 1;
        align-items: center;
        justify-content: center;
      `}
    >
      <ScoreGaugeView
        score={85}
        css={`
          align-self: stretch;
          height: 300px;
        `}
      />
    </SafeAreaView>
  );
};

export const ScorePlaygroundPage = wrapNavigatorScreen(ScoreCanvas, {
  title: 'Score SVG Demo',
});
