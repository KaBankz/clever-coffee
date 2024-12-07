/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Alert, ScrollView, View } from 'react-native';

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
  const paddingBottom = useBottomTabOverflow();

  // Hardcoded data for now
  const currentStreak = 3; // Out of 5 purchases
  const pastPurchases = [
    { date: 'Mar 15, 2024', drink: 'Cappuccino' },
    { date: 'Mar 13, 2024', drink: 'Latte' },
    { date: 'Mar 10, 2024', drink: 'Espresso' },
    { date: 'Mar 8, 2024', drink: 'Americano' },
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
      className='flex-1 bg-neutral-900'
      contentInsetAdjustmentBehavior='automatic'
      contentInset={{ bottom: paddingBottom }}
      scrollIndicatorInsets={{ bottom: paddingBottom }}>
      {/* Progress Card */}
      <View className='mx-4 mt-6 overflow-hidden rounded-3xl bg-neutral-800'>
        <LinearGradient
          colors={['#4F3422', '#2C1810']}
          className='p-6'
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <Text className='mb-2 px-4 pt-4 text-lg font-medium text-neutral-400'>
            Progress to Free Coffee
          </Text>
          <View className='mb-6 flex-row items-center justify-between px-4 py-2'>
            <Text className='text-3xl font-bold text-white'>
              {currentStreak}/5
            </Text>
            {currentStreak === 5 && (
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
                  index <= currentStreak ? 'bg-amber-500' : 'bg-neutral-700'
                }`}
              />
            ))}
          </View>
        </LinearGradient>
      </View>

      {/* Past Purchases */}
      <View className='mt-8 px-4'>
        <Text className='mb-4 text-xl font-bold text-white'>
          Past Purchases
        </Text>
        <View className='gap-y-3'>
          {pastPurchases.map((purchase, index) => (
            <View
              key={index}
              className='flex-row items-center justify-between rounded-2xl bg-neutral-800 p-4'>
              <View>
                <Text className='font-medium text-white'>{purchase.drink}</Text>
                <Text className='text-sm text-neutral-400'>
                  {purchase.date}
                </Text>
              </View>
              <Ionicons name='cafe' size={24} color='#d97706' />
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
