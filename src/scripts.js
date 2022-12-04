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
    "red": new Colour("red", "#f2190a"),
    "maroon": new Colour("maroon", "#4d0803"),
    "orange": new Colour("orange", "#fa7305"),
    "yellow": new Colour("yellow", "#ffc400"),
    "green": new Colour("green", "#65ad2a"),
    "blue": new Colour("blue", "#199ef7"),
    "purple": new Colour("purple", "#7d49d6"),
    "pink": new Colour("pink", "#f266ee"),
    "grey": new Colour("grey", "#666666"),
    "black": new Colour("black", "#080808"),
    "white": new Colour("white", "#f2f2f2"),
    "beige": new Colour("beige", "#ffeed9"),
    "tan": new Colour("tan", "#cca370"),
    "mediumBrown" : new Colour("medium brown", "#946e40"),
    "darkBrown": new Colour("dark brown", "#291b0a"),
}

const placeholderProductValues = {
    brand: "Uncle Joe's",
    image_link: "./images/cosmetics.png",
    name: "Freshest",
    price: "0.00"
}

const testValues = [
    {
        brand: "Uncle Joe's",
        image_link: "./images/cosmetics.png",
        name: "Freshest",
        price: "0.00",
        tag_list: ["vegan", "amazing"],
        product_colors: [{"hex_value":"#7C524F","colour_name":"27 Kisses"},{"hex_value":"#884955","colour_name":"Amalia"},{"hex_value":"#9F3D2A","colour_name":"Bitter Sweet"},{"hex_value":"#542A26","colour_name":"Dirty Diana"},{"hex_value":"#793D48","colour_name":"Dreamtime"},{"hex_value":"#BB6E60","colour_name":"Fairy Tale"},{"hex_value":"#BA8285","colour_name":"Halo"},{"hex_value":"#71474E","colour_name":"Just Like Jade"},{"hex_value":"#AF8475","colour_name":"Naked"},{"hex_value":"#D65572","colour_name":"Precious"},{"hex_value":"#8F1A23","colour_name":"Revenge"},{"hex_value":"#8B383D","colour_name":"Ruby Rose"},{"hex_value":"#C83752","colour_name":"Survivor"},{"hex_value":"#784F5F","colour_name":"Viva"},{"hex_value":"#672F57","colour_name":"Zo Zo"}]
    }, 
    {
        brand: "Uncle Daniel's",
        image_link: "./images/cosmetics.png",
        name: "Dankest",
        price: "50.00",
        tag_list: ["full gmo", "beautiful"],
        product_colors: [{"hex_value":"#B97271","colour_name":"Goal Digger"}]
    },
    {
        brand: "Uncle Daniel's",
        image_link: "./images/cosmetics.png",
        name: "Moistest",
        price: "10.00",
        tag_list: ["amazing", "noice"],
        product_colors: [{"hex_value":"#F2DEC3","colour_name":"Fair 05"},{"hex_value":"#793C36","colour_name":"Ziggie"}]
    }
]

const strings = {
    "productCardDisplay": "flex",
    "none": "none",
    "brand": "brand",
    "tagList": "tag_list",
    "productColours": "product_colors",
    "price": "price"
}

const classNames = {
    brandCheckbox: "brand-checkbox",
    tagCheckbox: "tag-checkbox",
    priceCheckbox: "price-checkbox",
    colourCheckbox: "colour-checkbox",
}

let loadedProducts = [];    // all productObjects that are loaded on the page
let cartProducts = [];

const cartURL = "http://localhost:3000/cart_products";

// *** QUERY SELECTORS ***
const divProductContainer = document.querySelector("#product-container");
const btnsCategorySelector = document.querySelectorAll(".category-selector");
const divBrandFilter = document.querySelector("#brand-filter");
const divTagFilter = document.querySelector("#tag-filter");
const divPriceFilter = document.querySelector("#price-filter");
const divColourFilter = document.querySelector("#colour-filter");

// *** PROTOTYPE FUNCTIONS ***

String.prototype.toTitleCase = function () {
    // convert string to title case
    // lowercase the string and split it into words
    const split = this.toLowerCase().split(" ");
    return split.reduce((p, c) => {
        // previous word + space + first letter of current word capitalised + rest of current word
        return (p + " " + c[0].toUpperCase() + c.substring(1)).trim();
    }, "")
}

Array.prototype.toLowerCase = function() {
    return this.map(e => {
        return e.toLowerCase();
    })
}

Array.prototype.toFloat = function() {
    return this.map(e => {
        return parseFloat(e);
    })
}

Array.prototype.sortCaseInsensitive = function () {
    return this.sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    })
}

Array.prototype.sum = function() {
    return this.reduce((p, c) => {
        return p+c;
    })
}

// *** GENERAL FUNCTIONS ***

function hexToHSL(H) {
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
    return prices.indexOf(price);
}

function addToLoadedProducts(id, card, product) {
    // card: element, product: object
    // create an object containing the card and product and push it to the loadedObjects array
    // return: none
    loadedProducts.push(new ProductObject(id, card, product, false, 0, false, 0));
}

function svgCircle(fillColour) {
    return `
        <svg height="10" width="10">
            <circle cx="5" cy="5" r="5" fill="${fillColour}" />
        </svg>
    `
}

function generateProductId(product) {
    return (product.brand + product.name).replace(/\s+/g, '');
}

function generateProductColourId(productId, colour) {
    return (productId + colour).replace(/\s+/g, '');
}

// *** FETCH FUNCTIONS ***

async function fetchProductsByTypeOrCategory (searchTerm) {
    // searchTerm: string to search
    // fetch from API the products matching the type or category
    // return: an array of product objects matching searchTerm

    let response;
    // if searchTerm is in the list of product types, use 'product_type' key
    if (allProductTypes.includes(searchTerm)){    
        response = await fetch(`https://makeup-api.herokuapp.com/api/v1/products.json?product_type=${searchTerm}`);
    } 
    // otherwise use the 'category' key
    else {
        response = await fetch(`https://makeup-api.herokuapp.com/api/v1/products.json?product_category=${searchTerm}`);
    }

    const products = await response.json();
    return products;
}

async function fetchCartProducts() {
    const response = await fetch(cartURL);
    const data = await response.json();
    cartProducts = data;
}

//fetchCartProducts()

// *** EVENT LISTENERS ***

// category selectors
function addCategorySelectorEventListener(buttons) {
    buttons.forEach(cs => {cs.addEventListener("click", async function() {
        // get array of product objects
        const products = await fetchProductsByTypeOrCategory(cs.value)
        // create and add product cards
        populateProductContainer(products);

        // populate filters
        const filterLists = getFilterLists(products);
        populateFilterContainer(divBrandFilter, filterLists.brands, "brands", strings.brand);
        populateFilterContainer(divTagFilter, filterLists.tags, "tags", strings.tagList);
        populateFilterContainer(divPriceFilter, prices, "price", strings.price);
        populateFilterContainer(divColourFilter, Object.values(productColours), "colours", strings.productColours);

    })});
}

function addProductImageErrorListenerToLast(placeholder) {
    // placeholder: string image url
    // add an event listener to the last product image
    // if there is an error retrieving the image, use the placeholder image instead
    // return: none
    const productImages = document.querySelectorAll(".product-image");
    const productImagesLast = productImages[productImages.length - 1];
    productImagesLast.addEventListener("error", () => productImagesLast.src = placeholder);
}

// function addFilterCheckboxEventListener(checkbox, searchKey, value, checked) {
//     checkbox.addEventListener('change', function() {
//         checkedBoxesCount = countCheckedBoxes();
//         console.log(checkedBoxesCount.values)
//         if (checkedBoxesCount.values().sum() === 1) {
//             changeDisplayOfAllProductCards(strings.none);
//         }

//         filterProducts(searchKey, value, checked);
//         showOrHideFilteredProductCards();

//         if (checkedBoxesCount.values.sum() === 0) {
//             changeDisplayOfAllProductCards(strings.productCardDisplay);
//         }
//     })
// }


// *** DOM FUNCTIONS ***

function removeAllChildElements(parent) {
    // parent: the element from which to remove all children
    // remove all of the children of parent
    // return: none

    let child = parent.lastElementChild;
    while (child) {
        parent.removeChild(child);
        child = parent.lastElementChild;
    }
}

function changeDisplayOfAllProductCards(display) {
    loadedProducts.forEach(e => {e.card.style.display = display});
}

// *** CREATE PRODUCT CARDS ***

function populateProductContainer(products) {
    // products: array of product objects
    // remove previous cards, generate new cards and append them to the product container
    // return: none

    // remove all cards on page
    loadedProducts = [];
    removeAllChildElements(divProductContainer);

    // create and append cards
    products.forEach(product => {
        const id = generateProductId(product);
        const card = createProductCard(id, product.image_link, product.brand, product.name, product.price, product.product_colors);
        divProductContainer.appendChild(card);
        addProductImageErrorListenerToLast(placeholderProductValues.image_link);
        addToLoadedProducts(id, card, product);
    })
    addAddToCartEventListeners();
}

function createProductCard(id, image, brand, name, price, colours) {
    // image: string url, brand: string, name: string, price: string decimal number
    // return: product card div element

    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
        <img class="product-image" src="${image}">
        <span class="product-brand">${brand ? brand.toUpperCase() : placeholderProductValues.brand}</span>
        <span class="product-name">${name}</span>
        <span class="product-price">$${price}</span>
        ${colours.length > 0 ? createColourSelect(id, colours) : `<button class="add-to-cart-button">ADD TO BAG</button>`}
    `
    return card;
}

function createColourSelect(id, colours) {
    let html = `
        <form class="dropdown-bag-container">
        <select name="colour-select" class="colour-select">
    `;
    colours.forEach(c => {
        html += `<option value="${c.colour_name.toLowerCase()}"> ${c.colour_name.toTitleCase()}</option>`
    });
    html += `
        </select>
        <button type="submit" value="${id}" class="add-to-cart-button icon-add-to-cart-button"><img src="./images/shopping-bag.png"></button>
        </form>
    `;

    return html;
}

function addAddToCartEventListeners() {
    const btnsAddToCart = document.querySelectorAll(".add-to-cart-button");
    btnsAddToCart.forEach(btn => {
        //btn.addEventListener("click", postProductToCart(id, colour));
        btn.addEventListener("click", async function (e) {
            e.preventDefault();
            await fetchCartProducts();
            const colourSelect = btn.parentNode.querySelector(".colour-select");
            const colour = colourSelect.options[colourSelect.selectedIndex].text;
            const productId = btn.value;
            const productColourId = generateProductColourId(productId, colour);
            const productInCart = findProductById(productColourId, cartProducts);
            if (productInCart) {
                productInCart.quantity++
                patchProductQuantityInCart(productInCart);
            } else {
                postProductToCart(productId, colour);
            }
        });
    })
}

function postProductToCart(productId, colour) {
    const configurationObject = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            id: generateProductColourId(productId, colour),
            product: findProductById(productId, loadedProducts).product,
            selectedColour: colour,
            quantity: 1
        })
    }

    fetch(cartURL, configurationObject)
    .then(function (response) {
        return response.json();
      })
}

function patchProductQuantityInCart(productInCart) {
    const configurationObject = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            quantity: productInCart.quantity
        })
    }

    fetch(`${cartURL}/${productInCart.id}`, configurationObject)
    .then(function (response) {
        return response.json();
      })
}

function findProductById(id, array) {
    return array.find(p => p.id === id);
}

function checkProductInArray(id, array) {
    return array.some(p => p.id === id);
}

// *** CREATE FILTERS ***

function createCheckBoxAndLabel(value, labelText, searchKey) {
    // labelText: string, value: string
    // return: a div element containing a checkbox with value=value, and a label for the checkbox with innerText=value
    if (typeof value === "string"){
        value = value.toLowerCase()
    }

    // create checkbox
    const checkbox = document.createElement("input");
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

    //addFilterCheckboxEventListener(checkbox, searchKey, value, this.checked);

    // create label
    const label = document.createElement("label");
    
    // change label to titlecase if it's a brand or in all lowercase
    //label.innerHTML = labelText;
    label.innerHTML = searchKey !== strings.productColours || searchKey === strings.brand || labelText === labelText.toLowerCase() ? labelText.toTitleCase() : labelText;
    label.for = value;

    // create container and append checkbox + label
    const container = document.createElement("div");
    container.appendChild(checkbox);
    container.appendChild(label);

    return container;

}

function populateFilterContainer(filterContainer, filterValues, title, key) {
    // filterContainer: element to which to append children, array: array of filter values
    // populate the filter container with filter checkboxes and labels
    // return: none

    removeAllChildElements(filterContainer);

    const h2 = document.createElement("h2");
    h2.textContent = title.toTitleCase();
    filterContainer.appendChild(h2);

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
                label = `
                    ${svgCircle(filterValue.hexCode)}
                    ${filterValue.colourName.toTitleCase()}
                    `;
                break;
            default:
                label = filterValue;
                break;
        }
        filterContainer.appendChild(createCheckBoxAndLabel(filterValue, label, key))
    })
    
}

// *** FILTER FUNCTIONS ***

function showOrHideFilteredProductCards() {
    const checkedBoxesCount = countCheckedBoxes();
    loadedProducts.forEach(e => {
        // display cards if the product meets the criteria
        // if
        if ((e.tagCriteriaMet === checkedBoxesCount.tagFilters && ((checkedBoxesCount.brandFilters > 0 && e.brandCriteriaMet) || checkedBoxesCount.brandFilters === 0)) && ((checkedBoxesCount.priceFilters > 0 && e.priceCriteriaMet) || checkedBoxesCount.priceFilters === 0) && ((checkedBoxesCount.colourFilters > 0 && e.colourCriteriaMet) || checkedBoxesCount.colourFilters === 0)) {  
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
        const productValue = productObject.product[key];
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
                    const hexCode = c.hex_value;
                    const colour = determineColourRange(hexCode);
                    if (colour.colourName === value.colourName.toLowerCase()) {
                        changeCriteriaMet(productObject, checked, strings.productColours);
                    }
                })
                break;
            case strings.price:
                // check if product price matches the price range
                const priceIndex = checkPriceIndex(value);
                const floatPrices = prices.toFloat();
                switch (priceIndex){
                    case 0:
                        if (productValue < floatPrices[1]) {
                            changeCriteriaMet(productObject, checked, strings.price);
                        }
                        break;
                    case prices.length-1:
                        if (productValue >= floatPrices[prices.length-1]) {
                            changeCriteriaMet(productObject, checked, strings.price);
                        }
                        break;
                    default:
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
    return {
        "brandFilters": getCheckedCheckboxesLength(classNames.brandCheckbox),
        "tagFilters": getCheckedCheckboxesLength(classNames.tagCheckbox),
        "priceFilters": getCheckedCheckboxesLength(classNames.priceCheckbox),
        "colourFilters": getCheckedCheckboxesLength(classNames.colourCheckbox),
    };

}

function getCheckedCheckboxesLength(className) {
    return document.querySelectorAll(`.${className}:checked`).length
}

function determineColourRange(hex) {
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
    populateFilterContainer(divBrandFilter, filterLists.brands, "brands", strings.brand);
    populateFilterContainer(divTagFilter, filterLists.tags, "tags", strings.tagList);
    populateProductContainer(testValues);
    populateFilterContainer(divPriceFilter, prices, "price", strings.price);
    populateFilterContainer(divColourFilter, Object.values(productColours), "colours", strings.productColours);

}

addCategorySelectorEventListener(btnsCategorySelector);

test();