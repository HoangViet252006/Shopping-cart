import products from "./product.js";
let listCart = [];
let listCartHTML = document.querySelector('.list');
var finalQuantity = document.querySelector('.totalQuantity')
var finalPrice = document.querySelector('.totalPrice')
var totalPrice = 0;

const initApp = () => {
    if (localStorage.getItem('cart')) {
        listCart = JSON.parse(localStorage.getItem('cart'));
        addCartToHTML();
    }
}


const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    totalPrice = 0;
    if (listCart.length > 0) {
        listCart.forEach(item => {
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            listCartHTML.appendChild(newItem);
            totalQuantity += item.quantity;
            totalPrice += info.price * item.quantity;
            newItem.innerHTML = `
                        <img src="${info.image}">
                        <div class="info">
                            <div class="name">${info.name}</div>
                            <div class="price">$${info.price}/1 product</div>
                        </div>
                        <div class="quantity">${item.quantity}</div>
                        <div class="returnPrice">$${info.price * item.quantity}</div>
                    </div>
            `
        })
    }
    finalQuantity.innerText = totalQuantity;
    finalPrice.innerText = `$${totalPrice}`;
}

initApp();
addCartToHTML();

const username = document.getElementById('username');
const phone = document.getElementById('phone');
const email = document.getElementById('email');
const country = document.getElementById('country');
const city = document.getElementById('city');
const btnBuy = document.getElementById('btncheck');

function notice(e, message) {
    let par = e.parentElement;
    par.classList.add('invalid');
    let mess = par.querySelector('.form-message');
    mess.innerText = message;
}

function ValidatorName(e) {
    let text = e.value;
    if (text.length == 0) {
        notice(e, "Vui lòng nhập tên đầy đủ của bạn")
        return false;
    }
    return true;
}

function ValidatorPhone(e) {
    var phoneNumber = e.value;
    var regex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
    var found = phoneNumber.search(regex);
    if (found > -1) {
        return true;
    } else {
        notice(e, "Trường này không phải là Số điện thoại")
        return false;
    }
}

function ValidatorEmail(e) {
    var mailContent = e.value;
    var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var found = regex.test(mailContent);
    if (found == true) {
        return true;
    } else {
        notice(e, "Trường này không phải là Email")
        return false;
    }
}

function ValidatorCountry(e) {
    let text = e.value;
    if (text === "") {
        notice(e, "Vui lòng nhập quốc gia bạn đang ở")
        return false;
    }
    return true;
}

function ValidatorCity(e) {
    let text = e.value;
    if (text === "") {
        notice(e, "Vui lòng nhập thành phố bạn đang ở")
        return false;
    }
    return true;
}

function whileInput(e) {
    e = e.target;
    let par = e.parentElement;
    par.classList.remove('invalid');
    let mess = par.querySelector('.form-message');
    mess.innerText = "";
}

username.onblur = function(e) {
    ValidatorName(e.target);
}

username.oninput = function(e) {
    whileInput(e);
}

phone.onblur = function(e) {
    ValidatorPhone(e.target);
}

phone.oninput = function(e) {
    whileInput(e);
}

email.onblur = function(e) {
    ValidatorEmail(e.target);
}

email.oninput = function(e) {
    whileInput(e);
}

city.oninput = function(e) {
    whileInput(e);
}

country.oninput = function(e) {
    whileInput(e);
}

btnBuy.addEventListener('click', (e) => {
    var isName = ValidatorName(username);
    var isPhone = ValidatorPhone(phone);
    var isEmail = ValidatorEmail(email);
    var isCity = ValidatorCity(city);
    var isCountry = ValidatorCountry(country);
    if (isName && isPhone && isEmail &&
        isCity && isCountry) {
        showNotice();
        return true;
    }
    return false;
});


// modal

const modal = document.querySelector('.modal');
const text = document.querySelector('.js-pay-icon-text');
const modalContainer = document.querySelector('.pay-content');

text.innerText = `Bạn đã thanh toán $${totalPrice}`;
modalContainer.addEventListener('click', (e) => {
    e.stopPropagation();
})

function showNotice() {
    modal.classList.add('open');
}

function hideNotice() {
    modal.classList.remove('open');
}

function reset() {
    username.value = "";
    phone.value = "";
    email.value = "";
    country.value = "";
    city.value = "";
    localStorage.clear();
    listCartHTML.innerHTML = '';
    finalQuantity.innerText = 0;
    finalPrice.innerText = 0;
}

modal.addEventListener('click', () => {
    hideNotice();
    reset();
});