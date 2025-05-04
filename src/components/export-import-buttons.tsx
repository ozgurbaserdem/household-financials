import React, { useRef } from 'react'
import { exportToCsv } from '@/lib/export-to-csv'
import { importFromCsv } from '@/lib/import-from-csv'
import type { CalculatorState } from '@/lib/types'
import { Button } from '@/components/ui/button'

interface ExportImportButtonsProps {
	state: CalculatorState
	onImport: (state: Partial<CalculatorState>) => void
}

function ExportImportButtons ({ state, onImport }: ExportImportButtonsProps) {
	const fileInputRef = useRef<HTMLInputElement>(null)

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
			<Button type='button' onClick={handleExport}>
				Export CSV
			</Button>
			<Button type='button' onClick={handleImportClick}>
				Import CSV
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