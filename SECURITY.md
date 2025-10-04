# Seguridad de Contraseñas

## Implementación de Bcrypt

Este proyecto utiliza **bcrypt** para el hash de contraseñas, proporcionando seguridad robusta para las credenciales de los usuarios.

## Características de Seguridad

### 1. Hash de Contraseñas

- ✅ Todas las contraseñas se hashean automáticamente antes de guardarse en la base de datos
- ✅ Se utiliza bcrypt con 10 salt rounds (factor de costo)
- ✅ Las contraseñas **NUNCA** se almacenan en texto plano

### 2. Protección en Respuestas API

- ✅ El campo `password` tiene `select: false` en el schema de Mongoose
- ✅ Las contraseñas **NUNCA** se devuelven en las respuestas de la API
- ✅ Solo se incluyen en consultas específicas cuando se necesita validar credenciales

### 3. Validación de Contraseñas

Se proporciona el método `validatePassword()` en el servicio de usuarios para comparar contraseñas de forma segura:

```typescript
const isValid = await usersService.validatePassword(
  plainPassword,
  hashedPassword,
);
```

## Ejemplo de Uso

### Crear un Usuario

```typescript
// La contraseña se hashea automáticamente
const user = await usersService.create({
  name: 'John Doe',
  email: 'john@nasa.gov',
  password: 'mySecurePassword123!' // Será hasheada automáticamente
});

// Respuesta (sin contraseña)
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@nasa.gov",
  "image": null,
  "createdAt": "...",
  "updatedAt": "..."
}
```

### Validar Contraseña

```typescript
const user = await usersService.findByEmail('john@nasa.gov');
const isPasswordValid = await usersService.validatePassword(
  'userInputPassword',
  user.password,
);
```

## Mejores Prácticas

1. **Nunca** comparar contraseñas con `===` o `==`
2. **Siempre** usar `validatePassword()` para verificar contraseñas
3. **Nunca** enviar contraseñas hasheadas al cliente
4. **Siempre** requerir contraseñas fuertes en el frontend

## Configuración

El factor de costo (salt rounds) está configurado en 10, que proporciona un buen balance entre seguridad y rendimiento. Si necesitas mayor seguridad (para aplicaciones de alta sensibilidad), puedes aumentar este valor en `users.service.ts`:

```typescript
private readonly saltRounds = 12; // Mayor seguridad, más lento
```

## Dependencias

- `bcrypt`: ^5.1.1
- `@types/bcrypt`: ^5.0.2
