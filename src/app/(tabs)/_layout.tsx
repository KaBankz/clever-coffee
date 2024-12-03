import { Platform } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLingui } from '@lingui/react/macro';
import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';

export default function TabLayout() {
  const { t } = useLingui();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name='index'
        options={{
          title: t`Read`,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='cube-scan' size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='write'
        options={{
          title: t`Edit`,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='file-edit' size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
