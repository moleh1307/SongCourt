import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import type { Evidence } from '../../types/verdict';

const paperTexture = require('../../../assets/generated/court-paper-texture.png');

export function EvidenceCard({ evidence }: { evidence: Evidence }) {
  return (
    <View style={styles.card}>
      <ImageBackground source={paperTexture} resizeMode="cover" style={styles.paper}>
        <View style={styles.overlay}>
          <Text style={styles.label}>{evidence.label}</Text>
          <Text style={styles.text}>{evidence.text}</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.courtPaper, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: colors.dangerRed },
  paper: { width: '100%' },
  overlay: { padding: 16, gap: 8, backgroundColor: 'rgba(255, 244, 214, 0.66)' },
  label: { color: colors.dangerRed, fontSize: 12, fontWeight: '900' },
  text: { color: colors.black, fontSize: 16, fontWeight: '700' },
});
