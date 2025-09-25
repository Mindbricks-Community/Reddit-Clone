# Service Design Specification - Object Design for compliancePolicy

**redditclone-adminops-service** documentation

## Document Overview

This document outlines the object design for the `compliancePolicy` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## compliancePolicy Data Object

### Object Overview

**Description:** Singleton object for sitewide compliance/configuration options (e.g., minimum age, GDPR export/erase policy).

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** No — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Properties Schema

| Property            | Type    | Required | Description                                          |
| ------------------- | ------- | -------- | ---------------------------------------------------- |
| `minAge`            | Integer | Yes      | Minimum allowed user age (in years)                  |
| `gdprExportEnabled` | Boolean | Yes      | Sitewide toggle for GDPR data export availability    |
| `gdprDeleteEnabled` | Boolean | Yes      | Sitewide toggle for GDPR delete/erasure availability |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Default Values

Default values are automatically assigned to properties when a new object is created, if no value is provided in the request body.
Since default values are applied on db level, they should be literal values, not expressions.If you want to use expressions, you can use transposed parameters in any crud route to set default values dynamically.

- **minAge**: 13
- **gdprExportEnabled**: true
- **gdprDeleteEnabled**: true

### Auto Update Properties

`minAge` `gdprExportEnabled` `gdprDeleteEnabled`

An update crud route created with the option `Auto Params` enabled will automatically update these properties with the provided values in the request body.
If you want to update any property in your own business logic not by user input, you can set the `Allow Auto Update` option to false.
These properties will be added to the update route's body parameters and can be updated by the user if any value is provided in the request body.

### Elastic Search Indexing

`minAge`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.
