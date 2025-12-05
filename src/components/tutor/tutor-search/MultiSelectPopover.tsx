import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MultiSelectPopoverProps {
    label: string
    icon?: React.ReactNode
    options: string[]
    selected: string[]
    onChange: (selected: string[]) => void
    placeholder?: string
    getLabel?: (value: string) => string   // customize label
}

export function MultiSelectPopover({
    label,
    icon,
    options,
    selected,
    onChange,
    placeholder = "Search...",
    getLabel,
}: MultiSelectPopoverProps) {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredOptions = options.filter((option) =>
        (getLabel ? getLabel(option) : option)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    )

    const toggleOption = (option: string, checked: boolean) => {
        onChange(
            checked
                ? [...selected, option]
                : selected.filter((o) => o !== option)
        )
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="h-10 gap-2 bg-transparent text-sm flex-1 min-w-24"
                >
                    {icon}
                    {label}
                    {selected.length > 0 && (
                        <Badge
                            variant="secondary"
                            className="h-5 w-5 p-0 min-w-5 text-xs flex items-center justify-center"
                        >
                            {selected.length}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 max-h-96 overflow-y-auto" align="start">
                <div className="space-y-4">
                    <h4 className="font-medium text-sm">Chọn {label}</h4>

                    <Input
                        placeholder={placeholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-2"
                    />

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div key={option} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`${label}-${option}`}
                                        checked={selected.includes(option)}
                                        onCheckedChange={(checked) =>
                                            toggleOption(option, checked as boolean)
                                        }
                                    />
                                    <Label htmlFor={`${label}-${option}`} className="text-sm">
                                        {getLabel ? getLabel(option) : option}
                                    </Label>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Không tìm thấy kết quả
                            </p>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
