# Siebel Architecture Reference

## 1. Siebel Server Architecture

The Siebel Architecture is a multi-tiered structure consisting of:

- **Web Client**: The end-user interface (Open UI) running in the browser.
- **Siebel Web Server Extension (SWSE)**: A plugin on the web server (IIS/IHS) that identifies requests and forwards them to the Siebel Server.
- **Gateway Name Server**: The dynamic registry that addresses the Enterprise and provides load balancing.
- **Siebel Enterprise**: A logical grouping of Siebel Servers that share a common database.
- **Siebel Server**: The application server that runs components (Object Managers, Workflow Manager, etc.).
- **Database Server**: Stores all data and repository definitions (SRF/Runtime Repository).
- **File System**: Stores physical files (attachments, images).

## 2. Object Manager (OM)

The Object Manager is a multi-threaded process on the Siebel Server that hosts the business logic. Different clients connect via different OMs:

- **Call Center Object Manager**: For internal employees.
- **eSales Object Manager**: For customer-facing sites.
- **EAI Object Manager**: For integration requests.

## 3. Key Server Components

### Workflow Process Manager
Executes workflow processes. Can run synchronously (locally) or asynchronously (via Server Request).
*Tables used*: `S_WFA_INSTANCE`, `S_WFA_STPRP` (for persistence).

### Assignment Manager
Assigns records (like Service Requests or Leads) to the most appropriate employee or team based on rules.
*Key concept*: Uses Assignment Rules and Criteria to match candidates.

### Workflow Monitor Agent / Generator
Used for Workflow Policies.
- **Generator**: Checks conditions in `S_ESCL_REQ`.
- **Monitor Agent**: Executes the action (Run Workflow) when conditions are met.

## 4. Client Types

- **HMTL Thin Client**: Zero-footprint, runs in browser, logic on server.
- **Dedicated Client**: Heavy client, installs locally, connects directly to DB (bypasses OM for logic, acts as its own OM). primarily for developers.
- **Mobile Client**: Local database, syncs via Siebel Remote.

## 5. Data Model Basics

- **Base Table**: Stores the main business data (e.g., `S_ORG_EXT` for Accounts).
- **Extension Table**: Extends a base table (1:1 relationship) to hold more columns (e.g., `S_ORG_EXT_X`).
- **Intersection Table**: Implements M:M relationships (e.g., `S_OPTY_POSTN` links Opportunities to Positions).
- **S_PARTY**: The master table for all "People/Entity" data (User, Employee, Contact, Account, Position, Division).
