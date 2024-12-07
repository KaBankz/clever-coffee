/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Alert, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Trans } from '@lingui/react/macro';
import * as Linking from 'expo-linking';

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

export default function CausePage() {
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
      console.log(data);

      return data;
      // Handle the response data as needed
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
    <View className='flex-1'>
      <Pressable
        className='items-center justify-center bg-red-400 p-6'
        onPress={async () => {
          console.log('Pressed Button');
          const data = await getDeepLink();
          await Linking.openURL(data.deeplink);
          Alert.alert('Did you scan the NFC tag?', '', [
            {
              text: 'Yes',
              onPress: async () => {
                console.log('Yes Pressed');
                await checkStatus(data?.qrcode);
              },
            },
            {
              text: 'No',
              onPress: () => console.log('No Pressed'),
              style: 'cancel',
            },
          ]);
        }}>
        <Text className='text-2xl font-bold'>
          <Trans>Scan Loyalty Tag</Trans>
        </Text>
      </Pressable>

      <View className='m-6 flex-row items-center justify-center gap-4 rounded-lg bg-neutral-800 p-6'>
        <View>
          <Text>Mon</Text>
          <Ionicons name='star' size={25} color='white' />
        </View>
        <View>
          <Text>Tue</Text>
          <Ionicons name='star-outline' size={25} color='white' />
        </View>
        <View>
          <Text>Wed</Text>
          <Ionicons name='star-outline' size={25} color='white' />
        </View>
        <View>
          <Text>Thu</Text>
          <Ionicons name='star-outline' size={25} color='white' />
        </View>
        <View>
          <Text>Fri</Text>
          <Ionicons name='star-outline' size={25} color='white' />
        </View>
        <View>
          <Text>Sat</Text>
          <Ionicons name='star-outline' size={25} color='white' />
        </View>
        <View>
          <Text>Sun</Text>
          <Ionicons name='star-outline' size={25} color='white' />
        </View>
      </View>

      <View>
        <Text className='px-4 text-xl font-bold'>Past Visits</Text>

        <View className='gap-2 px-4'>
          <View className='rounded-lg bg-neutral-700 p-4'>
            <Text>Mon, Dec 2, 2024</Text>
          </View>
          <View className='rounded-lg bg-neutral-700 p-4'>
            <Text>Mon, Dec 2, 2024</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
