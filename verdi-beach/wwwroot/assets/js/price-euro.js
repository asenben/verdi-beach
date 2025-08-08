function renderPrices() {
    const euroRate = 1.96; // Смени курса, ако трябва
    document.querySelectorAll('.item-price').forEach(span => {
        const priceBGN = Number(span.dataset.price);
        const priceEUR = (priceBGN / euroRate).toFixed(2);
        span.textContent = `${priceBGN} лв (${priceEUR} €)`;
    });
}
renderPrices();
