/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  useColorScheme,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { Stack } from 'expo-router';

import { Pressable } from '@/components/Pressable';
import { Text } from '@/components/Text';

type RequestQrCodeResponse = {
  status: number;
  qrCodeLink?: string;
  qrcode?: string;
  deeplink?: string;
  message?: string;
};

type ApiStatusCheck = {
  message?: string;
  nfc_tag?: string;
  chip_type?: string;
  product_id?: string;
  product_name?: string;
  status?: number;
};

const api = {
  getDeepLink: async (): Promise<RequestQrCodeResponse> => {
    const response = await fetch(
      'https://causality.xyz/api/requestQrCode?key=$2y$10$W2nCYcBsxvq7LiGljf9xfuT.rLat3z.AcK9gEfvbhI.ML1VYbbgwS&token=AFv4aGPL&browser=nfcp',
      {
        method: 'POST',
      }
    );
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json() as Promise<RequestQrCodeResponse>;
  },

  checkStatus: async (code: string): Promise<ApiStatusCheck> => {
    const response = await fetch(
      `https://causality.xyz/api/apiStatusCheck?code=${code}`,
      {
        method: 'POST',
      }
    );
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json() as Promise<ApiStatusCheck>;
  },
};

export default function CleverCoffee() {
  const colorScheme = useColorScheme();

  const [pastVisits, setPastVisits] = useState([
    {
      date: 'Mar 15, 2024',
      time: '09:30 AM',
      total: 12.5,
      partOfStreak: true,
    },
    {
      date: 'Mar 13, 2024',
      time: '08:45 AM',
      total: 8.75,
      partOfStreak: true,
    },
    {
      date: 'Mar 10, 2024',
      time: '02:15 PM',
      total: 15.0,
      partOfStreak: true,
    },
    {
      date: 'Mar 8, 2024',
      time: '11:20 AM',
      total: 6.5,
      partOfStreak: false,
    },
  ]);

  const deepLinkMutation = useMutation({
    mutationFn: api.getDeepLink,
    onError: (error) => {
      Alert.alert(t`Error`, t`Failed to get QR code. Please try again.`);
      console.error('Deep link error:', error);
    },
  });

  const statusCheckMutation = useMutation({
    mutationFn: api.checkStatus,
    onSuccess: (data) => {
      if (data.status === 200) {
        const now = new Date();
        setPastVisits((prev) => [
          {
            date: now.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            time: now.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            }),
            total: 10.0,
            partOfStreak: true,
          },
          ...prev,
        ]);
      }
    },
    onError: (error) => {
      Alert.alert(t`Error`, t`Failed to check status. Please try again.`);
      console.error('Status check error:', error);
    },
  });

  // Update the Scan Button press handler
  const handleScan = async () => {
    try {
      const data = await deepLinkMutation.mutateAsync();
      if (data?.deeplink) {
        await Linking.openURL(data.deeplink);
        Alert.alert(t`Did you scan the NFC tag?`, '', [
          {
            text: t`Yes`,
            onPress: () => {
              if (data?.qrcode) {
                statusCheckMutation.mutate(data.qrcode);
              }
            },
          },
          {
            text: t`No`,
            style: 'cancel',
          },
        ]);
      }
    } catch (error) {
      console.error('Scan process failed:', error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerLargeTitle: true,
          title: t`Clever Coffee`,
          headerLargeStyle: { backgroundColor: 'transparent' },
          headerTransparent: Platform.OS === 'ios',
          headerBlurEffect: 'systemMaterial',
        }}
      />
      <ScrollView
        automaticallyAdjustContentInsets
        contentInsetAdjustmentBehavior='automatic'
        className='flex-1 bg-coffee-50 dark:bg-coffee-700'>
        <View className='mx-4 mt-6 overflow-hidden rounded-3xl bg-white dark:bg-coffee-600'>
          <LinearGradient
            colors={
              colorScheme === 'dark'
                ? ['#4F3422', '#2C1810']
                : ['#F5E6D3', '#FFFFFF']
            }
            className='p-6'
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <Text className='mb-2 px-4 pt-4 text-lg font-medium text-coffee-400 dark:text-coffee-200'>
              <Trans>Progress to Free Coffee</Trans>
            </Text>
            <View className='mb-6 flex-row items-center justify-between px-4'>
              <Text className='text-3xl font-bold text-coffee-600 dark:text-white'>
                {pastVisits.length}/5
              </Text>
              {pastVisits.length === 5 && (
                <View className='rounded-full bg-green-500/20 px-4 py-2'>
                  <Text className='font-medium text-green-500'>
                    <Trans>Ready to Redeem!</Trans>
                  </Text>
                </View>
              )}
            </View>

            <View className='flex-row justify-between gap-x-2 px-4 pb-4'>
              {[1, 2, 3, 4, 5].map((index) => (
                <View
                  key={index}
                  className={`h-3 flex-1 rounded-full ${
                    index <= pastVisits.length
                      ? 'bg-amber-500'
                      : 'bg-coffee-100 dark:bg-coffee-500'
                  } ${pastVisits.length === 5 ? 'bg-green-500' : ''}`}
                />
              ))}
            </View>
          </LinearGradient>
        </View>

        <View className='mt-8 px-4'>
          <Text className='mb-4 text-xl font-bold text-coffee-600 dark:text-white'>
            <Trans>Past Visits</Trans>
          </Text>
          <View className='gap-y-3'>
            {pastVisits.map((visit, index) => (
              <View
                key={index}
                className='flex-row items-center justify-between rounded-2xl bg-white p-4 dark:bg-coffee-600'>
                <View className='flex-1'>
                  <View className='flex-row items-center justify-between'>
                    <Text className='font-medium text-coffee-600 dark:text-white'>
                      ${visit.total.toFixed(2)}
                    </Text>
                    <Ionicons
                      name={visit.partOfStreak ? 'cafe' : 'cafe-outline'}
                      size={24}
                      color={
                        visit.partOfStreak
                          ? '#d97706'
                          : colorScheme === 'dark'
                            ? '#A87B51'
                            : '#795438'
                      }
                    />
                  </View>
                  <View className='mt-1 flex-row items-center gap-x-2'>
                    <Text className='text-coffee-400 dark:text-coffee-200'>
                      {visit.date}
                    </Text>
                    <Text className='text-coffee-300'>•</Text>
                    <Text className='text-coffee-400 dark:text-coffee-200'>
                      {visit.time}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <Pressable
          className='mx-4 mt-8 overflow-hidden rounded-2xl'
          onPress={handleScan}
          disabled={
            deepLinkMutation.isPending || statusCheckMutation.isPending
          }>
          <LinearGradient
            colors={['#d97706', '#92400e']}
            className='items-center justify-center p-4'
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <View className='flex-row items-center gap-x-2 px-4 py-2'>
              {deepLinkMutation.isPending || statusCheckMutation.isPending ? (
                <ActivityIndicator color='white' />
              ) : (
                <>
                  <Ionicons name='scan-outline' size={24} color='white' />
                  <Text className='text-lg font-bold text-white'>
                    <Trans>Scan Loyalty Tag</Trans>
                  </Text>
                </>
              )}
            </View>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </>
  );
}
