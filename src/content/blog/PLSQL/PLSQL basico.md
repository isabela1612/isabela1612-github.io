---
title: "PL/SQL basico (primeros pasos)"
date: "2026-09-25T23:30:00+08:00"
updated: "2026-09-27T17:45:29+08:00"
"description": "Aqui se evidencia mis primeros pasos en PL/SQL, aprendiendo de lo basico a lo avanzado"
draft: false
categories:
  - "PLSQL"
tags: []
---

### Bloque PL/SQL

Todo el trabajo que va a ejecutar un programa se define por cuatro palabras claves

![alt text](image.png)

### PL/SQL VS SQL

> SQL: SQL solo no alcanza para programas complejos. SQL es declarativo (dices qué quieres, no cómo), pero no tiene IF, no tiene bucles, no puede guardar un valor en una variable y reutilizarlo.

> PL/SQL = Procedural Language / SQL. Es Oracle metiéndole a SQL las herramientas de un lenguaje de programación normal: variables, condicionales, bucles, manejo de errores.

### ¿Para qué sirve?

<tbody>
    <tr>
      <td>Procedimientos almacenados</td>
      <td>un "programa" guardado dentro de la base</td>
    </tr>
   <tr>
     <td>Funciones</td>
     <td>igual, pero devuelve un valor</td>
   </tr>
   <tr>
     <td>Triggers</td>
     <td>código que se dispara solo cuando algo pasa (un INSERT, por ejemplo)</td>
   </tr>
   <tr>
     <td>Scripts</td>
     <td>bloques sueltos para tareas puntuales</td>
   </tr>
   <tr>


### UNIDADES LÉXICAS

>DELIMITADOR: 
Es un símbolo simple o compuesto que tiene una función especial en PL/SQL.
Estos pueden ser:
<br>• Operadores Aritméticos
<br>• Operadores Lógicos
<br>• Operadores Relacionales

Ejemplo:
> ; , + -

>IDENTIFICADOR: 
Son empleados para nombrar objetos de programas en PL/SQL así como a
unidades dentro del mismo, estas unidades y objetos incluyen:
<br>• Constantes
<br>• Cursores
<br>• Variables
<br>• Subprogramas
<br>• Excepciones
<br>• Paquetes


>LITERAL: 
Es un valor de tipo numérico, carácter, cadena o lógico no representado por un
identificador (es un valor explícito)

> COMENTARIOS: 
de línea simple y multilínea:

```sql
-- Línea simple
```

```sql
/*
Conjunto de Líneas
*/
```
### Variables y tipo de datos

Ejemplo:
Estructura de variables que siempre se debe usar 

![alt text](image-1.png)

También puedes especificar precisión y escala:

```sql
saldo NUMBER(16,2);
```
> Se utiliza NUMBER(16,2) para representar 14 dígitos enteros y 2 decimales.

>Oracle redondea los decimales sobrantes en silencio, pero NUNCA recorta dígitos enteros. Si el entero no cabe, es un error duro, no un truncamiento silencioso.
ERROR:

>ORA-01438: value larger than specified precision allows for this column

Constantes:
```sql
PI CONSTANT NUMBER := 3.1416;
```
> CONSTANT obliga a inicializar la constante y que su valor no puede modificarse.
```sql
v_edad NUMBER := 20;
v_edad := 21;
```
una variable no puede quedar en NULL:
```sql
v_nombre VARCHAR2(30) NOT NULL := 'Isabela';
```
EL SIGNO ":="

> El operador := se usa para asignar un valor, mientras que = se usa para comparar la igualdad

> := (Asignación): Asigna un valor a una variable o parámetro. Guarda la información dentro del espacio de memoria de la variable.

> = (Comparación o Asignación): En consultas SQL estándar (WHERE col = val), evalúa si dos expresiones son iguales (devuelve verdadero o falso). 

### Definicion de tipo de datos automatico(%TYPE y %ROWTYPE)

```sql
DECLARE
  nombre paises.nom_pais%TYPE;    
BEGIN
  SELECT nom_pais INTO nombre FROM paises WHERE cod_pais = 3;
  dbms_output.put_line('El país es: ' || nombre);
END;
```

> Aquí %TYPE es un truco muy usado: en vez de escribir VARCHAR2(30) a mano y arriesgarte a que un día la tabla cambie de tipo y tu variable se desactualice, le dices "sé del mismo tipo que esa columna".

```sql
v_empleado employees%ROWTYPE;
```
![alt text](image-2.png)

> %ROWTYPE obtiene los tipos de todos los campos de una tabla, vista o cursor.


### SELECT ... INTO


```sql
DECLARE
    v_nombre employees.first_name%TYPE;

BEGIN

    SELECT first_name
    INTO v_nombre
    FROM employees
    WHERE employee_id = 100;

END;
```

> 1. El SELECT first_name FROM employees WHERE employee_id = 100; busca el nombre del empleado con el ID 100.
2. Al encontrarlo (por ejemplo, "Steven"), la instrucción INTO v_nombre toma ese valor y lo guarda dentro de la variable v_nombre que declaraste arriba.

>NOTA: Debe devolver exactamente una fila: Si el SELECT no encuentra ningún registro (NO_DATA_FOUND) o si devuelve más de una fila (TOO_MANY_ROWS), el programa fallará con un error a menos que captures la excepción.



