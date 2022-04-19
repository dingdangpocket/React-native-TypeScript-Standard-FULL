import { WechatBindIcon } from '@euler/app/flows/task/icons/WechatBindIcon';
import { FC, memo } from 'react';
import { Image, Text, View } from 'react-native';
type Props = {
  vehicleName: string;
  licensePlateNo: string;
  customerWxBindings: string[] | null | undefined;
  vehicleImageUrl: string | null | undefined;
};
export const PreInspectionHeadCard: FC<Props> = memo(
  ({ vehicleName, licensePlateNo, customerWxBindings, vehicleImageUrl }) => {
    return (
      <View
        css={`
          height: 80px;
          width: 345px;
          background: white;
          border-radius: 5px;
          flex-direction: row;
        `}
      >
        <View
          css={`
            width: 240px;
            align-items: center;
            justify-content: center;
          `}
        >
          <Text
            css={`
              font-size: 16px;
            `}
          >
            {vehicleName}
          </Text>
          <View
            css={`
              flex-direction: row;
              margin-top: 10px;
              justify-content: space-between;
              align-items: center;
              width: 150px;
              height: 30px;
            `}
          >
            <View
              css={`
                background: #f2f2f2;
                justify-content: center;
                align-items: center;
                width: 80px;
                height: 25px;
              `}
            >
              <Text>{licensePlateNo}</Text>
            </View>
            <View
              css={`
                background: #3ecc82;
                flex-direction: row;
                align-items: center;
                height: 25px;
              `}
            >
              <WechatBindIcon
                size={30}
                style={{ marginRight: -10 }}
              ></WechatBindIcon>
              <Text
                css={`
                  padding: 3px;
                  color: white;
                `}
              >
                {customerWxBindings != null && customerWxBindings.length != 0
                  ? '已绑定'
                  : '未绑定'}
              </Text>
            </View>
          </View>
        </View>
        <View
          css={`
            flex: 1;
            justify-content: center;
            align-items: center;
          `}
        >
          <Image
            source={{ uri: vehicleImageUrl ?? undefined }}
            css={`
              height: 100px;
              width: 100px;
              border-radius: 10px;
              margin-left: 25px;
              margin-right: 25px;
            `}
            resizeMode={'contain'}
          ></Image>
        </View>
      </View>
    );
  },
);
