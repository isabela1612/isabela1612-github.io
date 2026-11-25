---
title: "Bases de datos NoSQL con MongoDB"
date: "2026-11-19T20:00:00+08:00"
updated: "2026-011-20T17:45:29+08:00"
"description": "Un espacio donde muestro lo que investigue de NoSQL en MongoBD."
draft: false
categories:
  - "SQL en Avanzado"
tags: []
---


## ¿Qué es NoSQL?

NoSQL significa Not Only SQL (no solo SQL). Es un tipo de base de datos que permite almacenar y gestionar información mediante modelos diferentes al relacional tradicional.

A diferencia de las bases de datos SQL, que organizan la información principalmente en tablas con filas y columnas, las bases de datos NoSQL pueden utilizar documentos, pares clave-valor, grafos o estructuras de columnas.

¿Para qué se utiliza?

- Almacenar grandes cantidades de información.
- Trabajar con datos que tienen estructuras flexibles o variables.
- Facilitar el crecimiento de las aplicaciones.
- Manejar información que no necesariamente necesita estar organizada en tablas relacionadas.

## ¿Qué es MongoDB?

MongoDB es un sistema de gestión de bases de datos NoSQL orientado a documentos. Almacena la información en documentos con formato BSON, una representación binaria de JSON que permite manejar diferentes tipos de datos.

En MongoDB, la información se organiza principalmente en:

- Base de datos: contiene las colecciones.
- Colecciones: agrupan documentos relacionados. Son similares a las tablas en SQL.
- Documentos: contienen los datos organizados mediante campos y valores. Son similares a los registros de una tabla.

Ejemplo de un documento:
```json
{
    _id: ObjectId("..."),
    nombre: "Isabela",
    edad: 19,
    carrera: "Ingeniería de Sistemas",
    activo: true
}
```
En este caso, se tiene un documento con información de una persona. Cada campo contiene un nombre y un valor.

### Diferencias entre SQL y NoSQL

<table>
  <thead>
    <tr>
      <th>Característica</th>
      <th>SQL</th>
      <th>NoSQL (MongoDB)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Organización</td>
      <td>Tablas</td>
      <td>Colecciones y documentos</td>
    </tr>
    <tr>
      <td>Estructura</td>
      <td>Filas y columnas</td>
      <td>Campos y valores</td>
    </tr>
    <tr>
      <td>Esquema</td>
      <td>Generalmente definido</td>
      <td>Flexible</td>
    </tr>
    <tr>
      <td>Relaciones</td>
      <td>Mediante claves y JOIN</td>
      <td>Referencias o documentos embebidos</td>
    </tr>
    <tr>
      <td>Consultas</td>
      <td>SQL</td>
      <td>Operadores y métodos propios de MongoDB</td>
    </tr>
    <tr>
      <td>Ejemplo</td>
      <td>Oracle, PostgreSQL</td>
      <td>MongoDB</td>
    </tr>
  </tbody>
</table>

Nota: No significa que NoSQL sea mejor que SQL. Cada modelo tiene ventajas dependiendo de las necesidades del sistema y de cómo se organiza la información.

### Estructura de MongoDB

Estructura de MongoDB

Base de datos

Es el espacio donde se almacenan las colecciones.

Ejemplo:
```json
use universidad
```
Este comando selecciona la base de datos llamada universidad. Si todavía no existe, MongoDB la crea cuando se almacena información por primera vez.

Colección

Es un conjunto de documentos relacionados entre sí. Se puede comparar con una tabla de SQL.

Crear una colección:
```json
db.createCollection("estudiantes")
```
En este caso, se crea una colección llamada estudiantes.

Documento

Es la unidad principal de almacenamiento. Contiene los campos y valores que representan la información.

Ejemplo:
```json
db.estudiantes.insertOne({
    nombre: "Laura",
    edad: 20,
    carrera: "Ingeniería de Sistemas"
})
```

En este caso, se inserta un documento dentro de la colección estudiantes.

### Tipos de datos en MongoDB

<table>
  <thead>
    <tr>
      <th>Tipo</th>
      <th>Descripción</th>
      <th>Ejemplo</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>String</td>
      <td>Texto</td>
      <td>"Laura"</td>
    </tr>
    <tr>
      <td>Int</td>
      <td>Número entero</td>
      <td>20</td>
    </tr>
    <tr>
      <td>Double</td>
      <td>Número decimal</td>
      <td>3.5</td>
    </tr>
    <tr>
      <td>Boolean</td>
      <td>Verdadero o falso</td>
      <td>true</td>
    </tr>
    <tr>
      <td>Array</td>
      <td>Conjunto de valores</td>
      <td>["SQL", "MongoDB"]</td>
    </tr>
    <tr>
      <td>Object</td>
      <td>Documento anidado</td>
      <td>{ ciudad: "Bogotá" }</td>
    </tr>
    <tr>
      <td>Date</td>
      <td>Fecha y hora</td>
      <td>new Date()</td>
    </tr>
    <tr>
      <td>ObjectId</td>
      <td>Identificador único</td>
      <td>ObjectId()</td>
    </tr>
    <tr>
      <td>Null</td>
      <td>Valor nulo</td>
      <td>null</td>
    </tr>
  </tbody>
</table>

Ejemplo de documento con diferentes tipos de datos:
```json
{
    nombre: "Laura",
    edad: 20,
    promedio: 4.2,
    activo: true,
    materias: ["Bases de Datos", "Programación"],
    ubicacion: {
        ciudad: "Bogotá",
        pais: "Colombia"
    }
}
```

### Operaciones CRUD en MongoDB

CRUD representa las cuatro operaciones básicas que se pueden realizar sobre los datos: crear, leer, actualizar y eliminar.

INSERT: insertar documentos

Se utiliza para agregar nuevos documentos a una colección.

Insertar un documento:
```json
db.estudiantes.insertOne({
    nombre: "Carlos",
    edad: 22,
    carrera: "Ingeniería de Sistemas"
})
```
Insertar varios documentos:
```json
db.estudiantes.insertMany([
    {
        nombre: "Ana",
        edad: 19
    },
    {
        nombre: "Pedro",
        edad: 21
    }
])
```
FIND: consultar documentos

Se utiliza para recuperar información de una colección.

Consultar todos los documentos:
```json
db.estudiantes.find()
```
Consultar un documento:
```json
db.estudiantes.findOne({
    nombre: "Ana"
})
```

Filtrar por una condición:
```json
db.estudiantes.find({
    edad: { $gt: 20 }
})
```

En este caso, se consultan los estudiantes cuya edad es mayor que 20.

UPDATE: actualizar documentos

Se utiliza para modificar información que ya existe en una colección.

Actualizar un documento:
```json
db.estudiantes.updateOne(
    { nombre: "Ana" },
    { $set: { edad: 20 } }
)
```
En este caso, se busca el documento de Ana y se modifica su edad a 20.

Actualizar varios documentos:
```json
db.estudiantes.updateMany(
    { carrera: "Ingeniería de Sistemas" },
    { $set: { activo: true } }
)
```
En este caso, se establece el campo activo en verdadero para todos los estudiantes que cumplan la condición.

DELETE: eliminar documentos

Se utiliza para eliminar información de una colección.

Eliminar un documento:
```json
db.estudiantes.deleteOne({
    nombre: "Carlos"
})
```
Eliminar varios documentos:
```json
db.estudiantes.deleteMany({
    edad: { $lt: 18 }
})
```

En este caso, se eliminan los documentos de los estudiantes menores de 18 años.

### Operadores de consulta

## Operadores de comparación

<table>
  <caption>Operadores de comparación</caption>
  <thead>
    <tr>
      <th>Operador</th>
      <th>Significado</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>$eq</td>
      <td>Igual a</td>
    </tr>
    <tr>
      <td>$ne</td>
      <td>Diferente de</td>
    </tr>
    <tr>
      <td>$gt</td>
      <td>Mayor que</td>
    </tr>
    <tr>
      <td>$gte</td>
      <td>Mayor o igual que</td>
    </tr>
    <tr>
      <td>$lt</td>
      <td>Menor que</td>
    </tr>
    <tr>
      <td>$lte</td>
      <td>Menor o igual que</td>
    </tr>
    <tr>
      <td>$in</td>
      <td>Coincide con alguno de los valores indicados</td>
    </tr>
    <tr>
      <td>$nin</td>
      <td>No coincide con ninguno de los valores indicados</td>
    </tr>
  </tbody>
</table>

Ejemplo:
```json
db.estudiantes.find({
    edad: { $gte: 18 }
})
```
Obtiene los estudiantes cuya edad es mayor o igual a 18.

## Operadores lógicos

<table>
  <thead>
    <tr>
      <th>Operador</th>
      <th>Significado</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>$and</td>
      <td>Se deben cumplir todas las condiciones.</td>
    </tr>
    <tr>
      <td>$or</td>
      <td>Se debe cumplir al menos una condición.</td>
    </tr>
    <tr>
      <td>$not</td>
      <td>Niega una condición.</td>
    </tr>
    <tr>
      <td>$nor</td>
      <td>Ninguna de las condiciones debe cumplirse.</td>
    </tr>
  </tbody>
</table>

Ejemplo con $and:
```json
db.estudiantes.find({
    $and: [
        { edad: { $gte: 18 } },
        { activo: true }
    ]
})
```

En este caso, se buscan los estudiantes que tienen 18 años o más y que se encuentran activos.

Ejemplo con $or:
```json
db.estudiantes.find({
    $or: [
        { edad: 20 },
        { carrera: "Ingeniería de Sistemas" }
    ]
})
```
En este caso, se consultan los estudiantes que tienen 20 años o que pertenecen a Ingeniería de Sistemas.

##  Proyección de campos

La proyección permite seleccionar qué campos se desean mostrar en los resultados de una consulta.

Ejemplo:

a proyección permite seleccionar qué campos se desean mostrar en los resultados de una consulta.

Ejemplo:
```json
db.estudiantes.find(
    {},
    {
        nombre: 1,
        edad: 1,
        _id: 0
    }
)
```

En este caso:

1: indica que el campo se debe mostrar.
0: indica que el campo se debe excluir.
{}: significa que no se aplica ningún filtro y se consultan todos los documentos.

De esta manera, se muestran únicamente el nombre y la edad, sin incluir el identificador _id.

## Diferencias entre documentos embebidos y referencias

### Documentos embebidos

Consiste en almacenar información relacionada dentro de un mismo documento, utilizando objetos o arreglos.

Ejemplo:
```json
{
    nombre: "Laura",
    edad: 20,
    direccion: {
        ciudad: "Bogotá",
        barrio: "Chapinero"
    }
}
```

En este caso, la dirección se encuentra dentro del mismo documento del estudiante.

¿Cuándo usarlo?

Cuando la información relacionada suele consultarse junto con el documento principal y tiene una relación de pertenencia.

### Referencias

Consiste en almacenar identificadores que permiten relacionar documentos ubicados en diferentes colecciones.

Ejemplo:
```json
// Colección estudiantes
{
    _id: 1,
    nombre: "Laura",
    id_carrera: 10
}

// Colección carreras
{
    _id: 10,
    nombre: "Ingeniería de Sistemas"
}
```
En este caso, el estudiante guarda el identificador de su carrera, que se encuentra en otra colección.

¿Cuándo usarlo?

Cuando los datos relacionados se manejan de manera independiente, se comparten entre varios documentos o pueden crecer considerablemente.


##  Introducción a Aggregation Pipeline

El Aggregation Pipeline permite procesar y transformar documentos mediante diferentes etapas, con el propósito de obtener resultados más elaborados.

Cada etapa recibe documentos, realiza una operación y entrega los resultados a la siguiente.

Estructura:
```json
db.coleccion.aggregate([
    { etapa_1 },
    { etapa_2 },
    { etapa_3 }
])
```

Algunas de sus etapas más utilizadas son:
<table>
  <thead>
    <tr>
      <th>Etapa</th>
      <th>Función</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>$match</td>
      <td>Filtra documentos.</td>
    </tr>
    <tr>
      <td>$project</td>
      <td>Selecciona o transforma campos.</td>
    </tr>
    <tr>
      <td>$group</td>
      <td>Agrupa documentos y realiza cálculos.</td>
    </tr>
    <tr>
      <td>$sort</td>
      <td>Ordena los resultados.</td>
    </tr>
    <tr>
      <td>$limit</td>
      <td>Limita la cantidad de documentos.</td>
    </tr>
    <tr>
      <td>$count</td>
      <td>Cuenta los documentos.</td>
    </tr>
    <tr>
      <td>$lookup</td>
      <td>Relaciona información de otra colección.</td>
    </tr>
    <tr>
      <td>$unwind</td>
      <td>Descompone un arreglo en documentos individuales.</td>
    </tr>
  </tbody>
</table>

Ejemplo:
```json
db.estudiantes.aggregate([
    {
        $match: {
            activo: true
        }
    },
    {
        $group: {
            _id: "$carrera",
            cantidad: { $sum: 1 },
            edad_promedio: { $avg: "$edad" }
        }
    },
    {
        $sort: {
            cantidad: -1
        }
    }
])
```
En este caso:

$match selecciona los estudiantes activos.

$group agrupa los documentos por carrera, cuenta los estudiantes y calcula la edad promedio.

$sort ordena los resultados desde la carrera con mayor cantidad de estudiantes hasta la de menor cantidad.
