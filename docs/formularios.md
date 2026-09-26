# Estándar de formularios — techstorepro

Referencia canónica: `src/app/features/auth/login/login.html` y
`src/app/features/auth/register/register.html` (mismo diseño).
Todo formulario del proyecto debe verse y comportarse como esos dos.

## Tokens (únicos, no inventar otros)

| Elemento              | Clases                                                     |
| --------------------- | ---------------------------------------------------------- |
| Borde de campo        | `border-neutral-200` (único borde permitido en forms)      |
| Label                 | `text-sm text-neutral-800`                                 |
| Input / select / textarea | `w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-600 focus:outline-none` |
| Error de validación   | `text-sm text-red-500`                                     |
| Título página (auth)  | `text-2xl text-neutral-800` + subtítulo `text-sm text-neutral-600` |
| Título flotante       | `text-base text-neutral-800` (elemento `h2`)               |
| Botón primario página | `w-full cursor-pointer rounded-xl bg-green-800 px-4 py-2.5 text-sm text-white` |
| Botón primario flotante | `cursor-pointer rounded-xl bg-green-800 px-4 py-2 text-sm text-white` |
| Botón cancelar        | `cursor-pointer rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-600` |
| Overlay flotante      | `fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 p-4` |
| Form flotante         | `flex w-full max-w-md flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6` (`max-w-lg` solo si lleva fila de 2 columnas) |

## Patrones

Campo (siempre con `label` + `for`/`id`, nunca solo `placeholder`):

```html
<div class="flex flex-col gap-2">
  <label for="email" class="text-sm text-neutral-800">Email</label>
  <input id="email" ... class="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-600 focus:outline-none" />
  <p class="text-sm text-red-500">Introduce un correo válido.</p>
</div>
```

Form de página / inline: `class="flex flex-col gap-4"` con `(ngSubmit)`.

Form flotante: el `form` es hijo directo del overlay, con `h2` de título y
fila de acciones al final. Solo se cierra con el botón Cancelar
(`type="button"`) o con submit exitoso.

```html
<div class="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 p-4">
  <form (ngSubmit)="save()" class="flex w-full max-w-md flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6">
    <h2 class="text-base text-neutral-800">Nueva categoría</h2>
    <!-- campos -->
    <div class="flex justify-end gap-2">
      <button type="button" (click)="close()" class="cursor-pointer rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-600">Cancelar</button>
      <button type="submit" class="cursor-pointer rounded-xl bg-green-800 px-4 py-2 text-sm text-white">Crear</button>
    </div>
  </form>
</div>
```

## Prohibido en formularios

- `hover:` en botones (el `hover:bg-green-800` con el mismo color es código
  muerto). Si algún hover fuese necesario, solo con el token `main-transition`.
- `(click)` en el overlay para cerrar y `$event.stopPropagation()` en el form.
  Sin excepciones: la única salida es Cancelar.
- Otros bordes (`neutral-300`), otros radios (`rounded-lg`), `bg-neutral-50`
  en campos, `transition-all`, `backdrop-blur`, fondos de overlay distintos.
- `div` + `input` sueltos donde debe haber `form` + `(ngSubmit)` + `type="submit"`.
- `type` sin declarar en `button`, `[(ngModel)]` dentro de `form` sin `name`.
- Errores en verde (`text-green-800`): siempre `text-red-500`.

## Formularios del proyecto

| Formulario | Tipo | Archivo |
| ---------- | ---- | ------- |
| Login | página (referencia) | `features/auth/login/login.html` |
| Register | página (referencia) | `features/auth/register/register.html` |
| Checkout | inline | `features/shop/cart/cart.html` |
| Reseña | inline | `features/shop/product-detail/product-detail.html` |
| Editar perfil | flotante | `features/shop/my-orders/my-orders.html` |
| Producto | flotante | `features/admin/products/product-form/product-form.html` |
| Categoría | flotante | `features/admin/categories/admin-categories.html` |

Fuera de alcance: buscador del header y `select` de estado en
`admin-orders.html` (controles inline, no formularios).
