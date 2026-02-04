"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import {
    CreditCard,
    LayoutDashboard,
    Settings,
    User,
    ShoppingBag,
    Package,
    Megaphone,
    Search
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"

export function CommandMenu() {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <Button
                variant="outline"
                className="relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
                onClick={() => setOpen(true)}
            >
                <span className="hidden lg:inline-flex">Buscar...</span>
                <span className="inline-flex lg:hidden">Buscar...</span>
                <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Escribe un comando o busca..." />
                <CommandList>
                    <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                    <CommandGroup heading="Sugerencias">
                        <CommandItem onSelect={() => runCommand(() => router.push("/admin/dashboard"))}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/admin/pedidos"))}>
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            <span>Pedidos</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/admin/productos"))}>
                            <Package className="mr-2 h-4 w-4" />
                            <span>Productos</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Configuración">
                        <CommandItem onSelect={() => runCommand(() => router.push("/admin/usuarios"))}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Usuarios</span>
                            <CommandShortcut>⌘U</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/admin/settings"))}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Configuración</span>
                            <CommandShortcut>⌘S</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
