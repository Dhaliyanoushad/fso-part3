import { set, connect, Schema, model, connection } from "mongoose";

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://kadalthavala:${password}@cluster0.djilz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

set("strictQuery", false);

connect(url);

const contactSchema = new Schema({
  name: String,
  number: Number,
});

const Contact = model("Contact", contactSchema);

if (process.argv.length === 3) {
  Contact.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((contact) => {
      console.log(`${contact.name} ${contact.number}`);
    });
    connection.close();
  });
  return;
}

const contact = new Contact({
  name: process.argv[3],
  number: process.argv[4],
});

contact.save().then((result) => {
  console.log(`added ${result.name} number ${result.number} to phonebook`);
  connection.close();
});
