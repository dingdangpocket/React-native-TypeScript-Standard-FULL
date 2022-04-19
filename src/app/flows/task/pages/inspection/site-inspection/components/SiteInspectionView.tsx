import { memo } from 'react';
import { CheckItemInfo } from '../functions/SiteInspection';
import {
  ItemInspectionCallbackProps,
  ItemInspectionView,
} from './ItemInspectionView';

type Props = {
  items: CheckItemInfo[];
} & ItemInspectionCallbackProps;

export const SiteInspectionView = memo(({ items, ...callbackProps }: Props) => {
  return (
    <>
      {items.map((item, index) => (
        <ItemInspectionView
          key={item.key}
          itemNo={index + 1}
          item={item}
          {...callbackProps}
          css={`
            margin-top: ${index === 0 ? 15 : 0}px;
            margin-left: 15px;
            margin-right: 15px;
            margin-bottom: 15px;
            border-radius: 5px;
          `}
        />
      ))}
    </>
  );
});
