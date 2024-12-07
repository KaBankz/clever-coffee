import { Text, View } from 'react-native';

import { Trans } from '@lingui/react/macro';
import { Link } from 'expo-router';

import { Pressable } from '@/components/Pressable';

export default function Home() {
  return (
    <View className='flex-1 items-center justify-center gap-4 bg-coffee-50 dark:bg-coffee-700'>
      <Link href='/store?store=nyc' asChild>
        <Pressable className='rounded-lg bg-coffee-200 p-4 dark:bg-coffee-300'>
          <Text className='text-3xl font-bold text-coffee-500 dark:text-coffee-100'>
            <Trans>Clever Coffee NYC</Trans>
          </Text>
        </Pressable>
      </Link>
      <Link href='/store?store=sf' asChild>
        <Pressable className='rounded-lg bg-coffee-200 p-4 dark:bg-coffee-300'>
          <Text className='text-3xl font-bold text-coffee-500 dark:text-coffee-100'>
            <Trans>Clever Coffee SF</Trans>
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
