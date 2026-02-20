// ✅ FORMA 1 — sin dependencia externa (stream lee signals directo)
private readonly dataRX = rxResource({
  stream: () => {
    const payload = this.submitPayload(); // signal leído aquí
    if (!payload) return NEVER;
    return this.service.update(payload.id, payload.dto);
  },
});

// ✅ FORMA 2 — con params (dependencia reactiva declarada explícitamente)
private readonly dataRX = rxResource({
  params: () => this.authUser().userId,   // 👈 signal separado como params
  stream: ({ params: id }) => {           // 👈 recibe el valor resuelto
    if (!id) return of(null);
    return this.service.getById(id).pipe(...);
  },
});
```

> `params` es útil cuando el trigger es un valor derivado de otro signal. Cuando el stream es autosuficiente, se leen signals directamente.

---

### Prompt actualizado con estos fixes:
```
Estoy trabajando con Angular 21. Responde SIEMPRE usando las prácticas modernas 
y NUNCA uses patrones deprecated o legacy. Sigue estas reglas estrictamente:

---

### ❌ PROHIBIDO — Nunca uses esto:

- `constructor()` para lógica → usa `inject()` e inicialización directa en clase
- `ngOnInit`, `ngOnDestroy` u otros lifecycle hooks → usa `effect()` o `computed()`
- `@Input()` decorator → usa `input<Type>()` o `input.required<Type>()`
- `@Output()` decorator → usa `output<Type>()`
- `*ngIf`, `*ngFor`, `*ngSwitch` → usa `@if`, `@for`, `@switch` (control flow moderno)
- `ngModel` / `FormsModule` → usa signals + eventos directos
- `async` pipe → usa `toSignal()` o `rxResource()`
- `BehaviorSubject` / `Subject` para estado → usa `signal()` y `computed()`
- `subscribe()` para peticiones HTTP en componentes → usa `rxResource()`
- `takeUntilDestroyed` manual → no es necesario con `rxResource()`
- `EventEmitter` → usa `output<Type>()`
- `NgModule` → usa standalone components únicamente
- `CommonModule` → NO importar nunca, si necesitas pipes impórtalos directo (DatePipe, CurrencyPipe, etc.)
- `EMPTY` en `rxResource` → usa `NEVER` para estado idle sin params, o `of(null)` si params es null

---

### ✅ OBLIGATORIO — Siempre usa esto:

**Inyección de dependencias:**
\`\`\`typescript
private readonly userService = inject(UserService);
private readonly router      = inject(Router);
\`\`\`

**Inputs/Outputs:**
\`\`\`typescript
readonly name     = input.required<string>();
readonly age      = input<number | null>(null);
readonly onSubmit = output<UserVM>();
\`\`\`

**Estado local:**
\`\`\`typescript
readonly isLoading    = signal(false);
readonly errorMessage = signal<string | null>(null);
readonly displayName  = computed(() => this.name().toUpperCase());
\`\`\`

**Estado desde history/navigation:**
\`\`\`typescript
private readonly state = history.state as { userVM?: UserVM };
readonly userVM = signal<UserVM | null>(this.state.userVM ?? null);
\`\`\`

**HTTP reactivo GET — sin dependencia externa (stream autosuficiente):**
\`\`\`typescript
private readonly dataRX = rxResource({
  stream: () => {
    return this.userService.getAll().pipe(
      map(response => {
        if (!response.isSuccess) throw new Error(response.message);
        return response.result;
      })
    );
  },
});
\`\`\`

**HTTP reactivo GET — con dependencia reactiva externa (params):**
\`\`\`typescript
private readonly dataRX = rxResource({
  params: () => this.authUser().userId,      // signal como trigger
  stream: ({ params: id }) => {
    if (!id) return of(null);                // params null → no fetch

    return this.userService.getById(id).pipe(
      map(response => {
        if (!response.isSuccess) throw new Error(response.message);
        return response.result;
      })
    );
  },
});
\`\`\`

**HTTP reactivo POST/PUT/DELETE — mutación con trigger signal:**
\`\`\`typescript
private readonly submitPayload = signal<{ id: number; dto: UpdateDTO } | null>(null);

private readonly updateRX = rxResource({
  stream: () => {
    const payload = this.submitPayload();
    if (!payload) return NEVER;             // sin payload → idle

    return this.service.update(payload.id, payload.dto).pipe(
      map(response => {
        if (!response.isSuccess) throw new Error(response.message);
        return response.result;
      })
    );
  },
});
\`\`\`

**Estado derivado del resource:**
\`\`\`typescript
readonly isLoading = this.dataRX.isLoading;
readonly error     = computed(() => this.dataRX.error()?.message ?? null);
readonly data      = computed(() => this.dataRX.value() ?? null);
\`\`\`

**Observable → Signal:**
\`\`\`typescript
readonly userRole = toSignal(
  this.roleService.getAll().pipe(
    catchError(err => of(null))
  ),
  { initialValue: undefined }
);
\`\`\`

**Efectos secundarios:**
\`\`\`typescript
private readonly onSuccess = effect(() => {
  if (this.updateRX.value() && !this.updateRX.error()) {
    this.router.navigateByUrl('/destino');
  }
});
\`\`\`

**Templates — control flow moderno:**
\`\`\`html
@if (isLoading()) { <app-spinner /> }
@else if (error()) { <app-error [message]="error()!" /> }
@else {
  @for (item of data(); track item.id) {
    <app-card [data]="item" />
  }
}
\`\`\`

---

### Estructura de componente base esperada:

\`\`\`typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [...],          // sin CommonModule
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  // 1. Inputs / Outputs
  readonly data   = input.required<UserVM>();
  readonly onSave = output<UserVM>();

  // 2. Servicios
  private readonly userService = inject(UserService);
  private readonly router      = inject(Router);

  // 3. Estado local
  readonly isLoading = signal(false);
  readonly error     = signal<string | null>(null);

  // 4. Recursos reactivos
  private readonly saveRX = rxResource({ stream: () => { ... } });

  // 5. Computed
  readonly displayName = computed(() => this.data().name.toUpperCase());

  // 6. Effects
  private readonly onSaveSuccess = effect(() => { ... });

  // 7. Métodos protegidos (usados en template)
  protected onSubmit(): void { ... }
}
\`\`\`