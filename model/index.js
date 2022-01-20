const fs = require('fs/promises');
const path = require('path');
//const contactsFile = require('./contacts.json');
const { nanoid } = require('nanoid');

const contacts = path.normalize(path.resolve('./contacts.json'));


async function writeJSON(data) {
  const newObj = [...data];
  fs.writeFile(contacts, JSON.stringify(newObj, null, '\t'))
}


const listContacts = async () => {
  const data = await fs.readFile(contacts, "utf-8");
  return JSON.parse(data);  
};


const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const contact = contacts.filter(el => el.id === contactId)
  //console.log(contact);  
  if (contact.length > 0) {
    return JSON.parse(contact);
  }
  else {
    return false;
  }
};


const removeContact = async (contactId) => {
  const contacts = await listContacts();
  if (contacts.findIndex(el => el.id === contactId) === -1) {
    return false
  }
  else {
    const newContacts = contacts.filter(el => el.id !== contactId);
    await writeJSON(newContacts);
    return true;
  }
}


const addContact = async (body) => {
  const contact = { "id": nanoid().toString(), ...body };
  await writeJSON([...await listContacts(), contact]);
  return JSON.parse(contact);
}


const updateContact = async (contactId, body) => {
  const contact = await getContactById();
  if (!contact) {
    return false;
  }
  else {
    contact = {...contact, ...body}
    const contacts = await listContacts();
    const newContacts = contacts.filter(el => el.id !== contactId);
    await writeJSON([...newContacts, contact ]);
    return JSON.parse(contact);
    }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
