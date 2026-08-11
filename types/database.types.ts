export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      almacenes: {
        Row: {
          activo: boolean | null
          created_at: string | null
          direccion: string | null
          id: number
          nombre: string
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          direccion?: string | null
          id?: number
          nombre: string
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          direccion?: string | null
          id?: number
          nombre?: string
        }
        Relationships: []
      }
      announcement_bar: {
        Row: {
          enabled: boolean
          id: number
          interval_ms: number
          messages: string[]
          updated_at: string
        }
        Insert: {
          enabled?: boolean
          id: number
          interval_ms?: number
          messages?: string[]
          updated_at?: string
        }
        Update: {
          enabled?: boolean
          id?: number
          interval_ms?: number
          messages?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      categorias: {
        Row: {
          created_at: string
          id: number
          nombre: string
          parent_id: number | null
          slug: string
        }
        Insert: {
          created_at?: string
          id?: number
          nombre: string
          parent_id?: number | null
          slug: string
        }
        Update: {
          created_at?: string
          id?: number
          nombre?: string
          parent_id?: number | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categorias_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          created_at: string
          departamento: string | null
          direccion: string | null
          distrito: string | null
          dni: string | null
          email: string | null
          es_problematico: boolean | null
          id: number
          link_ubicacion: string | null
          nombre: string
          provincia: string | null
          referencia: string | null
          telefono: string | null
          updated_at: string | null
          usuario_id: string | null
        }
        Insert: {
          created_at?: string
          departamento?: string | null
          direccion?: string | null
          distrito?: string | null
          dni?: string | null
          email?: string | null
          es_problematico?: boolean | null
          id?: number
          link_ubicacion?: string | null
          nombre: string
          provincia?: string | null
          referencia?: string | null
          telefono?: string | null
          updated_at?: string | null
          usuario_id?: string | null
        }
        Update: {
          created_at?: string
          departamento?: string | null
          direccion?: string | null
          distrito?: string | null
          dni?: string | null
          email?: string | null
          es_problematico?: boolean | null
          id?: number
          link_ubicacion?: string | null
          nombre?: string
          provincia?: string | null
          referencia?: string | null
          telefono?: string | null
          updated_at?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      cupones: {
        Row: {
          activo: boolean
          codigo: string
          created_at: string
          expires_at: string | null
          id: number
          max_usos: number | null
          min_total: number
          starts_at: string | null
          tipo: string
          usos: number
          valor: number
        }
        Insert: {
          activo?: boolean
          codigo: string
          created_at?: string
          expires_at?: string | null
          id?: number
          max_usos?: number | null
          min_total?: number
          starts_at?: string | null
          tipo?: string
          usos?: number
          valor?: number
        }
        Update: {
          activo?: boolean
          codigo?: string
          created_at?: string
          expires_at?: string | null
          id?: number
          max_usos?: number | null
          min_total?: number
          starts_at?: string | null
          tipo?: string
          usos?: number
          valor?: number
        }
        Relationships: []
      }
      home_banners: {
        Row: {
          activo: boolean
          countdown_end: string | null
          created_at: string
          cta: string | null
          href: string
          id: number
          orden: number
          subtitle: string | null
          title: string | null
        }
        Insert: {
          activo?: boolean
          countdown_end?: string | null
          created_at?: string
          cta?: string | null
          href: string
          id?: number
          orden?: number
          subtitle?: string | null
          title?: string | null
        }
        Update: {
          activo?: boolean
          countdown_end?: string | null
          created_at?: string
          cta?: string | null
          href?: string
          id?: number
          orden?: number
          subtitle?: string | null
          title?: string | null
        }
        Relationships: []
      }
      incidencias: {
        Row: {
          comentario: string | null
          created_at: string
          foto: string | null
          id: number
          pedido_id: number | null
          tipo: string | null
        }
        Insert: {
          comentario?: string | null
          created_at?: string
          foto?: string | null
          id?: number
          pedido_id?: number | null
          tipo?: string | null
        }
        Update: {
          comentario?: string | null
          created_at?: string
          foto?: string | null
          id?: number
          pedido_id?: number | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidencias_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      inventario_movimientos: {
        Row: {
          almacen_id: number | null
          cantidad: number
          costo_unitario: number
          created_at: string | null
          created_by: string | null
          id: number
          notas: string | null
          producto_id: number
          referencia: string | null
          tipo_movimiento: string
          variante_id: number | null
        }
        Insert: {
          almacen_id?: number | null
          cantidad: number
          costo_unitario?: number
          created_at?: string | null
          created_by?: string | null
          id?: number
          notas?: string | null
          producto_id: number
          referencia?: string | null
          tipo_movimiento: string
          variante_id?: number | null
        }
        Update: {
          almacen_id?: number | null
          cantidad?: number
          costo_unitario?: number
          created_at?: string | null
          created_by?: string | null
          id?: number
          notas?: string | null
          producto_id?: number
          referencia?: string | null
          tipo_movimiento?: string
          variante_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventario_movimientos_almacen_id_fkey"
            columns: ["almacen_id"]
            isOneToOne: false
            referencedRelation: "almacenes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventario_movimientos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventario_movimientos_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventario_movimientos_variante_id_fkey"
            columns: ["variante_id"]
            isOneToOne: false
            referencedRelation: "producto_variantes"
            referencedColumns: ["id"]
          },
        ]
      }
      libro_reclamaciones: {
        Row: {
          apellidos: string
          apoderado_dni: string | null
          apoderado_nombres: string | null
          archivo_adjunto: string | null
          codigo: string
          created_at: string | null
          departamento: string | null
          descripcion_bien: string | null
          detalle_reclamo: string
          direccion: string
          distrito: string | null
          email: string
          estado: string | null
          fecha_respuesta: string | null
          id: string
          menor_edad: boolean | null
          monto_reclamado: number | null
          nombres: string
          numero_documento: string
          observaciones_proveedor: string | null
          pedido_relacionado: string | null
          provincia: string | null
          telefono: string
          tipo_bien: string
          tipo_documento: string | null
          tipo_reclamo: string
        }
        Insert: {
          apellidos: string
          apoderado_dni?: string | null
          apoderado_nombres?: string | null
          archivo_adjunto?: string | null
          codigo?: string
          created_at?: string | null
          departamento?: string | null
          descripcion_bien?: string | null
          detalle_reclamo: string
          direccion: string
          distrito?: string | null
          email: string
          estado?: string | null
          fecha_respuesta?: string | null
          id?: string
          menor_edad?: boolean | null
          monto_reclamado?: number | null
          nombres: string
          numero_documento: string
          observaciones_proveedor?: string | null
          pedido_relacionado?: string | null
          provincia?: string | null
          telefono: string
          tipo_bien: string
          tipo_documento?: string | null
          tipo_reclamo: string
        }
        Update: {
          apellidos?: string
          apoderado_dni?: string | null
          apoderado_nombres?: string | null
          archivo_adjunto?: string | null
          codigo?: string
          created_at?: string | null
          departamento?: string | null
          descripcion_bien?: string | null
          detalle_reclamo?: string
          direccion?: string
          distrito?: string | null
          email?: string
          estado?: string | null
          fecha_respuesta?: string | null
          id?: string
          menor_edad?: boolean | null
          monto_reclamado?: number | null
          nombres?: string
          numero_documento?: string
          observaciones_proveedor?: string | null
          pedido_relacionado?: string | null
          provincia?: string | null
          telefono?: string
          tipo_bien?: string
          tipo_documento?: string | null
          tipo_reclamo?: string
        }
        Relationships: []
      }
      marketing_pixels: {
        Row: {
          clave: string
          created_at: string
          enabled: boolean | null
          id: number
          nombre: string
          pixel_id: string | null
          updated_at: string
        }
        Insert: {
          clave: string
          created_at?: string
          enabled?: boolean | null
          id?: number
          nombre: string
          pixel_id?: string | null
          updated_at?: string
        }
        Update: {
          clave?: string
          created_at?: string
          enabled?: boolean | null
          id?: number
          nombre?: string
          pixel_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          cupon_codigo: string | null
          email: string
          id: number
        }
        Insert: {
          created_at?: string
          cupon_codigo?: string | null
          email: string
          id?: number
        }
        Update: {
          created_at?: string
          cupon_codigo?: string | null
          email?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_subscriptions_cupon_codigo_fkey"
            columns: ["cupon_codigo"]
            isOneToOne: false
            referencedRelation: "cupones"
            referencedColumns: ["codigo"]
          },
        ]
      }
      pedido_items: {
        Row: {
          cantidad: number
          cantidad_devuelta: number | null
          id: number
          pedido_id: number | null
          precio_unitario: number | null
          producto_id: number | null
          producto_nombre: string | null
          producto_variante_id: number | null
          variante_nombre: string | null
        }
        Insert: {
          cantidad: number
          cantidad_devuelta?: number | null
          id?: number
          pedido_id?: number | null
          precio_unitario?: number | null
          producto_id?: number | null
          producto_nombre?: string | null
          producto_variante_id?: number | null
          variante_nombre?: string | null
        }
        Update: {
          cantidad?: number
          cantidad_devuelta?: number | null
          id?: number
          pedido_id?: number | null
          precio_unitario?: number | null
          producto_id?: number | null
          producto_nombre?: string | null
          producto_variante_id?: number | null
          variante_nombre?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pedido_items_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_items_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_items_producto_variante_id_fkey"
            columns: ["producto_variante_id"]
            isOneToOne: false
            referencedRelation: "producto_variantes"
            referencedColumns: ["id"]
          },
        ]
      }
      pedido_logs: {
        Row: {
          accion: string
          created_at: string
          detalles: string | null
          id: number
          pedido_id: number
          usuario_nombre: string | null
        }
        Insert: {
          accion: string
          created_at?: string
          detalles?: string | null
          id?: number
          pedido_id: number
          usuario_nombre?: string | null
        }
        Update: {
          accion?: string
          created_at?: string
          detalles?: string | null
          id?: number
          pedido_id?: number
          usuario_nombre?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pedido_logs_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedido_notas: {
        Row: {
          autor_id: string | null
          autor_nombre: string
          contenido: string
          created_at: string
          id: number
          pedido_id: number
          tipo: string | null
        }
        Insert: {
          autor_id?: string | null
          autor_nombre: string
          contenido: string
          created_at?: string
          id?: number
          pedido_id: number
          tipo?: string | null
        }
        Update: {
          autor_id?: string | null
          autor_nombre?: string
          contenido?: string
          created_at?: string
          id?: number
          pedido_id?: number
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pedido_notas_autor"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_notas_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedido_pagos: {
        Row: {
          comprobante_url: string | null
          created_at: string
          id: number
          metodo_pago: string
          monto: number
          nota: string | null
          pedido_id: number
          registrado_por: string
          registrado_por_id: string | null
          tipo_pago: string
        }
        Insert: {
          comprobante_url?: string | null
          created_at?: string
          id?: number
          metodo_pago: string
          monto: number
          nota?: string | null
          pedido_id: number
          registrado_por: string
          registrado_por_id?: string | null
          tipo_pago: string
        }
        Update: {
          comprobante_url?: string | null
          created_at?: string
          id?: number
          metodo_pago?: string
          monto?: number
          nota?: string | null
          pedido_id?: number
          registrado_por?: string
          registrado_por_id?: string | null
          tipo_pago?: string
        }
        Relationships: [
          {
            foreignKeyName: "pedido_pagos_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_pagos_registrado_por_id_fkey"
            columns: ["registrado_por_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          agencia_destino: string | null
          agencia_origen: string | null
          asignado_a: string | null
          cliente_id: number | null
          codigo_seguimiento: string | null
          comprobante_pago_url: string[] | null
          created_at: string
          culqi_charge_id: string | null
          cupon_codigo: string | null
          departamento: string | null
          descuento: number | null
          direccion_calle: string | null
          distrito: string | null
          dni_contacto: string | null
          email_confirmacion_enviado: boolean | null
          email_contacto: string | null
          evidencia_entrega_url: string | null
          fecha_asignacion: string | null
          guia_archivo_url: string | null
          id: number
          link_ubicacion: string | null
          metodo_envio: string | null
          nombre_contacto: string | null
          origen: string | null
          pago_status: string | null
          provincia: string | null
          referencia_direccion: string | null
          shalom_clave: string | null
          shalom_orden: string | null
          shalom_pin: string | null
          status: string | null
          stock_descontado: boolean
          subtotal: number | null
          telefono_contacto: string | null
          total: number
          usuario_id: string | null
          voucher_url: string | null
        }
        Insert: {
          agencia_destino?: string | null
          agencia_origen?: string | null
          asignado_a?: string | null
          cliente_id?: number | null
          codigo_seguimiento?: string | null
          comprobante_pago_url?: string[] | null
          created_at?: string
          culqi_charge_id?: string | null
          cupon_codigo?: string | null
          departamento?: string | null
          descuento?: number | null
          direccion_calle?: string | null
          distrito?: string | null
          dni_contacto?: string | null
          email_confirmacion_enviado?: boolean | null
          email_contacto?: string | null
          evidencia_entrega_url?: string | null
          fecha_asignacion?: string | null
          guia_archivo_url?: string | null
          id?: number
          link_ubicacion?: string | null
          metodo_envio?: string | null
          nombre_contacto?: string | null
          origen?: string | null
          pago_status?: string | null
          provincia?: string | null
          referencia_direccion?: string | null
          shalom_clave?: string | null
          shalom_orden?: string | null
          shalom_pin?: string | null
          status?: string | null
          stock_descontado?: boolean
          subtotal?: number | null
          telefono_contacto?: string | null
          total: number
          usuario_id?: string | null
          voucher_url?: string | null
        }
        Update: {
          agencia_destino?: string | null
          agencia_origen?: string | null
          asignado_a?: string | null
          cliente_id?: number | null
          codigo_seguimiento?: string | null
          comprobante_pago_url?: string[] | null
          created_at?: string
          culqi_charge_id?: string | null
          cupon_codigo?: string | null
          departamento?: string | null
          descuento?: number | null
          direccion_calle?: string | null
          distrito?: string | null
          dni_contacto?: string | null
          email_confirmacion_enviado?: boolean | null
          email_contacto?: string | null
          evidencia_entrega_url?: string | null
          fecha_asignacion?: string | null
          guia_archivo_url?: string | null
          id?: number
          link_ubicacion?: string | null
          metodo_envio?: string | null
          nombre_contacto?: string | null
          origen?: string | null
          pago_status?: string | null
          provincia?: string | null
          referencia_direccion?: string | null
          shalom_clave?: string | null
          shalom_orden?: string | null
          shalom_pin?: string | null
          status?: string | null
          stock_descontado?: boolean
          subtotal?: number | null
          telefono_contacto?: string | null
          total?: number
          usuario_id?: string | null
          voucher_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      product_answers: {
        Row: {
          answer: string
          answered_by: string | null
          created_at: string
          id: number
          published: boolean
          question_id: number
        }
        Insert: {
          answer: string
          answered_by?: string | null
          created_at?: string
          id?: number
          published?: boolean
          question_id: number
        }
        Update: {
          answer?: string
          answered_by?: string | null
          created_at?: string
          id?: number
          published?: boolean
          question_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "product_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      product_questions: {
        Row: {
          asker_name: string | null
          asker_phone: string | null
          created_at: string
          id: number
          product_id: number
          published: boolean
          question: string
        }
        Insert: {
          asker_name?: string | null
          asker_phone?: string | null
          created_at?: string
          id?: number
          product_id: number
          published?: boolean
          question: string
        }
        Update: {
          asker_name?: string | null
          asker_phone?: string | null
          created_at?: string
          id?: number
          product_id?: number
          published?: boolean
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_questions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          approved: boolean
          body: string
          created_at: string
          customer_city: string | null
          customer_name: string | null
          id: number
          order_id: number | null
          photo_urls: string[] | null
          product_id: number
          rating: number
          title: string | null
          verified: boolean
        }
        Insert: {
          approved?: boolean
          body: string
          created_at?: string
          customer_city?: string | null
          customer_name?: string | null
          id?: number
          order_id?: number | null
          photo_urls?: string[] | null
          product_id: number
          rating: number
          title?: string | null
          verified?: boolean
        }
        Update: {
          approved?: boolean
          body?: string
          created_at?: string
          customer_city?: string | null
          customer_name?: string | null
          id?: number
          order_id?: number | null
          photo_urls?: string[] | null
          product_id?: number
          rating?: number
          title?: string | null
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      producto_especificaciones: {
        Row: {
          clave: string
          created_at: string
          id: number
          orden: number
          producto_id: number
          valor: string | null
        }
        Insert: {
          clave: string
          created_at?: string
          id?: number
          orden?: number
          producto_id: number
          valor?: string | null
        }
        Update: {
          clave?: string
          created_at?: string
          id?: number
          orden?: number
          producto_id?: number
          valor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "producto_especificaciones_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      producto_variantes: {
        Row: {
          activo: boolean
          color: string | null
          created_at: string
          etiqueta: string
          id: number
          modelo: string | null
          precio: number | null
          precio_antes: number | null
          producto_id: number
          stock: number
          talla: string | null
        }
        Insert: {
          activo?: boolean
          color?: string | null
          created_at?: string
          etiqueta: string
          id?: number
          modelo?: string | null
          precio?: number | null
          precio_antes?: number | null
          producto_id: number
          stock?: number
          talla?: string | null
        }
        Update: {
          activo?: boolean
          color?: string | null
          created_at?: string
          etiqueta?: string
          id?: number
          modelo?: string | null
          precio?: number | null
          precio_antes?: number | null
          producto_id?: number
          stock?: number
          talla?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "producto_variantes_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      productos: {
        Row: {
          calificacion: number | null
          categoria_id: number | null
          color: string | null
          created_at: string
          cuidados: string | null
          descripcion: string | null
          fts: unknown
          id: number
          imagen_url: string | null
          imagenes: string[] | null
          materiales: string | null
          nombre: string
          precio: number
          precio_antes: number | null
          slug: string | null
          stock: number
          tamano: string | null
          uso: string | null
          videos: string[] | null
        }
        Insert: {
          calificacion?: number | null
          categoria_id?: number | null
          color?: string | null
          created_at?: string
          cuidados?: string | null
          descripcion?: string | null
          fts?: unknown
          id?: number
          imagen_url?: string | null
          imagenes?: string[] | null
          materiales?: string | null
          nombre: string
          precio: number
          precio_antes?: number | null
          slug?: string | null
          stock?: number
          tamano?: string | null
          uso?: string | null
          videos?: string[] | null
        }
        Update: {
          calificacion?: number | null
          categoria_id?: number | null
          color?: string | null
          created_at?: string
          cuidados?: string | null
          descripcion?: string | null
          fts?: unknown
          id?: number
          imagen_url?: string | null
          imagenes?: string[] | null
          materiales?: string | null
          nombre?: string
          precio?: number
          precio_antes?: number | null
          slug?: string | null
          stock?: number
          tamano?: string | null
          uso?: string | null
          videos?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "productos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      social_links: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: number
          orden: number | null
          platform: string
          url: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: number
          orden?: number | null
          platform: string
          url: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: number
          orden?: number | null
          platform?: string
          url?: string
        }
        Relationships: []
      }
      system_audit_logs: {
        Row: {
          action: string
          changed_at: string | null
          changed_by: string | null
          id: number
          new_data: Json | null
          old_data: Json | null
          record_id: string
          table_name: string
        }
        Insert: {
          action: string
          changed_at?: string | null
          changed_by?: string | null
          id?: number
          new_data?: Json | null
          old_data?: Json | null
          record_id: string
          table_name: string
        }
        Update: {
          action?: string
          changed_at?: string | null
          changed_by?: string | null
          id?: number
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string
          table_name?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          activo: boolean | null
          bloqueado_hasta: string | null
          created_at: string | null
          departamento: string | null
          direccion: string | null
          distrito: string | null
          dni: string | null
          email: string | null
          id: string
          intentos_fallidos: number | null
          nombre: string | null
          provincia: string | null
          puntos: number | null
          referencia: string | null
          role: string | null
          telefono: string | null
        }
        Insert: {
          activo?: boolean | null
          bloqueado_hasta?: string | null
          created_at?: string | null
          departamento?: string | null
          direccion?: string | null
          distrito?: string | null
          dni?: string | null
          email?: string | null
          id: string
          intentos_fallidos?: number | null
          nombre?: string | null
          provincia?: string | null
          puntos?: number | null
          referencia?: string | null
          role?: string | null
          telefono?: string | null
        }
        Update: {
          activo?: boolean | null
          bloqueado_hasta?: string | null
          created_at?: string | null
          departamento?: string | null
          direccion?: string | null
          distrito?: string | null
          dni?: string | null
          email?: string | null
          id?: string
          intentos_fallidos?: number | null
          nombre?: string | null
          provincia?: string | null
          puntos?: number | null
          referencia?: string | null
          role?: string | null
          telefono?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      kardex_valorizado_view: {
        Row: {
          almacen_id: number | null
          almacen_nombre: string | null
          cantidad: number | null
          costo_unitario: number | null
          created_at: string | null
          created_by: string | null
          entradas: number | null
          id: number | null
          notas: string | null
          producto_id: number | null
          producto_nombre: string | null
          referencia: string | null
          saldo_cantidad: number | null
          salidas: number | null
          tipo_movimiento: string | null
          usuario_email: string | null
          usuario_nombre: string | null
          valor_total: number | null
          variante_id: number | null
          variante_nombre: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventario_movimientos_almacen_id_fkey"
            columns: ["almacen_id"]
            isOneToOne: false
            referencedRelation: "almacenes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventario_movimientos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventario_movimientos_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventario_movimientos_variante_id_fkey"
            columns: ["variante_id"]
            isOneToOne: false
            referencedRelation: "producto_variantes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      vincular_pedidos_usuario: {
        Args: { p_email: string; p_usuario_id: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
