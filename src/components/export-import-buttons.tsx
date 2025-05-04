'use client'

import React, { useRef } from 'react'
import { exportToCsv } from '@/lib/export-to-csv'
import { importFromCsv } from '@/lib/import-from-csv'
import type { CalculatorState } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

interface ExportImportButtonsProps {
	state: CalculatorState
	onImport: (state: Partial<CalculatorState>) => void
}

function ExportImportButtons ({ state, onImport }: ExportImportButtonsProps) {
	const fileInputRef = useRef<HTMLInputElement>(null)
	const { t } = useTranslation()

	function handleExport () {
		exportToCsv(state)
	}

	function handleImportClick () {
		fileInputRef.current?.click()
	}

	function handleFileChange (e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0]
		if (!file) return
		importFromCsv(
			file,
			onImport,
			err => alert('Import error: ' + err.message)
		)
	}

	return (
		<div className='flex gap-2'>
			<Button 
				type='button' 
				onClick={handleExport}
				variant='outline'
				className='
					bg-white hover:bg-gray-100 text-black
					dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white
				'
			>
				{t('export_import.export_csv')}
			</Button>
			<Button 
				type='button' 
				onClick={handleImportClick}
				variant='outline'
				className='
					bg-white hover:bg-gray-100 text-black
					dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white
				'
			>
				{t('export_import.import_csv')}
			</Button>
			<input
				type='file'
				accept='.csv'
				ref={fileInputRef}
				style={{ display: 'none' }}
				onChange={handleFileChange}
			/>
		</div>
	)
}

export default ExportImportButtons