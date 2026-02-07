# Siebel Configuration Reference

## Table of Contents
1. [Business Components](#business-components)
2. [Fields & Joins](#fields--joins)
3. [Links](#links)
4. [Picklists](#picklists)
5. [MVG & SVF](#mvg--svf)
6. [Applets](#applets)
7. [User Properties](#user-properties)

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
| CanInvokeMethod | Enable/disable buttons |
| Auto Query Mode | Auto-query on applet load |
| Default Focus Field | Initial cursor position |

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
