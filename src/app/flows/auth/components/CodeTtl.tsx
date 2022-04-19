import { Colors } from '@euler/components';
import { FontFamily } from '@euler/components/typography';
import { FC, memo, useEffect, useState } from 'react';
import { Text } from 'react-native';

export const CodeTtl: FC<{ ttl: number; onTimeout: () => void }> = memo(
  ({ ttl, onTimeout }) => {
    const [seconds, setSeconds] = useState(ttl);

    useEffect(() => {
      let timer: any = 0;
      let value = ttl;
      const reset = () => {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      };

      const tick = () => {
        reset();

        if (value <= 0) {
          onTimeout();
          return;
        }

        value--;

        setSeconds(value);

        timer = setTimeout(tick, 1000);
      };

      timer = setTimeout(tick, 1000);

      return reset;
    }, [ttl, onTimeout]);

    return (
      <Text
        css={`
          font-family: ${FontFamily.NotoSans.Light};
          font-size: 14px;
          color: ${Colors.Gray3};
        `}
      >
        重新获取验证码{` (${seconds}秒)`}
      </Text>
    );
  },
);
