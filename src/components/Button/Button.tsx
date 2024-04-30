import { cn } from '@/utils/libs/cn'
import { FaSpinner } from 'react-icons/fa'

interface IButton extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  disabled?: boolean
  isLoading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export function Button({ children, className, disabled, type, isLoading, ...props }: IButton) {
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
      {isLoading ? <FaSpinner className="m-auto animate-spin" /> : children}
    </button>
  )
}
