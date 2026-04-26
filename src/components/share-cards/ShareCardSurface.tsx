import { forwardRef } from 'react';
import { View } from 'react-native';

import { cardSizes } from '../../design/tokens';
import { CourtReceiptCard } from './CourtReceiptCard';
import { ShareCardPayload } from './types';
import { VerdictPosterCard } from './VerdictPosterCard';

export type ShareTemplateId = 'poster' | 'receipt';

type ShareCardSurfaceProps = {
  payload: ShareCardPayload;
  template: ShareTemplateId;
};

export function getShareCardSize(template: ShareTemplateId) {
  return template === 'poster' ? cardSizes.story : cardSizes.feedPortrait;
}

export const ShareCardSurface = forwardRef<View, ShareCardSurfaceProps>(
  ({ payload, template }, ref) => {
    return (
      <View collapsable={false} ref={ref}>
        {template === 'poster' ? (
          <VerdictPosterCard payload={payload} />
        ) : (
          <CourtReceiptCard payload={payload} />
        )}
      </View>
    );
  },
);

ShareCardSurface.displayName = 'ShareCardSurface';
