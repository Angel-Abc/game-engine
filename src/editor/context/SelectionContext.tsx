import React, { createContext, useContext, useState } from 'react'

interface SelectionContextValue {
  selected: string | null
  setSelected: React.Dispatch<React.SetStateAction<string | null>>
}

const SelectionContext = createContext<SelectionContextValue | undefined>(undefined)

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <SelectionContext.Provider value={{ selected, setSelected }}>
      {children}
    </SelectionContext.Provider>
  )
}

export const useSelection = (): SelectionContextValue => {
  const context = useContext(SelectionContext)
  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider')
  }
  return context
}

