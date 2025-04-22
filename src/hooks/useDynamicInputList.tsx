import { useState } from "react"

type InputField = {
  id: number
  value: string
}

type DynamicInputList = {
  count: number
  inputFields: InputField[]
  addInputField: () => void
  handleInputChange: (id: number, value: string) => void
  removeInputField: (id: number) => void
} 

function useDynamicInputList(itemsPerPage: number): DynamicInputList {
  const [count, setCount] = useState(1)
  const [inputFields, setInputFields] = useState([
    { id: count, value: '' }
  ])


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