'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import type { CalculatorState } from '@/lib/types'
import { calculateNetIncome } from '@/lib/calculations'
import { Calculator } from 'lucide-react'
import { useEffect } from 'react'

const formSchema = z.object({
	loanAmount: z.number().min(0),
	interestRates: z.array(z.number()),
	amortizationRates: z.array(z.number()),
	income1: z.number().min(0),
	income2: z.number().min(0),
	runningCosts: z.number().min(0)
})

interface CalculatorFormProps {
	onSubmit: (state: Partial<CalculatorState>) => void
	values?: {
		loanAmount: number
		interestRates: number[]
		amortizationRates: number[]
		income1: number
		income2: number
		runningCosts: number
	}
}

export function CalculatorForm({ onSubmit, values }: CalculatorFormProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			loanAmount: 0,
			interestRates: [3.5],
			amortizationRates: [2],
			income1: 0,
			income2: 0,
			runningCosts: 0
		}
	})

	// Reset form when values prop changes (e.g. after import)
	useEffect(() => {
		if (values) {
			form.reset(values)
		}
	}, [values, form])

	const handleSubmit = (values: z.infer<typeof formSchema>) => {
		const netIncome1 = calculateNetIncome(values.income1)
		const netIncome2 = calculateNetIncome(values.income2)
		onSubmit({
			loanParameters: {
				amount: values.loanAmount,
				interestRates: values.interestRates,
				amortizationRates: values.amortizationRates
			},
			income1: netIncome1,
			income2: netIncome2,
			grossIncome1: values.income1,
			grossIncome2: values.income2,
			runningCosts: values.runningCosts
		})
	}

	return (
		<Card className='shadow-lg rounded-2xl border border-gray-200'>
			<CardHeader className='flex flex-row items-center gap-3 pb-2'>
				<Calculator className='w-7 h-7 text-blue-600' />
				<CardTitle className='text-2xl font-bold text-gray-900 dark:text-gray-100'>Loan Parameters</CardTitle>
			</CardHeader>

			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
						<div className='grid grid-cols-1 gap-6'>
							<FormField
								control={form.control}
								name='loanAmount'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-gray-700 dark:text-gray-300'>Loan Amount (SEK)</FormLabel>
										<FormControl>
											<Input
												type='number'
												min={0}
												{...field}
												onChange={e => field.onChange(Number(e.target.value))}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
								<FormLabel className='text-gray-700 dark:text-gray-300 mb-2 block'>Interest Rates (%)</FormLabel>
								<div className='flex flex-wrap gap-4'>
									{[2.5, 3, 3.5, 4, 4.5].map(rate => (
										<FormField
											key={rate}
											control={form.control}
											name='interestRates'
											render={({ field }) => (
												<FormItem className='flex items-center space-x-2'>
													<FormControl>
														<Checkbox
															checked={field.value.includes(rate)}
															onCheckedChange={(checked: boolean) => {
																const newValue = checked
																	? [...field.value, rate]
																	: field.value.filter((r: number) => r !== rate)
																field.onChange(newValue)
															}}
														/>
													</FormControl>
													<FormLabel className='text-sm text-gray-700 dark:text-gray-300'>{rate}%</FormLabel>
												</FormItem>
											)}
										/>
									))}
								</div>
							</div>

							<div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
								<FormLabel className='text-gray-700 dark:text-gray-300 mb-2 block'>Amortization Rates (%)</FormLabel>
								<div className='flex flex-wrap gap-4'>
									{[1, 2, 3, 4, 5].map(rate => (
										<FormField
											key={rate}
											control={form.control}
											name='amortizationRates'
											render={({ field }) => (
												<FormItem className='flex items-center space-x-2'>
													<FormControl>
														<Checkbox
															checked={field.value.includes(rate)}
															onCheckedChange={(checked: boolean) => {
																const newValue = checked
																	? [...field.value, rate]
																	: field.value.filter((r: number) => r !== rate)
																field.onChange(newValue)
															}}
														/>
													</FormControl>
													<FormLabel className='text-sm text-gray-700 dark:text-gray-300'>{rate}%</FormLabel>
												</FormItem>
											)}
										/>
									))}
								</div>
							</div>

							<FormField
								control={form.control}
								name='income1'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-gray-700 dark:text-gray-300'>Income 1 (SEK)</FormLabel>
										<FormControl>
											<Input
												type='number'
												min={0}
												{...field}
												onChange={e => field.onChange(Number(e.target.value))}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='income2'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-gray-700 dark:text-gray-300'>Income 2 (SEK)</FormLabel>
										<FormControl>
											<Input
												type='number'
												min={0}
												{...field}
												onChange={e => field.onChange(Number(e.target.value))}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='runningCosts'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-gray-700 dark:text-gray-300'>Running Costs (SEK)</FormLabel>
										<FormControl>
											<Input
												type='number'
												min={0}
												{...field}
												onChange={e => field.onChange(Number(e.target.value))}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button type='submit' className='w-full mt-4 text-lg py-3 rounded-xl shadow-lg hover:scale-[1.03] active:scale-95 transition-transform'>
							Calculate
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
