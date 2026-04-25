import { Alert, StyleSheet, Text, View } from 'react-native';
import { Cable, Users } from 'lucide-react-native';
import { CourtCard } from '../../src/components/common/CourtCard';
import { NeonButton } from '../../src/components/common/NeonButton';
import { Screen } from '../../src/components/common/Screen';
import { SectionHeader } from '../../src/components/common/SectionHeader';
import { colors } from '../../src/constants/colors';

export default function FriendsTab() {
  return (
    <Screen>
      <SectionHeader eyebrow="AUX COMPATIBILITY COURT" title="Can your taste survive a car ride?" />
      <CourtCard accent={colors.electricPurple}>
        <View style={styles.visual}>
          <Users color={colors.hotPink} size={56} />
          <Cable color={colors.neonGreen} size={42} />
        </View>
        <Text style={styles.empty}>No co-defendants yet.</Text>
        <Text style={styles.muted}>Send an invite and test your aux chemistry.</Text>
        <NeonButton
          onPress={() => Alert.alert('Invites are next.', 'No co-defendants yet. The court is preparing friend compatibility.')}
          variant="purple"
        >
          Invite a Friend
        </NeonButton>
      </CourtCard>
      <CourtCard accent={colors.warningYellow}>
        <Text style={styles.score}>34%</Text>
        <Text style={styles.title}>Short Ride Only</Text>
        <Text style={styles.muted}>You can survive a 12-minute Uber, but not a road trip.</Text>
      </CourtCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  visual: { alignItems: 'center', gap: 10, marginVertical: 18 },
  empty: { color: colors.text, fontSize: 24, fontWeight: '900' },
  muted: { color: colors.muted, fontSize: 15, fontWeight: '700', marginVertical: 8 },
  score: { color: colors.neonGreen, fontSize: 74, fontWeight: '900' },
  title: { color: colors.text, fontSize: 22, fontWeight: '900', textTransform: 'uppercase' },
});
