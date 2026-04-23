"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  ShoppingBag,
  Package,
  Users,
  Search,
  Percent,
  Megaphone,
  AlertCircle,
  Star,
  MessageSquare
} from "lucide-react"

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
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

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  const items = [
    { label: "Dashboard", icon: <Calculator className="mr-2 h-4 w-4" />, href: "/admin/dashboard" },
    { label: "Pedidos", icon: <ShoppingBag className="mr-2 h-4 w-4" />, href: "/admin/pedidos" },
    { label: "Productos", icon: <Package className="mr-2 h-4 w-4" />, href: "/admin/productos" },
    { label: "Clientes", icon: <Users className="mr-2 h-4 w-4" />, href: "/admin/clientes" },
    { label: "Usuarios Sistema", icon: <User className="mr-2 h-4 w-4" />, href: "/admin/usuarios" },
    { label: "Cupones", icon: <Percent className="mr-2 h-4 w-4" />, href: "/admin/cupones" },
    { label: "Reseñas", icon: <Star className="mr-2 h-4 w-4" />, href: "/admin/resenas" },
    { label: "Preguntas", icon: <MessageSquare className="mr-2 h-4 w-4" />, href: "/admin/preguntas" },
    { label: "Announcement Bar", icon: <Megaphone className="mr-2 h-4 w-4" />, href: "/admin/announcement-bar" },
    { label: "Incidencias", icon: <AlertCircle className="mr-2 h-4 w-4" />, href: "/admin/incidencias" },
  ]

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl max-w-[550px] top-[20%] translate-y-0">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Escribe un comando o busca..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <div className="flex items-center gap-1 rounded bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 h-5">
            <span className="text-xs">ESC</span>
          </div>
        </div>
        <ScrollArea className="max-h-[300px]">
            <div className="p-2">
                <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Sugerencias
                </p>
                {filteredItems.length === 0 && (
                    <p className="px-4 py-14 text-center text-sm text-muted-foreground">
                        No se encontraron resultados.
                    </p>
                )}
                {filteredItems.map((item) => (
                    <button
                        key={item.href}
                        onClick={() => runCommand(() => router.push(item.href))}
                        className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors"
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
