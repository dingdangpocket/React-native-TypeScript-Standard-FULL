import { LayoutProviderView } from '@euler/app/components/layout/LayoutProvider';
import { StatusColors } from '@euler/components';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { uniq } from 'ramda';
import { memo, ReactNode } from 'react';
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import { TagButton } from './TagButton';

// -webkit-gradient(linear, left top, left 20%, from(rgba(0,0,0,0)), to(rgba(0,0,0,1)))
const Mask = memo(
  (props: { style?: StyleProp<ViewStyle>; children: ReactNode }) => {
    return (
      <MaskedView
        style={props.style}
        maskElement={
          <LinearGradient
            colors={['black', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            locations={[0.8, 1]}
            css={`
              flex: 1;
            `}
          />
        }
      >
        {props.children}
      </MaskedView>
    );
  },
);

export const TagButtonBar = memo(
  ({
    tags,
    style,
    activeTag,
    onTagPress,
    onAddTag,
  }: {
    tags: string[];
    activeTag?: string;
    style?: StyleProp<ViewStyle>;
    onTagPress: (name: string) => void;
    onAddTag?: () => void;
  }) => {
    return (
      <LayoutProviderView style={style}>
        <View
          css={`
            flex: 1;
            flex-direction: row;
            align-items: center;
            padding-left: 15px;
          `}
        >
          <Mask
            css={`
              flex: 1;
              flex-direction: row;
            `}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 24 }}
              css={`
                flex: 1;
              `}
            >
              {uniq(tags).map(tag => (
                <TagButton
                  key={tag}
                  name={tag}
                  active={activeTag === tag}
                  css={`
                    margin-top: 15px;
                    margin-bottom: 15px;
                  `}
                  onPress={onTagPress}
                  icon={
                    <FontAwesome5 name="hashtag" size={24} color="orange" />
                  }
                />
              ))}
            </ScrollView>
          </Mask>
          <TagButton
            name="添加"
            icon={
              <Ionicons
                name="add-circle-outline"
                size={26}
                color={StatusColors.Info}
              />
            }
            onPress={onAddTag}
          />
        </View>
      </LayoutProviderView>
    );
  },
);
