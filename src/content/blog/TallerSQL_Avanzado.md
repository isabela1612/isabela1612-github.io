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


### 6.1 Verificación de casos borde del esquema
Columnas obligatorias: caso_borde, empleados_afectados, descripcion

Debe devolver exactamente cuatro filas: empleado sin jefe, empleado sin departamento,
empleados sin comisión y departamentos sin empleados.

• Estos cuatro casos son los que hacen fallar las consultas de los bloques siguientes.
Identificarlos primero es parte de la evaluación.

SOLUCION 


```sql
SELECT 'Empleado sin jefe' AS caso_borde,
       count(*) AS Empleados_afectados,
       'Empleado que el manager id se encuentra en NULL' AS descripcion
FROM hr.employees E
LEFT JOIN HR.EMPLOYEES M
ON e.manager_id = m.employee_id
WHERE m.employee_id IS NULL

UNION ALL

SELECT 'Empleado sin departamento',
        COUNT(*),
        'Empleado donde el departamento id este en NULL' 
FROM hr.employees E
LEFT JOIN HR.DEPARTMENTS D
ON E.DEPARTMENT_ID = D.DEPARTMENT_ID
WHERE D.DEPARTMENT_ID IS NULL

UNION ALL

SELECT 'Empleado sin comisión',
        COUNT(*),
        'Empleado donde la comisión este en NULL' 
FROM hr.employees E
WHERE E.Commission_pct IS NULL

UNION ALL

SELECT 'Deparatamento sin empleado',
        COUNT(*),
        'Departamento donde el employee id del empleado este en NULL' 
FROM hr.employees E
RIGHT JOIN HR.DEPARTMENTS D
ON E.DEPARTMENT_ID = D.DEPARTMENT_ID
WHERE E.employee_ID IS NULL
```


> Como en el ejercicio se piden cuatro filas, se utilizó UNION ALL, que permite unir todos los SELECT y mostrar los resultados de cada uno, obteniendo así las cuatro filas que pide el ejercicio.

> También se utilizó COUNT(*) porque este cuenta todas las filas, incluyendo las que tienen valores NULL. En este caso, como se utiliza WHERE para evaluar la condición, se cuentan únicamente los registros que cumplen con ella, que en este caso son los valores NULL. Si se utilizara COUNT(columna), los valores NULL no se contarían, por lo que el resultado sería 0 aunque existan registros con esa columna en NULL.



### 6.2 Inventario completo de departamentos

Columnas obligatorias: department_id, department_name, city, country_name,
employee_count, avg_salary

• Deben aparecer todos los departamentos, incluidos los que no tienen ningún empleado.

• employee_count debe mostrar 0 para los departamentos vacíos, no una fila ausente ni el valor 1.

• El comentario debe explicar por qué COUNT(*) produce el valor incorrecto en este caso y qué función lo corrige.

SOLUCIÓN

> No serviria usar count(*) ya que este se ejecuta después de hacer join, y cuenta los NULL por lo que el valor sería 1 y no como 0. En cambio, si solo se pone COUNT(columna) solo cuenta los valores que no sean NULL.

```sql
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

> En la siguiente imagen se muestra el empleado 100 con manager_name en NULL. Esto fue posible gracias al uso de CASE, ya que permite establecer una condición: si el valor está vacío, se muestra NULL; de lo contrario, se muestra el nombre del empleado correspondiente. Esta función sirve para controlar qué valor se desea mostrar dependiendo de una determinada condición 

![alt text](image.png)

> Si se usara INNER JOIN, eliminaría la fila 107, ya que el manager estaría en NULL y no mostraría los valores que no coinciden entre las tablas. Es por ello que se utilizó LEFT JOIN, que permite mostrar la fila que no muestra el INNER JOIN; aunque el manager esté en NULL, mantiene la fila de la tabla izquierda y coloca NULL en los datos de la tabla derecha que no tengan coincidencia. 

```sql
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

SOLUCIÓN

> La condición en ON mantiene todas las filas de la tabla izquierda (mostrando nulos si no hay coincidencia), mientras que en WHERE elimina los nulos por completo del resultado final

ON
```sql
SELECT 'ON' AS variante,
       COUNT(*) AS filas_devueltas,
       'Conserva las filas de la tabla derecha' AS explicacion
FROM HR.EMPLOYEES E
RIGHT JOIN HR.DEPARTMENTS D
ON e.department_id = D.department_id AND E.SALARY > 10000;
```

WHERE
```sql
SELECT 'WHERE' AS variante,
       COUNT(*) AS filas_devueltas,
       'Elimina los nulos por completo del resultado final.' AS explicacion
FROM HR.EMPLOYEES E
RIGHT JOIN HR.DEPARTMENTS D
ON e.department_id = D.department_id 
WHERE e.salary > 10000;
```

### 6.5 Diagnóstico de nulos y compensación total

Columnas obligatorias: employee_id, last_name, department_id, salary, commission_pct,
total_compensation, es_jefe

• total_compensation no puede ser nulo para ningún empleado.

• es_jefe debe indicar explícitamente SI o NO y resolverse con NOT EXISTS.

• El comentario debe explicar por qué la versión con NOT IN sobre la subconsulta de manager_id
devuelve el conjunto vacío, y por qué NOT EXISTS no presenta ese comportamiento

> La version con NOT EXISTS permite trabajar con nulos, simplemente verifica si existe o no existe una fila que cumpla la condición. En cambio, NOT IN puede presentar problemas cuando existen valores NULL, debido a la forma en que SQL evalúa estas comparaciones.

> El uso del CASE nos permitio cumplir con la segunda condicion para indicar si el empleado es jefe mediante SI o NO. Valida si el id del manager concuerda con el empleado, si es el caso lo agrega como SI, indicando queque es Jefe; en caso contrario, muestra NO

```sql
SELECT E.EMPLOYEE_ID,
       E.LAST_NAME,
       E.DEPARTMENT_ID,
       E.SALARY,
       E.commission_pct,
       E.SALARY + (E.SALARY * NVL(COMMISSION_PCT, 0)) AS total_compensation,
       CASE
         WHEN NOT EXISTS(
            SELECT 1
            FROM HR.EMPLOYEES M
            WHERE M.MANAGER_ID = E.EMPLOYEE_ID
        )
        THEN 'NO'
        ELSE 'SI'
      END AS ES_JEFE
FROM HR.EMPLOYEES E;
```

### 6.6 Agregación con filtrado de grupos

Columnas obligatorias: department_id, department_name, employee_count, avg_salary,
min_salary, max_salary, salary_mass, empleados_recientes

Solo departamentos con más de cinco empleados y salario promedio superior a 6.000.

• empleados_recientes debe contar únicamente a los contratados después del 1 de enero de
2005, sin que ese criterio afecte a employee_count. Debe resolverse con agregación
condicional, no con WHERE.

• El comentario debe justificar por qué el criterio de más de cinco empleados no puede
escribirse en WHERE.

```sql
SELECT D.DEPARTMENT_ID, 
      D.DEPARTMENT_NAME,
      COUNT(E.EMPLOYEE_ID) AS employee_count,
      AVG (E.SALARY) AS PROMEDIO_SALARIO,
      MIN(SALARY) AS min_salary,
      MAX(SALARY) AS max_salary,
      SUM(E.SALARY) AS salary_mass,
      COUNT(CASE 
          WHEN E.HIRE_DATE > TO_DATE('2025-01-01', 'YYYY-MM-DD') THEN E.EMPLOYEE_ID
      END) AS empleados_recientes
FROM HR.EMPLOYEES E 
JOIN HR.DEPARTMENTS D
ON E.DEPARTMENT_ID = D.DEPARTMENT_ID
GROUP BY D.DEPARTMENT_ID,
         d.department_name
HAVING COUNT(E.EMPLOYEE_ID) > 5 AND AVG (E.SALARY) > 6000 ;
```

### 6.7 Comparación de cada empleado contra el promedio de su departamento

Columnas obligatorias: employee_id, last_name, department_id, salary, dept_avg_salary,
diff_vs_avg, pct_vs_avg

• Deben entregar dos versiones equivalentes: una con subconsulta correlacionada y otra con
expresión común de tabla.

• El comentario debe señalar exactamente qué columna produce la correlación y comparar
ambos planes de ejecución obtenidos con EXPLAIN PLAN o AUTOTRACE.


SUBCONSULTA CORRELACIONADA

```sql
SELECT E.EMPLOYEE_ID,
       E.LAST_NAME,
       E.DEPARTMET_ID,
       E.SALARY,
      (SELECT E2.EMPLOYEE_ID,
              AVG(E.SALARY) 
       FROM HR.EMPLOYEES E2
       WHERE E.DEPARTMENT_ID = E2.DEPARTMENT_ID
       GROUP BY D.DEPARTMENT_ID
      )AS dept_avg_salary,
       E.SALARY - dept_avg_salary AS diff_vs_avg,
       (E.SALARY - dept_avg_salary / dept_avg_salary * 100) AS pct_vs_avg
FROM HR.EMPLOYEES E;
```
> La línea que muestra que es una consulta correlacionada es WHERE E.DEPARTMENT_ID = E2.DEPARTMENT_ID, debido a que se relaciona la consulta externa con la interna. Esto hace que la consulta interna dependa de la fila que se está procesando en la consulta externa.


EXPRESIÓN COMUN DE TABLA: WITH

```sql
WITH dept_avg AS(
    SELECT DEPARTMENT_ID, AVG(SALARY) AS dept_avg_salary
    FROM HR.EMPLOYEES E 
    GROUP BY E.DEPARTMENT_ID
    )
SELECT E.EMPLOYEE_ID,
       E.LAST_NAME,
       E.DEPARTMENT_ID, 
       E.SALARY,    
       E.SALARY - dept_avg_salary AS diff_vs_avg,
       (E.SALARY - dept_avg_salary / dept_avg_salary * 100) AS pct_vs_avg
FROM HR.EMPLOYEES E
JOIN dept_avg A
ON E.DEPARTMENT_ID = A.DEPARTMENT_ID
```

### 6.8 Movilidad interna
Columnas obligatorias: employee_id, last_name, movilidad_status

• movilidad_status debe indicar CON HISTORIAL o SIN HISTORIAL.

• Deben resolverlo con INTERSECT y MINUS, y contrastar el resultado con la versión equivalente
escrita con NOT EXISTS.

• El comentario debe explicar cómo tratan los nulos las operaciones de conjuntos frente al
operador de igualdad.

<INTERSECT y MINUS> 

```sql
SELECT E.EMPLOYEE_ID,
       E.LAST_NAME,
       CASE 
          WHEN E.EMPLOYEE_ID IN (
            SELECT E.EMPLOYEE_ID
            FROM HR.EMPLOYEES E
            INTERSECT 
            SELECT J.EMPLOYEE_ID 
            FROM HR.JOB_HISTORY J)
          THEN  'CON HISTORIAL'
         WHEN E.EMPLOYEE_ID IN (
            SELECT E.EMPLOYEE_ID
            FROM HR.EMPLOYEES E
            MINUS 
            SELECT J.EMPLOYEE_ID 
            FROM HR.JOB_HISTORY J)
         THEN 'SIN HISTORIAL'
        END AS movilidad_status
FROM HR.EMPLOYEES E; 

<NOT EXISTS>

```sql
SELECT E.EMPLOYEE_ID,
       E.LAST_NAME,
       CASE
           WHEN EXISTS (
               SELECT 1
               FROM HR.JOB_HISTORY J
               WHERE J.EMPLOYEE_ID = E.EMPLOYEE_ID
           )
           THEN 'CON HISTORIAL'

           WHEN NOT EXISTS (
               SELECT 1
               FROM HR.JOB_HISTORY J
               WHERE J.EMPLOYEE_ID = E.EMPLOYEE_ID
           )
           THEN 'SIN HISTORIAL'
       END AS movilidad_status
FROM HR.EMPLOYEES E;

```

> La sentencia que trabaja con los conjuntos maneja los nulos de una manera diferente, debido a que intenta comparar las dos tablas para saber la relación entre ellas (INTERSECT) y si pertenece a una tabla y no a otra (MINUS). En el caso de que ambas tablas presenten NULL en sus resultados, los tomará en cuenta, ya sea que en ambas tengan NULL para decir que coinciden, o que el NULL pertenezca a la tabla que se está evaluando con MINUS.

> Es por ello que con NOT EXISTS no pasa este mismo comportamiento, ya que al realizar la comparación con =, si los valores son NULL, el resultado será UNKNOWN y no se tomará como una coincidencia como ocurre con las operaciones de conjuntos.

### 6.9 Jerarquía organizacional
Columnas obligatorias: employee_id, last_name, manager_id, nivel, ruta_jerarquica

• Debe construirse con una expresión común de tabla recursiva, con caso base en el empleado
sin jefe.

• ruta_jerarquica debe mostrar la cadena de apellidos desde la raíz hasta el empleado.

• El comentario debe identificar el caso base y el paso recursivo, explicar qué ocurre si UNION
ALL se reemplaza por UNION y cómo se controlaría un ciclo en los datos.



### 6.10 Posicionamiento salarial por departamento
Columnas obligatorias: employee_id, last_name, department_id, salary, rn, rk, drk, prev_salary,
delta_prev, salary_running_total, dept_avg_salary, pct_vs_dept_avg

• rn, rk y drk corresponden a ROW_NUMBER, RANK y DENSE_RANK sobre la misma partición y el
mismo ordenamiento.

• prev_salary y delta_prev deben calcularse con LAG sobre la fecha de contratación, sin que la
primera fila de cada partición quede en nulo.

• salary_running_total es el acumulado por departamento en orden de contratación.




### 6.11 Tres mejor pagados de cada departamento
Columnas obligatorias: department_id, department_name, employee_id, last_name, salary, drk

• No se acepta filtrar el alias de la función de ventana en el WHERE de la misma consulta.

• El comentario debe explicar en qué momento del orden lógico de evaluación se calculan las
funciones de ventana y por qué eso obliga a envolver la consulta.


```sql
WITH MEJORPAGADOS AS (
    SELECT 
       D.DEPARTMENT_ID,
       D.DEPARTMENT_NAME,
       E.EMPLOYEE_ID,
       E.LAST_NAME,
       E.SALARY,
        DENSE_RANK() OVER (
            PARTITION BY  D.DEPARTMENT_ID
            ORDER BY E.SALARY DESC
        ) AS MEJOR_PAGA
    FROM HR.EMPLOYEES E
    JOIN HR.DEPARTMENTS D
    ON D.DEPARTMENT_ID = E.DEPARTMENT_ID
)

SELECT DEPARTMENT_ID,
       DEPARTMENT_NAME,
       EMPLOYEE_ID,
       LAST_NAME,
       SALARY
FROM MEJORPAGADOS 
WHERE MEJOR_PAGA <= 3
ORDER BY DEPARTMENT_ID ASC, MEJOR_PAGA ASC;
```

> primero se calcula lo que se encuntra dentro del WITH, permitiendo realizar un cálculo y envolver toda esa operación para utilizarla posteriormente en otra parte de la consulta. as funciones de ventana se calculan después de las cláusulas WHERE, GROUP BY y HAVING, por lo que no se puede filtrar directamente en el mismo nivel de consulta el resultado de la función de ventana. Posteriormente, se reliza lo que está afuera del WITH utilizando este como una "tabla" y permitiendo realizar las especificaciones según la operación que se realizó. En este caso, se asignó un rango para cada empleado de cada departamento de toda la tabla y despues, con la consula exterior, se da una condicion WHERE MEJOR_PAGA <= 3 mostrando únicamente los empleados que se encuentran dentro de los tres mejores rangos de cada departamento.

#### 6.12 Depuración de consultas defectuosas

Columnas obligatorias del cuadro de diagnóstico: consulta_id, enunciado, error_detectado,
mecanismo, evidencia_correccion


<table>
  <thead>
    <tr>
      <th>Consulta ID</th>
      <th>Enunciado</th>
      <th>Error detectado</th>
      <th>Mecanismo</th>
      <th>Evidencia de corrección</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>I.1</td>
      <td>Todos los departamentos con la cantidad de empleados, incluidos los vacíos.</td>
      <td>
        Se utilizó <code>COUNT(*)</code>, lo que cuenta la fila generada por el
        <code>LEFT JOIN</code> aunque el empleado sea <code>NULL</code>.
      </td>
      <td>
        <code>COUNT(*)</code> cuenta filas, mientras que
        <code>COUNT(e.employee_id)</code> ignora los valores <code>NULL</code>.
      </td>
      <td>
        Al cambiar a <code>COUNT(e.employee_id)</code>, los departamentos sin
        empleados muestran una cantidad de 0.
      </td>
    </tr>
   <tr>
     <td>I.2</td>
     <td>Empleados que no trabajan en los departamentos 10, 20 ni 30.</td>
     <td>
        El <code>NOT IN</code> no maneja correctamente los valores
        <code>NULL</code>, ya que los empleados cuyo <code>department_id</code>
        es <code>NULL</code> no cumplen la condición.
    </td>
    <td>
         Al comparar un <code>NULL</code> con los valores de <code>NOT IN</code>,
         el resultado es <code>UNKNOWN</code>, por lo que el empleado no es
         incluido por el <code>WHERE</code>.
    </td>
     <td>
         Se debe considerar explícitamente el caso <code>NULL</code> para incluir
         también a los empleados que no tienen departamento.
     </td>
   </tr>
   <tr>
  <td>I.3</td>
  <td>
    Departamentos ubicados en Estados Unidos y la cantidad de empleados que trabajan en ellos.
  </td>
  <td>
    Se utiliza <code>LEFT JOIN</code> con <code>locations</code>, aunque se
    requieren únicamente los departamentos cuya ubicación corresponde a
    Estados Unidos. El <code>LEFT JOIN</code> conserva también los
    departamentos sin coincidencia en <code>locations</code>.
  </td>
  <td>
    El <code>LEFT JOIN</code> genera también filas con valores
    <code>NULL</code> para las columnas de <code>locations</code>. Aunque
    posteriormente el <code>WHERE l.country_id = 'US'</code> elimina esas
    filas y las que no corresponden a Estados Unidos, el uso de
    <code>LEFT JOIN</code> no es necesario para este caso, ya que se buscan
    únicamente coincidencias.
  </td>
  <td>
    Se reemplaza el <code>LEFT JOIN</code> por <code>JOIN</code> para
    <code>locations</code>. Si también se utiliza <code>JOIN</code> con
    <code>employees</code>, el <code>COUNT(*)</code> puede mantenerse porque
    solo se consideran filas con coincidencias.
  </td>
</tr>
<tr>
  <td>I.4</td>
  <td>
    El empleado mejor pagado de cada departamento.
  </td>
  <td>
    Se incluye <code>last_name</code> en el <code>GROUP BY</code>, por lo que
    se crea un grupo diferente para cada empleado dentro de cada departamento.
    De esta manera, <code>MAX(salary)</code> no obtiene el salario máximo de
    todo el departamento.
  </td>
  <td>
    Al agrupar por <code>department_id</code> y <code>last_name</code>, cada
    empleado queda en su propio grupo. Por lo tanto, <code>MAX(salary)</code>
    se calcula sobre cada empleado individualmente en lugar de calcularse
    sobre todos los empleados del departamento.
  </td>
  <td>
    Se debe agrupar únicamente por <code>department_id</code> para obtener el
    salario máximo de cada departamento. Posteriormente, se requiere otro
    mecanismo para identificar el empleado que corresponde a ese salario
    máximo.
  </td>
  </tr>
  <tr>
  <td>I.5</td>
  <td>
    Promedio de comisión de la compañía, contando como cero a quienes no reciben comisión.
  </td>
  <td>
    Se utiliza <code>AVG(commission_pct)</code> directamente, pero los empleados
    que no reciben comisión tienen el valor <code>NULL</code>.
  </td>
  <td>
    <code>AVG()</code> ignora los valores <code>NULL</code> al calcular el
    promedio. Por lo tanto, los empleados que no reciben comisión no participan
    en el denominador del promedio.
  </td>
      <td>
    Se deben convertir los valores <code>NULL</code> de <code>commission_pct</code>
    a <code>0</code> antes de aplicar <code>AVG()</code>, por ejemplo mediante
    <code>NVL(commission_pct, 0)</code>.
    </td>
  </tr>

  </tbody>
</table>

