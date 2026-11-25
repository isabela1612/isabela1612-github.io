---
title: "WITH (CTE) en SQL Avanzado"
date: "2026-11-11T20:00:00+08:00"
updated: "2026-11-12T17:45:29+08:00"
"description": "Un espacio donde hablo de WITH (CTE)."
draft: false
categories:
  - "SQL Avanzado"
tags: []
---

## ¿Qué es WITH?

WITH es una cláusula de SQL que permite definir consultas temporales llamadas CTE (Common Table Expressions o expresiones de tabla comunes).

Estas consultas funcionan como tablas temporales dentro de una única instrucción SQL, permitiendo organizar consultas complejas en partes más pequeñas y fáciles de entender.

## ¿Para qué se utiliza?

- Dividir consultas complejas en secciones más sencillas.
- Reutilizar resultados dentro de una misma consulta.
- Mejorar la legibilidad y organización del código.
- Evitar repetir subconsultas.
- Realizar consultas recursivas para recorrer jerarquías o generar secuencias.

## Estructura de WITH

Su estructura general es:
```sql
WITH nombre_cte AS (
    SELECT columnas
    FROM tabla
    WHERE condicion
)
SELECT columnas
FROM nombre_cte;
```
EJEMPLO
```sql
WITH EMPLEADOS_ALTOS AS (
    SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        SALARY
    FROM HR.EMPLOYEES
    WHERE SALARY > 5000
)
SELECT *
FROM EMPLEADOS_ALTOS;
```
En este caso, se crea un CTE llamado EMPLEADOS_ALTOS, que contiene los empleados cuyo salario es superior a 5000. Posteriormente, la consulta principal utiliza ese resultado para mostrar los registros.

¿Cuándo usarlo?

Cuando una consulta tiene varias condiciones o subconsultas y se necesita organizar su lógica para que sea más fácil de comprender y mantener.

Nota: un CTE no crea una tabla permanente ni almacena necesariamente los resultados físicamente. Su definición está disponible durante la ejecución de la instrucción SQL en la que se declara.

## WITH con varios CTE

Una misma cláusula WITH permite declarar varios CTE, separados por comas. Esto permite dividir una consulta en diferentes etapas y utilizar los resultados de un CTE dentro de otro.

¿Cuándo usarlo?

Cuando una consulta necesita realizar varios procesos antes de obtener el resultado final, por ejemplo, primero calcular los salarios promedio por departamento y después identificar los departamentos que superan determinado promedio.

Estructura:
```sql
WITH
    CTE_1 AS (
        SELECT ...
    ),
    CTE_2 AS (
        SELECT ...
        FROM CTE_1
    ),
    CTE_3 AS (
        SELECT ...
        FROM CTE_2
    )
SELECT ...
FROM CTE_3;
```
Ejemplo:
```sql
WITH
PROMEDIO_DEPARTAMENTO AS (
    SELECT
        DEPARTMENT_ID,
        AVG(SALARY) AS PROMEDIO
    FROM HR.EMPLOYEES
    GROUP BY DEPARTMENT_ID
),
DEPARTAMENTOS_ALTOS AS (
    SELECT
        DEPARTMENT_ID,
        PROMEDIO
    FROM PROMEDIO_DEPARTAMENTO
    WHERE PROMEDIO > 7000
)
SELECT
    D.DEPARTMENT_NAME,
    DA.PROMEDIO
FROM DEPARTAMENTOS_ALTOS DA
INNER JOIN HR.DEPARTMENTS D
    ON DA.DEPARTMENT_ID = D.DEPARTMENT_ID;
```

En este ejemplo se utilizan dos CTE:

- PROMEDIO_DEPARTAMENTO: calcula el salario promedio de cada departamento.
- DEPARTAMENTOS_ALTOS: utiliza el resultado anterior para seleccionar los departamentos cuyo promedio supera los 7000.

Finalmente, la consulta principal relaciona los resultados con DEPARTMENTS para mostrar el nombre de cada departamento y su promedio salarial.

Importante: los CTE pueden utilizar los CTE definidos anteriormente dentro de la misma cláusula WITH, respetando el orden de declaración.

## WITH recursivo

Un WITH recursivo es una expresión de tabla común que permite que una consulta se haga referencia a sí misma para generar nuevos resultados a partir de los resultados anteriores.

Se utiliza principalmente para recorrer estructuras jerárquicas, como relaciones entre empleados y supervisores, categorías y subcategorías, o para generar secuencias de números.

A diferencia de un CTE normal, que ejecuta una consulta definida, el CTE recursivo repite un proceso utilizando los resultados obtenidos en la iteración anterior, hasta que se cumple una condición de parada.

### Partes de un WITH recursivo

1. Caso base o ancla

Es la consulta inicial que genera los primeros registros. No depende de la parte recursiva y establece desde dónde comienza el proceso.

2. Parte recursiva

Es la consulta que hace referencia al propio CTE para generar nuevos registros utilizando los resultados obtenidos anteriormente.

Ambas partes se unen mediante UNION ALL.

3. Condición de parada

Es la condición que determina cuándo debe finalizar la recursión. Evita que el proceso continúe generando resultados indefinidamente.

seria:
```sql
WITH nombre_cte (columnas) AS (
    -- Caso base o ancla
    SELECT ...

    UNION ALL

    -- Parte recursiva
    SELECT ...
    FROM nombre_cte
    WHERE condicion_parada
)
SELECT *
FROM nombre_cte;
```
En Oracle, la parte recursiva debe estar conectada con el caso base mediante UNION ALL, y el CTE recursivo debe declarar los nombres de sus columnas.

### Ejemplo sencillo: generar números
```sql
Unión: UNIWITH NUMEROS (N) AS (
    -- Caso base
    SELECT 1
    FROM DUAL

    UNION ALL

    -- Parte recursiva
    SELECT N + 1
    FROM NUMEROS
    WHERE N < 5
)
SELECT *
FROM NUMEROS;
```
Explicación:

- Caso base: comienza generando el número 1.
- Parte recursiva: toma el número obtenido y le suma 1.
- Condición de parada: mientras el número sea menor que 5, continúa generando el siguiente.
- ON ALL combina los resultados del caso base y de cada repetición.

### Ejemplo de WITH recursivo con jerarquías

Una de las aplicaciones más comunes de los CTE recursivos es recorrer relaciones jerárquicas.

Ejemplo:
En la tabla EMPLOYEES de Oracle existe la columna MANAGER_ID, que permite identificar al supervisor de cada empleado mediante su EMPLOYEE_ID.

Con esta relación se puede recorrer la jerarquía desde los empleados que no tienen supervisor hasta los empleados que dependen de ellos.
```sql
WITH JERARQUIA_EMPLEADOS (
    EMPLOYEE_ID,
    FIRST_NAME,
    MANAGER_ID,
    NIVEL
) AS (
    -- Caso base: empleados sin supervisor
    SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        MANAGER_ID,
        1 AS NIVEL
    FROM HR.EMPLOYEES
    WHERE MANAGER_ID IS NULL

    UNION ALL

    -- Parte recursiva: buscar sus subordinados
    SELECT
        E.EMPLOYEE_ID,
        E.FIRST_NAME,
        E.MANAGER_ID,
        J.NIVEL + 1
    FROM HR.EMPLOYEES E
    INNER JOIN JERARQUIA_EMPLEADOS J
        ON E.MANAGER_ID = J.EMPLOYEE_ID
)
SELECT *
FROM JERARQUIA_EMPLEADOS
ORDER BY NIVEL, EMPLOYEE_ID;
```

Explicación:

- Caso base: obtiene los empleados que no tienen supervisor (MANAGER_ID IS NULL). Estos representan el primer nivel de la jerarquía.
- Parte recursiva: busca en EMPLOYEES los empleados cuyo MANAGER_ID coincide con el EMPLOYEE_ID de los registros encontrados anteriormente.
- Nivel: cada vez que se encuentra un nuevo grupo de subordinados, se incrementa el nivel en 1.
- Unión: UNION ALL combina los empleados iniciales con los encontrados en cada iteración.
- Condición de parada: la recursión termina cuando ya no existen más empleados que dependan de los registros encontrados en la iteración anterior.

De esta manera, se obtiene la estructura jerárquica de los empleados, mostrando quiénes se encuentran en cada nivel.

Nota: este ejemplo parte de los empleados que no tienen supervisor y recorre sus subordinados. Si existen registros desconectados de esa jerarquía, no aparecerán en el resultado.

##  Diferencia entre CTE y CTE recursivo

<table>
  <thead>
    <tr>
      <th>Característica</th>
      <th>WITH (CTE)</th>
      <th>VIEW</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Duración</td>
      <td>Durante una única instrucción SQL.</td>
      <td>Permanece creada en la base de datos hasta que se elimine.</td>
    </tr>
    <tr>
      <td>Almacenamiento</td>
      <td>No crea un objeto permanente.</td>
      <td>Almacena la definición de la consulta como objeto de la base de datos.</td>
    </tr>
    <tr>
      <td>Reutilización</td>
      <td>Dentro de la misma instrucción.</td>
      <td>En diferentes instrucciones SQL.</td>
    </tr>
    <tr>
      <td>Creación</td>
      <td>Se declara con WITH.</td>
      <td>Se crea con CREATE VIEW.</td>
    </tr>
    <tr>
      <td>Uso</td>
      <td>Organizar consultas y dividir procesos.</td>
      <td>Consultar información de manera reutilizable.</td>
    </tr>
  </tbody>
</table>

