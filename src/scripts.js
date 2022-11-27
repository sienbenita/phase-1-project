// list of all possible values of the 'product_type' key
const selectionTypes = ["blush", "bronzer", "eyebrow", "eyeliner", "eyeshadow", "foundation", "lip_liner", "lipstick", "mascara", "nail_polish"]

// query selectors
const divProductContainer = document.querySelector("#product-container");
const btnsCategorySelector = document.querySelectorAll(".category-selector");

// add event listener to each category selector button
btnsCategorySelector.forEach(cs => {cs.addEventListener("click", async function() {
    // get array of product objects
    const products = await fetchProductsByTypeOrCategory(cs.value)
    // create and add product cards
    populateProductContainer(products);
})});

function toTitleCase(string) {
    // string: string to convert
    // convert the string to Title Case

    // lowercase the string and split it into words
    const split = string.toLowercase().split(" ");
    return split.reduce((p, c) => {
        // previous word + space + first letter of current word capitalised + rest of current word
        return p + " " + c[0].toUpperCase() + c.substring(1);
    }, "")
}

async function fetchProductsByTypeOrCategory (searchTerm) {
    // searchTerm: string to search
    // fetch from API the products matching the type or category
    // return: array of product objects

    let response;
    // if searchTerm is in the list of product types, use 'product_type' key
    if (selectionTypes.includes(searchTerm)){    
        response = await fetch(`https://makeup-api.herokuapp.com/api/v1/products.json?product_type=${searchTerm}`);
    } 
    // otherwise use the 'category' key
    else {
        response = await fetch(`https://makeup-api.herokuapp.com/api/v1/products.json?product_category=${searchTerm}`);
    }

    const products = await response.json();
    return products;
}

function getFilterLists(products) {
    // products: array of product objects
    // return an object containing arrays of brands, tags of current selection
    
    // the arrays of brands and tags
    const [brands, tags] = [[], []];

    // iterate through each product
    products.forEach((product) => {
        const pBrand = product.brand;
        const pTags = product.tag_list;
        // add non-null and unique brands
        if (pBrand && !brands.includes(pBrand)) {
            brands.push(toTitleCase(pBrand));
        }
        // add unique tags
        pTags.forEach((t) => {
            if (!tags.includes(t)) {
                tags.push(toTitleCase(t));
            }
        })
    })
    return {
        brands: brands,
        tags: tags
    };
}

function createProductCard(image, brand, name, price) {
    // image: string url, brand: string, name: string, price: string decimal number
    // create and return product card

    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
        <img class="product-image" src="${image}">
        <span class="product-brand">${brand.toUpperCase()}</span>
        <span class="product-name">${name}</span>
        <span class="product-price">$${price}</span>
        <button class="add-to-cart-button">ADD TO CART</button>
    `
    return card;
}

function populateProductContainer(products) {
    // products: array of product objects
    // remove previous cards, generate new cards and append them to the product container

    // remove all cards on page
    var child = divProductContainer.lastElementChild; 
    while (child) {
        divProductContainer.removeChild(child);
        child = divProductContainer.lastElementChild;
    }

    // create and append cards
    products.forEach(product => {
        const card = createProductCard(product.image_link, product.brand, product.name, product.price);
        divProductContainer.appendChild(card);
    })
}