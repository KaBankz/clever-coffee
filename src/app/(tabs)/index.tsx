/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Alert, ScrollView, useColorScheme, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Trans } from '@lingui/react/macro';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';

import { Pressable } from '@/components/Pressable';
import { Text } from '@/components/Text';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground.ios';

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

export default function CausePage() {
  const colorScheme = useColorScheme();
  const paddingBottom = useBottomTabOverflow();

  const pastVisits = [
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
  ];

  async function getDeepLink() {
    try {
      const response = await fetch(
        'https://causality.xyz/api/requestQrCode?key=$2y$10$W2nCYcBsxvq7LiGljf9xfuT.rLat3z.AcK9gEfvbhI.ML1VYbbgwS&token=AFv4aGPL&browser=nfcp',
        {
          method: 'POST',
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = (await response.json()) as RequestQrCodeResponse;
      return data;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  async function checkStatus(code: string) {
    try {
      const response = await fetch(
        `https://causality.xyz/api/apiStatusCheck?code=${code}`,
        {
          method: 'POST',
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = (await response.json()) as ApiStatusCheck;
      console.log(data);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  return (
    <ScrollView
      className='flex-1 bg-coffee-50 dark:bg-coffee-700'
      contentInsetAdjustmentBehavior='automatic'
      contentInset={{ bottom: paddingBottom }}
      scrollIndicatorInsets={{ bottom: paddingBottom }}>
      {/* Progress Card */}
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
            Progress to Free Coffee
          </Text>
          <View className='mb-6 flex-row items-center justify-between'>
            <Text className='px-4 text-3xl font-bold text-coffee-600 dark:text-white'>
              {pastVisits.length}/5
            </Text>
            {pastVisits.length === 5 && (
              <View className='rounded-full bg-green-500/20 px-4 py-2'>
                <Text className='font-medium text-green-500'>
                  Ready to Redeem!
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
                }`}
              />
            ))}
          </View>
        </LinearGradient>
      </View>

      {/* Past Visits */}
      <View className='mt-8 px-4'>
        <Text className='mb-4 text-xl font-bold text-coffee-600 dark:text-white'>
          Past Visits
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

      {/* Scan Button */}
      <Pressable
        className='mx-4 mt-8 overflow-hidden rounded-2xl'
        onPress={async () => {
          const data = await getDeepLink();
          await Linking.openURL(data.deeplink);
          Alert.alert('Did you scan the NFC tag?', '', [
            {
              text: 'Yes',
              onPress: async () => {
                await checkStatus(data?.qrcode);
              },
            },
            {
              text: 'No',
              style: 'cancel',
            },
          ]);
        }}>
        <LinearGradient
          colors={['#d97706', '#92400e']}
          className='items-center justify-center p-4'
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <View className='flex-row items-center gap-x-2 px-4 py-2'>
            <Ionicons name='scan-outline' size={24} color='white' />
            <Text className='text-lg font-bold text-white'>
              <Trans>Scan Loyalty Tag</Trans>
            </Text>
          </View>
        </LinearGradient>
      </Pressable>

      <View className='h-20' />
    </ScrollView>
  );
}
