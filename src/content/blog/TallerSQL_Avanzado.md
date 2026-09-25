---
title: "Ejercicios de practica de SQL avanzado"
date: "2026-09-22T20:00:00+08:00"
updated: "2026-09-23T17:45:29+08:00"
"description": "Se realizó varios ejecicios de SQL avanzado para desarollar mi aprendizaje y conocimientos en este tema."
draft: false
categories:
  - "SQL avanzado"
tags: [SQL Avanzado]
---
En este espacio se presentan los ejercicios realizados y resueltos durante las clases. Posteriormente, podrá consultar los ejercicios en formato PDF para una visualización más detallada y completa del trabajo realizado.

<a href="/archivos/taller_repaso_SQL_Avanzado_HR.pdf" download>
  Descargar PDF
</a>

### 6.2 Inventario completo de departamentos

Columnas obligatorias: department_id, department_name, city, country_name,
employee_count, avg_salary
• Deben aparecer todos los departamentos, incluidos los que no tienen ningún empleado.
• employee_count debe mostrar 0 para los departamentos vacíos, no una fila ausente ni el valor 1.
• El comentario debe explicar por qué COUNT(*) produce el valor incorrecto en este caso y qué función lo corrige.

SOLUCIÓN

No serviria usar count(*) ya que este se ejecuta después de hacer join, y cuenta los NULL por lo que el valor sería 1 y no como 0. En cambio, si solo se pone COUNT(columna) solo cuenta los valores que no sean NULL.

```SQL
SELECT D.department_id, 
       D.DEPARTMENT_NAME, 
       L.CITY, 
       C.COUNTRY_NAME,
       COUNT (E.EMPLOYEE_ID) AS EMPLOYEE_COUNT,
       AVG (E.SALARY) AS AVG_SALARY
FROM HR.departments D
LEFT JOIN HR.EMPLOYEES E
ON D.DEPARTMENT_ID = e.department_id
LEFT JOIN HR.LOCATIONS L
ON d.location_id = L.LOCATION_ID
LEFT JOIN HR.COUNTRIES C
ON C.COUNTRY_ID = L.COUNTRY_ID
GROUP BY D.department_id, 
       D.DEPARTMENT_NAME, 
       L.CITY, 
       C.COUNTRY_NAME;

```
### 6.3 Cadena de mando

Columnas obligatorias: employee_id, employee_name, job_title, manager_id, manager_name,
department_name
• El empleado 100 debe aparecer en el resultado con manager_name en nulo.
• El comentario debe indicar qué tipo de reunión se usó y qué ocurre con ese empleado si se usa
INNER JOIN.

SOLUCIÓN

Si se usara INNER JOIN, eliminaría la fila 107, ya que el manager estaría en NULL y no mostraría los valores que no coinciden entre las tablas. Es por ello que se utilizó LEFT JOIN, que permite mostrar la fila que no muestra el INNER JOIN; aunque el manager esté en NULL, mantiene la fila de la tabla izquierda y coloca NULL en los datos de la tabla derecha que no tengan coincidencia. 

```SQL
SELECT E.EMPLOYEE_ID,
       E.FIRST_NAME || ' ' || e.last_name AS employee_name,
       J.JOB_TITLE,
       M.MANAGER_ID,
       CASE
           WHEN M.EMPLOYEE_ID IS NULL THEN 'NULL'
           ELSE M.FIRST_NAME || ' ' || M.LAST_NAME
       END AS MANAGER_NAME,
       D.DEPARTMENT_NAME
FROM HR.EMPLOYEES E
LEFT JOIN HR.EMPLOYEES M
ON E.MANAGER_ID = M.EMPLOYEE_ID
LEFT JOIN HR.JOBS J
ON j.job_id = E.JOB_ID
LEFT JOIN HR.DEPARTMENTS D
ON D.DEPARTMENT_ID = E.DEPARTMENT_ID;
```

### 6.4 Contraste entre la condición en ON y la condición en WHERE

Columnas obligatorias: variante, filas_devueltas, explicacion
• Deben ejecutar la misma reunión externa filtrando por salario superior a 10.000, primero en la
cláusula ON y luego en la cláusula WHERE.
• Deben registrar el conteo de filas de cada variante y enunciar en una sola frase la regla general
que se deriva de la diferencia

La condición en ON mantiene todas las filas de la tabla izquierda (mostrando nulos si no hay coincidencia), mientras que en WHERE elimina los nulos por completo del resultado final

ON
```SQL
SELECT 'ON' AS variante,
       COUNT(*) AS filas_devueltas,
       'Conserva las filas de la tabla derecha' AS explicacion
FROM HR.EMPLOYEES E
RIGHT JOIN HR.DEPARTMENTS D
ON e.department_id = D.department_id AND E.SALARY > 10000;
```

WHERE
```SQL
SELECT 'WHERE' AS variante,
       COUNT(*) AS filas_devueltas,
       'Elimina los nulos por completo del resultado final.' AS explicacion
FROM HR.EMPLOYEES E
RIGHT JOIN HR.DEPARTMENTS D
ON e.department_id = D.department_id 
WHERE e.salary > 10000;
```



