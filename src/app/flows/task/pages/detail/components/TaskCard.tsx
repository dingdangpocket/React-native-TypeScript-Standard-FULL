import { Card } from '@euler/components/Card';
import styled from 'styled-components/native';

export const TaskCard = styled(Card).attrs(p => ({
  ...p,
  headerStyle: {
    paddingTop: 12,
    paddingBottom: 11,
    minHeight: 20,
  },
}))`
  margin-bottom: 15px;
`;
