'use client'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export default function LanguageSwitcher() {
	const { i18n } = useTranslation()
	const current = i18n.language.startsWith('sv') ? 'sv' : 'en'

	return (
		<div className='flex gap-2'>
			<Button
				type='button'
				onClick={() => i18n.changeLanguage('sv')}
				aria-label='Byt till svenska'
				className={`rounded p-2 border ${current === 'sv' ? 'border-blue-500' : 'border-transparent'} bg-white dark:bg-gray-900`}
                suppressHydrationWarning
			>
				<span className='text-2xl'>🇸🇪</span>
			</Button>
			<Button
				type='button'
				onClick={() => i18n.changeLanguage('en')}
				aria-label='Switch to English'
				className={`rounded p-2 border ${current === 'en' ? 'border-blue-500' : 'border-transparent'} bg-white dark:bg-gray-900`}
                suppressHydrationWarning
			>
				<span className='text-2xl'>🇬🇧</span>
			</Button>
		</div>
	)
}