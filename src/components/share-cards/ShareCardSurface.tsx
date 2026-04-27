import { forwardRef } from 'react';
import { View } from 'react-native';

import { cardSizes } from '../../design/tokens';
import { CourtReceiptCard } from './CourtReceiptCard';
import { MusicDnaCard } from './MusicDnaCard';
import { ShareCardPayload } from './types';
import { TagAFriendCard } from './TagAFriendCard';
import { VerdictPosterCard } from './VerdictPosterCard';

export type ShareTemplateId = 'poster' | 'receipt' | 'dna' | 'challenge';

type ShareCardSurfaceProps = {
  payload: ShareCardPayload;
  template: ShareTemplateId;
};

export function getShareCardSize(template: ShareTemplateId) {
  return template === 'receipt' ? cardSizes.feedPortrait : cardSizes.story;
}

export const ShareCardSurface = forwardRef<View, ShareCardSurfaceProps>(
  ({ payload, template }, ref) => {
    return (
      <View collapsable={false} ref={ref}>
        {template === 'poster' ? <VerdictPosterCard payload={payload} /> : null}
        {template === 'receipt' ? <CourtReceiptCard payload={payload} /> : null}
        {template === 'dna' ? <MusicDnaCard payload={payload} /> : null}
        {template === 'challenge' ? <TagAFriendCard payload={payload} /> : null}
      </View>
    );
  },
);

ShareCardSurface.displayName = 'ShareCardSurface';
