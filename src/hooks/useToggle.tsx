import { useState } from "react"


function useToggle(initialValue: boolean = false): [boolean, () => void] {
  const [enabled, setEnabled] = useState(initialValue)

  const toggle = () => {
    setEnabled(!enabled)
  }

  return [enabled, toggle]
}

export default useToggle