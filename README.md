# \# 💳 Java–COBOL Banking Application

# 

# A backend-driven banking system that demonstrates \*\*integration between modern Java (Spring Boot)\*\* and \*\*legacy COBOL programs\*\*.  

# This project simulates real-world enterprise systems where modern applications interact with legacy systems for core business logic.

# 

# \---

# 

# \## 🚀 Features

# 

# \- Account Creation  

# \- Balance Inquiry  

# \- Deposit \& Withdrawal Operations  

# \- Transaction Processing  

# \- Integration with COBOL for core logic execution  

# 

# \---

# 

# \## 🏗️ System Architecture

# 

# The system follows a layered architecture:

# 

# \- \*\*Frontend (React.js)\*\* → User interaction  

# \- \*\*Backend (Spring Boot)\*\* → REST APIs \& business logic  

# \- \*\*Database (MySQL)\*\* → Stores account and transaction data  

# \- \*\*COBOL Layer\*\* → Processes core banking operations  

# 

# \### 🔁 Data Flow:

React UI → Spring Boot API → MySQL Database → COBOL Program (via command-line)

→ Spring Boot → Database → Response to UI





\---



\## 🛠️ Tech Stack



\- \*\*Backend:\*\* Java, Spring Boot  

\- \*\*Frontend:\*\* React.js  

\- \*\*Database:\*\* MySQL (Hibernate ORM)  

\- \*\*Legacy System:\*\* COBOL  

\- \*\*Tools:\*\* IntelliJ IDEA, Git, Postman  



\---



\## ⚙️ How It Works



1\. User sends a request from the frontend (e.g., deposit money)  

2\. Spring Boot processes the request and fetches required data  

3\. Data is passed to the COBOL program as \*\*command-line arguments\*\*  

4\. COBOL processes the transaction  

5\. Result is returned to Spring Boot  

6\. Database is updated and response is sent to the user  





