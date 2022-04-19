import React, { FC, useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  isVisible: boolean;
  setIsvisible: (status: boolean) => void;
  remarkValueCallback: (value: string) => void;
};
const RemarkModal: FC<Props> = props => {
  const { isVisible, setIsvisible, remarkValueCallback } = props;
  const [text, onChangeText] = useState<string>('');
  const onComfirm = () => {
    remarkValueCallback(text);
    setIsvisible(false);
  };
  return (
    <View>
      <Modal
        transparent={true}
        animationType="fade"
        visible={isVisible}
        css={`
          margin-left: 0px;
        `}
      >
        <TouchableOpacity
          css={`
            flex: 1;
            background: rgba(22, 22, 22, 0.8);
            justify-content: center;
            align-items: center;
          `}
          onPress={() => setIsvisible(false)}
        >
          <View>
            <TextInput
              autoFocus={true}
              multiline={true}
              onChangeText={onChangeText}
              value={text}
              placeholder={'添加备注信息:'}
              css={`
                width: 305px;
                height: 100px;
                margin: 8px;
                padding: 10px;
                background: #e7e7e7;
                border-radius: 3px;
                margin-top: -100px;
              `}
            />
            <View
              css={`
                flex-direction: row;
                justify-content: space-around;
                align-items: center;
                width: 300px;
              `}
            >
              <TouchableOpacity
                onPress={() => setIsvisible(false)}
                css={`
                  width: 100px;
                  height: 50px;
                  justify-content: space-around;
                  align-items: center;
                  border-width: 1px;
                  border-color: #adadad;
                  border-radius: 5px;
                `}
              >
                <Text
                  css={`
                    color: white;
                  `}
                >
                  取消
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onComfirm()}
                css={`
                  width: 100px;
                  height: 50px;
                  justify-content: space-around;
                  align-items: center;
                  background: #207fe7;
                  border-radius: 5px;
                `}
              >
                <Text
                  css={`
                    color: white;
                  `}
                >
                  确认
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
export default RemarkModal;
