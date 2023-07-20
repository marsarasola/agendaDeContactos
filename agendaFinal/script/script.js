// message
function toast(txt, type){
    if(type === 'error'){
        Toastify({
            text: txt,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right", 
            stopOnFocus: true, 
            style: {
              background: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(171,126,103,1) 0%, rgba(123,55,22,1) 51%)",
              fontFamily: "system-ui, Roboto"
            }
          }).showToast();
    }else{
        Toastify({
            text: txt,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right", 
            stopOnFocus: true, 
            style: {
              background: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(134,140,87,1) 0%, rgba(33,50,32,1) 49%)",
              fontFamily: "system-ui, Roboto"
            }
          }).showToast();
    }
}

class Contact {
    constructor(name, tel, email){
        this.name = name;
        this.tel = tel;
        this.email = email;
    }
    add(){
        PHONEBOOK.push(this)
    }
}

const STORAGE_KEY = 'PHONEBOOK';

const PHONEBOOK = [];

const nameInput = document.querySelector('#name')
const telInput = document.querySelector('#tel')
const emailInput = document.querySelector('#mail')
const addBtn = document.querySelector('#add-btn')
const phonebookDOM = document.querySelector('#agenda') 

const checkIfContactAlreadyExists = ( contact ) => {
    if( PHONEBOOK.some( ctct => ctct.email === contact.email  ) ){
        toast('Ese contacto ya existe', 'error')
    }else{
        contact.add()
        localStorage.setItem(STORAGE_KEY, JSON.stringify(PHONEBOOK))
        updateDOM()
        toast(`He añadido a ${contact.name} a tus contactos`)
    }
}
    
const createContact = (e) => {
    e.preventDefault()

    const name = nameInput.value;
    const tel = telInput.value;
    const email = emailInput.value;

    if(!name || !tel || !email){
        toast('Los datos no son válidos', 'error')
    }else{
        const newContact = new Contact(name, tel, email)
        checkIfContactAlreadyExists(newContact)
    }

    document.querySelector('form').reset()
}

function updateDOM(){
    agenda.innerHTML = '<h2>Contactos</h2>'
    PHONEBOOK.forEach(contacto => createContactDiv(contacto) )
}

const createContactDiv = ( contact ) => {
    const newContact = document.createElement('div')

    const {name, email, tel} = contact

    newContact.classList.add('contacto')

    const contactName = document.createElement('span')
    contactName.textContent = name
    const contactMail = document.createElement('span')
    contactMail.textContent = email
    const contactTel = document.createElement('span')
    contactTel.textContent  = tel

    const editBtn = document.createElement('button')
    editBtn.classList.add('edit-btn')
    editBtn.textContent = 'Editar'
    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('delete-btn')
    deleteBtn.textContent = 'Borrar'

    editBtn.addEventListener('click', editContact)
    deleteBtn.addEventListener('click', deleteContact)

    newContact.appendChild(contactName)
    newContact.appendChild(editBtn)
    newContact.appendChild(contactMail)
    newContact.appendChild(deleteBtn)
    newContact.appendChild(contactTel)

    phonebookDOM.appendChild(newContact)
}

const editContact = (e) => {
    const selectedEmail = e.target.nextSibling.textContent

    ///find the contact
    const selectedContact = PHONEBOOK.find( contacto => contacto.email === selectedEmail)
    const {name, tel, email} = selectedContact;

    const {newName, newTel, newMail} = getNewValues()

    //edit
    const selectedIndex = PHONEBOOK.indexOf(selectedContact)
    ///save
    PHONEBOOK[selectedIndex].name = newName ? newName : name;
    PHONEBOOK[selectedIndex].tel = newTel ? newTel : tel ;
    PHONEBOOK[selectedIndex].email = newMail ? newMail : email;

    //update the storage
    //update dom
    localStorage.setItem(STORAGE_KEY, JSON.stringify(PHONEBOOK))
    updateDOM()
}


const deleteContact = (e) => {
    const selectedEmail = e.target.previousSibling.textContent
    const selectedContact = PHONEBOOK.find( contacto => contacto.email === selectedEmail)
    const selectedIndex = PHONEBOOK.indexOf(selectedContact)

    const confirmation = confirm(`¿Segurx que quieres eliminar a ${selectedContact.name} de tus contactos?`)

    if(confirmation){
        PHONEBOOK.splice(selectedIndex, 1)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(PHONEBOOK))
        updateDOM()
    }
    
}

addBtn.addEventListener('click', createContact)

const checkStorage = () => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if(savedData){
        const parsedData = JSON.parse(savedData)
        PHONEBOOK.push(...parsedData)
        updateDOM()
    }
}

window.onload = () => {
    checkStorage()
};

function getNewValues(){
    const newName = prompt('Nuevo nombre')
    const newMail = prompt('Nuevo mail')
    const newTel = prompt('Nuevo telefono') 

    return {
        newName : newName,
        newMail : newMail,
        newTel : newTel
    }
}