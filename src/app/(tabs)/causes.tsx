/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Alert } from 'react-native';

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
        <Trans>Click me</Trans>
      </Text>
    </Pressable>
  );
}
