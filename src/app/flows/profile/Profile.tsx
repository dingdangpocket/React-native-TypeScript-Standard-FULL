import Cell from '@euler/app/components/Cell';
import { GenderIcon } from '@euler/app/flows/profile/icons/GenderIcon';
import { JobIcon } from '@euler/app/flows/profile/icons/JobIcon';
import { RealNameIcon } from '@euler/app/flows/profile/icons/RealNameIcon';
import { UserIcon } from '@euler/app/flows/profile/icons/UserIcon';
import { wrapNavigatorScreen } from '@euler/functions';
import { UserInfo } from '@euler/model';
import { useState } from 'react';
import { ScrollView } from 'react-native';

export const ProfileScreen = wrapNavigatorScreen(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (props: any) => {
    const [userInfo] = useState<UserInfo>({
      userId: 10,
      uid: '19832231',
      memberId: 2,
      orgId: 3,
      storeId: 10,
      userName: '张海',
      role: '车间主管',
      isMobileVerified: true,
      name: '李春',
      jobTitle: '车间主管',
      enabled: true,
      createdAt: 'manager',
      isDefaultPassword: true,
      gender: 1,
    });

    return (
      <ScrollView
        css={`
          flex: 1;
          background: rgb(220, 220, 220);
        `}
      >
        <Cell title={'个人信息'} value={'张三'} leftIcon={UserIcon} />
        <Cell
          title={'真实姓名'}
          value={userInfo.name}
          leftIcon={RealNameIcon}
        />
        <Cell
          title={'性别'}
          value={
            userInfo.gender == 1 ? '男' : userInfo.gender == 0 ? '女' : '未知'
          }
          leftIcon={GenderIcon}
        />
        <Cell title={'职务'} value={userInfo.jobTitle} leftIcon={JobIcon} />
      </ScrollView>
    );
  },
  {
    title: '个人信息',
  },
);
