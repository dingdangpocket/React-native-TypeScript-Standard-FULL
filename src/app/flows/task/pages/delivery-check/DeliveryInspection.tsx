import DeliveryInputItem from '@euler/app/flows/task/pages/delivery-check/components/DeliveryInputItem';
import { BottomButton } from '@euler/app/flows/task/pages/pre-inspection/components/BottomButton';
import { wrapNavigatorScreen } from '@euler/functions';
import { DeliveryCheckTemplateItemOption } from '@euler/model';
import { array2map } from '@euler/utils/array';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

type Props = {
  res: string;
  itemId?: string;
};
export interface DeliveryCheckItem {
  id?: string;
  subject?: string;
  requiresPhoto?: boolean;
  options?: DeliveryCheckTemplateItemOption[];
  medias?: string[];
  resCode?: string;
  resText?: string;
  resMark?: string;
}

export const DeliveryInspectionScreen = wrapNavigatorScreen(
  (props: Props) => {
    //拍摄完成后有生成一张照片和一个对应的Id,通过计算属性插入图片,进行渲染;
    const { res, itemId } = props;
    const [submitStatus, setSubmitStatus] = useState<boolean>(false);
    console.log(
      '新拍摄的图片地址',
      props.res,
      '图片应该所属的Item的ID',
      props.itemId,
    );
    const [template] = useState<DeliveryCheckItem[]>([
      {
        id: 'fe3c72b191f5a34578551ff47cc11001',
        subject: '机油液位中线偏上？',
        requiresPhoto: true,
        options: [
          {
            id: '6a8761a0867a759b4a141fc5acd2e67e',
            title: '合格',
            remark: '机油油位已到达上线',
            isDefaultChecked: false,
          },
          {
            id: 'abf8770da67eaab12a854888c209b282',
            title: '否',
            remark: '机油液位下线建议处理',
            isDefaultChecked: false,
          },
        ],
      },
      {
        id: '0e1a9954546d0be77b1f67e92594111d',
        subject: '冷却液液位中线偏上？',
        requiresPhoto: true,
        options: [
          {
            id: '6bcaed561477db54721a6023b6ad8c1e',
            title: '是',
            remark: '冷却液位已达上线',
            isDefaultChecked: false,
          },
          {
            id: '11b0329fce0ae540708066f56504d26b',
            title: '否',
            remark: '',
            isDefaultChecked: false,
          },
        ],
      },
      {
        id: 'e1eafe7c8a556e21b90fc340df96a512',
        subject: '机油格、放油螺丝干净，不漏油？',
        requiresPhoto: false,
        options: [
          {
            id: '4fac8e465df8e3f33b50c88125aea7d9',
            title: '是',
            remark: '已清洁并检查',
            isDefaultChecked: false,
          },
          {
            id: '292a00a08fa08c12dd0edbeaaa86f72f',
            title: '否',
            remark: '',
            isDefaultChecked: false,
          },
        ],
      },
      {
        id: 'aa6fcd6d933611e42cb92dd056b44e5d',
        subject: '发动机舱整洁，所有拆卸部位已安装到位？',
        requiresPhoto: false,
        options: [
          {
            id: '03fc37759cb07115bd03353f76d8da18',
            title: '是',
            remark: '机舱已清洁了，部件已安装到位',
            isDefaultChecked: false,
          },
          {
            id: '657ab35cc91a9c14d84ca9a2c5417569',
            title: '否',
            remark: '',
            isDefaultChecked: false,
          },
        ],
      },
      {
        id: '9353964dfd8313971df734e915b0ffb2',
        subject: '内饰无油污、指纹？',
        requiresPhoto: false,
        options: [
          {
            id: '94edb39d14f9c42c1b0682e6c787431f',
            title: '是',
            remark: '无油污指纹',
            isDefaultChecked: false,
          },
          {
            id: '4d2ac23c84859d887ec2fca4710225ec',
            title: '否',
            remark: '',
            isDefaultChecked: false,
          },
        ],
      },
      {
        id: '5d3aced4dadcab390267dd90cad253c8',
        subject: '保养提示已复位？',
        requiresPhoto: false,
        options: [
          {
            id: 'b6bfd481466b59dd9e35eea20518660d',
            title: '是',
            remark: '保养灯已复位',
            isDefaultChecked: false,
          },
          {
            id: 'a540a6f96b3606826991ba683422d4d2',
            title: '否',
            remark: '该车不带保养提供功能',
            isDefaultChecked: false,
          },
        ],
      },
    ]);

    const [checkResult] = useState<any[]>([
      {
        title: '机油液位中线偏上？',
        resultCode: 'OK',
        resultText: '合格',
        constructionJobId: 100,
        remark: 'some remarks',
        medias: [
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202005%2F03%2F20200503193405_QavAd.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652615499&t=5b75216825e40b941228d531dd77beb8',
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2F9f%2F6b%2Fc8%2F9f6bc8cf69fc651d6f2d2af3778dee17.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652615499&t=9e87cd66e1476c685a1ec55bcf290c02',
        ],
      },
      {
        title: '冷却液液位中线偏上？',
        resultCode: 'NO',
        resultText: '不合格',
        constructionJobId: 100,
        remark: '这个问题没有解决',
        medias: [
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic_source%2F9e%2F32%2F9a%2F9e329acc0c79523b0204f6ed7ea1e45e.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652615499&t=0ef7543813e3fc31132c874338b2ee5e',
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic_source%2F30%2F90%2F40%2F309040a0602c672cebc6ab3a1bbbc8cd.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652615499&t=e3ad14ca7e1cf54010445b0ccdd67a88',
        ],
      },
    ]);

    const [checkItemsCache, setCheckItemsCache] =
      useState<DeliveryCheckItem[]>();
    const checkItems = useMemo<DeliveryCheckItem[] | undefined>(() => {
      if (!template) return;
      if (!checkResult) {
        let checkItemsCacheMap = new Map();
        if (!checkItemsCache) {
          checkItemsCacheMap = array2map(template, x => x.id);
        }
        if (checkItemsCache) {
          checkItemsCacheMap = array2map(checkItemsCache, x => x.id);
        }
        let MEDIA: string[] = [];
        return template.map<DeliveryCheckItem>(item => {
          if (
            item.id == itemId &&
            checkItemsCacheMap.get(item.id)?.medias?.length == 0
          ) {
            MEDIA = [res];
          }
          if (
            item.id != itemId &&
            checkItemsCacheMap.get(item.id)?.medias?.length == 0
          ) {
            MEDIA = [];
          }
          if (
            item.id == itemId &&
            checkItemsCacheMap.get(item.id)?.medias?.length != 0
          ) {
            MEDIA = [...(checkItemsCacheMap.get(item.id)?.medias ?? []), res];
          }
          if (
            item.id != itemId &&
            checkItemsCacheMap.get(item.id)?.medias?.length != 0
          ) {
            MEDIA = [...(checkItemsCacheMap.get(item.id)?.medias ?? [])];
          }
          return {
            subject: item.subject,
            id: item.id,
            requiresPhoto: item.requiresPhoto,
            medias: MEDIA,
            resCode: 'OK',
            resText: '是',
          };
        });
      }
      if (checkResult) {
        if (res) {
          let checkItemsCacheMap = new Map();
          if (!checkItemsCache) {
            checkItemsCacheMap = array2map(template, x => x.id);
          }
          if (checkItemsCache) {
            checkItemsCacheMap = array2map(checkItemsCache, x => x.id);
          }
          const checkResultMap = array2map(checkResult, x => x.title);
          let MEDIA: string[] = [];
          let Code = 'OK';
          let Text = '是';
          let Mark = '';
          return template.map<DeliveryCheckItem>(item => {
            if (item.subject == checkResultMap.get(item.subject)?.title) {
              Code = checkResultMap.get(item.subject)?.resultCode;
              Text = checkResultMap.get(item.subject)?.resultText;
              Mark = checkResultMap.get(item.subject)?.remark;
            }
            if (item.subject != checkResultMap.get(item.subject)?.title) {
              Code = 'OK';
              Text = '是';
              Mark = '添加备注';
            }
            if (
              item.id == itemId &&
              checkItemsCacheMap.get(item.id)?.medias?.length == 0
            ) {
              MEDIA = [res];
            }
            if (
              item.id != itemId &&
              checkItemsCacheMap.get(item.id)?.medias?.length == 0
            ) {
              MEDIA = [];
            }
            if (
              item.id == itemId &&
              checkItemsCacheMap.get(item.id)?.medias?.length != 0
            ) {
              MEDIA = [...(checkItemsCacheMap.get(item.id)?.medias ?? []), res];
            }
            if (
              item.id != itemId &&
              checkItemsCacheMap.get(item.id)?.medias?.length != 0
            ) {
              MEDIA = [...(checkItemsCacheMap.get(item.id)?.medias ?? [])];
            }
            return {
              subject: item.subject,
              id: item.id,
              requiresPhoto: item.requiresPhoto,
              medias: MEDIA,
              resCode: Code,
              resText: Text,
              resMark: Mark,
            };
          });
        }
        if (!res) {
          let checkItemsCacheMap = new Map();
          if (!checkItemsCache) {
            checkItemsCacheMap = array2map(template, x => x.id);
          }
          if (checkItemsCache) {
            checkItemsCacheMap = array2map(checkItemsCache, x => x.id);
          }
          const checkResultMap = array2map(checkResult, x => x.title);
          let MEDIA: string[] = [];
          let Code = 'OK';
          let Text = '是';
          let Mark = '';
          return template.map<DeliveryCheckItem>(item => {
            if (item.subject == checkResultMap.get(item.subject)?.title) {
              Code = checkResultMap.get(item.subject)?.resultCode;
              Text = checkResultMap.get(item.subject)?.resultText;
              Mark = checkResultMap.get(item.subject)?.remark;
            }
            if (item.subject != checkResultMap.get(item.subject)?.title) {
              Code = 'OK';
              Text = '是';
              Mark = '添加备注';
            }
            if (item.subject == checkResultMap.get(item.subject)?.title) {
              MEDIA = checkResultMap.get(item.subject).medias;
            }
            if (item.subject != checkResultMap.get(item.subject)?.title) {
              MEDIA = [...(checkItemsCacheMap.get(item.id)?.medias ?? [])];
            }
            return {
              subject: item.subject,
              id: item.id,
              requiresPhoto: item.requiresPhoto,
              medias: MEDIA,
              resCode: Code,
              resText: Text,
              resMark: Mark,
            };
          });
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemId, res, template]);
    //all computed logic.....

    useEffect(() => {
      setCheckItemsCache(checkItems);
      console.log('检测项目Cache', checkItems);
    }, [checkItems]);

    const onCacheDeliveryCheck = () => {
      setSubmitStatus(true);
    };
    const onPreviewDeliveryCheck = () => {};

    const onInputDataCallback = (value: any) => {
      const arrCache = [];
      arrCache.push(value);
      console.log('需要COMMIT的所有结果', arrCache);
    };

    return (
      <View
        css={`
          flex: 1;
        `}
      >
        <ScrollView
          css={`
            flex: 1;
          `}
        >
          {checkItems?.map((item: DeliveryCheckItem, index: number) => {
            return (
              <DeliveryInputItem
                key={index}
                itemId={item.id}
                medias={item.medias}
                subject={item.subject}
                resCode={item.resCode}
                resText={item.resText}
                resMark={item.resMark}
                setSubmitStatus={setSubmitStatus}
                submitStatus={submitStatus}
                onInputDataCallback={onInputDataCallback}
              />
            );
          })}
        </ScrollView>
        <BottomButton
          leftText={'暂存任务'}
          rightText={'预览报告'}
          onLeftPress={onCacheDeliveryCheck}
          onRightPress={onPreviewDeliveryCheck}
        />
      </View>
    );
  },
  {
    title: '交车检查',
    headerShown: true,
    titleStyle: {
      fontSize: 49,
    },
  },
);
