### Employee Tracker
Back-end SQL database that can be adjusted to fit a business structure that can be easily accessed and manipulated via the command line
tutorial link: 

### Features
- Easy to operate via CLI
- Scalable and fleixble database structure 
- Utilizes a Node.js hosted Express.js server to query and manipulate a MySQL database based on user input
- Powered by Inquirer package for command line prompting

### Instructions

- Download files from repository
- Run `npm install` to install necessary packages
- Run `touch .env` to create environment variables file
- Set up your .env file as such: 
        `DB_USER= '<your-mysql-username>'
         DB_PW= '<your--mysql-password>'
         DB_NAME= 'business'`
- Run `mysql -u root -p` to enter the mysql shell
- Run `source db/db.sql`, `source db/schema.sql`, and `source db/seeds.sql` to initialize the database, models, and seeds
- Run `quit` to exit the mysql shell
- Run `npm run start` to start the express server and initialize the command line prompts

### Usage

- Includes options to view the 3 base tables (departments, roles, employees) along with the ability to create a row in any of these three tables and an option to update an employees role
- Employees table includes full name, role, role salary, and manager
- Departments table includes the department name
- Roles table includes the role name, salary, and department the role belongs to

### Future Improvemenets

- Flexible nature of the database allows the addition of more complicated SQL queries 
- Additional column fields for each table
- Delete rows from tables
- Alternate update queries
