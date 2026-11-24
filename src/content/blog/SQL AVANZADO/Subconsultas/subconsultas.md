---
title: "Subconsultas en SQL"
date: "2026-10-11T20:00:00+08:00"
updated: "2026-10-12T17:45:29+08:00"
"description": "En este espacio hablare y explicare sobre las subconsultas en SQL"
draft: false
categories:
  - "SQL Avanzado"
tags: []
---

## ¿Qué es una subconsulta?

Una subconsulta es una consulta SQL que se encuentra dentro de otra consulta. Su propósito es obtener un resultado que la consulta principal pueda utilizar para realizar una operación, filtrar registros, comparar valores o generar información adicional.

En lugar de realizar varias consultas por separado, podemos utilizar una subconsulta para que una consulta obtenga la información que necesita directamente de otra.

EJEMPLO

imaginemos que queremos consultar los empleados que ganan más que el salario promedio de todos los empleados.

para esto tenemos que:

1. tendríamos que conocer el salario promedio
2. utilizar ese resultado para buscar a los empleados que ganan más

1. 
```sql
SELECT AVG(SALARY)
FROM HR.EMPLOYEES;
```
2. 
```sql
SELECT EMPLOYEE_ID, LAST_NAME, SALARY
FROM HR.EMPLOYEES
WHERE SALARY > 8000;
```

Pero si queremos que el promedio se calcule automáticamente y no tener que escribirlo manualmente, podemos utilizar una subconsulta:

```sql
SELECT EMPLOYEE_ID, LAST_NAME, SALARY
FROM HR.EMPLOYEES
WHERE SALARY > (
    SELECT AVG(SALARY)
    FROM HR.EMPLOYEES
);
```
Lo que hace la consulta interna es calcular el salario promedio de todos los empledos, y la consulta externa utiliza ese resultadi para filtrar los empleados que tienen un salario superior al promedio

> NOTA
La subconsulta proporciona un valor que la consulta principal necesita para realizar la comparación.

> En este caso, la subconsulta devuelve un único valor, por lo que puede utilizarse con el operador >.

## ¿Para qué sirven las subconsultas?

Las subconsultas permiten resolver situaciones en las que necesitamos obtener información adicional antes de determinar el resultado de una consulta principal.

Por ejemplo, podemos utilizarlas para buscar empleados que ganen más que el promedio de su departamento, empleados que pertenezcan a departamentos específicos o empleados que no tengan subordinados.

## Estructura de una subconsulta

Una subconsulta normalmente se encuentra entre paréntesis y puede estar ubicada en diferentes partes de una consulta SQL.

```sql
SELECT columnas
FROM tabla
WHERE columna = (
    SELECT valor
    FROM otra_tabla
);
```
Se puede identrificar dos partes:

<table border="1">
  <thead>
    <tr>
      <th>Parte</th>
      <th>Función</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Consulta externa</td>
      <td>Es la consulta principal que obtiene los resultados que queremos mostrar.</td>
    </tr>
    <tr>
      <td>Consulta interna</td>
      <td>Es la consulta que proporciona un resultado utilizado por la consulta externa.</td>
    </tr>
  </tbody>
</table>

La consulta interna puede contener sus propios SELECT, FROM, WHERE, GROUP BY, HAVING y otras cláusulas, dependiendo de lo que necesitemos realizar.

Una consulta también puede contener varias subconsultas, e incluso una subconsulta puede encontrarse dentro de otra subconsulta.

## Tipos de subconsultas según el resultado que devuelven

### Subconsultas escalares

Una subconsulta escalar es aquella que devuelve un único valor: una sola fila y una sola columna.

Ese resultado puede ser un número, una fecha, un texto, etc.

Por ejemplo, queremos mostrar los empleados cuyo salario sea superior al salario máximo del departamento 50.

```sql
SELECT EMPLOYEE_ID,
       LAST_NAME,
       SALARY
FROM HR.EMPLOYEES
WHERE SALARY > (
    SELECT MAX(SALARY)
    FROM HR.EMPLOYEES
    WHERE DEPARTMENT_ID = 50
);
```

¿Cómo funciona?

Esta subconsulta:
```sql
SELECT MAX(SALARY)
FROM HR.EMPLOYEES
WHERE DEPARTMENT_ID = 50;
```
Obtiene el salario máximo del departamento 50.

Supongamos que el resultado es 8.200.

La consulta principal utiliza ese valor para realizar la comparación:

```sql
SELECT EMPLOYEE_ID,
       LAST_NAME,
       SALARY
FROM HR.EMPLOYEES
WHERE SALARY > 8200;
```
Por lo tanto, solo mostrará los empleados cuyo salario sea superior a 8.200.

¿Dónde se pueden utilizar?

Las subconsultas escalares pueden utilizarse en diferentes partes de una consulta, como WHERE, para filtrar registros; SELECT, para mostrar un resultado calculado como una columna; HAVING, para comparar resultados de agrupaciones y en expresiones como CASE

EJEMPLO

podemos mostrar el salario promedio de toda la empresa como una columna adicional junto a cada empleado:

```sql
SELECT EMPLOYEE_ID,
       LAST_NAME,
       SALARY,
       (SELECT AVG(SALARY)
        FROM HR.EMPLOYEES) AS SALARIO_PROMEDIO
FROM HR.EMPLOYEES;
```
Aquí la consulta interna devuelve un único promedio y ese valor aparece en cada fila de la consulta externa.

Aunque la consulta devuelve muchas filas de empleados, la subconsulta devuelve un solo valor, por lo que sigue siendo escalar.

¿Qué pasa si devuelve más de una fila?

Si utilizamos un operador que espera un único valor, como =, pero la subconsulta devuelve varias filas, Oracle puede generar el error:

> ORA-01427: single-row subquery returns more than one row

Por eso debemos asegurarnos de que la subconsulta realmente devuelva un único resultado cuando utilizamos operadores de comparación de una sola fila.

### Subconsultas de múltiples filas

Estas subconsultas devuelven varios resultados, normalmente una columna con múltiples filas.

EJEMPLO

Se quiere consultar los empleados que pertenecen a los departamentos donde trabaja algún empleado con el cargo de IT_PROG.

```sql
SELECT EMPLOYEE_ID,
       LAST_NAME,
       DEPARTMENT_ID
FROM HR.EMPLOYEES
WHERE DEPARTMENT_ID IN (
    SELECT DEPARTMENT_ID
    FROM HR.EMPLOYEES
    WHERE JOB_ID = 'IT_PROG'
);
```
La consulta interna obtiene los departamentos donde trabajan los programadores, digamos como 60, 60 y 60. La consulta externa utiliza esos resultados para buscar empleados que pertenezcan a esos departamentos.

En este caso se utiliza IN, porque estamos comparando el departamento de cada empleado con un conjunto de resultados.

En estecaso no se utiliza =, debido a que este operador espera comparar un valor con un único resultado, mientras que la subconsulta podría devolver varios departamentos.

Para este tipo de subconsultas existen operadores como:
- IN
- ANY
- ALL
- EXISTS

### Subconsultas de tabla

Este tipo de subconsulta devuelve un conjunto de resultados que puede utilizarse como una tabla dentro de la consulta principal.

También se conocen como tablas derivadas o Inline Views cuando se encuentran dentro del FROM.

EJEMPLO

Se quiere calcular el salario promedio de cada departamento y posteriormente mostrar los departamentos cuyo promedio sea superior a 7.000.

```sql
SELECT D.DEPARTMENT_ID,
       D.AVG_SALARY
FROM (
    SELECT DEPARTMENT_ID,
           AVG(SALARY) AS AVG_SALARY
    FROM HR.EMPLOYEES
    GROUP BY DEPARTMENT_ID
) D
WHERE D.AVG_SALARY > 7000;
```
Primero se ejecuta conceptualmente la subconsulta, esta genera una tabla temporal de resultados, luego la consulta externa utiliza ese resultado como si fuera una tabla normal; de esta manera podemos filtrar los resultados de una agrupación utilizando otra consulta.

¿Por qué se utiliza D?
Porque Oracle requiere que la subconsulta utilizada como tabla derivada tenga un alias.

En este caso, D es el nombre que le asignamos a los resultados de la subconsulta.

Este tipo de subconsulta es especialmente útil cuando queremos realizar operaciones sobre resultados previamente agrupados y después utilizar esos resultados para continuar con otra consulta.

### Subconsultas no correlacionadas

Una subconsulta no correlacionada es aquella que no depende de la consulta externa para ejecutarse.

Esto significa que puede ejecutarse de manera independiente, porque no utiliza columnas de la consulta principal.

EJEMPLO:
```sql
SELECT EMPLOYEE_ID,
       LAST_NAME,
       SALARY
FROM HR.EMPLOYEES
WHERE SALARY > (
    SELECT AVG(SALARY)
    FROM HR.EMPLOYEES
);
```
> En la consulta interna no necesita conocer el empleado que está siendo procesado por la consulta externa.

La consulta interna no necesita ejecutarse nuevamente para cada empleado, porque su resultado no depende de la fila externa.

### Subconsultas correlacionadas

Una subconsulta correlacionada es aquella que depende de la consulta externa, debido a que utiliza alguna de sus columnas.

En otras palabras, la consulta interna necesita información de la fila que está siendo procesada por la consulta principal.

EJEMPLO

Se quiere mostrar los empleados que ganan más que el salario promedio de su propio departamento.

```sql
SELECT E.EMPLOYEE_ID,
       E.LAST_NAME,
       E.DEPARTMENT_ID,
       E.SALARY
FROM HR.EMPLOYEES E
WHERE E.SALARY > (
    SELECT AVG(E2.SALARY)
    FROM HR.EMPLOYEES E2
    WHERE E2.DEPARTMENT_ID = E.DEPARTMENT_ID
);
```

La liena que relaciona ambas consultas es:

```sql
WHERE E2.DEPARTMENT_ID = E.DEPARTMENT_ID
```

Aquí se está comparando el departamento de la consulta interna (E2) con el departamento del empleado que está siendo procesado por la consulta externa (E).

Por lo tanto, el promedio no se calcula para toda la empresa, sino para el departamento al que pertenece cada empleado.


