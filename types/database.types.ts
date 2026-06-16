export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      almacenes: {
        Row: {
          activo: boolean | null
          created_at: string | null
          direccion: string | null
          id: number
          nombre: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          direccion?: string | null
          id?: number
          nombre?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          direccion?: string | null
          id?: number
          nombre?: string | null
        }
        Relationships: []
      }
      announcement_bar: {
        Row: {
          enabled: boolean | null
          id: number
          interval_ms: number | null
          messages: string[] | null
          updated_at: string | null
        }
        Insert: {
          enabled?: boolean | null
          id: number
          interval_ms?: number | null
          messages?: string[] | null
          updated_at?: string | null
        }
        Update: {
          enabled?: boolean | null
          id?: number
          interval_ms?: number | null
          messages?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      categorias: {
        Row: {
          created_at: string | null
          id: number
          nombre: string | null
          parent_id: number | null
          slug: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          nombre?: string | null
          parent_id?: number | null
          slug?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          nombre?: string | null
          parent_id?: number | null
          slug?: string | null
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
          created_at: string | null
          departamento: string | null
          direccion: string | null
          distrito: string | null
          dni: string | null
          email: string | null
          es_problematico: boolean | null
          id: number
          link_ubicacion: string | null
          nombre: string | null
          provincia: string | null
          referencia: string | null
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          departamento?: string | null
          direccion?: string | null
          distrito?: string | null
          dni?: string | null
          email?: string | null
          es_problematico?: boolean | null
          id?: number
          link_ubicacion?: string | null
          nombre?: string | null
          provincia?: string | null
          referencia?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          departamento?: string | null
          direccion?: string | null
          distrito?: string | null
          dni?: string | null
          email?: string | null
          es_problematico?: boolean | null
          id?: number
          link_ubicacion?: string | null
          nombre?: string | null
          provincia?: string | null
          referencia?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cupones: {
        Row: {
          activo: boolean | null
          codigo: string | null
          created_at: string | null
          expires_at: string | null
          id: number
          max_usos: number | null
          min_total: number | null
          starts_at: string | null
          tipo: string | null
          usos: number | null
          valor: number | null
        }
        Insert: {
          activo?: boolean | null
          codigo?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: number
          max_usos?: number | null
          min_total?: number | null
          starts_at?: string | null
          tipo?: string | null
          usos?: number | null
          valor?: number | null
        }
        Update: {
          activo?: boolean | null
          codigo?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: number
          max_usos?: number | null
          min_total?: number | null
          starts_at?: string | null
          tipo?: string | null
          usos?: number | null
          valor?: number | null
        }
        Relationships: []
      }
      home_banners: {
        Row: {
          activo: boolean | null
          countdown_end: string | null
          created_at: string | null
          cta: string | null
          href: string | null
          id: number
          orden: number | null
          subtitle: string | null
          title: string | null
        }
        Insert: {
          activo?: boolean | null
          countdown_end?: string | null
          created_at?: string | null
          cta?: string | null
          href?: string | null
          id?: number
          orden?: number | null
          subtitle?: string | null
          title?: string | null
        }
        Update: {
          activo?: boolean | null
          countdown_end?: string | null
          created_at?: string | null
          cta?: string | null
          href?: string | null
          id?: number
          orden?: number | null
          subtitle?: string | null
          title?: string | null
        }
        Relationships: []
      }
      incidencias: {
        Row: {
          comentario: string | null
          created_at: string | null
          foto: string | null
          id: number
          pedido_id: number | null
          tipo: string | null
        }
        Insert: {
          comentario?: string | null
          created_at?: string | null
          foto?: string | null
          id?: number
          pedido_id?: number | null
          tipo?: string | null
        }
        Update: {
          comentario?: string | null
          created_at?: string | null
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
          cantidad: number | null
          costo_unitario: number | null
          created_at: string | null
          created_by: string | null
          id: number
          notas: string | null
          producto_id: number | null
          referencia: string | null
          tipo_movimiento: string | null
          variante_id: number | null
        }
        Insert: {
          almacen_id?: number | null
          cantidad?: number | null
          costo_unitario?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          notas?: string | null
          producto_id?: number | null
          referencia?: string | null
          tipo_movimiento?: string | null
          variante_id?: number | null
        }
        Update: {
          almacen_id?: number | null
          cantidad?: number | null
          costo_unitario?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          notas?: string | null
          producto_id?: number | null
          referencia?: string | null
          tipo_movimiento?: string | null
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
          apellidos: string | null
          apoderado_dni: string | null
          apoderado_nombres: string | null
          archivo_adjunto: string | null
          codigo: string | null
          created_at: string | null
          departamento: string | null
          descripcion_bien: string | null
          detalle_reclamo: string | null
          direccion: string | null
          distrito: string | null
          email: string | null
          estado: string | null
          fecha_respuesta: string | null
          id: string
          menor_edad: boolean | null
          monto_reclamado: number | null
          nombres: string | null
          numero_documento: string | null
          observaciones_proveedor: string | null
          pedido_relacionado: string | null
          provincia: string | null
          telefono: string | null
          tipo_bien: string | null
          tipo_documento: string | null
          tipo_reclamo: string | null
        }
        Insert: {
          apellidos?: string | null
          apoderado_dni?: string | null
          apoderado_nombres?: string | null
          archivo_adjunto?: string | null
          codigo?: string | null
          created_at?: string | null
          departamento?: string | null
          descripcion_bien?: string | null
          detalle_reclamo?: string | null
          direccion?: string | null
          distrito?: string | null
          email?: string | null
          estado?: string | null
          fecha_respuesta?: string | null
          id?: string
          menor_edad?: boolean | null
          monto_reclamado?: number | null
          nombres?: string | null
          numero_documento?: string | null
          observaciones_proveedor?: string | null
          pedido_relacionado?: string | null
          provincia?: string | null
          telefono?: string | null
          tipo_bien?: string | null
          tipo_documento?: string | null
          tipo_reclamo?: string | null
        }
        Update: {
          apellidos?: string | null
          apoderado_dni?: string | null
          apoderado_nombres?: string | null
          archivo_adjunto?: string | null
          codigo?: string | null
          created_at?: string | null
          departamento?: string | null
          descripcion_bien?: string | null
          detalle_reclamo?: string | null
          direccion?: string | null
          distrito?: string | null
          email?: string | null
          estado?: string | null
          fecha_respuesta?: string | null
          id?: string
          menor_edad?: boolean | null
          monto_reclamado?: number | null
          nombres?: string | null
          numero_documento?: string | null
          observaciones_proveedor?: string | null
          pedido_relacionado?: string | null
          provincia?: string | null
          telefono?: string | null
          tipo_bien?: string | null
          tipo_documento?: string | null
          tipo_reclamo?: string | null
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
          cantidad: number | null
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
          cantidad?: number | null
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
          cantidad?: number | null
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
          accion: string | null
          created_at: string | null
          detalles: string | null
          id: number
          pedido_id: number | null
          usuario_nombre: string | null
        }
        Insert: {
          accion?: string | null
          created_at?: string | null
          detalles?: string | null
          id?: number
          pedido_id?: number | null
          usuario_nombre?: string | null
        }
        Update: {
          accion?: string | null
          created_at?: string | null
          detalles?: string | null
          id?: number
          pedido_id?: number | null
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
          autor_nombre: string | null
          contenido: string | null
          created_at: string | null
          id: number
          pedido_id: number | null
          tipo: string | null
        }
        Insert: {
          autor_id?: string | null
          autor_nombre?: string | null
          contenido?: string | null
          created_at?: string | null
          id?: number
          pedido_id?: number | null
          tipo?: string | null
        }
        Update: {
          autor_id?: string | null
          autor_nombre?: string | null
          contenido?: string | null
          created_at?: string | null
          id?: number
          pedido_id?: number | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pedido_notas_autor_id_fkey"
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
          created_at: string | null
          id: number
          metodo_pago: string | null
          monto: number | null
          nota: string | null
          pedido_id: number | null
          registrado_por: string | null
          registrado_por_id: string | null
          tipo_pago: string | null
        }
        Insert: {
          comprobante_url?: string | null
          created_at?: string | null
          id?: number
          metodo_pago?: string | null
          monto?: number | null
          nota?: string | null
          pedido_id?: number | null
          registrado_por?: string | null
          registrado_por_id?: string | null
          tipo_pago?: string | null
        }
        Update: {
          comprobante_url?: string | null
          created_at?: string | null
          id?: number
          metodo_pago?: string | null
          monto?: number | null
          nota?: string | null
          pedido_id?: number | null
          registrado_por?: string | null
          registrado_por_id?: string | null
          tipo_pago?: string | null
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
          created_at: string | null
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
          pago_status: string | null
          provincia: string | null
          referencia_direccion: string | null
          shalom_clave: string | null
          shalom_orden: string | null
          shalom_pin: string | null
          status: string | null
          stock_descontado: boolean | null
          subtotal: number | null
          telefono_contacto: string | null
          total: number | null
          voucher_url: string | null
        }
        Insert: {
          agencia_destino?: string | null
          agencia_origen?: string | null
          asignado_a?: string | null
          cliente_id?: number | null
          codigo_seguimiento?: string | null
          comprobante_pago_url?: string[] | null
          created_at?: string | null
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
          pago_status?: string | null
          provincia?: string | null
          referencia_direccion?: string | null
          shalom_clave?: string | null
          shalom_orden?: string | null
          shalom_pin?: string | null
          status?: string | null
          stock_descontado?: boolean | null
          subtotal?: number | null
          telefono_contacto?: string | null
          total?: number | null
          voucher_url?: string | null
        }
        Update: {
          agencia_destino?: string | null
          agencia_origen?: string | null
          asignado_a?: string | null
          cliente_id?: number | null
          codigo_seguimiento?: string | null
          comprobante_pago_url?: string[] | null
          created_at?: string | null
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
          pago_status?: string | null
          provincia?: string | null
          referencia_direccion?: string | null
          shalom_clave?: string | null
          shalom_orden?: string | null
          shalom_pin?: string | null
          status?: string | null
          stock_descontado?: boolean | null
          subtotal?: number | null
          telefono_contacto?: string | null
          total?: number | null
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
        ]
      }
      product_answers: {
        Row: {
          answer: string | null
          answered_by: string | null
          created_at: string | null
          id: number
          published: boolean | null
          question_id: number | null
        }
        Insert: {
          answer?: string | null
          answered_by?: string | null
          created_at?: string | null
          id?: number
          published?: boolean | null
          question_id?: number | null
        }
        Update: {
          answer?: string | null
          answered_by?: string | null
          created_at?: string | null
          id?: number
          published?: boolean | null
          question_id?: number | null
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
          created_at: string | null
          id: number
          product_id: number | null
          published: boolean | null
          question: string | null
        }
        Insert: {
          asker_name?: string | null
          asker_phone?: string | null
          created_at?: string | null
          id?: number
          product_id?: number | null
          published?: boolean | null
          question?: string | null
        }
        Update: {
          asker_name?: string | null
          asker_phone?: string | null
          created_at?: string | null
          id?: number
          product_id?: number | null
          published?: boolean | null
          question?: string | null
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
          approved: boolean | null
          body: string | null
          created_at: string | null
          customer_city: string | null
          customer_name: string | null
          id: number
          order_id: number | null
          photo_urls: string[] | null
          product_id: number | null
          rating: number | null
          title: string | null
          verified: boolean | null
        }
        Insert: {
          approved?: boolean | null
          body?: string | null
          created_at?: string | null
          customer_city?: string | null
          customer_name?: string | null
          id?: number
          order_id?: number | null
          photo_urls?: string[] | null
          product_id?: number | null
          rating?: number | null
          title?: string | null
          verified?: boolean | null
        }
        Update: {
          approved?: boolean | null
          body?: string | null
          created_at?: string | null
          customer_city?: string | null
          customer_name?: string | null
          id?: number
          order_id?: number | null
          photo_urls?: string[] | null
          product_id?: number | null
          rating?: number | null
          title?: string | null
          verified?: boolean | null
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
          clave: string | null
          created_at: string | null
          id: number
          orden: number | null
          producto_id: number | null
          valor: string | null
        }
        Insert: {
          clave?: string | null
          created_at?: string | null
          id?: number
          orden?: number | null
          producto_id?: number | null
          valor?: string | null
        }
        Update: {
          clave?: string | null
          created_at?: string | null
          id?: number
          orden?: number | null
          producto_id?: number | null
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
          activo: boolean | null
          color: string | null
          created_at: string | null
          etiqueta: string | null
          id: number
          modelo: string | null
          precio: number | null
          precio_antes: number | null
          producto_id: number | null
          stock: number | null
          talla: string | null
        }
        Insert: {
          activo?: boolean | null
          color?: string | null
          created_at?: string | null
          etiqueta?: string | null
          id?: number
          modelo?: string | null
          precio?: number | null
          precio_antes?: number | null
          producto_id?: number | null
          stock?: number | null
          talla?: string | null
        }
        Update: {
          activo?: boolean | null
          color?: string | null
          created_at?: string | null
          etiqueta?: string | null
          id?: number
          modelo?: string | null
          precio?: number | null
          precio_antes?: number | null
          producto_id?: number | null
          stock?: number | null
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
          created_at: string | null
          cuidados: string | null
          descripcion: string | null
          fts: unknown
          id: number
          imagen_url: string | null
          imagenes: string[] | null
          materiales: string | null
          nombre: string | null
          precio: number | null
          precio_antes: number | null
          slug: string | null
          stock: number | null
          tamano: string | null
          uso: string | null
          videos: string[] | null
        }
        Insert: {
          calificacion?: number | null
          categoria_id?: number | null
          color?: string | null
          created_at?: string | null
          cuidados?: string | null
          descripcion?: string | null
          fts?: unknown
          id?: number
          imagen_url?: string | null
          imagenes?: string[] | null
          materiales?: string | null
          nombre?: string | null
          precio?: number | null
          precio_antes?: number | null
          slug?: string | null
          stock?: number | null
          tamano?: string | null
          uso?: string | null
          videos?: string[] | null
        }
        Update: {
          calificacion?: number | null
          categoria_id?: number | null
          color?: string | null
          created_at?: string | null
          cuidados?: string | null
          descripcion?: string | null
          fts?: unknown
          id?: number
          imagen_url?: string | null
          imagenes?: string[] | null
          materiales?: string | null
          nombre?: string | null
          precio?: number | null
          precio_antes?: number | null
          slug?: string | null
          stock?: number | null
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
          platform: string | null
          url: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: number
          orden?: number | null
          platform?: string | null
          url?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: number
          orden?: number | null
          platform?: string | null
          url?: string | null
        }
        Relationships: []
      }
      system_audit_logs: {
        Row: {
          action: string | null
          changed_at: string | null
          changed_by: string | null
          id: number
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string | null
        }
        Insert: {
          action?: string | null
          changed_at?: string | null
          changed_by?: string | null
          id?: number
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
        }
        Update: {
          action?: string | null
          changed_at?: string | null
          changed_by?: string | null
          id?: number
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          activo: boolean | null
          bloqueado_hasta: string | null
          created_at: string | null
          email: string | null
          id: string
          intentos_fallidos: number | null
          nombre: string | null
          role: string | null
          telefono: string | null
        }
        Insert: {
          activo?: boolean | null
          bloqueado_hasta?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          intentos_fallidos?: number | null
          nombre?: string | null
          role?: string | null
          telefono?: string | null
        }
        Update: {
          activo?: boolean | null
          bloqueado_hasta?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          intentos_fallidos?: number | null
          nombre?: string | null
          role?: string | null
          telefono?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_procesar_descuento_stock: {
        Args: { p_pedido_id: number; p_revertir?: boolean }
        Returns: boolean
      }
      admin_procesar_devolucion_parcial: {
        Args: {
          p_cantidad_a_devolver: number
          p_item_id: number
          p_pedido_id: number
          p_usuario_nombre: string
        }
        Returns: undefined
      }
      can_access_pedido: { Args: { pedido_id: number }; Returns: boolean }
      check_user_role: { Args: { required_roles: string[] }; Returns: boolean }
      get_admin_dashboard_stats: { Args: { p_user_id?: string }; Returns: Json }
      get_costo_promedio: {
        Args: { p_producto_id: number; p_variante_id?: number }
        Returns: number
      }
      get_sales_chart_data: {
        Args: { p_end_date: string; p_interval?: string; p_start_date: string }
        Returns: {
          order_count: number
          period_label: string
          total_sales: number
        }[]
      }
      get_top_products: {
        Args: { exclude_id?: number; limit_count?: number }
        Returns: {
          calificacion: number | null
          categoria_id: number | null
          color: string | null
          created_at: string | null
          cuidados: string | null
          descripcion: string | null
          fts: unknown
          id: number
          imagen_url: string | null
          imagenes: string[] | null
          materiales: string | null
          nombre: string | null
          precio: number | null
          precio_antes: number | null
          slug: string | null
          stock: number | null
          tamano: string | null
          uso: string | null
          videos: string[] | null
        }[]
        SetofOptions: {
          from: "*"
          to: "productos"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_user_name_by_email: { Args: { p_email: string }; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
      slugify: { Args: { value: string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
