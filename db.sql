
1. users
   - id (Primary Key)
   - email (Unique)
   - password (Hashed)
   - role (admin/teacher/student)
   - is_active (Boolean)
   - created_at (Timestamp)

2. students
   - id (Primary Key)
   - user_id (Foreign Key → users.id)
   - roll_no (Unique)
   - name
   - father_name
   - cnic
   - phone
   - address
   - photo
   - department_id (Foreign Key)
   - batch
   - semester
   - status (active/inactive)
   - created_at

3. teachers
   - id (Primary Key)
   - user_id (Foreign Key → users.id)
   - name
   - cnic
   - phone
   - designation
   - department_id (Foreign Key)
   - qualification
   - experience
   - photo
   - created_at

4. admins
   - id (Primary Key)
   - user_id (Foreign Key → users.id)
   - name
   - role
   - created_at

5. departments
   - id (Primary Key)
   - name
   - code (Unique)
   - hod_teacher_id (Foreign Key)
   - created_at

6. sessions
   - id (Primary Key)
   - name (e.g., "2024-2025")
   - start_date
   - end_date
   - is_active (Boolean)
   - created_at

7. semesters
   - id (Primary Key)
   - session_id (Foreign Key)
   - name (e.g., "Fall 2024")
   - number (1-8)
   - start_date
   - end_date
   - is_active (Boolean)
   - created_at

8. courses
   - id (Primary Key)
   - code (Unique, e.g., "CS101")
   - name
   - credit_hours
   - department_id (Foreign Key)
   - semester_number (1-8)
   - description
   - created_at

9. course_registrations
   - id (Primary Key)
   - student_id (Foreign Key)
   - course_id (Foreign Key)
   - semester_id (Foreign Key)
   - session_id (Foreign Key)
   - registration_date
   - status (registered/dropped)
   - created_at

10. course_sections
    - id (Primary Key)
    - course_id (Foreign Key)
    - semester_id (Foreign Key)
    - teacher_id (Foreign Key)
    - section_name (e.g., "A", "B")
    - capacity
    - room_no
    - created_at
```

### **Afternoon: Create Database**

**Step 1: Open pgAdmin**
```
1. pgAdmin 4 open karo
2. PostgreSQL server connect karo (password enter karo)