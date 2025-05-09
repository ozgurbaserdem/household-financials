import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

export interface MainProps
	extends React.HTMLAttributes<HTMLElement> {
	asChild?: boolean
}

const Main = React.forwardRef<HTMLElement, MainProps>(
	({ className, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'main'
		return (
			<Comp
				className={cn(className)}
				ref={ref}
				{...props}
			/>
		)
	}
)
Main.displayName = 'Main'

export { Main } 