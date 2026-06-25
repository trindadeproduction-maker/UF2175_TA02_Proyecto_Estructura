# 🦆(MIHIFIDEM / DUCKY)🦆

## Posibles nombre comerciales
MihiAdvisor - MihiTrack - DuckyAdvisor - MihiWork - DuckyJob - MihiRadar - MihiTrack 

# Descripcion
> MultiTracker — Developer Career Intelligence Platform
Plataforma Full Stack orientada al sector tecnológico que permite a candidatos, trabajadores y empresas compartir información transparente sobre el entorno laboral tech.
El objetivo del proyecto es crear un eco-sistema donde los candidatos no solo puedan postularse a ofertas de empleo, sino también analizar empresas mediante métricas, opiniones y datos relevantes antes de aplicar. Que permita el Usaurio/Candidato transparencia hacia la oferta y peso en la negociación.

>> MultiTracker es una plataforma digital pensada para ayudar a las personas a tomar mejores decisiones sobre su futuro profesional dentro del mundo tecnológico.

## Problemas reales
>La idea nace de un problema muy común hoy en día, falta de visibilidad en la oferta y exceso de tiempo invertido:
>Muchas personas aplican a trabajos sin saber realmente cómo es la empresa por dentro, lo que conlleva a invertir tiempo en un proceso el cual termina no siendo seleccionado, o a un desgaste personal, por no tener en consideracion ambitos como:
>cómo es el ambiente laboral, entorno, metodologia, volumen de trabajo si existe crecimiento profesional, cómo son los procesos de selección, si hay estabilidad, cómo es el trato a los trabajadores,o incluso si el salario realmente compensa.


MultiTracker busca cambiar eso creando un espacio más transparente, humano e inteligente para el mundo laboral tecnológico otorgando al candidato una postura de igualdad a la hora de la entrevista.


## Objetivo del proyecto
Actualmente, muchas plataformas de empleo están centradas únicamente en las empresas y reclutadores.
Nuestro proyecto busca equilibrar esa relación proporcionando herramientas para que los candidatos puedan:
conocer la realidad de las empresas,consultar experiencias de otros trabajadores,analizar salarios,visualizar tecnologías utilizadas,entender procesos de selección,comparar empresas,
y tomar decisiones laborales claras y orientada a datos.

## Características principales

| Módulo | Funcionalidad |
|---|---|
| 👤 Gestión de usuarios | Roles de candidatos, empresas, recruiters y administradores con autenticación y permisos |
| 🏢 Empresas | Perfiles corporativos, ofertas laborales, beneficios y gestión de procesos |
| 💬 Reviews | Opiniones sobre ambiente laboral, entrevistas, salarios y experiencia profesional |
| 💼 Empleo | Publicación de ofertas, filtros, candidaturas y seguimiento de procesos |
| 📊 Analytics | Dashboards interactivos con métricas, rankings y tendencias tecnológicas |
| 🎯 Matching | Compatibilidad candidato-empresa basada en skills, experiencia e intereses |

___

## Diagrama Entidad-Relacion
Podría tener más de 12 tablas:
usuarios EF
roles (atributo dentro de usuario)
candidatos (entidad debil)
empresas
githunters ??
ofertas
candidaturas
reviews_empresas (entidad debil)
salarios
tecnologias
empresa_tecnologia (entidad debil)
beneficios 
empresa_beneficio (entidad debil)
entrevistas/seguimientos
favoritos
comentarios (reviews)
reportes/puntuacion/ranking
beneficios_empresas (entidad debil)
relaciones N:M:
empresas ↔ tecnologías
empresas ↔ beneficios
candidatos ↔ ofertas
candidatos ↔ empresas favoritas
ofertas ↔ tecnologías

## Entidades principales

| Entidad | Descripción |
|---|---|
| usuarios | Información base y autenticación |
| roles | Roles y permisos del sistema |
| candidatos | Perfil profesional de candidatos |
| empresas | Empresas registradas |
| recruiters | Reclutadores y headhunters |
| ofertas | Ofertas laborales |
| candidaturas | Aplicaciones a ofertas |
| reviews_empresas | Opiniones y valoraciones |
| tecnologias | Tecnologías y skills |
| beneficios | Beneficios corporativos |
| entrevistas | Seguimiento de procesos |
| favoritos | Empresas y ofertas guardadas |
| comentarios | Comentarios en reviews |
| salarios | Rangos salariales y estadísticas |
___

```mermaid
Entidad-Relacion

    USUARIOS ||--o{ CANDIDATOS : tiene
    USUARIOS ||--o{ EMPRESAS : tiene
    EMPRESAS ||--o{ OFERTAS : publica
    CANDIDATOS ||--o{ CANDIDATURAS : realiza
    OFERTAS ||--o{ CANDIDATURAS : recibe

    EMPRESAS ||--o{ REVIEWS : recibe
    EMPRESAS }o--o{ TECNOLOGIAS : usa
    EMPRESAS }o--o{ BENEFICIOS : ofrece

    OFERTAS }o--o{ TECNOLOGIAS : requiere
```