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

function cartItemClickListener() {

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
  const productsObject = object.results;
  const infos = productsObject.map((element) => ({
     sku: element.id,
     name: element.title,
     image: element.thumbnail,
    }));
  return infos.forEach((product) => {
    sectionItems.appendChild(createProductItemElement(product));
  });
}

function getInfosCart(object) {
  return {
    sku: object.id,
    name: object.title,
    salePrice: object.price,
   };
}

const clickButtonCart = () => {
  const cartItems = document.querySelector('.cart__items');
  const addButton = document.querySelectorAll('.item__add');
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', () => {
    cartItems.innerHTML = '';
  });
  addButton.forEach((button) => button.addEventListener('click', (event) => {
    const clickedItem = event.target.parentNode.firstChild.innerText;
    fetch(`https://api.mercadolibre.com/items/${clickedItem}`)
  .then((response) => response.json())
  .then((ObjectOfProducts) => getInfosCart(ObjectOfProducts))
  .then((elementToCart) => cartItems.appendChild(createCartItemElement(elementToCart)));
  }));
};

function fetchApi() {
   fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((responde) => responde.json())
  .then((arrayOfProduts) => getInfosApi(arrayOfProduts))
  .then(() => clickButtonCart());
}

window.onload = () => { 
  fetchApi();
};
