// variables
const allProductTypes = ["blush", "bronzer", "eyebrow", "eyeliner", "eyeshadow", "foundation", "lip_liner", "lipstick", "mascara", "nail_polish"]
const placeholderProductValues = {
    brand: "Uncle Joe's",
    image: "./images/cosmetics.png",
    name: "Freshest",
    price: "0.00"
}

// query selectors
const divProductContainer = document.querySelector("#product-container");
const btnsCategorySelector = document.querySelectorAll(".category-selector");
const divBrandFilter = document.querySelector("#brand-filter");
const divTagFilter = document.querySelector("#tag-filter");

// add event listener to each category selector button
btnsCategorySelector.forEach(cs => {cs.addEventListener("click", async function() {
    // get array of product objects
    const products = await fetchProductsByTypeOrCategory(cs.value)
    // create and add product cards
    populateProductContainer(products);

    const filterLists = getFilterLists(products);
    populateFilterContainer(divBrandFilter, filterLists.brands, "brands");
    populateFilterContainer(divTagFilter, filterLists.tags, "tags");
})});

function toTitleCase(string) {
    // string: string to convert
    // return: the string in title case

    // lowercase the string and split it into words
    const split = string.toLowerCase().split(" ");
    return split.reduce((p, c) => {
        // previous word + space + first letter of current word capitalised + rest of current word
        return (p + " " + c[0].toUpperCase() + c.substring(1)).trim();
    }, "")
}

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

function getFilterLists(products) {
    // products: array of product objects
    // return: an object containing arrays of brands, tags of products
    
    // the arrays of brands and tags
    const [brands, tags] = [[], []];

    // iterate through each product
    products.forEach((product) => {
        const pBrand = product.brand ? toTitleCase(product.brand) : null;
        const pTags = product.tag_list;
        // add non-null and unique brands
        if (pBrand && !brands.includes(pBrand)) {
            brands.push(pBrand);
        }
        //add unique tags
        pTags.forEach((t) => {
            if (t && !tags.includes(toTitleCase(t))) {
                tags.push(toTitleCase(t));
            }
        })
    })
    return {
        brands: brands.sort(),
        tags: tags.sort()
    };
}

function createProductCard(image, brand, name, price) {
    // image: string url, brand: string, name: string, price: string decimal number
    // return: product card div element

    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
        <img class="product-image" src="${image}">
        <span class="product-brand">${brand ? brand.toUpperCase() : placeholderProductValues.brand}</span>
        <span class="product-name">${name}</span>
        <span class="product-price">$${price}</span>
        <button class="add-to-cart-button">ADD TO CART</button>
    `
    return card;
}

function populateProductContainer(products) {
    // products: array of product objects
    // remove previous cards, generate new cards and append them to the product container
    // return: none

    // remove all cards on page
    removeAllChildElements(divProductContainer);

    // create and append cards
    products.forEach(product => {
        const card = createProductCard(product.image_link, product.brand, product.name, product.price);
        divProductContainer.appendChild(card);
        addProductImageErrorListenerToLast(placeholderProductValues.image);
    })
}

function addProductImageErrorListenerToLast(placeholder) {
    const productImages = document.querySelectorAll(".product-image");
    const productImagesLast = productImages[productImages.length - 1];
    productImagesLast.addEventListener("error", () => productImagesLast.src = placeholder);
}

function createCheckBoxAndLabel(value, labelText) {
    // labelText: string, value: string
    // return: a div element containing a checkbox with value=value, and a label for the checkbox with innerText=value
    
    value = value.toLowerCase()

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = value;
    checkbox.name = value;

    const label = document.createElement("label");
    label.for = value;
    label.innerText = toTitleCase(labelText);

    const container = document.createElement("div");
    container.appendChild(checkbox);
    container.appendChild(label);

    return container;

}

function populateFilterContainer(filterContainer, array, title) {
    removeAllChildElements(filterContainer);
    const h2 = document.createElement("h2");
    h2.textContent = toTitleCase(title);
    filterContainer.appendChild(h2);
    array.forEach(e => {
        filterContainer.appendChild(createCheckBoxAndLabel(e, e))
    })
}

function removeAllChildElements(parent) {
    let child = parent.lastElementChild;
    while (child) {
        parent.removeChild(child);
        child = parent.lastElementChild;
    }
}