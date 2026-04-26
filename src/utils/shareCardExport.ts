import type { RefObject } from 'react';
import { Image, PixelRatio, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import { getShareCardSize, type ShareTemplateId } from '../components/share-cards/ShareCardSurface';

export type ShareCardExportResult = {
  uri: string;
  width: number;
  height: number;
};

export async function captureShareCard(
  ref: RefObject<View | null>,
  template: ShareTemplateId,
): Promise<ShareCardExportResult> {
  if (!ref.current) {
    throw new Error('Share card is not ready yet.');
  }

  const size = getShareCardSize(template);
  const uri = await captureRef(ref.current, {
    format: 'png',
    height: Math.round(size.height / PixelRatio.get()),
    quality: 1,
    result: 'tmpfile',
    width: Math.round(size.width / PixelRatio.get()),
  });

  const dimensions = await readImageSize(uri);

  return {
    height: dimensions.height,
    uri,
    width: dimensions.width,
  };
}

function readImageSize(uri: string) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    Image.getSize(uri, (width, height) => resolve({ width, height }), reject);
  });
}
