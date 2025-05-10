import { useState, useEffect, useRef } from "react"

type InputField = {
  id: number
  value: string
}

type UseDynamicInputListOptions = {
  initialValues?: string[]
  onChange?: (value: string[]) => void
} 

type DynamicInputList = {
  count: number
  inputFields: InputField[]
  addInputField: () => void
  handleInputChange: (id: number, value: string) => void
  removeInputField: (id: number) => void
} 

function useDynamicInputList(itemsPerPage: number, options?: UseDynamicInputListOptions): DynamicInputList {
  const { initialValues = [], onChange } = options || {}

  const [count, setCount] = useState(Math.max(initialValues.length || 1, 1))
  const [inputFields, setInputFields] = useState<InputField[]>(() => {
    if (initialValues && initialValues.length > 0) {
      return initialValues.map((value, index) => ({
        id: index + 1,
        value
      }))
    }
    return [{ id: 1, value: '' }]
  })

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (onChange) {
      const values = inputFields.map(field => field.value)
      onChange(values)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputFields])

  const addInputField = () => {
    const newId = count + 1
    setInputFields([...inputFields, { id: newId, value: '' }])
    setCount(newId)
  }

  const handleInputChange = (id: number, value: string) => {
    const newInputFields = inputFields.map(field => 
      field.id === id ? { ...field, value } : field
    )
    setInputFields(newInputFields)
  }

  const removeInputField = (id: number) => {
    if (inputFields.length <= 1) return
    const newInputFields = inputFields.filter(field => field.id !== id)
    setInputFields(newInputFields)
    const newCount = count - 1
    setCount(newCount)
  }

  return { count, inputFields, addInputField, handleInputChange, removeInputField }
}

export default useDynamicInputList