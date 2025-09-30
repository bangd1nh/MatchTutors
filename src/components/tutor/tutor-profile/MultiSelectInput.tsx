import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
interface MultiSelectInputProps {
    wrapperRef?: React.RefObject<HTMLDivElement>;
    value: string[]
    onChange: (value: string[]) => void
    options?: string[]
    placeholder?: string
    searchPlaceholder?: string
    emptyMessage?: string
    className?: string
    labels?: Record<string, string>
}

export function MultiSelectInput({
    wrapperRef,
    value = [],
    onChange,
    options = [],
    placeholder = "Select items...",
    searchPlaceholder = "Search items...",
    emptyMessage = "No items found.",
    className,
    labels = {} // 👈 default empty
}: MultiSelectInputProps) {
    const [open, setOpen] = useState(false)

    const handleSelect = (item: string) => {
        if (value.includes(item)) {
            onChange(value.filter((v) => v !== item))
        } else {
            onChange([...value, item])
        }
    }

    const removeItem = (item: string, e: React.MouseEvent) => {
        e.stopPropagation()
        onChange(value.filter((v) => v !== item))
    }

    const getLabel = (key: string) => labels[key] ?? key

    return (
        <div ref={wrapperRef}>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn("w-full justify-between min-h-[60px] p-3 bg-transparent", className)}
                    >
                        <div className="flex flex-wrap gap-1">
                            {value.length > 0 ? (
                                value.map((item) => (
                                    <Badge key={item} variant="secondary" className="flex items-center gap-1">
                                        {getLabel(item)}
                                        <X
                                            className="h-3 w-3 cursor-pointer hover:text-red-500"
                                            onClick={(e) => removeItem(item, e)}
                                        />
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-muted-foreground">{placeholder}</span>
                            )}
                        </div>
                        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder={searchPlaceholder} />
                        <CommandList>
                            <CommandEmpty>{emptyMessage}</CommandEmpty>
                            <CommandGroup>
                                {options.map((item) => (
                                    <CommandItem
                                        key={item}
                                        onSelect={() => handleSelect(item)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value.includes(item) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {getLabel(item)}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
