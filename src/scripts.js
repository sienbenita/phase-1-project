// variables
const allProductTypes = ["blush", "bronzer", "eyebrow", "eyeliner", "eyeshadow", "foundation", "lip_liner", "lipstick", "mascara", "nail_polish"]
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
        tag_list: ["vegan", "amazing"]
    }, 
    {
        brand: "Uncle Daniel's",
        image_link: "./images/cosmetics.png",
        name: "Dankest",
        price: "50.00",
        tag_list: ["full gmo", "beautiful"]
    }
]

const strings = {
    "productCardDisplay": "flex",
    "none": "none",
    "brand": "brand",
    "tagList": "tag_list"
}

// array of objects: 
// {
//     card: element, 
//     product: object,
//     brandCriteriaMet: boolean,
//     criteriaMet: number
// }
let loadedProducts = [];

// query selectors
const divProductContainer = document.querySelector("#product-container");
const btnsCategorySelector = document.querySelectorAll(".category-selector");
const divBrandFilter = document.querySelector("#brand-filter");
const divTagFilter = document.querySelector("#tag-filter");

// event listeners

// navbar category selectors
btnsCategorySelector.forEach(cs => {cs.addEventListener("click", async function() {
    // get array of product objects
    const products = await fetchProductsByTypeOrCategory(cs.value)
    // create and add product cards
    populateProductContainer(products);

    const filterLists = getFilterLists(products);
    populateFilterContainer(divBrandFilter, filterLists.brands, "brands", strings.brand);
    populateFilterContainer(divTagFilter, filterLists.tags, "tags", strings.tagList);
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

function arrayToLowerCase(array) {
    return array.map(e => {
        return e.toLowerCase();
    })
}

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

function addToLoadedProducts(card, product) {
    // card: element, product: object
    // create an object containing the card and product and push it to the loadedObjects array
    // return: none

    const productObject = {
        "card": card,
        "product": product,
        "brandCriteriaMet": false,
        "criteriaMet": 0
    }
    loadedProducts.push(productObject);
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
    loadedProducts = [];
    removeAllChildElements(divProductContainer);

    // create and append cards
    products.forEach(product => {
        const card = createProductCard(product.image_link, product.brand, product.name, product.price);
        divProductContainer.appendChild(card);
        addProductImageErrorListenerToLast(placeholderProductValues.image_link);
        addToLoadedProducts(card, product);
    })
}



function createCheckBoxAndLabel(value, labelText, category) {
    // labelText: string, value: string
    // return: a div element containing a checkbox with value=value, and a label for the checkbox with innerText=value
    
    value = value.toLowerCase()

    // create checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = value;
    checkbox.name = value;
    if (category === strings.brand){
        checkbox.classList.add("brand-checkbox");
    } else {
        checkbox.classList.add("other-filter-checkbox");
    }

    // add checkbox event listener
    checkbox.addEventListener('change', function() {
        checkedBoxesCount = countCheckedBoxes();
        if (checkedBoxesCount.brandFilters + checkedBoxesCount.otherFilters === 1) {
            changeDisplayOfAllProductCards("none");
        }
        filterProducts(category, value, this.checked);
        if (checkedBoxesCount.brandFilters + checkedBoxesCount.otherFilters === 0) {
            changeDisplayOfAllProductCards(strings.productCardDisplay);
        }
    })

    // create label
    const label = document.createElement("label");
    label.for = value;
    label.innerText = toTitleCase(labelText);

    // create container and append checkbox + label
    const container = document.createElement("div");
    container.appendChild(checkbox);
    container.appendChild(label);

    return container;

}

function populateFilterContainer(filterContainer, array, title, key) {
    // filterContainer: element to which to append children, array: array of filter values
    // populate the filter container with filter checkboxes and labels
    // return: none

    removeAllChildElements(filterContainer);

    const h2 = document.createElement("h2");
    h2.textContent = toTitleCase(title);
    filterContainer.appendChild(h2);

    // create and append filter checkboxes and labels
    array.forEach(e => {
        filterContainer.appendChild(createCheckBoxAndLabel(e, e, key)) // the value and label text are the same
    })
}

function filterProducts(key, value, checked) {

    // determine if products match the search value
    switch (key){
        case strings.brand:
            loadedProducts.forEach(e => {
                if (e.product[key].toLowerCase() === value.toLowerCase()) {
                    changeCriteriaMet(e, checked, true);
                }
            })
            break;
        case strings.tagList:
            loadedProducts.forEach(e => {
                if (arrayToLowerCase(e.product[key]).includes(value.toLowerCase())) {
                    changeCriteriaMet(e, checked);
                }
            })
            break;
    }


    const checkedBoxesCount = countCheckedBoxes();
    loadedProducts.forEach(e => {
        if (e.criteriaMet === checkedBoxesCount.otherFilters && ((checkedBoxesCount.brandFilters > 0 && e.brandCriteriaMet) || checkedBoxesCount.brandFilters === 0)) {
            e.card.style.display = strings.productCardDisplay;
        } else {
            e.card.style.display = strings.none;
        }
        
    })
}

function changeCriteriaMet (product, checked, brand = false) {
    if (brand) {
        product.brandCriteriaMet = checked;
    } else {
        if (checked) { 
            product.criteriaMet++;
        } else {
            product.criteriaMet--;
        }
    } 
}

function changeDisplayOfAllProductCards(display) {
    loadedProducts.forEach(e => {e.card.style.display = display});
}

function countCheckedBoxes() {
    return {
        "brandFilters": document.querySelectorAll(".brand-checkbox:checked").length,
        "otherFilters": document.querySelectorAll(".other-filter-checkbox:checked").length
    };

}

function test(){
    const filterLists = getFilterLists(testValues);
    populateFilterContainer(divBrandFilter, filterLists.brands, "brands", strings.brand);
    populateFilterContainer(divTagFilter, filterLists.tags, "tags", strings.tagList);
    populateProductContainer(testValues);
}

test();