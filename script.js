const cartItems = document.querySelector('.cart__items');

function saveCart() {
  localStorage.setItem('cartItems', cartItems.innerHTML);
}

function getSavedCart() {
  cartItems.innerHTML = localStorage.getItem('cartItems');
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const clickedItemParent = event.target.parentNode;
  clickedItemParent.removeChild(event.target);
  saveCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getInfosApi(object) {
  const sectionItems = document.querySelector('.items');
  const infos = object.map((element) => ({
     sku: element.id,
     name: element.title,
     image: element.thumbnail,
    }));
  return infos.forEach((product) => {
    sectionItems.appendChild(createProductItemElement(product));
  });
}

async function getInfosCart(object) {
  return {
    sku: object.id,
    name: object.title,
    salePrice: object.price,
   };
}

function clearCart() {
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', () => {
    cartItems.innerHTML = '';
    saveCart();
  });
}
clearCart();

const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

async function fetchProductId(id) {
  const urlFetch = `https://api.mercadolibre.com/items/${id}`;
  const response = await fetch(urlFetch);
  const data = await response.json();
  const filteredData = await getInfosCart(data);
  cartItems.appendChild(createCartItemElement(filteredData));
  saveCart();
}

async function clickButtonCart() {
  const addButton = document.querySelectorAll('.item__add');
  addButton.forEach((button) => button.addEventListener('click', (event) => {
    const clickedItem = event.target.parentNode.firstChild.innerText;
    fetchProductId(clickedItem);
  }));
}

async function fetchApi() {
  const response = await fetch(url);
  const json = await response.json();
  const data = json.results;
  getInfosApi(data);
  clickButtonCart();
}
fetchApi();

window.onload = () => { 
  getSavedCart();
};