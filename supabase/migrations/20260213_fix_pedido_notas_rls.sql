-- Tabla de Notas Internas (Seguridad Mejorada con tabla 'usuarios')
-- Reemplaza 'profiles' por 'usuarios'

CREATE TABLE IF NOT EXISTS public.pedido_notas (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
    autor_id UUID NOT NULL, 
    autor_nombre TEXT NOT NULL,
    contenido TEXT NOT NULL,
    tipo TEXT CHECK (tipo IN ('info', 'alerta', 'urgente')) DEFAULT 'info',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.pedido_notas ENABLE ROW LEVEL SECURITY;

-- 1. Lectura (Admins y Workers)
CREATE POLICY "Permitir lectura staff" ON public.pedido_notas
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.usuarios
            WHERE id = auth.uid() AND role IN ('admin', 'worker')
        )
    );

-- 2. Escritura (Admins y Workers)
CREATE POLICY "Permitir escritura staff" ON public.pedido_notas
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.usuarios
            WHERE id = auth.uid() AND role IN ('admin', 'worker')
        )
    );

-- 3. Borrado (Solo Admins)
CREATE POLICY "Permitir borrado admin" ON public.pedido_notas
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.usuarios
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
