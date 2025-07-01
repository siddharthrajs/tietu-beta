// Source: https://github.com/shadcn/ui/blob/main/apps/www/components/ui/use-toast.ts
import * as React from "react"

export type ToastVariant = "default" | "destructive"

export interface ToastOptions {
  id?: string
  title?: string
  description?: string
  variant?: ToastVariant
}

interface Toast extends ToastOptions {
  id: string
  open: boolean
}

interface ToastContextType {
  toasts: Toast[]
  toast: (options: ToastOptions) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

let toastId = 0

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback((options: ToastOptions) => {
    const id = options.id || `toast-${toastId++}`
    setToasts((toasts) => [
      ...toasts,
      {
        ...options,
        id,
        open: true,
      },
    ])
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((toasts) => toasts.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
} 