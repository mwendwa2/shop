// JavaScript Code
let totalSales = 0;
let totalProfit = 0;
let editIndex = -1;
let logs = [];
let currentLogIndex = -1;
let products = [];

function showSection(section) {
    document.getElementById('sales-tracker').style.display = 'none';
    document.getElementById('product-management').style.display = 'none';
    document.getElementById('analytics-dashboard').style.display = 'none';
    document.getElementById(section).style.display = 'block';

    document.getElementById('sales-tracker-btn').classList.remove('active');
    document.getElementById('product-management-btn').classList.remove('active');
    document.getElementById('analytics-dashboard-btn').classList.remove('active');
    
    if (section === 'sales-tracker') {
        document.getElementById('sales-tracker-btn').classList.add('active');
    } else if (section === 'product-management') {
        document.getElementById('product-management-btn').classList.add('active');
    } else if (section === 'analytics-dashboard') {
        document.getElementById('analytics-dashboard-btn').classList.add('active');
        renderCharts();
    }
}

function addProduct() {
    const product = document.getElementById('sidebar-product').value;
    const buyingPrice = document.getElementById('buying-price').value;
    const sellingPrice = document.getElementById('selling-price').value;
    const initialQuantity = document.getElementById('initial-quantity').value;

    if (product && buyingPrice && sellingPrice && initialQuantity) {
        const productObj = {
            name: product,
            buyingPrice: parseFloat(buyingPrice),
            sellingPrice: parseFloat(sellingPrice),
            quantity: parseInt(initialQuantity)
        };

        if (editIndex > -1) {
            products[editIndex] = productObj;
            editIndex = -1;
        } else {
            products.push(productObj);
        }

        updateProductList();
        clearProductForm();
    } else {
        alert('Please fill in all fields');
    }
}

function updateProductList() {
    const productSelect = document.getElementById('product');
    const productList = document.getElementById('product-list');
    
    productSelect.innerHTML = '';
    productList.innerHTML = '';

    products.forEach((product, index) => {
        const option = document.createElement('option');
        option.value = product.name;
        option.textContent = product.name;
        productSelect.appendChild(option);

        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span><strong>Product:</strong> ${product.name}</span>
            <span><strong>Buying Price:</strong> KSH ${product.buyingPrice}</span>
            <span><strong>Selling Price:</strong> KSH ${product.sellingPrice}</span>
            <span><strong>Quantity:</strong> ${product.quantity}</span>
            <div class="actions">
                <button class="edit" onclick="editProduct(${index})">Edit</button>
                <button class="delete" onclick="deleteProduct(${index})">Delete</button>
            </div>
        `;
        productList.appendChild(listItem);
    });
}

function clearProductForm() {
    document.getElementById('sidebar-product').value = '';
    document.getElementById('buying-price').value = '';
    document.getElementById('selling-price').value = '';
    document.getElementById('initial-quantity').value = '';
    document.querySelector('button[onclick="addProduct()"]').textContent = 'Add Product';
    editIndex = -1;
}

function editProduct(index) {
    const product = products[index];
    document.getElementById('sidebar-product').value = product.name;
    document.getElementById('buying-price').value = product.buyingPrice;
    document.getElementById('selling-price').value = product.sellingPrice;
    document.getElementById('initial-quantity').value = product.quantity;

    document.querySelector('button[onclick="addProduct()"]').textContent = 'Update Product';
    editIndex = index;
}

function deleteProduct(index) {
    products.splice(index, 1);
    updateProductList();
}

function addSale() {
    const productSelect = document.getElementById('product');
    const productName = productSelect.value;
    const quantity = parseInt(document.getElementById('quantity').value);

    const product = products.find(p => p.name === productName);

    if (product && quantity > 0 && quantity <= product.quantity) {
        const saleAmount = product.sellingPrice * quantity;
        const profit = (product.sellingPrice - product.buyingPrice) * quantity;

        totalSales += saleAmount;
        totalProfit += profit;

        product.quantity -= quantity;
        updateProductList();

        const sale = {
            product: productName,
            quantity: quantity,
            amount: saleAmount,
            profit: profit
        };
        
        logs.push(sale);
        updateLog();
        document.getElementById('total-sales').textContent = totalSales.toFixed(2);
        document.getElementById('total-profit').textContent = totalProfit.toFixed(2);
        document.querySelector('button[onclick="addSale()"]').textContent = 'Add Sale';
        clearSaleForm();
    } else {
        alert('Please enter a valid quantity');
    }
}

function clearSaleForm() {
    document.getElementById('quantity').value = '';
    document.getElementById('product').value = '';
}

function updateLog() {
    const log = document.getElementById('log');
    log.innerHTML = '';

    logs.forEach((sale, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span><strong>Product:</strong> ${sale.product}</span>
            <span><strong>Quantity Sold:</strong> ${sale.quantity}</span>
            <span><strong>Sale Amount:</strong> KSH ${sale.amount.toFixed(2)}</span>
            <span><strong>Profit:</strong> KSH ${sale.profit.toFixed(2)}</span>
            <div class="actions">
                <button class="edit" onclick="editSale(${index})">Edit</button>
                <button class="delete" onclick="deleteSale(${index})">Delete</button>
            </div>
        `;
        log.appendChild(listItem);
    });
}

function editSale(index) {
    const sale = logs[index];
    document.getElementById('product').value = sale.product;
    document.getElementById('quantity').value = sale.quantity;

    document.querySelector('button[onclick="addSale()"]').textContent = 'Update Sale';
    editIndex = index;
}

function deleteSale(index) {
    const sale = logs[index];
    totalSales -= sale.amount;
    totalProfit -= sale.profit;

    document.getElementById('total-sales').textContent = totalSales.toFixed(2);
    document.getElementById('total-profit').textContent = totalProfit.toFixed(2);

    const product = products.find(p => p.name === sale.product);
    if (product) {
        product.quantity += sale.quantity;
        updateProductList();
    }

    logs.splice(index, 1);
    updateLog();
}

function createNewLog() {
    logs = [];
    totalSales = 0;
    totalProfit = 0;

    document.getElementById('total-sales').textContent = '0';
    document.getElementById('total-profit').textContent = '0';
    updateLog();
}

function switchLog() {
    const logSelector = document.getElementById('log-selector');
    const selectedLogIndex = logSelector.selectedIndex;

    if (selectedLogIndex !== currentLogIndex) {
        currentLogIndex = selectedLogIndex;
        logs = [];
        updateLog();
    }
}

function renderCharts() {
    const salesCtx = document.getElementById('sales-chart').getContext('2d');
    const profitCtx = document.getElementById('profit-chart').getContext('2d');

    const salesData = logs.map(log => log.amount);
    const profitData = logs.map(log => log.profit);
    const labels = logs.map((log, index) => `Sale ${index + 1}`);

    new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sales Amount (KSH)',
                data: salesData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    new Chart(profitCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Profit (KSH)',
                data: profitData,
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: false,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    showSection('sales-tracker');
});
