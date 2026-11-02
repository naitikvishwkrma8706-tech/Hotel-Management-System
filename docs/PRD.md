# Product Requirements Document (PRD): Hotel Management System

## 1. Project Overview
The Hotel Management System is a command-line Python application designed to streamline and automate the core operations of a hotel. It focuses on handling two primary categories of data: Guest Records and Staff Records. The application provides an interactive terminal-based interface for adding, searching, updating, deleting, and visualizing both guest and staff information reliably.

## 2. Problem Statement
Managing hotel operations manually or through disconnected spreadsheets often leads to data loss, inefficiencies, and poor decision-making due to a lack of immediate insights. Hotel administrators need a lightweight, fast, and centralized repository to manage guests and employees, along with the ability to instantly generate graphical reports on room occupancies and staff salary distributions.

## 3. Target Users
- **Hotel Administrators / Managers:** To oversee staff details, track salaries, and analyze booking trends.
- **Front Desk Receptionists:** To quickly add new guest bookings, allocate rooms, and check existing guest details.

## 4. Key Features & Functionality

### 4.1. Guest Data Handling
- **Add Guest Record:** Capture essential details including ID, Name, Source of Booking, Room Number, Date of Booking, and Type of Room. Validates against duplicate IDs.
- **Show All Records:** Display a complete tabular view of all guests currently in the system.
- **Search Records:** Find specific guests easily using various filters (ID, Name, Source, Room No, Date, Type of Room).
- **Update Records:** Modify the details of an existing guest by providing their ID (updates Name, Source, Date, or Room Type).
- **Delete Records:** Safely remove a guest from the system using their ID.
- **Graphical Analysis (Matplotlib):**
  - **Rooms Booked:** A bar chart visualizing the frequency of individual room bookings.
  - **Source of Booking:** A bar chart visualizing the volume of bookings originating from different sources (e.g., Online, Walk-in, Agency).

### 4.2. Staff Data Handling
- **Add Staff Record:** Capture staff details including ID, Name, Department (cleaning, food and beverages, management), Salary, and Hire Date. The system automatically assigns baseline salaries based on the department (Cleaning: 2000, Food/Beverage: 4000, Management: 6000) unless customized.
- **Show All Records:** Display a complete tabular view of all employed staff.
- **Search Records:** Find specific employees using filters (ID, Name, Department, Salary, Hire Date).
- **Update Records:** Modify existing staff details (ID, Name, Department, Hire Date). Salary adjustments are auto-calculated upon department change.
- **Delete Records:** Remove an employee from the system using their ID.
- **Graphical Analysis (Matplotlib):**
  - **Salary Distribution:** A bar chart displaying the count of staff members across the primary salary brackets (2000, 4000, 6000).

## 5. Technology Stack
- **Programming Language:** Python 3.8+
- **Database:** MySQL
- **Database Connector / ORM:** `pymysql` (Raw SQL execution) & `SQLAlchemy` (Pandas Database Engine)
- **Data Manipulation:** `pandas` (Used for structuring SQL outputs into readable tabular dataframes).
- **Data Visualization:** `matplotlib.pyplot` (Used for generating analytical bar charts).

## 6. Database Schema Design
The system relies on a single relational database named `hotel`, consisting of two primary tables:

### Table 1: `guest`
| Field Name     | Data Type    | Description                           |
|----------------|--------------|---------------------------------------|
| `id`           | INT (PK)     | Unique Identifier                     |
| `name`         | VARCHAR(255) | Full Name                             |
| `source`       | VARCHAR(255) | Booking Origin (e.g., Web, Agency)    |
| `room_no`      | INT          | Assigned Room Number                  |
| `date`         | DATE         | Date of Booking/Stay                  |
| `type_of_room` | VARCHAR(255) | Standard, Deluxe, Suite, etc.         |

### Table 2: `staff`
| Field Name | Data Type    | Description                                  |
|------------|--------------|----------------------------------------------|
| `id`       | INT (PK)     | Unique Identifier                            |
| `name`     | VARCHAR(255) | Full Name                                    |
| `dept`     | VARCHAR(255) | Working Department                           |
| `sal`      | INT          | Salary Amount                                |
| `hiredate` | DATE         | Date of Joining                              |

## 7. Non-Functional Requirements
- **Reliability:** The system heavily utilizes `try/except` blocks to prevent crashes during database connection failures or invalid user inputs.
- **Performance:** Optimized for speed using direct SQL insertions and Pandas Dataframe reads.
- **User Interface:** A strict, menu-driven CLI (Command Line Interface) providing clear prompts and clean standard outputs.

## 8. Future Enhancements (Potential Version 2.0)
- **Authentication:** Add a login system to restrict access to management features (like staff salaries) from front desk receptionists.
- **Web Interface:** Migrate the CLI application to a web-based dashboard using Flask or Django.
- **Dynamic Pricing & Billing:** Add features to automatically calculate guest bills based on the `type_of_room` and duration of stay.
- **Date Validations:** Ensure `date` fields strictly accept valid date strings during user input.
