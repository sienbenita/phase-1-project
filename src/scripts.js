const divProductContainer = document.querySelector("#product-container");
const btnFoundation = document.querySelectorAll(".category-selector");
btnFoundation[0].addEventListener("click", async function() {
    const products = await fetchProductsByType(btnFoundation[0].textContent)
    populateProductContainer(products);
});

function toTitleCase(string) {
    const split = string.split(" ");
    return split.reduce((p, c) => {
        return p + " " + c[0].toUpperCase() + c.substring(1);
    }, "")
}

async function fetchProductsByType (productType) {
    const response = await fetch(`https://makeup-api.herokuapp.com/api/v1/products.json?product_type=${productType}`);
    const data = await response.json();
    return data;
}

function getFilterLists(data) {
    const [brands, tags] = [[], []];
    data.forEach((e) => {
        const eBrand = e.brand;
        const eTags = e.tag_list;
        if (eBrand && !brands.includes(eBrand)) {
            brands.push(toTitleCase(eBrand));
        }
        eTags.forEach((t) => {
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
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
        <img class="product-image" src="${image}">
        <span class="product-brand">${brand}</span>
        <span class="product-name">${name}</span>
        <span class="product-price">$${price}</span>
        <button class="add-to-cart-button">ADD TO CART</button>
    `
    return card;
}

function populateProductContainer(data) {
    data.forEach(product => {
        const card = createProductCard(product.image_link, product.brand, product.name, product.price);
        divProductContainer.appendChild(card);
    })
}