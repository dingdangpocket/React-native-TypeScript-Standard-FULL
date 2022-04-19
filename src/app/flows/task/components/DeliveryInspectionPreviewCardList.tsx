import { AppNavParams } from '@euler/app/Routes';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { FC, memo } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
const cardConmonStyle = {
  backgroundColor: '#d6d6d6',
  marginLeft: 25,
  marginRight: 25,
  borderRadius: 5,
  marginTop: 5,
  marginBottom: 20,
  padding: 10,
};
const DeliveryInspectionPreviewCardList: FC<any> = memo((props: any) => {
  console.log('list', props);
  const { deliveryInputArray } = props;
  const navigation = useNavigation<StackNavigationProp<AppNavParams>>();
  return deliveryInputArray.map((item: any) => {
    return (
      <View
        key={item.title}
        style={
          item.medias == undefined
            ? {
                ...cardConmonStyle,
              }
            : {
                ...cardConmonStyle,
              }
        }
      >
        <View
          css={`
            flex-direction: row;
            justify-content: space-between;
          `}
        >
          <Text
            css={`
              font-size: 14px;
              margin-top: 5px;
            `}
          >
            {item.title}
          </Text>
          <View
            css={`
              height:30px
              flex-direction: row;
              align-items: center;
            `}
          >
            <Text
              css={`
                font-size: 14px;
                margin-right: 3px;
              `}
            >
              {item.resultText}
            </Text>
            {item.resultText == '是' ? (
              <AntDesign name="checkcircle" size={20} color="#328028" />
            ) : (
              <AntDesign name="closecircle" size={20} color="#c93535" />
            )}
          </View>
        </View>
        {item.medias != undefined ? (
          <View
            css={`
              margin: 0 auto;
            `}
          >
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              css={`
                margin-top: 10px;
              `}
            >
              {item.medias.map((each: any, index: any) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      navigation.push('PreinspectionFailurePreview', {
                        sitePath: each,
                      })
                    }
                  >
                    <Image
                      source={{ uri: each }}
                      css={`
                          height: 170px;
                          width:260px
                          border-radius: 10px;
                          margin-left:8px;
                          margin-right:8px;
                      `}
                    ></Image>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View
              css={`
                margin-top: 10px;
                margin-left: 5px;
                margin-right: 5px;
              `}
            >
              {item.remark != '' ? (
                <Text
                  css={`
                    font-size: 14px;
                    margin-right: 3px;
                  `}
                >
                  备注信息:{item.remark}
                </Text>
              ) : null}
            </View>
          </View>
        ) : (
          <Text
            css={`
              font-size: 14px;
              margin-right: 3px;
            `}
          >
            备注信息:{item.remark}
          </Text>
        )}
      </View>
    );
  });
});
export default DeliveryInspectionPreviewCardList;
