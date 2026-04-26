import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

type ScaledCardPreviewProps = {
  width: number;
  height: number;
  maxWidth: number;
  children: ReactNode;
};

export function ScaledCardPreview({ width, height, maxWidth, children }: ScaledCardPreviewProps) {
  const scale = Math.min(maxWidth / width, 0.36);

  return (
    <View
      style={[
        styles.stage,
        {
          width: width * scale,
          height: height * scale,
        },
      ]}
    >
      <View
        style={{
          width,
          height,
          marginLeft: -(width * (1 - scale)) / 2,
          marginTop: -(height * (1 - scale)) / 2,
          transform: [{ scale }],
        }}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignSelf: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 22 },
    shadowOpacity: 0.18,
    shadowRadius: 30,
  },
});
