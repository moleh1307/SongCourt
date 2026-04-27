import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '../components/BrandMark';
import { colors, spacing } from '../design/tokens';
import { SongCourtUser } from '../types/songcourt';

type TrialHomeScreenProps = {
  authMessage?: string;
  canRunSpotifyTrial: boolean;
  isConnecting: boolean;
  onConnectSpotify: () => void;
  onRunDemoTrial: () => void;
  onRunSpotifyTrial: () => void;
  user?: SongCourtUser | null;
};

export function TrialHomeScreen({
  authMessage,
  canRunSpotifyTrial,
  isConnecting,
  onConnectSpotify,
  onRunDemoTrial,
  onRunSpotifyTrial,
  user,
}: TrialHomeScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <BrandMark size="small" />
          <View style={styles.livePill}>
            <Text style={styles.livePillText}>Daily Trial</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.kicker}>Music on trial</Text>
          <Text style={styles.title}>Turn your Spotify history into evidence.</Text>
          <Text style={styles.copy}>
            SongCourt scans replay behavior, artist loyalty, mood swings, genre jumps, and late-night listens.
          </Text>
        </View>

        <View style={styles.connectPanel}>
          <View style={styles.panelHeader}>
            <View>
              <Text style={styles.panelTitle}>Spotify Case File</Text>
              <Text style={styles.panelSubtitle}>
                {user ? `Connected as ${user.displayName}` : 'Connect for a real verdict, or run the demo case.'}
              </Text>
            </View>
            <View style={[styles.statusDot, user && styles.statusDotConnected]} />
          </View>

          {authMessage ? <Text style={styles.authMessage}>{authMessage}</Text> : null}

          <View style={styles.buttonStack}>
            {canRunSpotifyTrial ? (
              <Pressable accessibilityRole="button" onPress={onRunSpotifyTrial} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Run Spotify Trial</Text>
              </Pressable>
            ) : (
              <Pressable
                accessibilityRole="button"
                disabled={isConnecting}
                onPress={onConnectSpotify}
                style={[styles.primaryButton, isConnecting && styles.buttonDisabled]}
              >
                <Text style={styles.primaryButtonText}>
                  {isConnecting ? 'Waiting for Spotify' : 'Connect Spotify'}
                </Text>
              </Pressable>
            )}

            <Pressable accessibilityRole="button" onPress={onRunDemoTrial} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Try Demo Case</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.todayPanel}>
          <View style={styles.dial}>
            <Text style={styles.dialLabel}>Today</Text>
            <Text style={styles.dialValue}>01</Text>
            <Text style={styles.dialMeta}>case ready</Text>
          </View>
          <View style={styles.todayCopy}>
            <Text style={styles.todayTitle}>Your daily verdict is waiting.</Text>
            <Text style={styles.todayText}>
              One scan. One verdict. One share card built for Stories and group chats.
            </Text>
          </View>
        </View>

        <View style={styles.statRow}>
          <MiniStat label="Replay" value="Crime" />
          <MiniStat label="Mood" value="Swing" />
          <MiniStat label="Night" value="Court" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.miniStat}>
      <Text style={styles.miniStatLabel}>{label}</Text>
      <Text style={styles.miniStatValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.warmIvory,
    flex: 1,
  },
  content: {
    paddingBottom: 56,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  livePill: {
    backgroundColor: colors.ink,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  livePillText: {
    color: colors.warmIvory,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  kicker: {
    color: colors.courtRed,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.8,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink,
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 46,
  },
  copy: {
    color: colors.mutedInk,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
    marginTop: spacing.sm,
  },
  connectPanel: {
    backgroundColor: colors.receiptWhite,
    borderColor: '#D8CCB8',
    borderRadius: 24,
    borderWidth: 1,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    padding: spacing.md,
  },
  panelHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  panelTitle: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900',
  },
  panelSubtitle: {
    color: colors.mutedInk,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 5,
    maxWidth: 258,
  },
  statusDot: {
    backgroundColor: colors.paperTan,
    borderRadius: 9,
    height: 18,
    marginTop: 6,
    width: 18,
  },
  statusDotConnected: {
    backgroundColor: colors.lime,
  },
  authMessage: {
    color: colors.courtRed,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 17,
    marginTop: spacing.sm,
  },
  buttonStack: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.courtRed,
    borderRadius: 18,
    paddingVertical: 17,
  },
  buttonDisabled: {
    opacity: 0.64,
  },
  primaryButtonText: {
    color: colors.receiptWhite,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: colors.ink,
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 15,
  },
  secondaryButtonText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  todayPanel: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: 24,
    flexDirection: 'row',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  dial: {
    alignItems: 'center',
    backgroundColor: colors.lime,
    borderRadius: 60,
    height: 120,
    justifyContent: 'center',
    width: 120,
  },
  dialLabel: {
    color: colors.ink,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dialValue: {
    color: colors.ink,
    fontSize: 40,
    fontWeight: '900',
    lineHeight: 44,
  },
  dialMeta: {
    color: colors.ink,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  todayCopy: {
    flex: 1,
  },
  todayTitle: {
    color: colors.warmIvory,
    fontSize: 21,
    fontWeight: '900',
    lineHeight: 25,
  },
  todayText: {
    color: colors.paperTan,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 8,
  },
  statRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  miniStat: {
    backgroundColor: colors.receiptWhite,
    borderColor: '#D8CCB8',
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    padding: spacing.sm,
  },
  miniStatLabel: {
    color: colors.mutedInk,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  miniStatValue: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 6,
  },
});
