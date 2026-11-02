# 🏨 Hotel Management System
Welcome to the Hotel Management System! This is a simple, easy-to-use computer program built with Python. It helps hotel workers and managers keep track of their guests and staff members without using messy notebooks or confusing spreadsheets.

---

## 🌟 What Does This Project Do?
Imagine you are running a hotel. You need to know who is staying in which room, how they booked their stay, and who is working today. 

This project does exactly that through a clean **Command Line Interface (CLI)**—meaning you type simple numbers into a black screen (terminal) to talk to the project.

It has two main menus:

### 1. 🧍 Guest Management (For the Front Desk)
*   **Add a Guest:** Type in a guest's ID, Name, Room Number, Booking Date, and Room Type (like Deluxe or Standard) to save them in the system.
*   **See All Guests:** Look at a neat table showing everyone currently staying at the hotel.
*   **Search for a Guest:** Easily find a specific guest by typing their name or room number.
*   **Update a Guest:** Did a guest change rooms? You can easily change their information.
*   **Delete a Guest:** Remove a guest from the system after they check out.
*   **View Charts (Graphs):** See beautiful popup visual charts showing how many rooms are booked or where guests are coming from (like Walk-ins vs. Online bookings).

### 2. 👨‍🍳 Staff Management (For the Manager)
*   **Add Staff:** Hire a new worker and type in their ID, Name, Department (like Cleaning, Food, or Management), and Hire Date. The system automatically calculates their base salary based on their department!
*   **See All Staff:** Look at a neat table of everyone who works at your hotel.
*   **Search for Staff:** Find a worker by their name or ID.
*   **Update Staff:** If a worker gets promoted to a new department, update their record. The system will auto-adjust their salary!
*   **Remove Staff:** Delete a worker's record if they leave the hotel.
*   **View Charts (Graphs):** See a popup bar chart that shows how many workers are earning different salary amounts (2000 vs. 4000 vs. 6000).

---

## 🛠️ What Is It Built With?
This project uses some very popular and powerful tools:
*   **Python:** The main programming language used to write the application.
*   **MySQL Database:** The secure "digital filing cabinet" where all guest and staff information is permanently saved.
*   **Pandas:** A smart Python tool used to fetch data from the database and draw perfectly aligned, readable tables on your screen.
*   **Matplotlib:** A Python drawing tool used to pop up those colorful bar charts.
*   **SQLAlchemy:** A helpful connector tool that makes sure Python talks to the MySQL database smoothly and without warning errors.

---

## 📂 Project Folder Structure
This project is organized cleanly into folders so it is easy to find things:

```text
hotelManagement/
├── main.py              <-- The main file you run to start the application!
├── requirements.txt     <-- A list of the Python tools this project needs.
├── docs/                <-- Documentation folder
│   ├── PRD.md           <-- Product Requirements (What the project does)
│   └── TRD.md           <-- Technical Requirements (How the code works)
├── src/                 <-- Source code folder
│   ├── db/
│   │   └── db.py        <-- Code that connects to the MySQL Database 
│   └── modules/
│       ├── guest.py     <-- All the code for the Guest menus
│       └── staff.py     <-- All the code for the Staff menus
└── db_setup.sql         <-- The SQL file used to create your database tables
```

---

## 🚀 How To Set Up and Run the Project

Want to run this project on your own computer? Just follow these simple steps!

### Step 1: Prepare the MySQL Database
You must have MySQL installed on your computer. 
1. Open your MySQL system (using the terminal or an app like MySQL Workbench).
2. Look for the file named `db_setup.sql` in this project folder.
3. Run or import that file into MySQL. It will automatically create a database named `hotel` and set up the `guest` and `staff` tables for you!

*(If you use the terminal, you can run: `mysql -u root < db_setup.sql`)*

### Step 2: Set Up Python
You need to install the special Python tools this project uses.
1. Open your terminal or command prompt.
2. Go into the `hotelManagement` folder.
3. (Highly Recommended) Create and turn on a Virtual Environment to keep things clean.
   * *Mac/Linux:* `python3 -m venv venv` and then `source venv/bin/activate`
   * *Windows:* `python -m venv venv` and then `venv\Scripts\activate`
4. Install exactly what the project needs by typing:
   ```bash
   pip install -r requirements.txt
   ```

### Step 3: Run the Application!
Now for the fun part. Inside your terminal, simply type:
```bash
python main.py
```
*(On some Macs or Linux systems, you might need to type `python3 main.py`)*

The Main Menu will appear on your screen, and you can start typing numbers to manage your digital hotel!

---

## 🔒 A Note on Passwords
By default, the code assumes your MySQL database has the username `root` and **no password**.
If your MySQL has a password, no problem! Open the file at `src/db/db.py` and replace `passwd=""` and the `root:@localhost` string with your actual MySQL password.
