---
title: "Funciones en PL/SQL"
date: "2026-09-01T20:00:00+08:00"
updated: "2026-09-03T17:45:29+08:00"
"description": "En este espacio se explica de manera clara, detallada y visual los procedimientos, para que se utilizan, su estructura, ejemplos y ejercicios."
draft: false
categories:
  - "PLSQL"
tags: []
----

### ¿Qué es un procedimiento?

Un procedimiento es un bloque de código PL/SQL que se guarda en la base de datos para ejecutar una acción cuando lo necesitemos.

Por ejemplo, para realizar:

- Registrar un empleado.
- Actualizar el salario de un empleado.
- Eliminar un registro.
- Registrar una matrícula.
- Consultar un dato y entregárselo a otro bloque.

### ¿En qué se diferencia de una función?

<table border="1" cellpadding="8" cellspacing="0">
  <thead>
    <tr>
      <th></th>
      <th>Función (FUNCTION)</th>
      <th>Procedimiento (PROCEDURE)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Propósito</th>
      <td>Calcula y devuelve un valor con RETURN.</td>
      <td>Ejecuta una acción.</td>
    </tr>
    <tr>
      <th>Ejemplo</th>
      <td>Calcular el salario anual.</td>
      <td>Actualizar el salario.</td>
    </tr>
    <tr>
      <th>Uso</th>
      <td>Se puede usar en expresiones y, con restricciones, en SQL.</td>
      <td>Se invoca como una instrucción PL/SQL.</td>
    </tr>
    <tr>
      <th>Resultado</th>
      <td>Su resultado principal es un valor.</td>
      <td>Puede comunicar resultados con parámetros OUT.</td>
    </tr>
  </tbody>
</table>

### Estructura general de un procedimiento

```sql
CREATE OR REPLACE PROCEDURE nombre_procedimiento (
    parametro IN NUMBER
)
IS
    -- Variables locales
BEGIN
    -- Instrucciones que se ejecutan
EXCEPTION
    -- Manejo de errores (opcional)
END nombre_procedimiento;
/
```

### Los parámetros: IN, OUT e IN OUT

1. IN

Es el modo predeterminado. El procedimiento recibe un valor y puede leerlo, pero no reasignar ese parámetro dentro del procedimiento.

EJEMPLO:

```sql
CREATE OR REPLACE PROCEDURE PR_MOSTRAR_ID (
    P_ID IN NUMBER
)
IS
BEGIN
    DBMS_OUTPUT.PUT_LINE('ID: ' || P_ID);
END PR_MOSTRAR_ID;
/
```

2. OUT

Se utiliza cuando quieres que el procedimiento entregue un resultado mediante una variable.

EJEMPLO;

```sql
CREATE OR REPLACE PROCEDURE PR_DOBLE (
    P_NUMERO IN NUMBER,
    P_RESULTADO OUT NUMBER
)
IS
BEGIN
    P_RESULTADO := P_NUMERO * 2;
END PR_DOBLE;
/
```

3. IN OUT: recibir y devolver modificado

El dato entra con un valor y sale con el valor modificado.

```sql
CREATE OR REPLACE PROCEDURE PR_INCREMENTAR (
    P_NUMERO IN OUT NUMBER
)
IS
BEGIN
    P_NUMERO := P_NUMERO + 1;
END PR_INCREMENTAR;
/
```

Resumen para memorizar

<table border="1" cellpadding="8" cellspacing="0">
  <caption>Resumen para memorizar: modos de parámetros</caption>
  <thead>
    <tr>
      <th>Modo</th>
      <th>¿Qué hace?</th>
      <th>Ejemplo</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>IN</td>
      <td>Recibe un dato.</td>
      <td>ID de empleado.</td>
    </tr>
    <tr>
      <td>OUT</td>
      <td>Entrega un dato.</td>
      <td>Resultado de un cálculo.</td>
    </tr>
    <tr>
      <td>IN OUT</td>
      <td>Recibe y modifica un dato.</td>
      <td>Incrementar un contador.</td>
    </tr>
  </tbody>
</table>

### Ejemplo real: actualizar el salario de un empleado


