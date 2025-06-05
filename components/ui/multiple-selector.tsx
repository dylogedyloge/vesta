"use client"

import * as React from "react"
import { X, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem, CommandEmpty } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"

export type Option = {
  label: string
  value: string
}

interface MultipleSelector {
  value?: Option[]
  onChange?: (value: Option[]) => void
  placeholder?: string
  options: Option[]
  className?: string
}

export function MultipleSelector({
  value = [],
  onChange,
  placeholder = "Select items...",
  options,
  className,
}: MultipleSelector) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  // Sync internal state with external value
  React.useEffect(() => {
    if (value) {
      // No need for internal state, we use the value prop directly
      onChange?.(value)
    }
  }, [value, onChange])

  const handleSelect = React.useCallback((option: Option) => {
    onChange?.([...value, option])
  }, [onChange, value])

  const handleRemove = React.useCallback((option: Option) => {
    onChange?.(value.filter(item => item.value !== option.value))
  }, [onChange, value])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "" && value.length > 0) {
          onChange?.(value.slice(0, -1))
        }
      }
      if (e.key === "Escape") {
        input.blur()
        setOpen(false)
      }
    }
  }, [value, onChange])

  // Filter options based on input value and selected items
  const filteredOptions = React.useMemo(() => {
    return options.filter((option) => {
      const matchesSearch = option.label.toLowerCase().includes(inputValue.toLowerCase())
      const isNotSelected = !value.some(item => item.value === option.value)
      return matchesSearch && isNotSelected
    })
  }, [options, inputValue, value])

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <Command onKeyDown={handleKeyDown} className={`${className} overflow-visible bg-transparent`}>
        <div
          className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          onClick={() => {
            setOpen(true)
            inputRef.current?.focus()
          }}
        >
          <div className="flex gap-1 flex-wrap">
            {value.map((option) => {
              return (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className="hover:bg-secondary/80"
                >
                  {option.label}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRemove(option)
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(option)
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              )
            })}
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => {
                if (!containerRef.current?.contains(document.activeElement)) {
                  setOpen(false)
                }
              }}
              onFocus={() => setOpen(true)}
              placeholder={value.length === 0 ? placeholder : "Add more..."}
              className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1 min-w-[120px] inline-flex"
            />
          </div>
        </div>
        {open && (
          <div className="absolute w-full z-50 top-full mt-2 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
            <CommandGroup className="max-h-[200px] overflow-auto p-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onSelect={() => {
                      handleSelect(option)
                      setInputValue("")
                    }}
                    className="cursor-pointer flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    {option.label}
                  </CommandItem>
                ))
              ) : (
                <CommandEmpty className="py-2 px-4 text-sm text-muted-foreground">No results found.</CommandEmpty>
              )}
            </CommandGroup>
          </div>
        )}
      </Command>
    </div>
  )
} 