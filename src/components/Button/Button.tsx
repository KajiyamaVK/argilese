import { cn } from '@/utils/cn'

interface IButton extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export function Button({ children, className, disabled, ...props }: IButton) {
  return (
    <button
      className={cn(
        'bg-yellow-700 text-white mx-auto p-2 rounded-lg cursor-pointer hover:opacity-50',
        disabled && 'opacity-50 pointer-events-none',
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
