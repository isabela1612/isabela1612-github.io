---
title: "Procedimientos en PL/SQL"
date: "2026-09-01T20:00:00+08:00"
updated: "2026-09-03T17:45:29+08:00"
"description": "En este espacio se explica de manera clara, detallada y visual los procedimientos, para que se utilizan, su estructura, ejemplos y ejercicios."
draft: false
categories:
  - "PLSQL"
tags: []
---
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

### ¿Cómo se ejecuta un procedimiento?

un procedimiento normalmente no se ejecuta con SELECT, a diferencia de una función.

En una funcion:
```sql
SELECT FUNCION(3) FROM DUAL;
```
> Devuelve un valor

En un procedimiento no esta solictando un valor que deba devolver la consulta, se hace de dos formas:

>Opción 1

Con EXEC

```sql
EXEC PR_SALUDO;
```

> Opción 2

Con un bloque PL/SQL

```sql
BEGIN
    PR_SALUDO;
END;
/
```

> Regla: la función devuelve un valor con RETURN; el procedimiento se invoca como una instrucción y puede comunicar resultados mediante parámetros OUT.

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

En una funcion se utiliza return para obtener un valor calculado dentro de esta, en el procedimiento se hace con out como parametro

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

los dos parámetros:

- P_NUMERO IN NUMBER: recibe el número.
- P_RESULTADO OUT NUMBER: entrega el resultado calculado.

¿Cómo lo ejecutamos?

```sql
DECLARE
    V_RESULTADO NUMBER;
BEGIN
    PR_DOBLE(5, V_RESULTADO);

    DBMS_OUTPUT.PUT_LINE(V_RESULTADO);
END;
/
```

Resultado: 10 ---> Sale del procedimiento y queda en V_RESULTADO.

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
  <caption>modos de parámetros</caption>
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

Objetivo: crear un procedimiento que reciba el ID de un empleado y un nuevo salario, y actualice su registro.

```sql
CREATE OR REPLACE PROCEDURE PR_ACTUALIZAR_SALARIO (
    P_ID IN HR.EMPLOYEES.EMPLOYEE_ID%TYPE,
    P_SALARIO IN HR.EMPLOYEES.SALARY%TYPE
)
IS
BEGIN
    UPDATE HR.EMPLOYEES
    SET SALARY = P_SALARIO
    WHERE EMPLOYEE_ID = P_ID;
END PR_ACTUALIZAR_SALARIO;
/
```

💡 El procedimiento no necesita devolver un valor con RETURN. Su acción consiste en evaluar una condición y mostrar un mensaje.

### Manejo de excepciones: EXCEPTION

En PL/SQL puedes manejar ciertos errores mediante EXCEPTION.

Ejemplo;

```sql
CREATE OR REPLACE PROCEDURE PR_BUSCAR_EMPLEADO (
    P_ID IN HR.EMPLOYEES.EMPLOYEE_ID%TYPE
)
IS
    V_NOMBRE HR.EMPLOYEES.FIRST_NAME%TYPE;
BEGIN
    SELECT FIRST_NAME
    INTO V_NOMBRE
    FROM HR.EMPLOYEES
    WHERE EMPLOYEE_ID = P_ID;

    DBMS_OUTPUT.PUT_LINE('Nombre: ' || V_NOMBRE);

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Empleado no encontrado');
END PR_BUSCAR_EMPLEADO;
/
```

### COMMIT y ROLLBACK: ¿quién confirma los cambios?

un procedimiento puede ejecutar operaciones INSERT, UPDATE y DELETE.

- COMMIT: confirma los cambios de la transacción.
- ROLLBACK: revierte los cambios pendientes de la transacción.
- SAVEPOINT: establece un punto al que puedes regresar con ROLLBACK TO.

normalmente quien inicia la transacción decide cuándo confirmarla. Un procedimiento reutilizable no debería ejecutar un COMMIT sin una razón clara, porque podría confirmar también cambios que el código que lo llamó todavía no quería confirmar.

### Errores frecuentes en procedimientos

<table border="1" cellpadding="8" cellspacing="0">
  <caption>Errores y problemas comunes</caption>
  <thead>
    <tr>
      <th>Error o problema</th>
      <th>¿Qué significa?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>PLS-00306</td>
      <td>El número o los tipos de argumentos no coinciden con la definición del procedimiento.</td>
    </tr>
    <tr>
      <td>Parámetro OUT en NULL</td>
      <td>Alguna ruta del procedimiento no le asignó un valor.</td>
    </tr>
    <tr>
      <td>El procedimiento aparece INVALID</td>
      <td>Tiene errores de compilación o alguna dependencia que debe revisarse.</td>
    </tr>
    <tr>
      <td>No ves el mensaje</td>
      <td>Puede faltar SET SERVEROUTPUT ON.</td>
    </tr>
    <tr>
      <td>Los cambios no aparecen en otra sesión</td>
      <td></td>
    </tr>
  </tbody>
</table>

Si el procedimiento no compila:

```sql
SHOW ERRORS PROCEDURE PR_ACTUALIZAR_SALARIO;
```

### Preguntas teoricas



### Ejercicios practicos

Ejercicio 1. Calcular y mostrar

Crea un procedimiento llamado PR_CALCULAR_DOBLE que reciba un número, calcule su doble y lo muestre usando DBMS_OUTPUT.PUT_LINE.

Prueba con los valores 5, 8 y 12.

SOLUCION

```sql
CREATE OR REPLACE PROCEDURE PR_CALCULAR_DOBLE(
VN_CALCULAR_DOBLE IN NUMBER
) IS
VN_CALCULAR NUMBER;
BEGIN
VN_CALCULAR := VN_CALCULAR_DOBLE * 2;
DBMS_OUTPUT.PUT_LINE(VN_CALCULAR);
END PR_CALCULAR_DOBLE;
/
```
```sql
EXEC PR_CALCULAR_DOBLE(5);
EXEC PR_CALCULAR_DOBLE(8);
EXEC PR_CALCULAR_DOBLE(12);
```
