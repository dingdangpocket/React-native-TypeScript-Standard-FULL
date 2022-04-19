import { Button, Colors } from '@euler/components';
import { useCreation } from '@euler/utils/hooks';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const DateTimePicker = (props: {
  isVisible: boolean;
  value?: Date;
  minimumDate?: Date;
  onConfirm?: (newDate: Date) => void;
  onCancel?: () => void;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(props.value?.toISOString() ?? '');
  useEffect(() => {
    if (props.isVisible) {
      ref.current?.click();
    }
  }, [props.isVisible]);
  const dom = useCreation(() => document.createElement('div'), []);
  useEffect(() => {
    document.body.appendChild(dom);
    return () => void document.body.removeChild(dom);
  }, [dom]);
  if (!props.isVisible) {
    return null;
  }
  return createPortal(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 300,
          padding: 20,
          borderRadius: 10,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
        }}
      >
        <input
          ref={ref}
          value={value}
          onChange={e => setValue(e.currentTarget.value)}
          min={props.minimumDate?.toISOString()}
          type="datetime-local"
          style={{ padding: 10, borderWidth: 1, borderRadius: 5 }}
        />
        <Button
          style={{ marginTop: 10 }}
          title="Confirm"
          onPress={() => {
            props.onConfirm?.(new Date(value));
          }}
        />
        <Button
          style={{ marginTop: 10 }}
          title="Cancel"
          backgroundColor={Colors.Gray3}
          onPress={props.onCancel}
        />
      </div>
    </div>,
    dom,
  );
};

export default DateTimePicker;
