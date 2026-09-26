---
title: "PL/SQL basico (primeros pasos)"
date: "2026-09-25T23:30:00+08:00"
updated: "2026-09-26T17:45:29+08:00"
"description": "Aqui se evidencia mis primeros pasos en PL/SQL, aprendiendo de lo basico a lo avanzado"
draft: false
categories:
  - "PLSQL"
tags: []
---

### Bloque PL/SQL

Todo el trabajo que va a ejecutar un programa se define por cuatro palabras claves

<p>DECLARE (opcional)</p>
variables, constantes, cursores
Secciones declarativas

<p>BEGIN (obligatoria)</p>
sentencias SQL y PL/SQL
la única parte que siempre existe
Seccion ejecutable
   
<p>EXCEPTION (opcional)</p>
manejo de errores, WHEN OTHERS

<p>END;</p>
final del programa

### PL/SQL VS SQL

> SQL: SQL solo no alcanza para programas complejos. SQL es declarativo (dices qué quieres, no cómo), pero no tiene IF, no tiene bucles, no puede guardar un valor en una variable y reutilizarlo.

> PL/SQL = Procedural Language / SQL. Es Oracle metiéndole a SQL las herramientas de un lenguaje de programación normal: variables, condicionales, bucles, manejo de errores.

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

Ejemplo:
Estructura de variables que siempre se debe usar 
VV VARCHAR
VF FECHA
VN NUMERO
VB BOOLEAN
VC CHAR

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

### Definicion de tipo d datos autimatico

```sql
DECLARE
  nombre paises.nom_pais%TYPE;    
BEGIN
  SELECT nom_pais INTO nombre FROM paises WHERE cod_pais = 3;
  dbms_output.put_line('El país es: ' || nombre);
END;
```
> Aquí %TYPE es un truco muy usado: en vez de escribir VARCHAR2(30) a mano y arriesgarte a que un día la tabla cambie de tipo y tu variable se desactualice, le dices "sé del mismo tipo que esa columna".





