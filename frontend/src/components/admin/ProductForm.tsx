'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Star, StarOff, Trash2, Plus, ImageIcon, Link as LinkIcon } from 'lucide-react'
import { adminApi } from '@/lib/api/admin'
import { productsApi } from '@/lib/api/products'
import { cn } from '@/lib/utils/cn'
import slugify from 'slugify'
import type { Product } from '@/types/product'

interface ProductFormProps {
  product?: Product
}

function ImageManager({ product }: { product: Product }) {
  const queryClient = useQueryClient()
  const [url, setUrl] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)

  const addImageMutation = useMutation({
    mutationFn: (params: { url: string; altText?: string }) =>
      adminApi.addProductImage(product.id, params.url, params.altText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-product', product.id] })
      queryClient.invalidateQueries({ queryKey: ['product', product.slug] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setUrl('')
      setShowUrlInput(false)
    },
  })

  const deleteImageMutation = useMutation({
    mutationFn: (imageId: string) =>
      adminApi.deleteProductImage(product.id, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-product', product.id] })
      queryClient.invalidateQueries({ queryKey: ['product', product.slug] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const setPrimaryMutation = useMutation({
    mutationFn: (imageId: string) =>
      adminApi.setPrimaryImage(product.id, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-product', product.id] })
      queryClient.invalidateQueries({ queryKey: ['product', product.slug] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const images = product.images ?? []

  return (
    <div className="rounded-xl bg-white p-6 boty-shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-[1.8rem] font-semibold text-foreground">Imágenes</h2>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="flex items-center gap-1.5 rounded-full bg-brand-accent/10 px-4 py-2 text-[1.2rem] font-medium text-brand-accent hover:bg-brand-accent/20 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Agregar imagen
        </button>
      </div>

      {showUrlInput && (
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-label="URL de la imagen"
            placeholder="URL de la imagen..."
            className="input-field flex-1 px-3 py-2 text-[1.4rem]"
          />
          <button
            type="button"
            onClick={() => {
              if (url.trim()) {
                addImageMutation.mutate({ url: url.trim() })
              }
            }}
            disabled={addImageMutation.isPending || !url.trim()}
            className="btn-primary flex items-center gap-2 px-4 py-2 text-[1.3rem] disabled:opacity-50"
          >
            {addImageMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LinkIcon className="h-4 w-4" />
            )}
            Agregar
          </button>
        </div>
      )}

      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-8 text-center">
          <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground/30" />
          <p className="text-[1.3rem] text-muted-foreground">Sin imágenes</p>
          <p className="text-[1.2rem] text-muted-foreground">Agrega una imagen por URL</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="group relative overflow-hidden rounded-lg border border-border">
              <div className="relative aspect-square bg-muted">
                <Image
                  src={img.url}
                  alt={img.altText || ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 group-hover:bg-black/30 group-hover:opacity-100 transition-all">
                <button
                  type="button"
                  onClick={() => setPrimaryMutation.mutate(img.id)}
                  disabled={setPrimaryMutation.isPending || img.isPrimary}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                    img.isPrimary
                      ? 'bg-yellow-400 text-white cursor-not-allowed'
                      : 'bg-white/90 text-muted-foreground hover:bg-white',
                  )}
                  title={img.isPrimary ? 'Imagen principal' : 'Establecer como principal'}
                >
                  {img.isPrimary ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('¿Eliminar esta imagen?')) {
                      deleteImageMutation.mutate(img.id)
                    }
                  }}
                  disabled={deleteImageMutation.isPending}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 hover:bg-white transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {img.isPrimary && (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-yellow-400 px-2 py-0.5 text-[1rem] font-medium text-white">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const isEditing = !!product

  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [description, setDescription] = useState(product?.description ?? '')
  const [shortDescription, setShortDescription] = useState(product?.shortDescription ?? '')
  const [sku, setSku] = useState(product?.sku ?? '')
  const [brand, setBrand] = useState(product?.brand ?? '')
  const [basePrice, setBasePrice] = useState(product?.basePrice?.toString() ?? '')
  const [comparePrice, setComparePrice] = useState(product?.comparePrice?.toString() ?? '')
  const [stock, setStock] = useState(product?.stock?.toString() ?? '0')
  const [categoryId, setCategoryId] = useState(product?.category?.id ?? '')
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false)
  const [genero, setGenero] = useState(product?.genero ?? '')
  const [tags, setTags] = useState('')

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productsApi.getCategories(),
  })

  const flattenCategories = (cats: typeof categories, depth = 0): Array<{ id: string; name: string; depth: number }> => {
    if (!cats) return []
    const result: Array<{ id: string; name: string; depth: number }> = []
    for (const c of cats) {
      result.push({ id: c.id, name: c.name, depth })
      if (c.children?.length) result.push(...flattenCategories(c.children, depth + 1))
    }
    return result
  }

  const flatCategories = flattenCategories(categories)

  const effectiveSlug = !slugManuallyEdited && name
    ? slugify(name, { lower: true, strict: true })
    : slug

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = {
        name,
        slug: effectiveSlug,
        description: description || undefined,
        shortDescription: shortDescription || undefined,
        sku: sku || undefined,
        brand: brand || undefined,
        basePrice: basePrice ? Number(basePrice) : undefined,
        comparePrice: comparePrice ? Number(comparePrice) : undefined,
        stock: stock ? Number(stock) : undefined,
        categoryId: categoryId || undefined,
        isFeatured,
        genero: genero || undefined,
        tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      }
      if (isEditing && product) {
        return adminApi.updateProduct(product.id, payload)
      }
      return adminApi.createProduct(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      if (product) {
        queryClient.invalidateQueries({ queryKey: ['product', product.slug] })
      }
      router.push('/admin/products')
    },
  })

  const sectionClass = 'rounded-xl bg-white p-6 boty-shadow'

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        mutation.mutate()
      }}
    >
      <div className="space-y-6">
        {/* Row 1: info / description / image */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1fr]">
          <div className={sectionClass}>
            <h2 className="mb-4 font-serif text-[1.8rem] font-semibold text-foreground">Información básica</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="pf-name" className="mb-1 block text-[1.3rem] font-medium text-foreground">Nombre *</label>
                <input
                  id="pf-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="input-field w-full px-3 py-2.5 text-[1.4rem]"
                />
              </div>
              <div>
                <label htmlFor="pf-slug" className="mb-1 block text-[1.3rem] font-medium text-foreground">Slug</label>
                <input
                  id="pf-slug"
                  type="text"
                  value={slug}
                  onChange={(e) => { setSlug(e.target.value); setSlugManuallyEdited(true) }}
                  className="input-field w-full px-3 py-2.5 text-[1.4rem] font-mono"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="pf-brand" className="mb-1 block text-[1.3rem] font-medium text-foreground">Marca</label>
                  <input
                    id="pf-brand"
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="input-field w-full px-3 py-2.5 text-[1.4rem]"
                  />
                </div>
                <div>
                  <label htmlFor="pf-sku" className="mb-1 block text-[1.3rem] font-medium text-foreground">SKU</label>
                  <input
                    id="pf-sku"
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="input-field w-full px-3 py-2.5 text-[1.4rem] font-mono"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="pf-category" className="mb-1 block text-[1.3rem] font-medium text-foreground">Categoría</label>
                <select
                  id="pf-category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="input-field w-full px-3 py-2.5 text-[1.4rem]"
                >
                  <option value="">Sin categoría</option>
                  {flatCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.depth > 0 ? `${'\u00A0'.repeat(cat.depth * 2)}${cat.name}` : cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="pf-genero" className="mb-1 block text-[1.3rem] font-medium text-foreground">Género</label>
                <select
                  id="pf-genero"
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                  className="input-field w-full px-3 py-2.5 text-[1.4rem]"
                >
                  <option value="">Sin género</option>
                  <option value="Hombre">Hombre</option>
                  <option value="Mujer">Mujer</option>
                  <option value="Niños">Niños</option>
                </select>
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <h2 className="mb-4 font-serif text-[1.8rem] font-semibold text-foreground">Descripción</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="pf-short-desc" className="mb-1 block text-[1.3rem] font-medium text-foreground">Descripción corta</label>
                <input
                  id="pf-short-desc"
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="input-field w-full px-3 py-2.5 text-[1.4rem]"
                />
              </div>
              <div>
                <label htmlFor="pf-desc" className="mb-1 block text-[1.3rem] font-medium text-foreground">Descripción</label>
                <textarea
                  id="pf-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="input-field w-full resize-none px-3 py-2.5 text-[1.4rem]"
                />
              </div>
            </div>
          </div>

          <div>
            {isEditing && product ? (
              <ImageManager product={product} />
            ) : (
              <div className={sectionClass}>
                <h2 className="mb-4 font-serif text-[1.8rem] font-semibold text-foreground">Imágenes</h2>
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-8 text-center">
                  <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground/30" />
                  <p className="text-[1.3rem] text-muted-foreground">Guarda el producto primero</p>
                  <p className="text-[1.2rem] text-muted-foreground">Luego podrás agregar imágenes</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: price / tags */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className={sectionClass}>
            <h2 className="mb-4 font-serif text-[1.8rem] font-semibold text-foreground">Precio y stock</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="pf-base-price" className="mb-1 block text-[1.3rem] font-medium text-foreground">Precio base</label>
                <input
                  id="pf-base-price"
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  min="0"
                  step="0.01"
                  className="input-field w-full px-3 py-2.5 text-[1.4rem]"
                />
              </div>
              <div>
                <label htmlFor="pf-compare-price" className="mb-1 block text-[1.3rem] font-medium text-foreground">Precio comparativo</label>
                <input
                  id="pf-compare-price"
                  type="number"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(e.target.value)}
                  min="0"
                  step="0.01"
                  className="input-field w-full px-3 py-2.5 text-[1.4rem]"
                />
              </div>
              <div>
                <label htmlFor="pf-stock" className="mb-1 block text-[1.3rem] font-medium text-foreground">Stock</label>
                <input
                  id="pf-stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  min="0"
                  className="input-field w-full px-3 py-2.5 text-[1.4rem]"
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-brand-accent"
                  />
                  <span className="text-[1.4rem] text-foreground">Producto destacado</span>
                </label>
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <h2 className="mb-4 font-serif text-[1.8rem] font-semibold text-foreground">Tags</h2>
            <div>
              <label htmlFor="pf-tags" className="mb-1 block text-[1.3rem] font-medium text-foreground">Tags (separados por coma)</label>
              <input
                id="pf-tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="nuevo, oferta, destacado"
                className="input-field w-full px-3 py-2.5 text-[1.4rem]"
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {mutation.isError && (
          <div className="rounded-lg bg-red-50 p-4 text-[1.3rem] text-red-600">
            {mutation.error instanceof Error ? mutation.error.message : 'Error al guardar el producto'}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-primary flex items-center gap-2 px-6 py-3 text-[1.4rem] disabled:opacity-50"
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEditing ? 'Actualizar producto' : 'Crear producto'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="btn-outline px-6 py-3 text-[1.4rem]"
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  )
}
