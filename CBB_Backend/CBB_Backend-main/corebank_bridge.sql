
CREATE DATABASE corebank_bridge;
USE corebank_bridge;

CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
	mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    reset_otp VARCHAR(255),
    reset_otp_expiry DATETIME,
    otp_code VARCHAR(100),
    otp_expiry TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE accounts (
    account_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    account_number BIGINT UNIQUE NOT NULL,
    account_type ENUM('SAVINGS','CURRENT') NOT NULL,
    balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    status ENUM('ACTIVE','BLOCKED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(user_id)
);

CREATE TABLE transactions (
    txn_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    from_acc_id BIGINT NOT NULL,
    txn_type ENUM('DEPOSIT','WITHDRAW','TRANSFER') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    to_acc_id BIGINT NULL,
    status ENUM('SUCCESS','FAILED','PENDING') NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_acc_id) REFERENCES accounts(account_id),
    FOREIGN KEY (to_acc_id) REFERENCES accounts(account_id)
);

CREATE TABLE loans (
    loan_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    salary DECIMAL(12,2) NOT NULL,
    loan_amount DECIMAL(15,2) NOT NULL,
    credit_score INT NOT NULL CHECK (credit_score BETWEEN 300 AND 900),
    loan_type ENUM('HOME','CAR','PERSONAL') NOT NULL,
    emi DECIMAL(12,2) NOT NULL,
    status ENUM('APPROVED','PENDING','REJECTED') NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(user_id)
);

CREATE TABLE emi_payment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    loan_id BIGINT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    paid_at DATETIME NOT NULL,
    FOREIGN KEY (loan_id) REFERENCES loan(loan_id)
);


INSERT INTO users (full_name,email,phone,password,role,status) VALUES
('Priya Darshini','priya@mail.com','9876543210','pass1','CUSTOMER','ACTIVE'),
('Rahul Kumar','rahul@mail.com','9123456780','pass2','CUSTOMER','ACTIVE'),
('Anita Sharma','anita@mail.com','9988776655','pass3','CUSTOMER','ACTIVE'),
('Admin User','admin@mail.com','9000000000','admin123','ADMIN','ACTIVE'),
('Kiran Reddy','kiran@mail.com','9345678901','pass5','CUSTOMER','ACTIVE');


INSERT INTO accounts (customer_id,account_number,account_type,balance,status) VALUES
(1,100001,'SAVINGS',50000,'ACTIVE'),
(2,100002,'CURRENT',75000,'ACTIVE'),
(3,100003,'SAVINGS',30000,'ACTIVE'),
(5,100004,'SAVINGS',15000,'ACTIVE'),
(1,100005,'CURRENT',20000,'ACTIVE');


INSERT INTO transactions (from_acc_id,txn_type,amount,to_acc_id,status) VALUES
(1,'TRANSFER',5000,2,'SUCCESS'),
(2,'WITHDRAW',2000,NULL,'SUCCESS'),
(3,'DEPOSIT',7000,NULL,'SUCCESS'),
(1,'TRANSFER',10000,3,'PENDING'),
(4,'WITHDRAW',1000,NULL,'FAILED');


INSERT INTO loans (customer_id, salary, loan_amount, credit_score, loan_type, emi, status) VALUES
(1, 50000, 500000, 780, 'HOME', 12000, 'APPROVED'),
(2, 40000, 200000, 690, 'CAR', 7000, 'PENDING'),
(3, 35000, 100000, 720, 'PERSONAL', 4500, 'APPROVED'),
(5, 60000, 800000, 750, 'HOME', 15000, 'PENDING'),
(1, 50000, 150000, 580, 'PERSONAL', 6000, 'REJECTED');


ALTER TABLE loans ADD COLUMN tenure_months INT NOT NULL DEFAULT 12;
ALTER TABLE loans ADD COLUMN annual_interest_rate DECIMAL(5,2);
ALTER TABLE loans MODIFY emi DECIMAL(12,2) NULL;


