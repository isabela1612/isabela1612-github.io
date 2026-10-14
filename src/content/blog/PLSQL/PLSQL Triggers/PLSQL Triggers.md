---
title: "Triggers en PL/SQL"
date: "2026-10-09T20:00:00+08:00"
updated: "2026-10-13T17:45:29+08:00"
"description": "En este espacio se explicara y detallara lo que aprendi de los triggers"
draft: false
categories:
  - "PL/SQL"
tags: []
---

### ¿Qué es un trigger?

Un trigger (disparador) es un bloque de código PL/SQL que Oracle ejecuta automáticamente cuando ocurre un evento determinado.

Ejemplo:
Es como la alarma de un celular: no se tiene que abrir la alarma y ejecutarla manualmente cuando llega la hora; la alarma se activa porque ocurrió el evento programado.

### Anatomía de un trigger

1. CREATE OR REPLACE TRIGGER
    Crea el trigger o reemplaza su definición.

2. BEFORE / AFTER / INSTEAD OF
    Indica el momento o comportamiento del disparador.

3. INSERT / UPDATE / DELETE
    Indica el evento que lo activa.

4. ON nombre_tabla
    Indica sobre qué tabla actúa.

5. FOR EACH ROW (opcional)
    Indica que se ejecuta una vez por cada fila afectada.

6. BEGIN ... END
    Contiene las instrucciones que ejecuta.

### Sintaxis general

```sql 
CREATE OR REPLACE TRIGGER nombre_trigger
BEFORE INSERT ON nombre_tabla
FOR EACH ROW
BEGIN
    -- Instrucciones que se ejecutan automáticamente
    NULL;
END;
/
```

### BEFORE, AFTER e INSTEAD OF

>  BEFORE -- Antes de la operación
Se usa, por ejemplo, para modificar los valores que se van a insertar o actualizar, mediante :NEW.

> AFTER -- Después de la operación correspondiente
Se usa, por ejemplo, para registrar una auditoría después de que se procesa cada fila.

> En lugar de la operación original
Se utiliza sobre vistas y ejecuta las instrucciones que traducen la operación solicitada a las tablas subyacentes.

DIFERENCIA ENTRE BEFORE Y AFTER


<table border="1" cellpadding="8" cellspacing="0">
  <caption>Diferencia entre trigger BEFORE y AFTER</caption>
  <thead>
    <tr>
      <th>Características</th>
      <th>BEFORE (Antes)</th>
      <th>AFTER (Después)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Momento de ejecución</th>
      <td>Se ejecuta <strong>antes</strong> de que los datos se escriban o cambien en la tabla.</td>
      <td>Se ejecuta <strong>después</strong> de que la operación se ha realizado con éxito en la tabla.</td>
    </tr>
    <tr>
      <th>Modificar valores</th>
      <td><strong>Sí permite.</strong> Puedes alterar los datos entrantes (ej. forzar texto a mayúsculas o poner valores por defecto) antes de guardarlos.</td>
      <td><strong>No permite.</strong> Los datos ya están guardados en la tabla, por lo que no se pueden modificar directamente en esa misma fila.</td>
    </tr>
    <tr>
      <th>Validaciones</th>
      <td><strong>Ideal para validar.</strong> Si los datos no cumplen una regla, puedes cancelar la operación antes de que toque la base de datos.</td>
      <td><strong>No es óptimo.</strong> Aunque puedes revertir la operación (hacer un <em>rollback</em>), consume más recursos porque el cambio ya se había procesado.</td>
    </tr>
    <tr>
      <th>Uso principal</th>
      <td>Validar datos, limpiar texto, autollenar campos o corregir errores antes de guardar.</td>
      <td>Registrar auditorías (logs), actualizar acumulados en otras tablas o activar notificaciones.</td>
    </tr>
  </tbody>
</table>

Ejemplo: asignar automáticamente una fecha

Imagina que tienes una tabla de inscripciones y quieres que cada inscripción tenga una fecha de registro.

```sql 
CREATE OR REPLACE TRIGGER TRG_INSCRIPCION_BI
BEFORE INSERT ON INSCRIPCION
FOR EACH ROW
BEGIN
    :NEW.FECHA_REGISTRO := SYSDATE;
END;
/
```

EL USUARIO ESCRIBE:

```sql 
INSERT INTO INSCRIPCION (ID_INSCRIPCION)
VALUES (1);
```

Se activa el trigger BEFORE INSERT:
```sql 
:NEW.FECHA_REGISTRO := SYSDATE;
```

### ¿Qué significa FOR EACH ROW?

Oracle distingue entre dos alcances:

- Por fila: el trigger se ejecuta una vez por cada fila afectada.
- Por sentencia: el trigger se ejecuta una sola vez por cada sentencia SQL, sin importar cuántas filas afecte.

EJEMPLO:

la tabla INSCRIPCION contiene 100 registros y se ejecuta:
```sql
UPDATE INSCRIPCION
SET ESTADO = 'ACTIVA';
```

1. Tirgger por fila

Con FOR EACH ROW

|  1  |  2  |  3  |  4  |  5  | …100

Se ejecuta 100 veces, una por cada fila afectada.

2. Trigger por sentencia
Sin FOR EACH ROW

1 ejecución

Se ejecuta una vez por el UPDATE completo.


### :NEW y :OLD: los valores de una fila

Son referencias que permiten acceder a los valores de la fila que se está insertando, actualizando o eliminando.


EJEMPLO: registrar quién modificó una nota
```sql
CREATE OR REPLACE TRIGGER TRG_NOTA_AUDITA
BEFORE UPDATE OF NOTA ON INSCRIPCION
FOR EACH ROW
WHEN (NEW.NOTA <> OLD.NOTA)
BEGIN
    :NEW.USUARIO_MODIFICA := USER;
END;
/
```

> NOTA: En el cuerpo se escribe :NEW y :OLD; en la cláusula WHEN se escriben NEW y OLD, sin los dos puntos.

### Auditoría: registrar INSERT, UPDATE y DELETE

La auditoría sirve para mantener un historial de las operaciones realizadas sobre una tabla.
Por ejemplo, se puede querer guardar:

- Fecha y hora.
- Usuario que hizo el cambio.
- Operación ejecutada.
- Identificador anterior.
- Identificador nuevo.

El trigger no solo detecta que algo pasó: también puede insertar un registro en una tabla de auditoría.

EJEMPLO:

```sql
CREATE OR REPLACE TRIGGER TRG_INSCRIPCION_AUDITA
AFTER INSERT OR UPDATE OR DELETE ON INSCRIPCION
FOR EACH ROW
DECLARE
    V_OPERACION VARCHAR2(10);
BEGIN
    IF INSERTING THEN
        V_OPERACION := 'INSERT';
    ELSIF UPDATING THEN
        V_OPERACION := 'UPDATE';
    ELSIF DELETING THEN
        V_OPERACION := 'DELETE';
    END IF;

    INSERT INTO AUDITORIA (
        FECHA, USUARIO, OPERACION,
        ID_ANTERIOR, ID_NUEVO
    )
    VALUES (
        SYSTIMESTAMP, USER, V_OPERACION,
        :OLD.ID_INSCRIPCION, :NEW.ID_INSCRIPCION
    );
END;
/
```

tres predicados condicionales:

<table border="1" cellpadding="8" cellspacing="0">
  <caption>Predicados condicionales en triggers</caption>
  <thead>
    <tr>
      <th>Predicado</th>
      <th>Significado</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>INSERTING</td>
      <td>El evento actual es un INSERT.</td>
    </tr>
    <tr>
      <td>UPDATING</td>
      <td>El evento actual es un UPDATE.</td>
    </tr>
    <tr>
      <td>DELETING</td>
      <td>El evento actual es un DELETE.</td>
    </tr>
  </tbody>
</table>

¿Qué quedaría registrado?

INSERT
ID_ANTERIOR será nulo y ID_NUEVO contendrá el identificador insertado.

UPDATE
Si el identificador no cambió, ambos campos contendrán el mismo identificador.

DELETE
ID_ANTERIOR contendrá el identificador eliminado y ID_NUEVO será nulo.


### Tabla mutante: el error ORA-04091

Una tabla se considera mutante cuando Oracle está procesando un cambio sobre ella y un trigger por fila intenta consultar o modificar esa misma tabla en un momento en que no está permitido.

Ejemplo del problema

Supongamos que se quiere impedir que una asignatura tenga más de 30 inscripciones.

Podrías intentar escribir:

```sql
CREATE OR REPLACE TRIGGER TRG_TOPE_CUPO
BEFORE INSERT ON INSCRIPCION
FOR EACH ROW
DECLARE
    V_TOTAL NUMBER;
BEGIN
    SELECT COUNT(*)
    INTO V_TOTAL
    FROM INSCRIPCION
    WHERE ID_ASIGNATURA = :NEW.ID_ASIGNATURA;

    IF V_TOTAL >= 30 THEN
        RAISE_APPLICATION_ERROR(-20020, 'Cupo lleno');
    END IF;
END;
/
```

El problema está aquí:

FROM INSCRIPCION

El trigger se ejecuta porque se está insertando una fila en INSCRIPCION, pero intenta consultar esa misma tabla dentro del trigger por fila.

Error:

```text
ORA-04091: table INSCRIPCION is mutating,
trigger/function may not see it
```

¿Por qué Oracle lo impide?
Porque durante una operación que afecta varias filas, el trigger podría observar un estado intermedio de la tabla. Oracle evita que la lógica dependa de ese estado inconsistente.

NOTA: Este ERROR solo ocurre cuando es un trigger por fila no de sentencia

¿Cómo se resuelve?
Usando el trigger compuesto (compound trigger). La idea es separar el trabajo en dos momentos:

1. Durante el procesamiento de las filas, recopilar los identificadores que interesan.

2. Cuando termina la sentencia, consultar la tabla y validar el resultado.

De esta manera, la consulta se realiza en AFTER STATEMENT, cuando el DML ya terminó de procesar las filas.

### Trigger compuesto: COMPOUND TRIGGER

Un trigger compuesto permite tener varias secciones de ejecución dentro de un mismo trigger y compartir variables entre ellas.

SU ESTRUCTURA:

```sql
CREATE OR REPLACE TRIGGER TRG_EJEMPLO
FOR INSERT ON INSCRIPCION
COMPOUND TRIGGER

    -- Variables compartidas
    -- Se declaran aquí

    BEFORE STATEMENT IS
    BEGIN
        NULL;
    END BEFORE STATEMENT;

    AFTER EACH ROW IS
    BEGIN
        NULL;
    END AFTER EACH ROW;

    AFTER STATEMENT IS
    BEGIN
        NULL;
    END AFTER STATEMENT;

END TRG_EJEMPLO;
/
```

Las secciones posibles son:

<table border="1" cellpadding="8" cellspacing="0">
  <caption>Secciones de un trigger compuesto</caption>
  <thead>
    <tr>
      <th>Sección</th>
      <th>¿Cuándo se ejecuta?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>BEFORE STATEMENT</code></td>
      <td>Antes de procesar la sentencia.</td>
    </tr>
    <tr>
      <td><code>BEFORE EACH ROW</code></td>
      <td>Antes de procesar cada fila.</td>
    </tr>
    <tr>
      <td><code>AFTER EACH ROW</code></td>
      <td>Después de procesar cada fila.</td>
    </tr>
    <tr>
      <td><code>AFTER STATEMENT</code></td>
      <td>Al terminar el procesamiento de la sentencia.</td>
    </tr>
  </tbody>
</table>

> No es obligatorio utilizar las cuatro secciones.

¿Cómo se aplica a la tabla mutante?

1. BEFORE STATEMENT
Prepara el estado compartido.

2. AFTER EACH ROW
Recopila los identificadores de asignatura que se deben validar, sin consultar la tabla mutante.

3. AFTER STATEMENT
Consulta la tabla y valida el cupo, una vez finalizado el DML.

Un trigger compuesto es útil cuando necesitas compartir información entre filas y realizar una comprobación al final de la operación.

### INSTEAD OF: triggers sobre vistas

Por ejemplo, una vista podría mostrar conjuntamente:

- El identificador de una inscripción.
- El estado de la inscripción.
- El nombre del estudiante.
- El título de la asignatura.

Como esa información procede de varias tablas, puede que Oracle no pueda resolver directamente un UPDATE sobre la vista.

Ahí entra INSTEAD OF.

EJEMPLO:

```sql
CREATE OR REPLACE TRIGGER TRG_V_INSCRIPCION_UPD
INSTEAD OF UPDATE ON V_INSCRIPCION_DETALLE
FOR EACH ROW
BEGIN
    UPDATE INSCRIPCION
    SET ESTADO = :NEW.ESTADO
    WHERE ID_INSCRIPCION = :OLD.ID_INSCRIPCION;
END;
/
```

¿Qué significa?

1. Alguien intenta actualizar V_INSCRIPCION_DETALLE.
2. El trigger sustituye la operación original por el código que escribiste.
3. El código actualiza la tabla real INSCRIPCION.

NOTA:
- INSTEAD OF se utiliza sobre vistas.
- Siempre es un trigger por fila.

### Triggers de sistema y DDL

Oracle también permite crear triggers para reaccionar a eventos del sistema o cambios en los objetos de la base de datos.

Por ejemplo:

- CREATE: alguien crea un objeto.
- ALTER: alguien modifica la estructura de un objeto.
- DROP: alguien elimina un objeto.
- LOGON: alguien inicia sesión.
- LOGOFF: alguien cierra sesión.
- SERVERERROR: ocurre un error de servidor.

Estos triggers se utilizan, entre otros fines, para auditoría de cambios en el esquema y seguimiento de eventos de sesión.

Ejemplo: auditar cambios en el esquema

```sql
CREATE OR REPLACE TRIGGER TRG_AUDITA_DDL
AFTER CREATE OR ALTER OR DROP ON SCHEMA
BEGIN
    INSERT INTO AUDITORIA_DDL (
        FECHA, USUARIO, EVENTO, OBJETO, TIPO
    )
    VALUES (
        SYSTIMESTAMP,
        ORA_LOGIN_USER,
        ORA_SYSEVENT,
        ORA_DICT_OBJ_NAME,
        ORA_DICT_OBJ_TYPE
    );
END;
/
```

Las variables especiales significan:

<table border="1" cellpadding="8" cellspacing="0">
  <caption>Atributos de eventos en triggers de sistema</caption>
  <thead>
    <tr>
      <th>Atributo</th>
      <th>Información</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>ORA_LOGIN_USER</code></td>
      <td>Usuario que inició sesión.</td>
    </tr>
    <tr>
      <td><code>ORA_SYSEVENT</code></td>
      <td>Evento que ocurrió.</td>
    </tr>
    <tr>
      <td><code>ORA_DICT_OBJ_NAME</code></td>
      <td>Nombre del objeto involucrado.</td>
    </tr>
    <tr>
      <td><code>ORA_DICT_OBJ_TYPE</code></td>
      <td>Tipo de objeto involucrado.</td>
    </tr>
  </tbody>
</table>

La cláusula ON SCHEMA limita el trigger a eventos del esquema en que se crea. Un trigger sobre DATABASE tiene un alcance mayor y requiere los privilegios administrativos apropiados.

### Varios triggers y la cláusula FOLLOWS

Puede haber varios triggers para el mismo evento y momento.
Por ejemplo, podrías tener:

- TRG_INSCRIPCION_BI: asigna la fecha de registro.
- TRG_INSCRIPCION_VALIDA: comprueba alguna regla antes de insertar.

Si necesitas declarar que uno debe ejecutarse después de otro, puedes utilizar FOLLOWS cuando las condiciones de Oracle lo permitan.

```sql
CREATE OR REPLACE TRIGGER TRG_INSCRIPCION_VALIDA
BEFORE INSERT ON INSCRIPCION
FOR EACH ROW
FOLLOWS TRG_INSCRIPCION_BI
BEGIN
    NULL;
END;
/
```
Aquí se establece que TRG_INSCRIPCION_VALIDA se ejecute después de TRG_INSCRIPCION_BI, dentro del ámbito de ordenamiento aplicable.

Otros comandos importantes son:

```sql
-- Deshabilitar un trigger sin eliminarlo
ALTER TRIGGER TRG_INSCRIPCION_VALIDA DISABLE;

-- Volver a habilitarlo
ALTER TRIGGER TRG_INSCRIPCION_VALIDA ENABLE;
```

Un trigger deshabilitado sigue existiendo, pero no se dispara.

Si el trigger es inválido por errores de compilación, la operación DML que lo activa puede fallar con ORA-04098.

### ¿Cómo consultar y diagnosticar los triggers?

Oracle dispone de vistas del diccionario de datos para conocer qué triggers existen, cuál es su estado y qué errores tienen.

Consultar los triggers de una tabla:

```sql
SELECT TRIGGER_NAME,
       TRIGGER_TYPE,
       TRIGGERING_EVENT,
       STATUS
FROM USER_TRIGGERS
WHERE TABLE_NAME = 'INSCRIPCION';
```

los nombres de los objetos sin comillas suelen guardarse en mayúsculas en el diccionario.

Consultar el código de un trigger: 

```sql
SELECT TRIGGER_BODY
FROM USER_TRIGGERS
WHERE TRIGGER_NAME = 'TRG_INSCRIPCION_AUDITA';
```

Consultar errores de compilación:

```sql
SELECT NAME, LINE, TEXT
FROM USER_ERRORS
WHERE TYPE = 'TRIGGER';
```

Recompilar un trigger

```sql
ALTER TRIGGER TRG_INSCRIPCION_AUDITA COMPILE;
```

### Errores frecuentes 

<table border="1" cellpadding="8" cellspacing="0">
  <caption>Errores comunes en triggers</caption>
  <thead>
    <tr>
      <th>Error o síntoma</th>
      <th>Causa habitual</th>
      <th>Qué debes revisar</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>ORA-04091</code></td>
      <td>Un trigger por fila consulta su propia tabla mutante.</td>
      <td>Reorganizar la lógica; considerar un trigger compuesto.</td>
    </tr>
    <tr>
      <td><code>ORA-04098</code></td>
      <td>El trigger está inválido.</td>
      <td>Consultar <code>USER_ERRORS</code> y corregir el código.</td>
    </tr>
    <tr>
      <td><code>ORA-04092</code></td>
      <td>Se intenta ejecutar <code>COMMIT</code> o <code>ROLLBACK</code> dentro de un trigger normal.</td>
      <td>Retirar el control transaccional del trigger.</td>
    </tr>
    <tr>
      <td><code>:NEW</code> no cambia el valor</td>
      <td>La asignación se hizo en un trigger <code>AFTER</code>.</td>
      <td>Utilizar <code>BEFORE</code> de fila.</td>
    </tr>
    <tr>
      <td>DML demasiado lento</td>
      <td>El trigger ejecuta consultas costosas por cada fila.</td>
      <td>Revisar si se puede usar un trigger de sentencia u otra alternativa.</td>
    </tr>
  </tbody>
</table>

¿Por qué no se utiliza COMMIT dentro de un trigger normal?

Porque el trigger se ejecuta como parte de la transacción que inició el usuario. No debe confirmar o revertir esa transacción por su cuenta.

Si el trigger falla, normalmente también falla la sentencia DML que lo activó. Las transacciones autónomas son una excepción especializada para casos como la auditoría independiente, pero no deben utilizarse como solución automática para cualquier error.
