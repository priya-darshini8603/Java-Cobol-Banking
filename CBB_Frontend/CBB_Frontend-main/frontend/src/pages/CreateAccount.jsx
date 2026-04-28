import { createAccount } from "../services/accountService";

const handleSubmit = async () => {
  const accountData = {
    accountNo: "5001",
    balance: 10000,
    name: "Sony",
  };

  try {
    const res = await createAccount(accountData);
    alert("Account Created Successfully");
    console.log(res.data);
  } catch (err) {
    console.error(err);
    alert("Error creating account");
  }
};
