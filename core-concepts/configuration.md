# Siebel Configuration Reference

## Table of Contents
1. [Database Layer](#database-layer)
2. [Business Components](#business-components)
3. [Fields & Joins](#fields--joins)
4. [Links](#links)
5. [Picklists](#picklists)
6. [LOV Architecture](#lov-architecture)
7. [MVG & SVF](#mvg--svf)
8. [Applets](#applets)
9. [User Properties](#user-properties)
10. [View Modes](#view-modes)
11. [Compilation & Deployment](#compilation--deployment)

---

## Database Layer

### Entity-to-Table Mapping
| Entity | Primary Table |
|--------|--------------|
| Account | `S_ORG_EXT` |
| Contact | `S_CONTACT` |
| Opportunity | `S_OPTY` |
| Activity | `S_EVT_ACT` |
| Service Request | `S_SRV_REQ` |
| Order | `S_ORDER` |
| Quote | `S_DOC_QUOTE` |
| Asset | `S_ASSET` |
| Product | `S_PROD_INT` |

### Base Table vs Extension Table
| Aspect | Base Table | Extension Table |
|--------|-----------|----------------|
| Definition | Core Siebel table (e.g., `S_ORG_EXT`) | Custom table added by developers |
| Upgrade | Preserved; schema managed by Siebel | Must be manually managed |
| Columns | Has pre-allocated ATTRIB columns | All columns are custom |
| Example | `S_EVT_ACT` (Activity) | `CX_CUSTOM_DATA` |

### Extension Columns
- Pre-allocated physical columns (`ATTRIB_01` through `ATTRIB_99`).
- Custom columns **must** use `X_` prefix (e.g., `X_CUSTOM_FLAG`).
- Non-`X_` columns risk being **overwritten during upgrade**.

**Check column usage before allocating:**
```sql
SELECT cc.NAME, cc.COL_NUM, cc.PHYS_TYPE, cc.LEN
FROM SIEBEL.S_TABLE_COL cc
JOIN SIEBEL.S_TABLE t ON cc.TBL_ID = t.ROW_ID
WHERE t.NAME = 'S_EVT_ACT'
  AND cc.INACTIVE_FLG = 'N'
ORDER BY cc.COL_NUM;
```

### Apply DDL
**Apply DDL** physically creates/modifies columns in the database. Must run:
- After creating a new extension column
- After modifying column attributes (length, data type)
- **Before** compiling BC fields that reference the new column

> ⚠️ If you skip Apply DDL, BC compiles fine but runtime throws SQL errors.

---

## Business Components

### BC Properties
| Property | Purpose |
|----------|---------|
| Table | Base table |
| Class | Behavior class (CSSBCBase, etc.) |
| Search Specification | Default filter |
| Sort Specification | Default sort |

### Creating a BC
1. Create/extend table if needed
2. Create BC, set Table property
3. Add Fields mapped to columns
4. Add Joins for related data
5. Add to Business Object

---

## Fields & Joins

### Field Types
| Type | Purpose |
|------|---------|
| Column-based | Direct table column mapping |
| Calculated | Expression-based |
| Join | From joined table |
| Multi-Value Link | From M:M relationship |

### DTYPE Reference
| DTYPE | Use Case |
|-------|----------|
| `DTYPE_TEXT` | General text/string fields |
| `DTYPE_NUMBER` | Numeric values (integer or decimal) |
| `DTYPE_UTCDATETIME` | Date and time stored in UTC |
| `DTYPE_BOOL` | Boolean flags (Y/N) |
| `DTYPE_ID` | ROW_ID references (foreign keys) |
| `DTYPE_NOTE` | Long text (CLOB) — use sparingly |
| `DTYPE_CURRENCY` | Monetary amounts |
| `DTYPE_PHONE` | Phone number formatting |
| `DTYPE_DATE` | Date only (no time component) |

### Force Active
**Force Active = TRUE** → field is always included in every SQL query, even if not displayed.
- Degrades query performance significantly.
- Only set TRUE when field is needed by server scripts, calculated fields, or workflows on **every** BC interaction.

### Join Configuration
| Property | Purpose |
|----------|---------|
| Table | Target table to join |
| Alias | Unique join identifier |
| Join Specification | Join condition |
| Outer Join Sequence | Left outer join order |

**Join Spec Example:**
```
[Table2.Foreign_Id] = [Table1.Id]
```

### Creating Join Fields
1. Create Join on BC
2. Create Field with Join = [Join Alias]
3. Set Column to target table column

---

## Links

### Link Properties
| Property | Purpose |
|----------|---------|
| Parent Business Component | Parent BC |
| Child Business Component | Child BC |
| Source Field | Parent field for relationship |
| Destination Field | Child field for relationship |

### Link Types
| Cascade Delete | No Delete | Result |
|----------------|-----------|--------|
| TRUE | TRUE | Error |
| TRUE | FALSE | Delete children |
| FALSE | TRUE | Set child FK to NULL |
| FALSE | FALSE | Allow orphan |

### M:M Links
For many-to-many via intersection table:

| Property | Value |
|----------|-------|
| Inter Table | Intersection table |
| Inter Parent Column | FK to parent |
| Inter Child Column | FK to child |

---

## Picklists

### Static Picklist
From LOV (Type-Value pairs).

**Setup:**
1. Administration - Data → LOV
2. Create Type and Values
3. On Field: Picklist = [Picklist Name]

### Dynamic Picklist
From BC query.

**Setup:**
1. Create Picklist object
2. Set Business Component
3. Map Display Field
4. Add Search Specification if needed
5. On Field: Picklist = [Picklist Name]

### Constrained Picklist
Filter based on another field.

**Search Spec:**
```
[Parent Type] = LookupValue('PARENT_LOV', GetFieldValue('Parent Field'))
```

---

## LOV Architecture

### Core Components
- **Type**: Grouping key (e.g., `CRM_AI_LEAD_MOTIVE`)
- **LIC (Language Independent Code)**: Internal DB value — same across all languages. **Never change after go-live.**
- **Display Value**: What end-users see — differs per language.
- **Language Code**: `ENU` (English), `FRA` (French), `DEU` (German), etc.

```
Type: CRM_AI_LEAD_MOTIVE
├── LIC: "Non-LCV buyer"  → ENU: "Non-LCV buyer"  → FRA: "Non acheteur VU"
├── LIC: "Competition"     → ENU: "Competition"     → FRA: "Concurrence"
└── LIC: "Closed account"  → ENU: "Closed account"  → FRA: "Compte clôturé"
```

### LOV Bounded
- **TRUE**: User must select from dropdown (no free-text). Use for Status fields.
- **FALSE**: User can type custom value. Use for flexible fields.

### Key Tables
| Table | Content |
|-------|---------|
| `S_LST_OF_VAL` | LOV data |
| `S_RESP` | Responsibility info |
| `S_APP_VIEW` | Responsibility-to-View mapping |
| `S_REPOSITORY` | Siebel repository |

> ⚠️ If LOV entries missing for a language, users see **blank dropdowns**. Always create records for all supported languages.

---


---

## Drilldowns

### Static Drilldown
Navigates to a specific view from a list column link.
- **Object**: `Drilldown Object` on Applet.
- **Issue**: "Record not found" if drilldown target applet has different search spec/visibility.

### Dynamic Drilldown
Navigates to *different* views based on field value.
1. Create multiple Drilldown Objects (destinations).
2. Create `Dynamic Drilldown Destination` objects under the *primary* drilldown.
3. Map `Field` and `Value` to specific Drilldown Objects.

---

## Hierarchical Picklists

User selects Parent value -> Child picklist filtered by Parent.

**Setup:**
1. **LOV**: Setup Parent and Child LOVs. Set `Parent Type` and `Parent Value` on Child LOV records.
2. **BC**:
   - Create Picklists for both Parent and Child fields.
   - **Child Pickmap**: Map Parent Field to `Parent Pick Component Column`.
   - **Constraint**: `PickList Hierarchical` property on Child Picklist object = TRUE.

---

## MVG & SVF

### Multi-Value Group (MVG)
Display M:M relationships (e.g., Account Contacts).

**Components:**
| Component | Purpose |
|-----------|---------|
| MVG Applet | Popup showing all values |
| MVG Field | Shows primary value |
| Association Applet | Add new associations |

**BC Configuration:**
- Link with Inter Table
- Multi Value Link field

### Single Value Field (SVF)
Display one value from M:M with popup to change.

**Setup:**
1. Create M:M Link
2. Add MVL Field on parent BC
3. Create MVG Applet for child BC
4. Set Primary field display

---

## Applets


## Applets

### Toggle Applets
Switch applet display based on field value (Dynamic Toggle) or User Profile (Static Toggle).

**Dynamic Toggle Setup:**
1. Go to `Applet Toggle` object on the Base Applet.
2. Add record:
   - **Applet**: Target Applet to show.
   - **Auto Toggle Field**: Field to check (e.g., `Type`).
   - **Auto Toggle Value**: Value to match (e.g., `Detail`).

### Applet Types
| Type | Use |
|------|-----|
| Form | Single record display |
| List | Multiple records |
| Tree | Hierarchical |
| Chart | Visualization |

### Applet Web Templates
| Property | Purpose |
|----------|---------|
| Web Template | Layout template |
| Web Template Item | Control bindings |

### List Applet Columns
Configure via List Column objects.

---

## User Properties

### BC User Properties
| User Property | Purpose |
|---------------|---------|
| On Field Update Set | Auto-set field when another changes |
| On Field Update Invoke | Call method on field change |
| Named Search | Predefined searches |


### Applet User Properties
| User Property | Purpose |
|---------------|---------|
| CanInvokeMethod | Enable/disable buttons (set Value=`TRUE`) |
| Auto Query Mode | Auto-query on applet load |
| Default Focus Field | Initial cursor position |
| NoDataHide | Hides applet if no records found (Value=`Y`) |
| Named Method | Invoke specialized actions/script from UI |

### Field User Properties
| User Property | Purpose |
|---------------|---------|
| Immediate Post Changes | Save on field change |
| PickList Search Spec | Dynamic picklist filter |

### Link User Properties
| User Property | Purpose |
|---------------|---------|
| Copy Source Field | Copy value to child |
| Cascade Update | Update children on parent change |

---

## View Modes

| View Mode | Description |
|-----------|-------------|
| **All View** | All records (no restriction) |
| **Sales Rep View** | Records where user is on team (Position-based) |
| **Manager View** | User + all direct/indirect reports |
| **Personal View** | Only records owned by logged-in user |
| **Sub-Organization View** | User's org and sub-orgs |
| **Group View** | Records in user's access group |
| **Catalog View** | Product catalog visibility |

---

## Compilation & Deployment

### Compilation Order
1. **Table** (Apply DDL first)
2. **Business Component**
3. **Applet**
4. **View**
5. **Screen**

### SRF (Siebel Repository File)
Compiled binary loaded by the application server at runtime.

| Type | Description |
|------|-------------|
| **Full Compile** | Entire repository → new SRF. Slower but safest. |
| **Incremental** | Only modified/locked projects. Faster, may miss dependencies. |

> Use incremental in dev, **full compile before production**. Always back up SRF.

### Deployment Pipeline
1. **Lock** project(s) in Siebel Tools
2. Make configuration changes
3. **Apply DDL** (if columns created/modified)
4. **Compile** in correct order
5. **Generate SRF** (full compile for production)
6. **Test** in dev/test environment
7. **Export** repository (ADM packages / SIF files)
8. **Import** into target environment
9. **Deploy** SRF to application server
10. **Restart** Siebel services / clear cache
11. **Validate** with smoke tests

### Workspace (IP2017+)
Modern Siebel's **version control** — replaces project-locking:
- Each developer works in an isolated **workspace** (sandbox)
- Changes don't affect the published repository
- **Deliver** = merge into main branch
- Supports **compare**, **rollback**, **discard**
- Analogous to **Git branches** for Siebel repository
