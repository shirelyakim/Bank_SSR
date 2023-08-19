### Purpose and General Explanation
The goal of this project is to create a website that helps people manage their bank accounts better. It will work like a virtual bank where users can do different things with their accounts. This project will be useful for bank managers, account holders, and people who want to send money to others. 
### User Types
 The project provides different levels of access to different user roles:
1. Bank Managers- can do special things like creating new accounts for customers and seeing a list of all accounts in the bank. The bank managers can see all the transactions across all the accounts and can see statistics about various  trends in the bank.
2. Account Holders: people who have bank accounts can see their transaction history (like when they put money in or take money out) and how much money they have in their account. They can also check their money activities for specific times. 
In addition, they can send money to another person. 
### Processes, Arcitecture and Data Management
![alt text](https://github.com/shirelyakim/Bank_SSR/blob/main/readme/architecture.png?raw=true) <br />
The application is structured using the Model-View-Controller (MVC) architectural pattern, ensuring a clear separation between data handling, user interface, and application logic. The project provides different levels of access to different user roles and provides tailored functionalities to meet users' needs.
### Screenshots
#### User Interface
##### Login page
![alt text](https://github.com/shirelyakim/Bank_SSR/blob/main/readme/login.png?raw=true) <br />
The application's login page
##### Home
![alt text](https://github.com/shirelyakim/Bank_SSR/blob/main/readme/home.png?raw=true) <br />
The application's home page. It presents the user's transactions and its account balance. 
The user can filter the transactions by selecting  date ranges.
He can perform new transaction by pushing the button in the top corner.
![alt text](https://github.com/shirelyakim/Bank_SSR/blob/main/readme/home_form.png?raw=true) <br />
Fill in the Username and the amount to create transaction and submit the form.
#### Admin Interface
##### All Transactions
![alt text](https://github.com/shirelyakim/Bank_SSR/blob/main/readme/all_transactions.png?raw=true) <br />
Showing all the transactions made in the bank by all its' users.
##### User Management
![alt text](https://github.com/shirelyakim/Bank_SSR/blob/main/readme/manage_users.png?raw=true) <br />
The users found in the system. It's possible to edit the user permissions, and view all hes' transactions.
The users' transactions will be shown on a different page by clicking on the arrow icon. This is how the page looks like: 
![alt text](https://github.com/shirelyakim/Bank_SSR/blob/main/readme/all_user_transactions.png?raw=true) <br />
The users' permissions can be edited by clicking on the penciel icon. This is how the form looks like:
![alt text](https://github.com/shirelyakim/Bank_SSR/blob/main/readme/edit_user.png?raw=true) <br />
By clicking on the create new user button its possible to create new users. This is how the form looks like:
![alt text](https://github.com/shirelyakim/Bank_SSR/blob/main/readme/new_user_form.png?raw=true) <br />
##### Statistics
![alt text](https://github.com/shirelyakim/Bank_SSR/blob/main/readme/statistics.png?raw=true) <br />
A trends across the bank accounts.