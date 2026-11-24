---
title: "Vistas SQL"
date: "2026-11-11T20:00:00+08:00"
updated: "2026-11-12T17:45:29+08:00"
"description": "En este espacio explicare las vistas en SQL"
draft: false
categories:
  - "SQL Avanzado"
tags: []
---

## ¿Qué es una vista?

Una vista es un objeto de la base de datos que permite guardar una consulta SQL para utilizarla posteriormente como si fuera una tabla normal.

Su principal utilidad es simplificar consultas, reutilizar instrucciones SQL y controlar qué información pueden consultar determinados usuarios.

EJEMPLO

Se necesita consultar constantemente información de los empleados, incluyendo su nombre, salario, departamento y ciudad donde trabajan.

Para obtener esta información necesitamos relacionar varias tablas mediante INNER JOIN. Si la consulta es muy extensa y debemos escribirla constantemente, podemos crear una vista que guarde esa consulta.

La ventaja es que, después de crearla, podemos consultarla utilizando un SELECT normal, sin tener que volver a escribir todos los JOIN.

## ¿Cómo se crea una vista?

Para crear una vista se utiliza la instrucción CREATE VIEW, seguida del nombre que queremos asignarle y de la consulta que deseamos guardar.

EJEMPLO

Se necesita consultar los empleados que ganan más de 5.000, mostrando su nombre, salario, departamento y ciudad.

Para conseguirlo, necesitamos relacionar las tablas EMPLOYEES, DEPARTMENTS y LOCATIONS.


consultar los empleados que ganan más de 5.000, mostrando su nombre, salario, departamento y ciudad.

Para conseguirlo, necesitamos relacionar las tablas EMPLOYEES, DEPARTMENTS y LOCATIONS.

```sql
SELECT E.FIRST_NAME,
       E.SALARY,
       D.DEPARTMENT_NAME,
       L.CITY
FROM HR.EMPLOYEES E
INNER JOIN HR.DEPARTMENTS D
    ON E.DEPARTMENT_ID = D.DEPARTMENT_ID
INNER JOIN HR.LOCATIONS L
    ON D.LOCATION_ID = L.LOCATION_ID
WHERE E.SALARY > 5000;
```

Pero esta consulta puede ser extensa y se podria necesitar varias veces, por eso lo convertirmos en una vista:

```sql
CREATE VIEW EMPLEADOS_INFORMACION AS
SELECT E.FIRST_NAME,
       E.SALARY,
       D.DEPARTMENT_NAME,
       L.CITY
FROM HR.EMPLOYEES E
INNER JOIN HR.DEPARTMENTS D
    ON E.DEPARTMENT_ID = D.DEPARTMENT_ID
INNER JOIN HR.LOCATIONS L
    ON D.LOCATION_ID = L.LOCATION_ID
WHERE E.SALARY > 5000;
```

Una vez creada, ya no se necesita escribir nuevamente toda la consulta. Podemos acceder a la información mediante:

```sql
SELECT *
FROM EMPLEADOS_INFORMACION;
```

También podemos seleccionar únicamente las columnas que se necesitan

```sql
SELECT FIRST_NAME,
       SALARY
FROM EMPLEADOS_INFORMACION;
```

> La vista permite ocultar la complejidad de una consulta extensa, ya que guarda su definición y permite acceder a sus resultados utilizando un SELECT normal. Esto facilita la reutilización de consultas y evita tener que escribir repetidamente los mismos JOIN y condiciones.

## Las vistas como una capa de seguridad

Otra utilidad importante de las vistas es controlar la información que pueden consultar determinados usuarios.

Imaginemos que en la tabla EMPLOYEES tenemos información como:
- EMPLOYEE_ID
- FIRST_NAME
- LAST_NAME
- EMAIL
- PHONE_NUMBER
- SALARY
- COMMISSION_PCT
Sin embargo, no queremos que todos los usuarios puedan consultar los salarios, las comisiones o los números telefónicos de los empleados.

Para ello podemos crear una vista que muestre únicamente la información que queremos compartir.

```sql
CREATE VIEW EMPLEADOS_PUBLICOS AS
SELECT EMPLOYEE_ID,
       FIRST_NAME,
       LAST_NAME
FROM HR.EMPLOYEES;
```

Ahora, los usuarios que tengan permiso para consultar esta vista podrán acceder a la información mediante:

```sql
SELECT *
FROM EMPLEADOS_PUBLICOS;
```

> El resultado mostrará únicamente el identificador, nombre y apellido de los empleados.

¿Por qué funciona como una capa de seguridad?

Porque podemos permitir que determinados usuarios consulten la vista sin concederles acceso directo a todas las columnas de la tabla original.

Para aplicar este control también debemos configurar los permisos correspondientes

EJEMPLO

```sql
GRANT SELECT ON EMPLEADOS_PUBLICOS TO USUARIO1;
```

Este permiso permite que USUARIO1 consulte la vista, siempre que se cumplan los requisitos de permisos de Oracle.

Es importante entender que crear una vista no protege automáticamente la información. La seguridad se consigue al combinar la vista con los permisos adecuados y controlar el acceso a la tabla original.

##  Diferencia entre una vista y WITH (CTE)

Aunque las vistas y las expresiones WITH permiten organizar consultas SQL, no funcionan de la misma manera.

La principal diferencia es que una vista queda guardada como un objeto de la base de datos, mientras que una CTE existe únicamente durante la ejecución de la consulta en la que se declara.

Ejemplo utilizando WITH

Supongamos que queremos consultar los empleados que ganan más de 5.000.

```sql
WITH EMPLEADOS_ALTOS AS (
    SELECT EMPLOYEE_ID,
           FIRST_NAME,
           SALARY
    FROM HR.EMPLOYEES
    WHERE SALARY > 5000
)
SELECT *
FROM EMPLEADOS_ALTOS;
```

En este caso:
1. WITH permite definir una consulta temporal llamada EMPLEADOS_ALTOS.
2. Dentro de ella se seleccionan los empleados que ganan más de 5.000.
3. La consulta principal utiliza ese resultado para mostrar la información.
Cuando termina la ejecución de la consulta, esa CTE deja de estar disponible. No queda creada como un objeto permanente de la base de datos.

Su principal utilidad es organizar consultas complejas y facilitar su lectura.

Ejemplo utilizando CREATE VIEW

Ahora podemos resolver el mismo ejercicio creando una vista:

```sql
CREATE VIEW EMPLEADOS_ALTOS AS
SELECT EMPLOYEE_ID,
       FIRST_NAME,
       SALARY
FROM HR.EMPLOYEES
WHERE SALARY > 5000;
```

En este caso, la vista permanece guardada en la base de datos y podemos reutilizarla en diferentes consultas, siempre que tengamos los permisos necesarios.

<table border="1">
  <thead>
    <tr>
      <th>Característica</th>
      <th>VIEW</th>
      <th>WITH (CTE)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>¿Qué es?</td>
      <td>Un objeto de la base de datos.</td>
      <td>Una expresión de consulta temporal.</td>
    </tr>
    <tr>
      <td>¿Permanece guardada?</td>
      <td>Sí, hasta que se elimine.</td>
      <td>No, solo existe durante la consulta.</td>
    </tr>
    <tr>
      <td>¿Se puede reutilizar?</td>
      <td>Sí, en diferentes consultas.</td>
      <td>Dentro de la sentencia donde se define.</td>
    </tr>
    <tr>
      <td>¿Cómo se crea?</td>
      <td>CREATE VIEW.</td>
      <td>WITH.</td>
    </tr>
    <tr>
      <td>¿Para qué se utiliza?</td>
      <td>Reutilización, abstracción y control de acceso.</td>
      <td>Organizar y simplificar consultas complejas.</td>
    </tr>
  </tbody>
</table>

## Modificar una vista

Cuando necesitamos cambiar la consulta que define una vista, podemos utilizar CREATE OR REPLACE VIEW.

Esta instrucción permite reemplazar la definición de una vista existente sin tener que eliminarla primero.

Estructura:

```sql
CREATE OR REPLACE VIEW nombre_vista AS
SELECT columnas
FROM tabla
WHERE condicion;
```

EJEMPLO

Inicialmente creamos una vista que muestra los empleados con salarios superiores a 5.000:

```sql
CREATE VIEW EMPLEADOS_ALTOS AS
SELECT EMPLOYEE_ID,
       FIRST_NAME,
       SALARY
FROM HR.EMPLOYEES
WHERE SALARY > 5000;
```

Posteriormente queremos modificar la condición para mostrar únicamente los empleados que ganan más de 8.000.

```sql
CREATE OR REPLACE VIEW EMPLEADOS_ALTOS AS
SELECT EMPLOYEE_ID,
       FIRST_NAME,
       SALARY
FROM HR.EMPLOYEES
WHERE SALARY > 8000;
```

> NOTA
CREATE OR REPLACE VIEW modifica la definición de la vista, no los registros de la tabla original. Por lo tanto, no estamos cambiando los salarios de los empleados ni eliminando registros de EMPLOYEES.


## Eliminar una vista

Se puede eliminar una vista utilizando DROP VIEW.

ESTRUCTURA:
```sql
DROP VIEW nombre_vista;
```

EJEMPLO
```sql
DROP VIEW EMPLEADOS_ALTOS;
```

Esta instrucción elimina el objeto de la base de datos, pero no elimina la tabla original ni los registros que contiene.

Es decir, si eliminamos EMPLEADOS_ALTOS, la tabla HR.EMPLOYEES seguirá existiendo con toda su información.

> Es importante recordar que el nombre de una vista debe ser único dentro del espacio de nombres correspondiente de su esquema.

## ¿Las vistas almacenan los datos?

Una de las diferencias más importantes que debemos conocer es que una vista normal no almacena físicamente los resultados de la consulta.

Lo que guarda es la definición de la consulta SQL.

Cuando consultamos una vista normal, Oracle utiliza esa definición para obtener los datos de las tablas originales.

```sql
CREATE VIEW EMPLEADOS_ALTOS AS
SELECT FIRST_NAME,
       SALARY
FROM HR.EMPLOYEES
WHERE SALARY > 5000;
```

Si posteriormente consultamos:

```sql
SELECT *
FROM EMPLEADOS_ALTOS;
```

Oracle obtiene la información de la tabla original EMPLOYEES según la definición de la vista.

Por eso, si cambia el salario de un empleado y este cambio se confirma en la base de datos, una consulta posterior a la vista reflejará el dato actualizado, siempre que el registro siga cumpliendo la condición.

## Vistas normales y vistas materializadas

Las vistas normales y las vistas materializadas permiten consultar información mediante una consulta previamente definida, pero tienen una diferencia importante: el almacenamiento de los resultados.

### Vista normal (VIEW)

Una vista normal guarda la definición de una consulta, pero no almacena físicamente sus resultados.

Cuando se consulta, Oracle obtiene los datos de las tablas originales.

Sus principales características son:
- No almacena una copia física de los resultados.
- Permite reutilizar consultas.
- Refleja los cambios confirmados en las tablas originales al volver a consultarla.
- Ayuda a simplificar consultas y controlar el acceso a la información.

EJEMPLO

```sql
CREATE VIEW RESUMEN_EMPLEADOS AS
SELECT DEPARTMENT_ID,
       AVG(SALARY) AS SALARIO_PROMEDIO
FROM HR.EMPLOYEES
GROUP BY DEPARTMENT_ID;
```

### Vista materializada (MATERIALIZED VIEW)

Una vista materializada es un objeto que almacena físicamente el resultado de una consulta.

A diferencia de una vista normal, no necesita volver a calcular toda la consulta cada vez que accedemos a ella, porque puede consultar los resultados que ya se encuentran almacenados.

Esto puede mejorar el rendimiento en determinados escenarios, especialmente cuando se realizan consultas complejas o cálculos sobre grandes cantidades de información.

EJEMPLO

Supongamos que constantemente necesitamos consultar el salario promedio de cada departamento.

Para esto, creamos una vista materializada

```sql
CREATE MATERIALIZED VIEW RESUMEN_SALARIOS
AS
SELECT DEPARTMENT_ID,
       AVG(SALARY) AS SALARIO_PROMEDIO
FROM HR.EMPLOYEES
GROUP BY DEPARTMENT_ID;
```

En este caso, Oracle consulta los resultados almacenados físicamente en la vista materializada.

## Comparación entre VIEW y MATERIALIZED VIEW

<table border="1">
  <thead>
    <tr>
      <th>Característica</th>
      <th>Vista normal</th>
      <th>Vista materializada</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>¿Almacena resultados físicamente?</td>
      <td>No.</td>
      <td>Sí.</td>
    </tr>
    <tr>
      <td>¿Qué guarda?</td>
      <td>La definición de la consulta.</td>
      <td>La definición y los resultados almacenados.</td>
    </tr>
    <tr>
      <td>¿Cómo obtiene los datos?</td>
      <td>Consulta las tablas originales.</td>
      <td>Consulta los resultados almacenados.</td>
    </tr>
    <tr>
      <td>¿Refleja cambios inmediatamente?</td>
      <td>Al consultar nuevamente, según los datos confirmados.</td>
      <td>Puede requerir un refresco.</td>
    </tr>
    <tr>
      <td>¿Para qué se utiliza?</td>
      <td>Simplificación, reutilización y seguridad.</td>
      <td>Mejorar el rendimiento en ciertos escenarios.</td>
    </tr>
  </tbody>
</table>

