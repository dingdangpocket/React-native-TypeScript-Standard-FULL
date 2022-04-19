import { memo, useCallback, useState } from 'react';
import DateTimePickerModal, {
  DateTimePickerProps,
} from 'react-native-modal-datetime-picker';

export const useDateTimePicker = () => {
  const [show, setShow] = useState(false);
  const showDateTimePicker = useCallback(() => {
    setShow(true);
  }, []);
  const hideDateTimePicker = useCallback(() => {
    setShow(false);
  }, []);
  return [show, showDateTimePicker, hideDateTimePicker] as const;
};

type Props = DateTimePickerProps;

export const DateTimePicker = memo((props: Props) => {
  return <DateTimePickerModal {...props} />;
});
