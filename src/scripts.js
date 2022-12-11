// *** CONSTRUCTORS *** 
class ProductObject {
    constructor(id, card, product, brandCriteriaMet, tagCriteriaMet, priceCriteriaMet, colourCriteriaMet) {
        // id: string, card: element, product: object, brandCriteriaMet, priceCriteriaMet: boolean, tagCriteriaMet: int
        this.id = id;
        this.card = card;
        this.product = product;
        this.brandCriteriaMet = brandCriteriaMet;
        this.tagCriteriaMet = tagCriteriaMet;
        this.priceCriteriaMet = priceCriteriaMet;
        this.colourCriteriaMet = colourCriteriaMet;
    }
}

class Colour {
    constructor(colourName, hexCode) {
        // colourName: string, hexCode: string hex code
        this.colourName = colourName;
        this.hexCode = hexCode;
    }
}

// *** VARIABLES ***
const allProductTypes = ["blush", "bronzer", "eyebrow", "eyeliner", "eyeshadow", "foundation", "lip_liner", "lipstick", "mascara", "nail_polish"]
const prices = ["0", "10", "20", "30"];
const productColours = {
    red: new Colour("red", "#f2190a"),
    maroon: new Colour("maroon", "#4d0803"),
    orange: new Colour("orange", "#fa7305"),
    yellow: new Colour("yellow", "#ffc400"),
    green: new Colour("green", "#65ad2a"),
    blue: new Colour("blue", "#199ef7"),
    purple: new Colour("purple", "#7d49d6"),
    pink: new Colour("pink", "#f266ee"),
    grey: new Colour("grey", "#666666"),
    black: new Colour("black", "#080808"),
    white: new Colour("white", "#f2f2f2"),
    beige: new Colour("beige", "#ffeed9"),
    tan: new Colour("tan", "#cca370"),
    mediumBrown : new Colour("medium brown", "#946e40"),
    darkBrown: new Colour("dark brown", "#4d361b"),
}

const placeholderProductValues = {
    brand: "Uncle Joe's",
    image_link: "./images/cosmetics.png",
    name: "Freshest",
    price: "0.00"
}

const testValues = JSON.parse(`[{"id":1035,"brand":"rejuva minerals","name":"Multi Purpose Powder - Blush \u0026 Eye","price":"5.5","price_sign":"$","currency":"USD","image_link":"https://www.purpicks.com/wp-content/uploads/2018/06/Rejuva-Minerals-Multi-Purpose-Powder-Blush-_-Eye-1.jpg","product_link":"https://www.purpicks.com/product/rejuva-minerals-multi-purpose-powder-blush-eye/","website_link":"https://purpicks.com/","description":"Our Multi Purpose Pressed Powders may be used for blush or eye shadow. Blended with antioxidants from Certified Organic Fruits, Berries \u0026amp; Botanicals*. Made without any gluten containing ingredients. Mica free Pink Parfait and Papaya will offer a natural, ultra sheer semi-matte finish. The petals from beautiful crushed red roses that are found in Pink Parfait, are valued for their natural color and delightful aroma that they provide! Acai Berry will offer a natural, ultra sheer satin finish (mica added). VEGAN. Image one is Pink Parfait. Image two is Papaya, and image three is Acai Berry. Model in image four is wearing Papaya. Model in image five is wearing Acai Berry. To see a demonstration of Papaya, click on the video and fast forward to 3:44. Enjoy! This product is EWG VERIFIED\u0026#x2122; and rated 'CLEAN'in the Think Dirty app! BPA and Phthalate free packaging. Plastic parts of compacts are recyclable. *Tiny flecks of fruit and botanical particles may be visible in powder. Pink Parfait and Papaya are Titanium Dioxide and Mica free. Net Weight: 2.8 gm.","rating":null,"category":"powder","product_type":"blush","tag_list":["purpicks","EWG Verified","Hypoallergenic","No Talc"],"created_at":"2018-06-30T19:19:31.909Z","updated_at":"2018-09-02T22:52:06.855Z","product_api_url":"https://makeup-api.herokuapp.com/api/v1/products/1035.json","api_featured_image":"//s3.amazonaws.com/donovanbailey/products/api_featured_images/000/001/035/original/open-uri20180630-4-n6wb0y?1530390383","product_colors":[{"hex_value":"#E1BFC0","colour_name":"Pink Parfait"},{"hex_value":"#D7A7A3","colour_name":"Papaya"},{"hex_value":"#E6C3CB","colour_name":"Acai Berry"}]}]`)

// strings used throughout the code
const strings = {
    productCardDisplay: "flex",
    block: "block",
    none: "none",
    brand: "brand",
    tagList: "tag_list",
    productColours: "product_colors",
    price: "price"
}

// html classnames
const classNames = {
    brandCheckbox: "brand-checkbox",
    tagCheckbox: "tag-checkbox",
    priceCheckbox: "price-checkbox",
    colourCheckbox: "colour-checkbox",
}

const categoryColours = {
    face: "#543826",
    lips: "#002500",
    eyes: "#218380",
    nails: "#255365"
}

let loadedProducts = [];    // all productObjects that are loaded on the page
let cartProducts = [];  // products in the cart

// 
const cartURL = "http://localhost:3000/cart_products";

// *** PROTOTYPE FUNCTIONS ***

String.prototype.toTitleCase = function () {
    // convert string to title case
    // lowercase the string and split it into words
    const split = this.toLowerCase().trim().split(/\s+/);
    return split.reduce((p, c) => {
        // previous word + space + first letter of current word capitalised + rest of current word
        return (p + " " + c[0].toUpperCase() + c.substring(1)).trim();
    }, "")
}

Array.prototype.toLowerCase = function() {
    // convert array of strings to lowercase

    return this.map(e => {
        return e.toLowerCase();
    })
}

Array.prototype.toFloat = function() {
    // convert array of numbers to float

    return this.map(e => {
        return parseFloat(e);
    })
}

Array.prototype.sortCaseInsensitive = function () {
    // sort array ignoring case

    return this.sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    })
}

Array.prototype.sum = function() {
    // sum array of numbers

    return this.reduce((p, c) => {
        return p+c;
    })
}

// *** GENERAL FUNCTIONS ***

function hexToHSL(H) {
    /* 
    H: string hexcode
    convert hexcode to HSL format
    return: object containing h, s, l number values
    */

    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
      r = "0x" + H[1] + H[1];
      g = "0x" + H[2] + H[2];
      b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
      r = "0x" + H[1] + H[2];
      g = "0x" + H[3] + H[4];
      b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
  
    if (delta == 0)
      h = 0;
    else if (cmax == r)
      h = ((g - b) / delta) % 6;
    else if (cmax == g)
      h = (b - r) / delta + 2;
    else
      h = (r - g) / delta + 4;
  
    h = Math.round(h * 60);
  
    if (h < 0)
      h += 360;
  
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
  
    return {
        "h": h,
        "s": s,
        "l": l
    };
  }

function checkPriceIndex(price) {
    /* 
    get the index of price in the prices array
    return: number
    */

    return prices.indexOf(price);
}

function addToLoadedProducts(id, card, product) {
    /* 
    card: element, product: object
    create an object containing the card and product and push it to the loadedObjects array
    return: none
    */
    loadedProducts.push(new ProductObject(id, card, product, false, 0, false, 0));
}

function sumProductPrices(products) {
    return products.reduce((a, c) => {return a + c.product.price * c.quantity;}, 0)
}

function sumProductQuanities(products) {
    return products.reduce((a, c) => {return a + c.quantity}, 0)
}

function svgCircle(fillColour, radius) {
    /*
    fillColour: string hexcode
    return: string html for an svg circle with fill=fillColour
    */
    const circleContainer = document.createElement("span");
    circleContainer.innerHTML = `
    <svg height="${radius*2}" width="${radius*2}">
        <circle cx="${radius}" cy="${radius}" r="${radius}" fill="${fillColour}" />
    </svg>
`
    return circleContainer;
}

function generateProductId(product) {
    /*
    product: object containing brand and name
    return: string id based on brand and name
    */
    return (product.brand + product.name).replace(/\s+/g, '').replace(/[^a-z0-9]/gi, '');
}

function generateProductColourId(productId, colour) {
    /*
    productId: string id, colour: string
    return: string id based on id and colour
    */
    return (productId + colour).replace(/\s+/g, '');
}

function findProductById(id, array) {
    /*
    id: string id, array: array of products
    return: undefined if not found, product object otherwise
    */
    return array.find(p => p.id === id);
}

// *** QUERY SELECTORS ***
// navbar
const categorySelectors = document.querySelectorAll(".category-selector");
// content
const productContainer = document.querySelector("#product-container");
const titleStrip = document.querySelector("#title-strip");
// filters
const brandFilter = document.querySelector("#brand-filter");
const tagFilter = document.querySelector("#tag-filter");
const priceFilter = document.querySelector("#price-filter");
const colourFilter = document.querySelector("#colour-filter");
// cart
const cartItemsContainer = document.querySelector("#cart-items-container");
const cartButton = document.querySelector("#cart-button");
const cartDropdownContent = document.querySelector(".cart-dropdown-content");
const cartItemCount = document.querySelector("#cart-item-count");
const cartSubtotal = document.querySelector("#cart-subtotal");
const checkoutButton = document.querySelector("#checkout-button");
// product detail overlay
const productDetailOverlay = document.querySelector("#product-detail-overlay");
const productDetailOverlayAddToCart = document.querySelector

// *** INIT ***
function initialisePage() {
    addCategorySelectorEventListener(categorySelectors);
    addCartButtonEventListener();
}

initialisePage();

// *** NAVBAR FUNCTIONS ***

// category selectors

async function fetchProductsByTypeOrCategory (searchTerm) {
    /*
    searchTerm: string to search
    fetch from API the products matching the type or category
    return: an array of product objects matching searchTerm
    */

    let response;
    // if searchTerm is in the list of product types, use 'product_type' key
    if (allProductTypes.includes(searchTerm)){    
        response = await fetch(`https://makeup-api.herokuapp.com/api/v1/products.json?product_type=${searchTerm}`);
    } 
    // otherwise use the 'category' key
    else {
        response = await fetch(`https://makeup-api.herokuapp.com/api/v1/products.json?product_category=${searchTerm}`);
    }

    // get product objects
    const products = await response.json();
    return products;
}

function addCategorySelectorEventListener(buttons) {
    buttons.forEach(cs => {cs.addEventListener("click", async function() {
        //titleStrip.style.backgroundColor = categoryColours[cs.parentNode.parentNode.querySelector(".nav-button").value]
        changeTitleStrip(cs.parentNode.parentNode.querySelector(".nav-button").value)
        titleStrip.childNodes[0].textContent = cs.textContent;
        // get array of product objects
        const products = await fetchProductsByTypeOrCategory(cs.value)
        // create and add product cards
        populateProductContainer(products);
        // populate filters
        const filterLists = getFilterLists(products);
        populateFilterContainer(brandFilter, filterLists.brands, strings.brand);
        populateFilterContainer(tagFilter, filterLists.tags, strings.tagList);
        populateFilterContainer(priceFilter, prices, strings.price);
        populateFilterContainer(colourFilter, Object.values(productColours), strings.productColours);

    })});
}

function changeTitleStrip(category) {
    titleStrip.style.backgroundColor = categoryColours[category];
    let imageLink = "";
    switch(category) {
        case "face":
            imageLink = "./images/foundation-containers-advertising-assortment.jpg";
            break;
        case "lips":
            imageLink = "./images/lip-product-arrangement.jpg";
            break;
        case "eyes":
            imageLink = "./images/eyeshadow.jpg";
            break;
        case "nails":
            imageLink = "./images/high-angle-shot-colorful-nail-polishes-multicolor-paper (1).jpg";
            break;
    }
    titleStrip.style.backgroundImage=`url(${"./images/gplay.png"})`;
}

// *** DOM FUNCTIONS ***

function removeAllChildElements(parent) {
    /*
    parent: the element from which to remove all children
    remove all of the children of parent
    return: none
    */

    let child = parent.lastElementChild;
    while (child) {
        parent.removeChild(child);
        child = parent.lastElementChild;
    }
}

function changeDisplayOfAllProductCards(display) {
    /*
    display: string
    change all of the cards' display to 'display'
    */
    loadedProducts.forEach(e => {e.card.style.display = display});
}

// *** CREATE PRODUCT CARDS ***

function populateProductContainer(products) {
    /*
    products: array of product objects
    remove previous cards, generate new cards and append them to the product container
    return: none
    */

    // remove all cards on page
    loadedProducts = [];
    removeAllChildElements(productContainer);

    // create and append cards
    products.forEach(product => {
        const id = generateProductId(product);
        const card = createProductCard(id, product.image_link, product.brand, product.name, product.price, product.product_colors);
        productContainer.appendChild(card);
        
        //addProductImageErrorListenerToLast(placeholderProductValues.image_link);
        
        addToLoadedProducts(id, card, product);
    })
    
}

function createProductCard(id, image, brand, name, price, colours) {
    /*
    image: string url, brand: string, name: string, price: string decimal number
    return: product card div element
    */

    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
        <img class="product-image" src="${image}" onerror="this.onerror=null; this.src='${placeholderProductValues.image_link}'">
        <span class="product-brand">${brand ? brand.toUpperCase() : placeholderProductValues.brand}</span>
        <span class="product-name">${name}</span>
        <span class="product-price">$${price}</span>
    `
        //${colours.length > 0 ? createColourSelect(id, colours) : `<button class="add-to-cart-button">ADD TO BAG</button>`}
    if (colours.length) {
        card.appendChild(createColourSelect(id, colours));
    } else {
        const addToCartButton = document.createElement("button");
        addToCartButton.classList.add("add-to-cart-button");
        addToCartButton.textContent = "ADD TO BAG";
        card.appendChild(addToCartButton);
    }
    const btn = card.querySelector(".add-to-cart-button");
    btn.addEventListener('click', async function (e) {
        addAddToCartEventListener(btn, btn.parentNode.querySelector(".colour-select"));
    })
    return card;
}

function createColourSelect(id, colours) {
    /*
    id: string id, colours: array of colour objects
    return: string html of a form containing a dropdown with an 'add to cart' button
    */

    const dropdownBagContainer = document.createElement("div");
    dropdownBagContainer.classList.add("dropdown-bag-container");

    // div and select declaration
    let html = `
        <select name="colour-select" class="colour-select">
    `;
    // add all of the colour options
    colours.forEach(c => {
        html += `<option value="${c.colour_name.toLowerCase()}"> ${c.colour_name.toTitleCase()}</option>`
    });

    // button declaration
    html += `
        </select>
        `;
        //<button value="${id}" class="add-to-cart-button icon-add-to-cart-button"><img src="./images/shopping-bag.png"></button>

    const addToCartButton = document.createElement("button");
    addToCartButton.value = id;
    addToCartButton.classList.add("add-to-cart-button", "icon-add-to-cart-button")
    addToCartButton.innerHTML = `<img src="./images/shopping-bag.png">
    `

    dropdownBagContainer.innerHTML = html;
    dropdownBagContainer.appendChild(addToCartButton);
    return dropdownBagContainer;
}

// *** CART FUNCTIONS ***

async function addAddToCartEventListener(button, colourSelect) {
    // update cartProducts
    await fetchCartProducts();

    // initialise values
    //const colourSelect = colourSelectParent.querySelector(".colour-select");
    const colour = colourSelect.options[colourSelect.selectedIndex].text;
    const productId = button.value;
    const productColourId = generateProductColourId(productId, colour);
    const productInCart = findProductById(productColourId, cartProducts);
    
    if (productInCart) {
        // if product is already in cart, patch quantity
        productInCart.quantity++
        await patchProductQuantityInCart(productInCart);
    } else {
        // if not in cart, post new product
        await postProductToCart(productId, colour);
    }
    await populateCart();
}

function addCartButtonEventListener() {
    cartButton.addEventListener("click", function(e) {
        changeCartDisplay();
    });
}

function changeCartDisplay() {
    const display = cartDropdownContent.style.display;
        if (!display || display === strings.none) {
            cartDropdownContent.style.display = strings.block;
            populateCart();
            document.addEventListener('click', e => {
                let targetElement = e.target;
                do {
                    if(targetElement === cartDropdownContent || targetElement === cartButton) {
                      // This is a click inside, does nothing, just return.
                      return;
                    }
                    // Go up the DOM
                    targetElement = targetElement.parentNode;
                  } while (targetElement);
                  // This is a click outside.      
                  cartDropdownContent.style.display = strings.none;
                });
            
        } else {
            cartDropdownContent.style.display = strings.none;
            document.removeEventListener('click', e => {
                if (e.target !== cartDropdownContent) {
                    cartDropdownContent.style.display = strings.none;
                }
            })
        }
}

async function fetchCartProducts() {
    /*
    fetch cart products from the server
    update cartProducts with the fetched products
    */
    const response = await fetch(cartURL);
    const data = await response.json();
    cartProducts = data;
}

async function populateCart() {
    removeAllChildElements(cartItemsContainer);
    await fetchCartProducts();
    cartProducts.forEach(item => {
        const cartItem = generateCartItem(item);
        cartItemsContainer.appendChild(cartItem);
    })
    cartItemCount.textContent = `Items in bag: ${sumProductQuanities(cartProducts)}`;
    cartSubtotal.textContent = `Subtotal: $${sumProductPrices(cartProducts)}`;

    addDeleteItemEventListeners();
}

function addDeleteItemEventListeners() {
    const btnsDeleteItem = cartItemsContainer.querySelectorAll(".delete-item-button");
    btnsDeleteItem.forEach(btn => {
        btn.addEventListener("click", async function() {
            await deleteItemFromCart(btn.value);
            populateCart();
        })
    })
}

function generateCartItem(item) {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.product.image_link}">
            </div>
            <div class="cart-item-description">
                <h1>${item.product.brand.toUpperCase()} ${item.product.name}</h1>
                
                <p>Colour: ${item.selectedColour}
                <br>Price: $${item.product.price}</p>
            </div>
            <div class="cart-item-quantity">
                <input type="number" class="item-quantity-input" name="${item.id}-quantity" value="${item.quantity}" readonly>
            </div>
            <div class="cart-item-price">
                <p>$${item.product.price*item.quantity}</p>
            </div>
            <div class="cart-item-delete">
                <button class="delete-item-button icon-button" value="${item.id}"><img src="./images/close.png"></button>
            </div>
        </div>
    `;
    return cartItem;
}


async function postProductToCart(productId, colour) {
    /*
    productId: string, colour: string
    send post request to add a product matching productId to cart
    */

    // configure request
    const configurationObject = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            id: generateProductColourId(productId, colour),     // new id containing colour
            product: findProductById(productId, loadedProducts).product,    // product object
            selectedColour: colour,
            quantity: 1
        })
    }

    // send request
    await fetch(cartURL, configurationObject);

}

async function patchProductQuantityInCart(productInCart) {
    /*
    productInCart: product object with edited quantity
    send patch request to update quantity
    */

    // configure request
    const configurationObject = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            quantity: productInCart.quantity    // send the updated quantity
        })
    }

    // send request
    await fetch(`${cartURL}/${productInCart.id}`, configurationObject);

}

async function deleteItemFromCart(productId) {
    // configure request
    const configurationObject = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }

    // send request
    await fetch(`${cartURL}/${productId}`, configurationObject);
}

// *** CREATE FILTERS ***

function createCheckBoxAndLabel(value, labelText, searchKey, hexCode="") {
    // labelText: string, value: string
    // return: a div element containing a checkbox with value=value, and a label for the checkbox with innerText=value
    if (typeof value === "string"){
        value = value.toLowerCase()
    }

    // create checkbox
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = value;
    checkbox.name = value.toString(10);
    switch (searchKey) {
        case strings.brand:
            checkbox.classList.add(classNames.brandCheckbox);
            break;
        case strings.tagList:
            checkbox.classList.add(classNames.tagCheckbox);
            break;
        case strings.productColours:
            checkbox.classList.add(classNames.colourCheckbox);
            break;
        case strings.price:
            checkbox.classList.add(classNames.priceCheckbox);
            break;
    }

    // add checkbox event listener
    checkbox.addEventListener('change', function() {
        checkedBoxesCount = countCheckedBoxes();
        if (Object.values(checkedBoxesCount).sum() === 1) {
            changeDisplayOfAllProductCards(strings.none);
        }

        filterProducts(searchKey, value, this.checked);
        showOrHideFilteredProductCards();

        if (Object.values(checkedBoxesCount).sum() === 0) {
            changeDisplayOfAllProductCards(strings.productCardDisplay);
        }
    })

    // create label
    const label = document.createElement("label");
    
    // change label to titlecase if it's a brand or in all lowercase
    //label.innerHTML = labelText;
    label.appendChild(checkbox);
    let labelTextContent;
    if (searchKey === strings.productColours) {
        labelTextContent = document.createElement("div");
        labelTextContent.classList.add("relative-container");
        const tooltip = document.createElement("div");
        tooltip.classList.add("bottom-tooltip");
        tooltip.innerHTML = searchKey !== strings.productColours || searchKey === strings.brand || labelText === labelText.toLowerCase() ? labelText.toTitleCase() : labelText
        labelTextContent.appendChild(tooltip);
        checkbox.classList.add("checkbox-hidden");
        const colourCircle = svgCircle(hexCode, 12);
        colourCircle.classList.add("colour-circle");
        label.appendChild(colourCircle);
    } else {
        labelTextContent = document.createElement("span");
        labelTextContent.innerHTML = searchKey !== strings.productColours || searchKey === strings.brand || labelText === labelText.toLowerCase() ? labelText.toTitleCase() : labelText
    }

    
    label.appendChild(labelTextContent)
    label.for = value;
    // create container and append checkbox + label
    // const container = document.createElement("div");
    // //container.appendChild(checkbox);
    // container.appendChild(label);

    return label;

}

function populateFilterContainer(filterContainer, filterValues, key) {
    // filterContainer: element to which to append children, array: array of filter values
    // populate the filter container with filter checkboxes and labels
    // return: none

    removeAllChildElements(filterContainer);

    // create and append filter checkboxes and labels
    
    filterValues.forEach(filterValue => {
        // determine label based on search key
        let label = "";
        switch (key) {
            case strings.price:
                // determine label based on price range
                const priceIndex = checkPriceIndex(filterValue);
                switch (priceIndex){
                    case 0:
                        label = `Under $${prices[1]}`;
                        break;
                    case prices.length-1:
                        label = `Over $${prices[prices.length-1]}`;
                        break;
                    default:
                        label = `$${prices[priceIndex]} to $${prices[priceIndex+1]}`;
                        break;
                };
                break;
            case strings.productColours:
                // if it's a colour, create a coloured circle and use the colour name
                label = `
                    ${filterValue.colourName.toTitleCase()}
                    `;
                break;
            default:
                // otherwise use plain label
                label = filterValue;
                break;
        }
        filterContainer.appendChild(createCheckBoxAndLabel(filterValue, label, key, filterValue.hexCode))
    })
    
}

// *** FILTER FUNCTIONS ***

function showOrHideFilteredProductCards() {
    /*
    change whether cards are hidden or visible based on whether they meet filter criteria
    */
    const checkedBoxesCount = countCheckedBoxes();
    loadedProducts.forEach(e => {
        // display cards if the product meets the criteria
        if ((e.tagCriteriaMet === checkedBoxesCount.tagFilters && ((checkedBoxesCount.brandFilters > 0 && e.brandCriteriaMet) || checkedBoxesCount.brandFilters === 0)) && ((checkedBoxesCount.priceFilters > 0 && e.priceCriteriaMet) || checkedBoxesCount.priceFilters === 0) && ((checkedBoxesCount.colourFilters > 0 && e.colourCriteriaMet) || checkedBoxesCount.colourFilters === 0)) {  
            /* 
            tag: tag_list contains all tags
            brand: brand is one of the selected brands
            price: price is in one of selected price ranges
            colour: product_colours contains at least one of the colours
            */
            e.card.style.display = strings.productCardDisplay;
        } else {
            e.card.style.display = strings.none;
        }
        
    })
}

function getFilterLists(products) {
    // products: array of product objects
    // return: an object containing arrays of brands, tags of products
    
    // the arrays of brands and tags
    const [brands, tags] = [[], []];

    // iterate through each product
    products.forEach((product) => {
        const pBrand = product.brand ? product.brand.toTitleCase() : null;
        const pTags = product.tag_list;
        // add non-null and unique brands
        if (pBrand && !brands.includes(pBrand)) {
            brands.push(pBrand);
        }
        //add unique tags
        pTags.forEach((t) => {
            if (t && !tags.includes(t)) {
                tags.push(t);
            }
        })
    })
    return {
        brands: brands.sortCaseInsensitive(),
        tags: tags.sortCaseInsensitive()
    };
}

function filterProducts(key, value, checked) {
    // key: the string object key to be searched on, value: the string value being searched for, checked: boolean whether the checkbox is being checked or unchecked
    
    // determine which loaded products match the search value
    loadedProducts.forEach(productObject => {
        let productValue = productObject.product[key];
        switch (key){   // change search conditions based on the key being searched on
            case strings.brand:
                // simple evaluation of matching brand names
                if (productValue.toLowerCase() === value.toLowerCase()) {
                    changeCriteriaMet(productObject, checked, strings.brand); // change brandCriteriaMet
                }
                break;
            case strings.tagList:
                // check if the value matches anything in the tag list
                if (productValue.toLowerCase().includes(value.toLowerCase())) {
                    changeCriteriaMet(productObject, checked, strings.tagList);  // increment criteriaMet
                }
                break;
            case strings.productColours:
                // check if any colour in the colour list meets the value
                productValue.forEach(c => {
                    const hexCode = c.hex_value.split(",");
                    hexCode.forEach(hc => {
                        const colour = determineColourRange(hc);
                        if (colour.colourName === value.colourName.toLowerCase()) {
                            changeCriteriaMet(productObject, checked, strings.productColours);
                        }
                    })
                })
                break;
            case strings.price:
                // check if product price matches the price range
                const priceIndex = checkPriceIndex(value);
                const floatPrices = prices.toFloat();
                switch (priceIndex){
                    case 0:
                        // lowest : less than
                        if (productValue < floatPrices[1]) {
                            changeCriteriaMet(productObject, checked, strings.price);
                        }
                        break;
                    case prices.length-1:
                        // highest: more than
                        if (productValue >= floatPrices[prices.length-1]) {
                            changeCriteriaMet(productObject, checked, strings.price);
                        }
                        break;
                    default:
                        // other: between
                        if (productValue >= floatPrices[priceIndex] && productValue < floatPrices[priceIndex+1]) {
                            changeCriteriaMet(productObject, checked, strings.price);
                        }
                        break;
                };
                break;
        }
    })

    
}

function changeCriteriaMet (product, checked, category) {
    /*
    product: object, checked: boolean, category: string
    alter the product's 'category' criteriaMet value based on 'checked'
    */
    if (category === strings.brand) {
        product.brandCriteriaMet = checked;
    } else if (category === strings.price){
        product.priceCriteriaMet = checked;
    } else if (category === strings.productColours){
        if (checked) { 
            product.colourCriteriaMet++;
        } else {
            product.colourCriteriaMet--;
        }
    } else {
        if (checked) { 
            product.tagCriteriaMet++;
        } else {
            product.tagCriteriaMet--;
        }
    } 
}

function countCheckedBoxes() {
    /*
    return: object containing number of checked checkboxes in each filter
    */
    return {
        "brandFilters": getCheckedCheckboxesLength(classNames.brandCheckbox),
        "tagFilters": getCheckedCheckboxesLength(classNames.tagCheckbox),
        "priceFilters": getCheckedCheckboxesLength(classNames.priceCheckbox),
        "colourFilters": getCheckedCheckboxesLength(classNames.colourCheckbox),
    };

}

function getCheckedCheckboxesLength(className) {
    /*
    className: string html class name
    nodelist containing checked checkboxes under className
    */
    return document.querySelectorAll(`.${className}:checked`).length
}

function determineColourRange(hex) {
    /*
    hex: string hex code
    calculate colour range based on hsl values
    return: string colour name
    */

    const {h, s, l} = hexToHSL(hex);
    let colour;
    // grey
    if (h === 0 && s < 5){
        if (l < 10) {
            colour = productColours.black;
        } else if (l < 90) {
            colour = productColours.grey;
        } else {
            colour = productColours.white;
        }
    } 
    // red
    else if ((h >= 345 && l < 60) || h < 9) {
        if (l < 40) {
            colour = productColours.red;
        } else {
            colour = productColours.maroon;
        }
    } 
    // brown
    else if (h < 45) {
        if (l > 85) {
            colour = productColours.beige;
        } else if (l > 40 && s < 70){
            colour = productColours.tan;
        } else if (l > 25 && l < 45) {
            colour = productColours.mediumBrown;
        } else if (l <= 25) {
            colour = productColours.darkBrown;
        } else {
            // orange
            if (h < 35) {
                colour = productColours.orange;
            } else {
                // a yellow
                colour = productColours.yellow;
            }
        }
    } 
    // yellow
    else if (h < 55) {
        colour = productColours.yellow;
    } 
    // green
    else if (h < 160) {
        colour = productColours.green;
    } 
    // blue
    else if (h < 241) {
        colour = productColours.blue;
    } 
    // purple
    else if (h < 301) {
        colour = productColours.purple;
    } 
    // pink
    else {
        colour = productColours.pink;
    }
    return colour;
}

function test(){
    const filterLists = getFilterLists(testValues);
    populateFilterContainer(brandFilter, filterLists.brands, strings.brand);
    populateFilterContainer(tagFilter, filterLists.tags, strings.tagList);
    populateProductContainer(testValues);
    populateFilterContainer(priceFilter, prices, strings.price);
    populateFilterContainer(colourFilter, Object.values(productColours), strings.productColours);

}



test();