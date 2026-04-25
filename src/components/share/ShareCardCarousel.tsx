import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { RefObject } from 'react';
import type { View as RNView } from 'react-native';
import { colors } from '../../constants/colors';
import type { ShareCardStyle, Verdict } from '../../types/verdict';
import { ShareCardPreview } from './ShareCardPreview';

const stylesList: ShareCardStyle[] = ['neon', 'receipt', 'mugshot', 'minimal'];

export function ShareCardCarousel({
  verdict,
  activeStyle,
  cardRef,
}: {
  verdict: Verdict;
  activeStyle: ShareCardStyle;
  cardRef: RefObject<RNView | null>;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {stylesList.map((styleName) => (
        <View key={styleName} style={styles.item}>
          <ShareCardPreview ref={styleName === activeStyle ? cardRef : undefined} verdict={verdict} styleName={styleName} defendant="Melih" />
          <Text style={styles.label}>{styleName.replace('-', ' ')}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 14, paddingRight: 20 },
  item: { gap: 10 },
  label: { color: colors.muted, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', textAlign: 'center' },
});
