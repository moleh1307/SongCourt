import * as Clipboard from 'expo-clipboard';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import type { RefObject } from 'react';
import type { View } from 'react-native';

export const shareService = {
  async copyCaption(caption: string) {
    await Clipboard.setStringAsync(caption);
  },
  async captureShareCard(ref: RefObject<View | null>) {
    if (!ref.current) {
      throw new Error('Share card is not ready.');
    }
    return captureRef(ref, {
      format: 'png',
      quality: 1,
      result: 'tmpfile',
      width: 1080,
      height: 1920,
    });
  },
  async shareImage(uri: string) {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    }
  },
  async saveImage(uri: string) {
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) {
      throw new Error('Photo library permission was not granted.');
    }
    await MediaLibrary.saveToLibraryAsync(uri);
  },
};
