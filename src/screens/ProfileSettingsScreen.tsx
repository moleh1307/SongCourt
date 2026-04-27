import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '../components/BrandMark';
import { colors, fonts, spacing } from '../design/tokens';
import { SongCourtUser } from '../types/songcourt';

type ProfileSettingsScreenProps = {
  historyCount: number;
  isSpotifyConnected: boolean;
  onBack: () => void;
  onClearHistory: () => void;
  onDisconnectSpotify: () => void;
  onOpenArchive: () => void;
  onToggleWatermark: (enabled: boolean) => void;
  user?: SongCourtUser | null;
  watermarkEnabled: boolean;
};

export function ProfileSettingsScreen({
  historyCount,
  isSpotifyConnected,
  onBack,
  onClearHistory,
  onDisconnectSpotify,
  onOpenArchive,
  onToggleWatermark,
  user,
  watermarkEnabled,
}: ProfileSettingsScreenProps) {
  function confirmClearHistory() {
    if (historyCount === 0) return;

    Alert.alert(
      'Clear case archive?',
      'This removes saved verdicts from this device. It does not affect Spotify.',
      [
        { style: 'cancel', text: 'Cancel' },
        { onPress: onClearHistory, style: 'destructive', text: 'Clear Archive' },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <BrandMark size="small" />
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>Trial</Text>
          </Pressable>
        </View>

        <View style={styles.hero}>
          <Text style={styles.kicker}>Profile</Text>
          <Text style={styles.title}>Control the case file.</Text>
          <Text style={styles.copy}>
            Keep the app clean: connection, sharing, and local archive controls in one place.
          </Text>
        </View>

        <View style={styles.accountPanel}>
          <View style={styles.panelHeader}>
            <View style={styles.panelTitleBlock}>
              <Text style={styles.panelTitle}>Spotify Connection</Text>
              <Text style={styles.panelSubtitle}>
                {isSpotifyConnected && user
                  ? `Connected as ${user.displayName}`
                  : 'Not connected. Demo cases still work.'}
              </Text>
            </View>
            <View style={[styles.statusDot, isSpotifyConnected && styles.statusDotConnected]} />
          </View>

          <Pressable
            accessibilityRole="button"
            disabled={!isSpotifyConnected}
            onPress={onDisconnectSpotify}
            style={[styles.disconnectButton, !isSpotifyConnected && styles.disabledButton]}
          >
            <Text style={styles.disconnectButtonText}>
              {isSpotifyConnected ? 'Disconnect Spotify' : 'Spotify Not Connected'}
            </Text>
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="switch"
          accessibilityState={{ checked: watermarkEnabled }}
          onPress={() => onToggleWatermark(!watermarkEnabled)}
          style={styles.settingsPanel}
        >
          <View style={styles.settingRow}>
            <View style={styles.settingCopy}>
              <Text style={styles.settingTitle}>Share Watermark</Text>
              <Text style={styles.settingText}>
                {watermarkEnabled
                  ? 'Share cards include the SongCourt mark.'
                  : 'Share cards use case details instead of the SongCourt mark.'}
              </Text>
            </View>
            <View style={[styles.toggleTrack, watermarkEnabled && styles.toggleTrackActive]}>
              <View style={styles.toggleKnob} />
            </View>
          </View>
        </Pressable>

        <View style={styles.dataPanel}>
          <Text style={styles.panelTitle}>Local Data</Text>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Saved verdicts</Text>
            <Text style={styles.dataValue}>{historyCount}</Text>
          </View>

          <View style={styles.dataActions}>
            <Pressable accessibilityRole="button" onPress={onOpenArchive} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Open Archive</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={historyCount === 0}
              onPress={confirmClearHistory}
              style={[styles.clearButton, historyCount === 0 && styles.disabledButton]}
            >
              <Text style={styles.clearButtonText}>Clear Archive</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.warmIvory,
    flex: 1,
  },
  content: {
    paddingBottom: 44,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
  },
  backButton: {
    borderColor: colors.hairline,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButtonText: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '800',
  },
  hero: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  kicker: {
    color: colors.courtRed,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 35,
    maxWidth: 340,
  },
  copy: {
    color: colors.mutedInk,
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginTop: 10,
    maxWidth: 345,
  },
  accountPanel: {
    backgroundColor: colors.receiptWhite,
    borderColor: colors.hairline,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    padding: 18,
  },
  panelHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  panelTitleBlock: {
    flex: 1,
  },
  panelTitle: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 20,
    fontWeight: '900',
  },
  panelSubtitle: {
    color: colors.mutedInk,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 5,
  },
  statusDot: {
    backgroundColor: colors.paperTan,
    borderRadius: 7,
    height: 14,
    marginTop: 5,
    width: 14,
  },
  statusDotConnected: {
    backgroundColor: '#38C768',
  },
  disconnectButton: {
    alignItems: 'center',
    borderColor: colors.ink,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: spacing.sm,
    paddingVertical: 13,
  },
  disconnectButtonText: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: '900',
  },
  disabledButton: {
    opacity: 0.45,
  },
  settingsPanel: {
    backgroundColor: colors.ink,
    borderRadius: 8,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    padding: 18,
  },
  settingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  settingCopy: {
    flex: 1,
  },
  settingTitle: {
    color: colors.warmIvory,
    fontFamily: fonts.body,
    fontSize: 19,
    fontWeight: '900',
  },
  settingText: {
    color: colors.paperTan,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 5,
  },
  toggleTrack: {
    alignItems: 'flex-start',
    backgroundColor: colors.paperTan,
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    padding: 3,
    width: 58,
  },
  toggleTrackActive: {
    alignItems: 'flex-end',
    backgroundColor: colors.courtRed,
  },
  toggleKnob: {
    backgroundColor: colors.receiptWhite,
    borderRadius: 13,
    height: 26,
    width: 26,
  },
  dataPanel: {
    backgroundColor: colors.receiptWhite,
    borderColor: colors.hairline,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    padding: 18,
  },
  dataRow: {
    alignItems: 'center',
    borderColor: colors.hairline,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
  },
  dataLabel: {
    color: colors.mutedInk,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: '800',
  },
  dataValue: {
    color: colors.ink,
    fontFamily: fonts.mono,
    fontSize: 28,
    fontWeight: '900',
  },
  dataActions: {
    gap: 10,
    marginTop: spacing.sm,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.courtRed,
    borderRadius: 8,
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: colors.receiptWhite,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: '900',
  },
  clearButton: {
    alignItems: 'center',
    borderColor: colors.courtRed,
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 13,
  },
  clearButtonText: {
    color: colors.courtRed,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: '900',
  },
});
