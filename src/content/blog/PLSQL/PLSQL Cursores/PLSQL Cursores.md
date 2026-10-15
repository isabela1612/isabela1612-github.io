---
title: "Cursores en PL/SQL"
date: "2026-10-09T20:00:00+08:00"
updated: "2026-10-13T17:45:29+08:00"
"description": "Un espacio donde explico y detallo lo aprendido sobre cursores utilizando ejemplos, su estructura y mas."
draft: false
categories:
  - "PL/SQL"
tags: []
---

### ¿Qué es un cursor y para qué sirve?

Un cursor permite manejar el resultado de una sentencia SQL desde PL/SQL, incluyendo su recorrido fila por fila cuando es necesario.

RECORDEMOS:

- SQL trabaja con conjuntos de filas. Una consulta puede devolver una fila, cien o miles.

- PL/SQL utiliza variables para trabajar con valores y permite ejecutar instrucciones, condiciones y bucles.

EJEMPLO:

Digamos que se tiene esta tabla PRODUCTO:

ID_PRODUCTO	NOMBRE	PRECIO
1	       Teclado	80000
2	       Mouse	45000
3	       Monitor	650000

Ejecuta una consulta en SQL:

```sql
SELECT id_producto, nombre, precio
FROM producto;
```

Oracle devuelve las tres filas. Pero ¿qué pasa si necesitas revisar cada producto, evaluar su precio y mostrar un mensaje diferente para cada uno?

Por ejemplo:
- Si cuesta más de $100.000, mostrar Producto costoso.
- Si cuesta $100.000 o menos, mostrar Producto económico.

Aquí necesitas combinar una consulta SQL con lógica PL/SQL para procesar los resultados.

> El cursor permite acceder el resultado y recuperra las filas.

Idea clave: el cursor no es una tabla nueva ni una variable que guarda automáticamente todos los datos. Es un mecanismo para manejar el resultado de una consulta.


¿Siempre se debe declarar un cursor?

No. Hay una regla muy importante:

> Si el problema se resuelve con una sola sentencia SQL, no uses un cursor explícito innecesariamente.

> En cambio, si debes aplicar una lógica particular a cada fila, puede ser apropiado utilizar un cursor.

### Tipos de cursores

> Cursor implícito

Oracle lo administra automáticamente. Tú consultas sus atributos cuando los necesitas.

Ejemplo: SQL%ROWCOUNT después de un UPDATE.

> 2. Cursor explícito

Tú declaras la consulta, abres el cursor, recuperas las filas y lo cierras.

Ejemplo: CURSOR, OPEN, FETCH y CLOSE.

> 3. Cursor recorrido con FOR

Oracle administra la apertura, la recuperación y el cierre por ti.

Ejemplo: FOR r IN c_productos LOOP.

> 4. Cursor parametrizado

Recibe valores para filtrar la consulta de distintas maneras.

Ejemplo: consultar pedidos de un cliente específico.

> 5. Cursor de referencia

Puede entregarse como parámetro a otro programa, mediante SYS_REFCURSOR.

Ejemplo: un procedimiento que devuelve un conjunto de movimientos.

### Cursor implícito

Oracle lo crea y gestiona de forma automática cada vez que ejecutas una instrucción SQL que afecta a una sola fila (o una operación DML).

EJEMPLO:

```sql
BEGIN
    UPDATE producto
    SET precio = precio * 1.05
    WHERE id_producto = 1;

    DBMS_OUTPUT.PUT_LINE(
        'Filas afectadas: ' || SQL%ROWCOUNT
    );
END;
/
```

¿Qué ocurre?

1. El UPDATE modifica el producto con ID 1.
2. Oracle administra el cursor implícito de esa sentencia.
3. SQL%ROWCOUNT indica cuántas filas modificó el UPDATE.
4. DBMS_OUTPUT.PUT_LINE muestra el resultado.

### Los atributos del cursor implícito

<table border="1" cellpadding="8" cellspacing="0">
  <caption>Atributos del cursor implícito SQL%</caption>
  <thead>
    <tr>
      <th>Atributo</th>
      <th>¿Qué indica?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>SQL%FOUND</code></td>
      <td><code>TRUE</code> si la última sentencia SQL afectó al menos una fila.</td>
    </tr>
    <tr>
      <td><code>SQL%NOTFOUND</code></td>
      <td><code>TRUE</code> si no afectó ninguna fila.</td>
    </tr>
    <tr>
      <td><code>SQL%ROWCOUNT</code></td>
      <td>Número de filas afectadas o recuperadas, según la sentencia.</td>
    </tr>
    <tr>
      <td><code>SQL%ISOPEN</code></td>
      <td>Siempre <code>FALSE</code> para el cursor implícito, porque Oracle lo cierra automáticamente.</td>
    </tr>
  </tbody>
</table>

EJEMPLO:

```sql
BEGIN
    UPDATE producto
    SET precio = precio * 1.05
    WHERE id_producto = 999;

    IF SQL%NOTFOUND THEN
        DBMS_OUTPUT.PUT_LINE('Producto no encontrado');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Actualización realizada');
    END IF;
END;
/
```

> Estos atributos se refieren a la última sentencia SQL ejecutada. Si se ejecuta otro UPDATE, INSERT, DELETE o SELECT INTO antes de consultarlos, puedes terminar leyendo el resultado de la sentencia equivocada.

¿Qué pasa con SELECT INTO?

Tambien se utiliza un cursor implicito:

```sql
DECLARE
    v_nombre producto.nombre%TYPE;
BEGIN
    SELECT nombre
    INTO v_nombre
    FROM producto
    WHERE id_producto = 1;

    DBMS_OUTPUT.PUT_LINE(v_nombre);
END;
/
```
Este patrón está pensado para recuperar una sola fila:

- Cero filas: NO_DATA_FOUND.
- Una fila: se asigna el resultado a v_nombre.
- Más de una fila: TOO_MANY_ROWS.

### Cursor explícito

Es declarado y controlado manualmente por el programador para manejar consultas que devuelven un conjunto de múltiples filas.

Cuándo se utiliza:

- Cuando una consulta SELECT devuelve múltiples filas y necesitas recorrerlas fila por fila (o en lotes).- Cuando requieres un control detallado del ciclo de vida del cursor: declarar, abrir (OPEN), extraer datos (FETCH) y cerrar (CLOSE).
- Cuando necesitas aplicar lógicas complejas de negocio fila a fila (por ejemplo, con un bucle LOOP o FOR).

### Las cuatro fases del cursor explicito

> 1. DECLARE — Declarar
Defines la consulta que quieres recorrer.

```sql
CURSOR c_productos IS
    SELECT id_producto, nombre, precio
    FROM producto;
```

Todavía no se ejecuta la consulta por el solo hecho de declararla.

> 2. OPEN — Abrir

```sql
OPEN c_productos;
```
Oracle ejecuta la consulta y deja el cursor preparado para recuperar la primera fila.

> 3. FETCH — Recuperar

```sql
FETCH c_productos
INTO v_id, v_nombre, v_precio;
```
Recupera una fila y avanza el cursor. Por eso normalmente está dentro de un bucle.

> 4. CLOSE — Cerrar

```sql
CLOSE c_productos;
```
Libera los recursos asociados al cursor explícito.

-------------------------------------------------------------

### ¿Cómo se declara la variable que recibe los datos?

Opción A: declarar variables por separado.

```sql
DECLARE
    CURSOR c_productos IS
        SELECT id_producto, nombre, precio
        FROM producto;

    v_id     producto.id_producto%TYPE;
    v_nombre producto.nombre%TYPE;
    v_precio producto.precio%TYPE;
BEGIN
    NULL;
END;
/
```

Aquí cada variable corresponde a una columna del resultado.

- v_id recibe id_producto.
- v_nombre recibe nombre.
- v_precio recibe precio.

Opción B: utilizar %ROWTYPE.

Esta es muy útil cuando se necesita varias columnas de la consulta.

```sql
DECLARE
    CURSOR c_productos IS
        SELECT id_producto, nombre, precio
        FROM producto;

    r_producto c_productos%ROWTYPE;
BEGIN
    NULL;
END;
/
```

r_producto es un registro que tiene campos para las columnas seleccionadas por el cursor.

Por ejemplo:

- r_producto.id_producto
- r_producto.nombre
- r_producto.precio

### Ejemplo completo de cursor explícito

Supongamos que queremos recorrer los productos con un precio superior a $100.000 e imprimir su nombre y precio.

```sql
DECLARE
    CURSOR c_productos IS
        SELECT id_producto, nombre, precio
        FROM producto
        WHERE precio > 100000;

    r_producto c_productos%ROWTYPE;

BEGIN
    OPEN c_productos;

    LOOP
        FETCH c_productos INTO r_producto;

        EXIT WHEN c_productos%NOTFOUND;

        DBMS_OUTPUT.PUT_LINE(
            r_producto.nombre || ' - ' ||
            r_producto.precio
        );
    END LOOP;

    CLOSE c_productos;
END;
/
```

¿Por qué el EXIT WHEN va inmediatamente después del FETCH?

Cuando ya no quedan filas, el FETCH deja de recuperar datos y c_productos%NOTFOUND pasa a ser verdadero. El EXIT WHEN termina el bucle antes de intentar procesar el registro sin una nueva fila.

Si se coloca el EXIT WHEN después de DBMS_OUTPUT.PUT_LINE, el código podría procesar el registro con los valores de la última recuperación exitosa una segunda vez.


### Atributos del cursor explícito

Los atributos permiten conocer el estado del cursor y el resultado de sus recuperaciones.

Se escriben con el nombre del cursor, seguido de % y el atributo.

Por ejemplo:

```sql
c_productos%NOTFOUND
```

<table border="1" cellpadding="8" cellspacing="0">
  <caption>Atributos de un cursor explícito</caption>
  <thead>
    <tr>
      <th>Atributo</th>
      <th>Significado</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>c_productos%ISOPEN</code></td>
      <td>Indica si el cursor está abierto.</td>
    </tr>
    <tr>
      <td><code>c_productos%FOUND</code></td>
      <td>Indica si la última recuperación obtuvo una fila.</td>
    </tr>
    <tr>
      <td><code>c_productos%NOTFOUND</code></td>
      <td>Indica si la última recuperación no obtuvo una fila.</td>
    </tr>
    <tr>
      <td><code>c_productos%ROWCOUNT</code></td>
      <td>Cantidad de filas recuperadas hasta el momento.</td>
    </tr>
  </tbody>
</table>

¿Cómo cambian durante el recorrido?




> NOTA: El cursor sigue abierto después del último FETCH; se debe cerrarlo explícitamente.

Ejemplo: contar cuántas filas recuperaste

```sql
DECLARE
    CURSOR c_productos IS
        SELECT id_producto
        FROM producto;

    v_id producto.id_producto%TYPE;

BEGIN
    OPEN c_productos;

    LOOP
        FETCH c_productos INTO v_id;

        EXIT WHEN c_productos%NOTFOUND;

        DBMS_OUTPUT.PUT_LINE('ID: ' || v_id);
    END LOOP;

    DBMS_OUTPUT.PUT_LINE(
        'Total recuperado: ' || c_productos%ROWCOUNT
    );

    CLOSE c_productos;
END;
/
```
> NOTA:
SQL%ROWCOUNT se refiere a la última sentencia SQL implícita; c_productos%ROWCOUNT se refiere a las filas recuperadas por ese cursor explícito.

### Cursor con FOR

Oracle permite recorrer un cursor con un ciclo FOR, sin que tengas que escribir manualmente las cuatro fases.

Forma A: cursor explícito manual

```sql
DECLARE
    CURSOR c_productos IS
        SELECT id_producto, nombre
        FROM producto;

    r_producto c_productos%ROWTYPE;
BEGIN
    OPEN c_productos;

    LOOP
        FETCH c_productos INTO r_producto;
        EXIT WHEN c_productos%NOTFOUND;

        DBMS_OUTPUT.PUT_LINE(r_producto.nombre);
    END LOOP;

    CLOSE c_productos;
END;
/
```

Forma B: ciclo FOR sobre cursor

```sql
DECLARE
    CURSOR c_productos IS
        SELECT id_producto, nombre
        FROM producto;
BEGIN
    FOR r_producto IN c_productos LOOP
        DBMS_OUTPUT.PUT_LINE(r_producto.nombre);
    END LOOP;
END;
/
```

### Cursores parametrizados

Un cursor parametrizado es un cursor que recibe valores de entrada para ejecutar una consulta con diferentes filtros.

Piensa en una consulta de pedidos: necesitas consultar los pedidos de distintos clientes sin escribir un cursor diferente para cada uno.

Estructura:

```sql
CURSOR nombre_cursor (
    parametro1 TIPO,
    parametro2 TIPO
) IS
    SELECT columnas
    FROM tabla
    WHERE columna = parametro1;
```

Los parámetros se declaran dentro de los paréntesis del cursor. Son parámetros de entrada y solo lectura.

Ejemplo completo

Supongamos que se tiene una tabla PEDIDO con las columnas ID_PEDIDO, ID_CLIENTE, FECHA_PEDIDO, TOTAL y ESTADO.

Queremos listar los pedidos confirmados de un cliente a partir de una fecha.

```sql
DECLARE
    CURSOR c_pedidos (
        p_cliente NUMBER,
        p_desde   DATE
    ) IS
        SELECT id_pedido, fecha_pedido, total
        FROM pedido
        WHERE id_cliente = p_cliente
          AND fecha_pedido >= p_desde
          AND estado = 'CONFIRMADO';

BEGIN
    FOR r IN c_pedidos(
        501,
        DATE '2026-01-01'
    ) LOOP
        DBMS_OUTPUT.PUT_LINE(
            r.id_pedido || ' - ' || r.total
        );
    END LOOP;
END;
/
```

El cursor recibe dos valores:

- 501: identifica al cliente.
- DATE '2026-01-01': fecha desde la cual se consultan los pedidos.

Oracle ejecuta la consulta con esos valores y el FOR recorre las filas resultantes.


¿Cómo reutilizarlo?

Se puede invocar el mismo cursor con valores diferentes:

```sql
FOR r IN c_pedidos(501, DATE '2026-01-01') LOOP
    DBMS_OUTPUT.PUT_LINE(r.id_pedido);
END LOOP;

FOR r IN c_pedidos(502, DATE '2026-02-01') LOOP
    DBMS_OUTPUT.PUT_LINE(r.id_pedido);
END LOOP;
```
En un mismo bloque, ambas llamadas utilizan la misma definición, pero con parámetros diferentes.

### FOR UPDATE y WHERE CURRENT OF

PREGUNTA:
¿qué ocurre cuando quieres recorrer un conjunto de registros y modificar cada fila encontrada?

Oracle permite utilizar un cursor con FOR UPDATE para bloquear las filas seleccionadas con el fin de modificarlas de forma controlada.

Ejemplo: aumentar los precios de una categoría

```sql
DECLARE
    CURSOR c_productos IS
        SELECT id_producto, precio
        FROM producto
        WHERE id_categoria = 1
        FOR UPDATE OF precio;

BEGIN
    FOR r IN c_productos LOOP
        UPDATE producto
        SET precio = r.precio * 1.07
        WHERE CURRENT OF c_productos;
    END LOOP;
END;
/
```
Este ejemplo incrementa en un 7 % el precio de los productos de la categoría 1.


- FOR UPDATE OF precio --> Solicita el bloqueo de las filas seleccionadas para actualizarlas.

- WHERE CURRENT OF c_productos --> Identifica la fila posicionada actualmente por el cursor.

> La ventaja de WHERE CURRENT OF es que no se tiene que escribir una condición de actualización usando la clave primaria: Oracle utiliza la fila actual del cursor.

¿Cuánto dura el bloqueo?

El bloqueo de las filas no termina simplemente porque cierres el cursor. Se mantiene hasta que la transacción termina mediante COMMIT o ROLLBACK.

También existen estas variantes:

- FOR UPDATE NOWAIT: falla inmediatamente si no puede obtener los bloqueos porque otra sesión los mantiene.
- FOR UPDATE SKIP LOCKED: omite las filas bloqueadas; puede ser útil para repartir trabajo entre procesos concurrentes.

### Cursores de referencia: SYS_REFCURSOR

Este tipo de cursor permite entregar el resultado de una consulta a otro programa mediante un parámetro.

A diferencia de un cursor estático declarado localmente, un cursor de referencia puede pasarse entre procedimientos, funciones o una aplicación externa.

Ejemplo: procedimiento que devuelve movimientos

Supongamos que existe una tabla MOVIMIENTO_INVENTARIO.

```sql
CREATE OR REPLACE PROCEDURE sp_listar_movimientos (
    p_id_producto IN NUMBER,
    p_cursor      OUT SYS_REFCURSOR
) IS
BEGIN
    OPEN p_cursor FOR
        SELECT fecha_mov, tipo, cantidad
        FROM movimiento_inventario
        WHERE id_producto = p_id_producto
        ORDER BY fecha_mov;
END;
/
```

- p_id_producto IN NUMBER: recibe el identificador del producto.
- p_cursor OUT SYS_REFCURSOR: devuelve el cursor.
- OPEN p_cursor FOR SELECT ...: abre el cursor con el resultado de la consulta.

El procedimiento prepara y entrega el cursor, pero quien lo recibe es responsable de recuperar las filas y cerrar el cursor.

¿Cuándo se utiliza?

Por ejemplo, una aplicación Java puede llamar a un procedimiento de Oracle que devuelve varios registros para mostrarlos en una tabla. El cursor de referencia permite transportar ese resultado al programa que lo consume.

### BULK COLLECT y FORALL

- BULK COLLECT recupera varias filas en una colección PL/SQL en una sola operación.

- FORALL envía una operación DML para múltiples elementos de una colección.

- Un cursor con FETCH tradicional recupera las filas una por una.

### BULK COLLECT

```sql
DECLARE
    TYPE t_ids IS TABLE OF producto.id_producto%TYPE;

    v_ids t_ids;

BEGIN
    SELECT id_producto
    BULK COLLECT INTO v_ids
    FROM producto
    WHERE id_categoria = 3;

    DBMS_OUTPUT.PUT_LINE(
        'Recuperados: ' || v_ids.COUNT
    );
END;
/
```

1. TYPE t_ids IS TABLE OF ...: define un tipo de colección.
2. v_ids t_ids: declara una variable que puede contener varios identificadores.
3. BULK COLLECT INTO v_ids: recupera todas las filas que cumplen el filtro y las almacena en la colección.
4. v_ids.COUNT: indica cuántos elementos contiene.

Si la consulta devuelve 200 identificadores, la colección tendrá 200 elementos.

Importante: este ejemplo trae todas las filas a memoria. Si el resultado puede ser enorme, debes controlar el volumen recuperado.

### FORALL

Digamos que ya se tiene una colección con identificadores de productos y se quiere cambiar su estado.

```sql
FORALL i IN 1..v_ids.COUNT
    UPDATE producto
    SET estado = 'ACTIVO'
    WHERE id_producto = v_ids(i);
```

- v_ids(i) es el identificador del elemento actual.
- FORALL envía la operación DML para los elementos indicados.

Diferencia esencial: FORALL no es un FOR LOOP tradicional. Está diseñado para ejecutar operaciones DML masivas y no para ejecutar instrucciones arbitrarias como un bucle normal.

### Ejemplo completo con lotes de 500 filas

```sql
DECLARE
    TYPE t_ids IS TABLE OF
        producto.id_producto%TYPE;

    v_ids t_ids;

    CURSOR c_productos IS
        SELECT id_producto
        FROM producto
        WHERE estado = 'PENDIENTE';

BEGIN
    OPEN c_productos;

    LOOP
        FETCH c_productos
        BULK COLLECT INTO v_ids
        LIMIT 500;

        EXIT WHEN v_ids.COUNT = 0;

        FORALL i IN 1..v_ids.COUNT
            UPDATE producto
            SET estado = 'ACTIVO'
            WHERE id_producto = v_ids(i);
    END LOOP;

    CLOSE c_productos;
END;
/
```

Este código:

1. Declara una colección para los identificadores.
2. Declara un cursor para consultar productos pendientes.
3. Abre el cursor.
4. Recupera hasta 500 identificadores por lote.
5. Sale cuando la colección queda vacía.
6. Actualiza masivamente los identificadores del lote.
7. Repite hasta terminar.
8. Cierra el cursor.

LIMIT 500 limita el número de filas recuperadas en cada lote, ayudando a controlar el uso de memoria.


¿qué hace SAVE EXCEPTIONS?

En un FORALL, puedes utilizar SAVE EXCEPTIONS para permitir que el procesamiento continúe aunque algunas operaciones individuales fallen.

```sql
FORALL i IN 1..v_ids.COUNT SAVE EXCEPTIONS
    UPDATE producto
    SET estado = 'ACTIVO'
    WHERE id_producto = v_ids(i);
```

Después se puede revisar los errores individuales mediante SQL%BULK_EXCEPTIONS.

Sin SAVE EXCEPTIONS, un error durante el procesamiento masivo puede interrumpir el FORALL al encontrar la operación fallida. Con él, Oracle conserva la información de los errores individuales para que se pueda analizarlos después.

¿Cual es mejor opcion?

<table border="1" cellpadding="8" cellspacing="0">
  <caption>Qué técnica usar según la situación</caption>
  <thead>
    <tr>
      <th>Situación</th>
      <th>Mejor punto de partida</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Modificar todas las filas según una condición común</td>
      <td>Un único <code>UPDATE</code>.</td>
    </tr>
    <tr>
      <td>Recuperar muchos registros para procesarlos en PL/SQL</td>
      <td><code>BULK COLLECT</code>.</td>
    </tr>
    <tr>
      <td>Ejecutar DML para muchos elementos de una colección</td>
      <td><code>FORALL</code>.</td>
    </tr>
    <tr>
      <td>Aplicar lógica diferente a cada fila y mostrar resultados</td>
      <td>Cursor con <code>FOR LOOP</code>, si el volumen lo permite.</td>
    </tr>
  </tbody>
</table>

### Errores frecuentes

<table border="1" cellpadding="8" cellspacing="0">
  <caption>Errores comunes con cursores</caption>
  <thead>
    <tr>
      <th>Error o problema</th>
      <th>Causa</th>
      <th>Cómo corregirlo</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>ORA-01001: invalid cursor</code></td>
      <td>Intentar operar con un cursor que no está abierto o que ya fue cerrado.</td>
      <td>Revisar el ciclo <code>OPEN</code> → <code>FETCH</code> → <code>CLOSE</code>.</td>
    </tr>
    <tr>
      <td><code>ORA-01000: maximum open cursors exceeded</code></td>
      <td>Acumular cursores abiertos sin cerrarlos.</td>
      <td>Cerrar los cursores explícitos y revisar los recursos.</td>
    </tr>
    <tr>
      <td>Se procesa una fila dos veces</td>
      <td>El <code>EXIT WHEN</code> se coloca después del procesamiento.</td>
      <td>Ponerlo inmediatamente después de <code>FETCH</code>.</td>
    </tr>
    <tr>
      <td>Variables sin datos esperados</td>
      <td>La consulta no devuelve filas o el <code>FETCH</code> no recuperó una fila nueva.</td>
      <td>Comprobar <code>%NOTFOUND</code> antes de procesar.</td>
    </tr>
    <tr>
      <td><code>TOO_MANY_ROWS</code></td>
      <td>Un <code>SELECT INTO</code> devuelve más de una fila.</td>
      <td>Usar una consulta que devuelva una sola fila o recorrer el conjunto con un cursor.</td>
    </tr>
    <tr>
      <td>Actualizaciones muy lentas</td>
      <td>Se ejecuta DML individualmente en muchas iteraciones.</td>
      <td>Evaluar un DML único, <code>FORALL</code> o procesamiento por lotes.</td>
    </tr>
    <tr>
      <td>Bloqueos prolongados</td>
      <td>El cursor <code>FOR UPDATE</code> mantiene bloqueos hasta terminar la transacción.</td>
      <td>Limitar las filas seleccionadas y gestionar la transacción adecuadamente.</td>
    </tr>
  </tbody>
</table>






