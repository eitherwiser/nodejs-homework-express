const fs = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');

const contacts = path.resolve(__dirname, 'contacts.json');

async function writeJSON(data) {
  const newObj = [...data];
  fs.writeFile(contacts, JSON.stringify(newObj, null, '\t'));
}

const listContacts = async () => {
  try {
    const data = await fs.readFile(contacts);
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

const getContactById = async contactId => {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex(el => el.id === contactId);
    if (index === -1) {
      return false;
    } else {
      return contacts[index];
    }
  } catch (error) {
    console.log(error);
  }
};

const removeContact = async contactId => {
  try {
    const contacts = await listContacts();
    if (contacts.findIndex(el => el.id === contactId) === -1) {
      return false;
    } else {
      const newContacts = contacts.filter(el => el.id !== contactId);
      await writeJSON(newContacts);
      return true;
    }
  } catch (error) {
    console.log(error);
  }
};

const addContact = async body => {
  try {
    const contact = { id: randomUUID().toString(), ...body };
    await writeJSON([...(await listContacts()), contact]);
    return contact;
  } catch (error) {
    console.log(error);
  }
};

const updateContact = async (contactId, body) => {
  try {
    let contact = await getContactById(contactId);
    console.table(contact);
    if (!contact) {
      console.log('ERORR');
      return false;
    } else {
      contact = { ...contact, ...body };
      console.table(contact);
      const contacts = await listContacts();
      const newContacts = contacts.filter(el => el.id !== contactId);
      await writeJSON([...newContacts, contact]);
      return contact;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
