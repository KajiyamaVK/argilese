import { cn } from '@/utils/cn'

interface IButton extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export function Button({ children, className, disabled, type, ...props }: IButton) {
  return (
    <button
      className={cn(
        'bg-yellow-700 text-white mx-auto p-2 rounded-lg cursor-pointer md:hover:opacity-50 min-w-24',
        disabled && 'opacity-50 pointer-events-none',
        type,
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
