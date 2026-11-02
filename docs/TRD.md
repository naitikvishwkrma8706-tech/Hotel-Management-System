# Technical Requirements Document (TRD): Hotel Management System

## 1. Introduction
This document outlines the technical architecture, dependencies, schemas, and logic flow for the Hotel Management System. It serves as a comprehensive guide for developers aiming to understand, maintain, or extend the project.

## 2. Architecture Overview
The application follows a monolithic, single-tier architecture where the user interface (CLI), business logic, and database connection logic are tightly coupled within a single Python script (`main.py`).

- **Frontend:** Standard Output / Standard Input (Command Line Interface).
- **Backend Processor:** Python 3.8+ script handling logical operations.
- **Data Persistence:** Local MySQL Database instance (port: 3306).

## 3. Technology Stack & Dependencies
The following libraries are required for the project environment (`requirements.txt`):

*   **`pymysql`**: A pure-Python MySQL client library. Used for establishing raw connections, executing Data Manipulation Language (DML) queries (`INSERT`, `UPDATE`, `DELETE`), and fetching simple counts.
*   **`SQLAlchemy`**: Provides a Python SQL toolkit and Object Relational Mapper. Primarily utilized as the underlying database engine parameter for Pandas to establish a safe, warning-free connection.
*   **`pandas`**: A powerful data analysis and manipulation library. Used exclusively for executing Data Query Language (DQL) statements (`SELECT * ...`) and formatting the result sets into clean, structural DataFrames for console output.
*   **`matplotlib`**: A comprehensive visualization library. Used for rendering pop-up bar charts based on aggregated DataFrame data or raw SQL counts.

## 4. Database Architecture (MySQL)
The local MySQL database `hotel` utilizes the standard `InnoDB` engine for relational consistency.

### 4.1. Table: `guest`
| Column Name  | Data Type    | Constraints    | Description                           |
| :---         | :---         | :---           | :---                                  |
| `id`         | `int`        | `PRIMARY KEY`  | Unique identifier for tracking        |
| `name`       | `varchar(255)`| `None`         | Guest's full name                   |
| `source`     | `varchar(255)`| `None`         | Acquisition channel (e.g., walk-in) |
| `room_no`    | `int`        | `None`         | Allocated room                      |
| `date`       | `date`       | `None`         | Interaction/Booking date (YYYY-MM-DD)|
| `type_of_room`| `varchar(255)`| `None`         | Category (e.g., standard, deluxe)   |

### 4.2. Table: `staff`
| Column Name  | Data Type    | Constraints    | Description                           |
| :---         | :---         | :---           | :---                                  |
| `id`         | `int`        | `PRIMARY KEY`  | Unique identifier for tracking        |
| `name`       | `varchar(255)`| `None`         | Employee's full name                  |
| `dept`       | `varchar(255)`| `None`         | Working department                    |
| `sal`        | `int`        | `None`         | Base salary amount                    |
| `hiredate`   | `date`       | `None`         | Initial employment date (YYYY-MM-DD)  |

## 5. System Components & Flow

### 5.1. Connection Handlers
The system utilizes two distinct connection factories to optimize interactions between raw SQL and pandas wrappers.
*   `get_connection()`: Returns a raw `pymysql` connection string. Used inside `cursor.execute()` calls for direct Data Manipulation operations, ensuring fast and lightweight record inserts/updates/deletes.
*   `get_engine()`: Returns a structured `SQLAlchemy` engine string (`mysql+pymysql://root:@localhost/hotel`). Used strictly for `pandas.read_sql()` operations to safely fetch structured data without triggering SQL abstraction warnings.

### 5.2. Execution Controllers
*   `main()`: The entry point. Initializes an infinite `while` loop keeping the CLI alive. Provides routing logic linking User Choices (`1`, `2`, `3`) to specific module controllers (`guest()`, `staff()`, `exit`).

### 5.3. Sub-Module Logic Flows
#### 5.3.1. Record Insertion (`add_guest`, `add_staff`)
1.  **Duplicate Check Checkpoint:** Prompts user for `id`. Runs a `SELECT` query utilizing `pymysql.cursor` to check for primary key violations. Loops back if `.rowcount > 0`.
2.  **Input Gathering:** Aggregates variable details.
3.  **Salary Computation (Staff Only):** Implements `if/elif` logical routing: maps `"cleaning"` -> `2000`, `"food and beverages"` -> `4000`, `"management"` -> `6000`. Prompts for manual input for unknown departments.
4.  **Statement Execution:** Formats inputs using `f-strings` into an `INSERT INTO ...` SQL query, bypassing standard parameterization due to local-only threat scope. Commits transaction.

#### 5.3.2. Record Fetching (`show_all_*`, `search_*`)
1.  **Engine Initialization:** Instantiates the `SQLAlchemy` link.
2.  **Display Configuration:** Sets `pd.set_option('display.expand_frame_repr', False)` globally to ensure wide datasets don't line-break in smaller terminal screens.
3.  **Data Ingestion:** Passes the routing query (e.g., `SELECT * FROM guest WHERE id=X`) and `engine` to `pd.read_sql()`. Returns a dataframe to stdout.

#### 5.3.3. Record Updating (`update_guest`, `update_staff`)
1.  **Validation:** Queries targeted ID. Exits function gracefully if `rowcount == 0` (ID missing).
2.  **State Output:** Pre-prints the targeted row DataFrame to give the user context before overriding.
3.  **Selective Execution:** Utilizes user choice matrix (1-4) to determine the specific column for the `UPDATE` sequence.
4.  **Calculated Overrides (Staff Only):** If the department is updated, the internal logic automatically calculates and overrides the associated `sal` (salary) field in a multi-column single `UPDATE` execution.

#### 5.3.4. Visualization (`graph_guest`, `graph_staff`)
*   **Guest Operations:** Defers mathematical grouping to SQL (`SELECT ..., COUNT(*) ... GROUP BY ...`), dumping the pre-aggregated results directly into pandas for plotting a bar chart (`plt.bar(df['x'], df['count'])`).
*   **Staff Operations:** Explicitly executes three staggered `SELECT count(*)` statements to fetch distinct array values for predefined static brackets (2000, 4000, 6000), concats the list output, and manually maps it onto the Matplotlib chart. This offers a secondary visualization demonstration approach.

## 6. Technical Limitations & Security Considerations
1.  **SQL Injection Vulnerability:** The script relies on raw formatted `f-strings` for query builds (e.g., `INSERT INTO guest VALUES ({gid}, '{name}'...`). Because there is no front-facing internet gateway, risk is currently restricted to local terminal users. Long-term updates must migrate `pymysql.cursor` commands to parameterized inputs arrays: `execute("INSERT INTO... (%s, %s)", (var1, var2))`.
2.  **Synchronous Bottlenecks:** Built utilizing completely synchronous, blocking execution (`def` instead of `async def`), guaranteeing atomic interactions but holding the main thread during heavy visualization processing.
3.  **Datatype Handling:** Date fields currently rely exclusively on string formatting (`YYYY-MM-DD`); there is no internal Python `datetime` validation forcing input string format compliance before SQL execution.
