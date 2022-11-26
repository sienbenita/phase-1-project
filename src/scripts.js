async function test () {
    const response = await fetch("https://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline");
    const data = await response.json();
    console.log(data.json())
}
