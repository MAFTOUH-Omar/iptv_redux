# Template Management Documentation

## Table of Contents
- [Fetching Templates](#fetching-templates)
- [Fetching a Single Template](#fetching-a-single-template)
- [Fetching Bouquets by Type](#fetching-bouquets-by-type)
- [Selectors](#selectors)
- [Examples](#examples)
- [State Management](#state-management)
- [Best Practices](#best-practices)

---

## Fetching Templates

### Fetch All Templates
Utilisez l'action `fetchTemplates` pour récupérer tous les templates disponibles.

```typescript
import { useAppDispatch } from './redux/hooks';
import { fetchTemplates } from './redux/slices/templateSlice';

const dispatch = useAppDispatch();

useEffect(() => {
  dispatch(fetchTemplates());
}, [dispatch]);
```

### Fetch a Single Template
Utilisez l'action `fetchTemplateById` pour récupérer un template spécifique par son ID.

```typescript
import { useAppDispatch } from './redux/hooks';
import { fetchTemplateById } from './redux/slices/templateSlice';

const dispatch = useAppDispatch();

useEffect(() => {
  dispatch(fetchTemplateById(1)); // Remplacez 1 par l'ID du template
}, [dispatch]);
```

### Fetch Bouquets by Type
Utilisez l'action `fetchBouquetsByTemplateId` pour récupérer les bouquets d'un template par type (live, serie, movie).

```typescript
import { useAppDispatch } from './redux/hooks';
import { fetchBouquetsByTemplateId } from './redux/slices/templateSlice';

const dispatch = useAppDispatch();

useEffect(() => {
  dispatch(fetchBouquetsByTemplateId({ id: 1, type: 'live' })); // Remplacez 1 par l'ID du template
}, [dispatch]);
```

---

## Selectors

### Access All Templates
```typescript
import { useAppSelector } from './redux/hooks';
import { selectTemplates } from './redux/slices/templateSlice';

const templates = useAppSelector(selectTemplates);
```

### Access Selected Template
```typescript
import { useAppSelector } from './redux/hooks';
import { selectSelectedTemplate } from './redux/slices/templateSlice';

const selectedTemplate = useAppSelector(selectSelectedTemplate);
```

### Access Global Templates
```typescript
import { useAppSelector } from './redux/hooks';
import { selectGlobalTemplates } from './redux/slices/templateSlice';

const globalTemplates = useAppSelector(selectGlobalTemplates);
```

### Access Bouquets by Type
```typescript
import { useAppSelector } from './redux/hooks';
import { selectBouquetsByTemplateType } from './redux/slices/templateSlice';

const liveBouquets = useAppSelector((state) => 
  selectBouquetsByTemplateType(state, 'live')
);
```

---

## Examples

### Display All Templates
```typescript
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { fetchTemplates, selectTemplates } from './redux/slices/templateSlice';

export const TemplatesList = () => {
  const dispatch = useAppDispatch();
  const templates = useAppSelector(selectTemplates);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  return (
    <div>
      {templates.map(template => (
        <div key={template.id}>
          <h3>{template.name}</h3>
          <p>Global: {template.is_global ? 'Yes' : 'No'}</p>
        </div>
      ))}
    </div>
  );
};
```

### Display Bouquets for a Template
```typescript
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { fetchBouquetsByTemplateId, selectBouquetsByTemplateType } from './redux/slices/templateSlice';

export const TemplateBouquets = ({ id, type }: { id: number; type: string }) => {
  const dispatch = useAppDispatch();
  const bouquets = useAppSelector((state) => selectBouquetsByTemplateType(state, type));

  useEffect(() => {
    dispatch(fetchBouquetsByTemplateId({ id, type }));
  }, [dispatch, id, type]);

  return (
    <div>
      {bouquets.map(bouquet => (
        <div key={bouquet.id}>
          <h3>{bouquet.bouquet_name}</h3>
          <p>Type: {bouquet.type}</p>
        </div>
      ))}
    </div>
  );
};
```

---

## State Management

Le slice `templateSlice` maintient l'état suivant :
```typescript
interface TemplateState {
  items: Template[]; // Liste de tous les templates
  selectedTemplate: Template | null; // Template sélectionné
  loading: boolean; // État de chargement
  error: string | null; // Message d'erreur
}
```

- `items` : Liste de tous les templates récupérés.
- `selectedTemplate` : Template actuellement sélectionné.
- `loading` : Indique si une opération asynchrone est en cours.
- `error` : Contient un message d'erreur en cas d'échec d'une opération.

---

## Best Practices

1. **Gérer les états de chargement et d'erreur** :
```typescript
const { loading, error } = useAppSelector(state => state.templates);

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
```

2. **Utiliser des sélecteurs optimisés** :
```typescript
// Au lieu de
const { items } = useAppSelector(state => state.templates);

// Utilisez
const templates = useAppSelector(selectTemplates);
```

3. **Vider le template sélectionné après utilisation** :
```typescript
import { clearSelectedTemplate } from './redux/slices/templateSlice';

useEffect(() => {
  return () => {
    dispatch(clearSelectedTemplate());
  };
}, [dispatch]);
```

4. **Gérer les erreurs d'API** :
```typescript
try {
  await dispatch(fetchTemplateById(1)).unwrap();
} catch (error) {
  console.error('Failed to fetch template:', error);
}
```