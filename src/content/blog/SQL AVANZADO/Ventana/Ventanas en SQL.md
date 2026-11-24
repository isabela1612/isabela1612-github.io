---
title: "Ventanas en SQL Avanzado"
date: "2026-11-11T20:00:00+08:00"
updated: "2026-11-12T17:45:29+08:00"
"description": "Un espacio donde hablo sobre las ventanas."
draft: false
categories:
  - "Presentación"
tags: []
---

## ¿Qué son las funciones de ventana?

Las funciones de ventana permiten realizar cálculos sobre un conjunto de filas relacionadas con la fila actual, sin agruparlas ni reducir la cantidad de registros del resultado.

Se utilizan para comparar registros, establecer posiciones, calcular acumulados y consultar valores de otras filas, manteniendo la información original.

A diferencia de GROUP BY, que agrupa los registros y devuelve resultados resumidos, las funciones de ventana conservan cada fila y agregan el resultado del cálculo como una columna adicional.

## Estructura de una ventana

Las funciones de ventana utilizan la cláusula OVER(), que permite definir sobre qué filas se realizará el cálculo y cómo se organizarán.

```sql
FUNCION() OVER (
    PARTITION BY columna
    ORDER BY columna
    ROWS BETWEEN inicio AND fin
)
```

La funciones de ventana y su estructura etsa conformado por:

- OVER()
- PARTITION BY
- ORDER BY
- ROWS / RANGE

### PARTITION BY

Divide los registros en grupos o particiones según una columna determinada. La función se calcula de manera independiente para cada grupo.

¿Cuándo usarlo?

Cuando se necesita realizar un cálculo por cada departamento, empleado, categoría u otro grupo, sin combinar los registros.

EJEMPLO
```sql
SELECT
    FIRST_NAME,
    DEPARTMENT_ID,
    SALARY,
    AVG(SALARY) OVER (
        PARTITION BY DEPARTMENT_ID
    ) AS PROMEDIO_DEPARTAMENTO
FROM HR.EMPLOYEES;
```

En este caso, se calcula el salario promedio de cada departamento, pero se siguen mostrando todos los empleados.

### ORDER BY

Establece el orden en el que se procesan las filas dentro de cada ventana. Es especialmente importante para funciones de ranking, desplazamiento y cálculos acumulados.

¿Cuándo usarlo?

Cuando se necesita ordenar los registros por salario, fecha, identificador u otro criterio para establecer posiciones o comparar filas.

EJEMPLO

Cuando se necesita ordenar los registros por salario, fecha, identificador u otro criterio para establecer posiciones o comparar filas.

Ejemplo:
```sql
SELECT
    FIRST_NAME,
    SALARY,
    ROW_NUMBER() OVER (
        ORDER BY SALARY DESC
    ) AS POSICION
FROM HR.EMPLOYEES;
```

En este ejemplo, los empleados se ordenan de mayor a menor salario y se les asigna una posición.

### ROWS 
Permite definir un marco o conjunto específico de filas que se utilizarán para realizar el cálculo alrededor de la fila actual.

¿Cuándo usarlo?

Cuando se necesita limitar el cálculo a determinadas filas, por ejemplo, sumar el salario del empleado actual y el de los dos registros anteriores.

EJEMPLO
```sql
SELECT
    FIRST_NAME,
    SALARY,
    SUM(SALARY) OVER (
        ORDER BY EMPLOYEE_ID
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS SUMA_FILAS
FROM HR.EMPLOYEES;
```

En este caso, se calcula una suma que incluye la fila actual y las dos filas anteriores, siguiendo el orden de EMPLOYEE_ID.

Algunos valores que se pueden utilizar en ROWS son:
- UNBOUNDED PRECEDING: desde la primera fila de la ventana.
- N PRECEDING: una cantidad determinada de filas anteriores.
- CURRENT ROW: la fila actual.
- N FOLLOWING: una cantidad determinada de filas posteriores.
- UNBOUNDED FOLLOWING: hasta la última fila de la ventana.

> Nota: ROWS es opcional. No todas las funciones necesitan definir un marco de filas.

### Funciones de ranking

Las funciones de ranking sirven para asignar una posición o clasificación a cada fila, de acuerdo con un criterio de ordenamiento, sin eliminar los registros originales.

Se utilizan principalmente para identificar los primeros lugares, establecer posiciones y clasificar registros.

## ROW_NUMBER()
Asigna un número consecutivo y único a cada fila, incluso cuando existen valores repetidos.

¿Cuándo usarlo?

Cuando se necesita asignar una posición diferente a cada registro, por ejemplo, enumerar los empleados según su salario.

ESTRUCTURA
```sql
ROW_NUMBER() OVER (
    PARTITION BY columna
    ORDER BY columna
)
```
EJEMPLO
```sql
SELECT
    FIRST_NAME,
    SALARY,
    ROW_NUMBER() OVER (
        ORDER BY SALARY DESC
    ) AS POSICION
FROM HR.EMPLOYEES;
```
En este caso, se asigna una posición consecutiva a cada empleado, comenzando por el salario más alto.

## RANK()

Asigna posiciones según el orden establecido. Cuando existen valores iguales, les asigna la misma posición y deja saltos en la numeración siguiente.

¿Cuándo usarlo?

Cuando se necesita establecer una clasificación en la que los valores empatados compartan la misma posición.

ESTRUCTURA
```sql
RANK() OVER (
    PARTITION BY columna
    ORDER BY columna
)
```

EJEMPLO
```sql
SELECT
    FIRST_NAME,
    SALARY,
    RANK() OVER (
        ORDER BY SALARY DESC
    ) AS POSICION
FROM HR.EMPLOYEES;
```
Si dos empleados tienen el mismo salario, ambos reciben la misma posición. Por ejemplo, si ocupan el segundo lugar, la siguiente posición será la cuarta.

## DENSE_RANK()

Asigna posiciones según el orden establecido y, cuando existen valores iguales, les asigna la misma posición, pero sin dejar saltos en la numeración.

¿Cuándo usarlo?

Cuando se necesita clasificar registros y mantener una numeración consecutiva, incluso cuando existen empates.

Estructura:
```sql
DENSE_RANK() OVER (
    PARTITION BY columna
    ORDER BY columna
)
```
EJEMPLO
```sql
SELECT
    FIRST_NAME,
    SALARY,
    DENSE_RANK() OVER (
        ORDER BY SALARY DESC
    ) AS POSICION
FROM HR.EMPLOYEES;
```

Si dos empleados ocupan el segundo lugar, el siguiente empleado tendrá la tercera posición, sin saltarse ningún número.

## NTILE()

Divide las filas ordenadas en una cantidad determinada de grupos o categorías, distribuyéndolas de la manera más equilibrada posible.

¿Cuándo usarlo?

Cuando se necesita dividir los registros en grupos, por ejemplo, clasificar empleados en cuatro grupos según su salario.

Estructura:
```sql
NTILE(numero_grupos) OVER (
    PARTITION BY columna
    ORDER BY columna
)
```
Ejemplo:
```sql
SELECT
    FIRST_NAME,
    SALARY,
    NTILE(4) OVER (
        ORDER BY SALARY DESC
    ) AS GRUPO
FROM HR.EMPLOYEES;
```
En este caso, los empleados se distribuyen en cuatro grupos según su salario, desde los más altos hasta los más bajos.

## PERCENT_RANK()

Calcula la posición relativa de una fila dentro de una ventana y devuelve un valor entre 0 y 1.

¿Cuándo usarlo?

Cuando se necesita conocer la posición relativa de un registro frente a los demás, por ejemplo, identificar qué tan alto se encuentra un salario dentro de la clasificación.

Estructura:
```sql
PERCENT_RANK() OVER (
    PARTITION BY columna
    ORDER BY columna
)
```

Ejemplo:
```sql
SELECT
    FIRST_NAME,
    SALARY,
    PERCENT_RANK() OVER (
        ORDER BY SALARY
    ) AS PORCENTAJE
FROM HR.EMPLOYEES;
```
El resultado permite observar la posición relativa de cada empleado dentro del conjunto. El valor 0 corresponde a la primera posición y el 1 a la última, cuando hay más de una fila.

## CUME_DIST()

Calcula la distribución acumulada de una fila dentro de una ventana. Devuelve un valor mayor que 0 y menor o igual a 1, indicando la proporción de filas que tienen un valor menor o igual al de la fila actual, según el orden establecido.

¿Cuándo usarlo?

Cuando se necesita conocer qué proporción de registros se encuentra hasta determinada posición, por ejemplo, qué porcentaje de empleados tiene un salario menor o igual al de un empleado específico.

Estructura:
```sql
CUME_DIST() OVER (
    PARTITION BY columna
    ORDER BY columna
)
```

EJEMPLO
```sql
SELECT
    FIRST_NAME,
    SALARY,
    CUME_DIST() OVER (
        ORDER BY SALARY
    ) AS DISTRIBUCION
FROM HR.EMPLOYEES;
```
El resultado muestra la proporción acumulada de empleados que tienen un salario menor o igual al salario de cada fila.

### Funciones de desplazamiento

Las funciones de desplazamiento permiten consultar valores de otras filas, ubicadas antes o después de la fila actual, sin necesidad de realizar un JOIN adicional.

Se utilizan para comparar registros consecutivos, identificar cambios y analizar diferencias entre valores.

## LAG()

Permite obtener el valor de una fila anterior con respecto a la fila actual, siguiendo el orden establecido.

¿Cuándo usarlo?

Cuando se necesita comparar el registro actual con uno anterior, por ejemplo, comparar el salario de un empleado con el del registro anterior.

Estructura:
```sql
LAG(columna, desplazamiento, valor_predeterminado) OVER (
    PARTITION BY columna
    ORDER BY columna
)
```
columna: valor que se desea consultar.

desplazamiento: cantidad de filas hacia atrás (por defecto es 1).

valor_predeterminado: valor que se devuelve si no existe una fila anterior (opcional).

Ejemplo:
```sql
SELECT
    FIRST_NAME,
    SALARY,
    LAG(SALARY) OVER (
        ORDER BY EMPLOYEE_ID
    ) AS SALARIO_ANTERIOR
FROM HR.EMPLOYEES;
```
En este caso, se muestra el salario del empleado actual y el salario del empleado que aparece inmediatamente antes según su identificador.

## LEAD()

Permite obtener el valor de una fila posterior con respecto a la fila actual, siguiendo el orden establecido.

¿Cuándo usarlo?

Cuando se necesita consultar o comparar información de un registro siguiente, por ejemplo, observar cuál es el salario del siguiente empleado según su identificador.

Estructura:
```sql
LEAD(columna, desplazamiento, valor_predeterminado) OVER (
    PARTITION BY columna
    ORDER BY columna
)
```
columna: valor que se desea consultar.

desplazamiento: cantidad de filas hacia adelante (por defecto es 1).

valor_predeterminado: valor que se devuelve si no existe una fila posterior (opcional).

Ejemplo:
```sql
SELECT
    FIRST_NAME,
    SALARY,
    LEAD(SALARY) OVER (
        ORDER BY EMPLOYEE_ID
    ) AS SALARIO_SIGUIENTE
FROM HR.EMPLOYEES;
```
En este caso, se muestra el salario del empleado actual y el salario del empleado que aparece inmediatamente después según su identificador.

## Funciones de valores

Las funciones de valores permiten obtener un dato específico de una fila dentro de una ventana, según su posición y el marco de filas establecido.

Se utilizan cuando se necesita consultar el primer valor, el último valor o un valor ubicado en una posición determinada dentro de un conjunto de registros.

### FIRST_VALUE()

Devuelve el primer valor de una ventana según el orden establecido.

¿Cuándo usarlo?

Cuando se necesita identificar o comparar un registro con el primer valor de un conjunto, por ejemplo, mostrar el salario más alto de cada departamento junto al salario de cada empleado.

Estructura:
```sql
FIRST_VALUE(columna) OVER (
    PARTITION BY columna
    ORDER BY columna
    ROWS BETWEEN inicio AND fin
)
```

Ejemplo:
```sql
SELECT
    FIRST_NAME,
    DEPARTMENT_ID,
    SALARY,
    FIRST_VALUE(SALARY) OVER (
        PARTITION BY DEPARTMENT_ID
        ORDER BY SALARY DESC
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS SALARIO_MAYOR
FROM HR.EMPLOYEES;
```
En este caso, se obtiene el salario más alto de cada departamento y se muestra junto a cada empleado perteneciente a ese departamento.

## LAST_VALUE()

Devuelve el último valor de una ventana según el orden establecido y el marco de filas definido.

¿Cuándo usarlo?

Cuando se necesita consultar el último valor de un conjunto, por ejemplo, identificar el salario más bajo de cada departamento.

Estructura:
```sql
LAST_VALUE(columna) OVER (
    PARTITION BY columna
    ORDER BY columna
    ROWS BETWEEN inicio AND fin
)
```
Ejemplo:
```sql
SELECT
    FIRST_NAME,
    DEPARTMENT_ID,
    SALARY,
    LAST_VALUE(SALARY) OVER (
        PARTITION BY DEPARTMENT_ID
        ORDER BY SALARY DESC
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS SALARIO_MENOR
FROM HR.EMPLOYEES;
```
En este caso, se obtiene el salario más bajo de cada departamento y se muestra junto a cada empleado.

Nota: En LAST_VALUE() es importante definir el marco de filas cuando se desea obtener el último valor de toda la partición. De lo contrario, el resultado puede corresponder únicamente al marco que llega hasta la fila actual.

## NTH_VALUE()

Permite obtener el valor que ocupa una posición específica dentro de una ventana.

¿Cuándo usarlo?

Cuando se necesita consultar un valor ubicado en una posición determinada, por ejemplo, obtener el tercer salario más alto de cada departamento.

Estructura:
```sql
NTH_VALUE(columna, posicion) OVER (
    PARTITION BY columna
    ORDER BY columna
    ROWS BETWEEN inicio AND fin
)
```

columna: valor que se desea obtener.

posicion: posición del valor que se quiere consultar, comenzando desde 1.

Ejemplo:
```sql
SELECT
    FIRST_NAME,
    DEPARTMENT_ID,
    SALARY,
    NTH_VALUE(SALARY, 3) OVER (
        PARTITION BY DEPARTMENT_ID
        ORDER BY SALARY DESC
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS TERCER_SALARIO
FROM HR.EMPLOYEES;
```
En este caso, se obtiene el tercer salario más alto de cada departamento y se muestra junto a los empleados de ese departamento. Si una partición no tiene al menos tres filas, el resultado será NULL.

### Resumen de las funciones de ventana

<table border="1">
  <thead>
    <tr>
      <th>Categoría</th>
      <th>Funciones</th>
      <th>¿Para qué sirven?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ranking</td>
      <td>ROW_NUMBER, RANK, DENSE_RANK</td>
      <td>Asignar posiciones y clasificaciones.</td>
    </tr>
    <tr>
      <td>Ranking</td>
      <td>NTILE</td>
      <td>Dividir registros en grupos.</td>
    </tr>
    <tr>
      <td>Ranking</td>
      <td>PERCENT_RANK, CUME_DIST</td>
      <td>Calcular posiciones relativas y distribuciones acumuladas.</td>
    </tr>
    <tr>
      <td>Desplazamiento</td>
      <td>LAG, LEAD</td>
      <td>Consultar valores de filas anteriores o posteriores.</td>
    </tr>
    <tr>
      <td>Valores</td>
      <td>FIRST_VALUE, LAST_VALUE, NTH_VALUE</td>
      <td>Obtener valores según su posición dentro de la ventana.</td>
    </tr>
  </tbody>
</table>
