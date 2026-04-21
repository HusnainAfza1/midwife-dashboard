import { Button, ButtonProps } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
interface SpinnerButtonProps extends ButtonProps {
  state: boolean
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any
}

export const SpinnerButton = ({
  state,
  name,
  icon,
  ...props
}: SpinnerButtonProps) => {
  return (
    <Button {...props}>
      {state ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <span className="flex items-center gap-x-2">
          {name}
          {icon}
        </span>
      )}
    </Button>
  )
}