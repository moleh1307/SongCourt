import { Tabs } from 'expo-router';
import { History, Scale, Settings, Users } from 'lucide-react-native';
import { colors } from '../../src/constants/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          marginHorizontal: 16,
          marginBottom: 12,
          height: 70,
          borderRadius: 8,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.deepCard,
        },
        tabBarActiveTintColor: colors.neonGreen,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
      }}
    >
      <Tabs.Screen name="trial" options={{ title: 'Trial', tabBarIcon: ({ color }) => <Scale color={color} size={23} /> }} />
      <Tabs.Screen name="history" options={{ title: 'History', tabBarIcon: ({ color }) => <History color={color} size={23} /> }} />
      <Tabs.Screen name="friends" options={{ title: 'Friends', tabBarIcon: ({ color }) => <Users color={color} size={23} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <Settings color={color} size={23} /> }} />
    </Tabs>
  );
}
