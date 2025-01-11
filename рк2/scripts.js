// Загружаем массив пользователей из локального хранилища
let users = JSON.parse(localStorage.getItem('users')) || [];

// Загружаем текущего пользователя
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Элементы на странице
const productList = document.getElementById('product-list');
const modal = document.getElementById('product-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description-text');
const modalPrice = document.getElementById('modal-price');
const modalQuantity = document.getElementById('modal-quantity');
const closeModal = document.getElementById('close-modal');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const totalPrice = document.getElementById('total-price');


function fetchProducts() {
    fetch('http://localhost/getProducts.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Сервер вернул ошибку: ' + response.status);
            }

            // Логируем ответ от сервера как текст
            return response.text();  // Преобразуем в текст, чтобы увидеть полный ответ
        })
        .then(responseText => {
            console.log('Ответ от сервера как текст:', responseText);  // Выводим текст в консоль
            try {
                const products = JSON.parse(responseText);  // Пытаемся парсить как JSON
                console.log('Продукты получены с сервера:', products);
                if (Array.isArray(products)) {
                    renderProducts(products);
                } else {
                    console.error("Не удалось получить продукты.");
                }
            } catch (error) {
                console.error('Ошибка при парсинге JSON:', error);
            }
        })
        .catch(error => {
            console.error('Ошибка при загрузке продуктов:', error);  // Логируем ошибку
        });
    }

// Функция для отображения продуктов на странице магазина
function renderProducts(products) {
    if (!productList) return;  // Проверка на наличие элемента с id 'product-list'

    productList.innerHTML = '';  // Очищаем текущий список продуктов

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <p>${product.name}</p>
            <p>Цена: ${product.price} руб.</p>
        `;

        productDiv.onclick = () => showProductDetails(product);  // Открытие модального окна

        productList.appendChild(productDiv);
    });
}

// Функция для отображения подробной информации о продукте в модальном окне
function showProductDetails(product) {
    if (!modal) return;  // Проверка на наличие модального окна

    modal.style.display = "block";
    modalImage.src = product.image;
    modalTitle.textContent = product.name;
    modalDescription.textContent = product.description;
    modalPrice.textContent = product.price;
    modalQuantity.textContent = product.quantity;

    const addToCartButton = document.getElementById('add-to-cart-btn');
    if (addToCartButton) {
        addToCartButton.onclick = () => addToCart(product);  // Добавление товара в корзину
    }
}

// Закрытие модального окна
if (closeModal) {
    closeModal.onclick = () => {
        modal.style.display = "none";
    };
}

// Закрытие модального окна при клике вне его
window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Инициализация отображения продуктов при загрузке страницы магазина
if (window.location.pathname.includes('shop.html')) {
    fetchProducts();  // Загружаем продукты с сервера
}

function addToCart(product) {
    if (!product) return; // Проверка на наличие продукта

    if (!currentUser) { 
        // Если пользователь не авторизован
        alert('Пожалуйста, войдите в систему, чтобы добавить товар в корзину.');
        return; // Прерываем выполнение функции
    }

    // Проверка, чтобы количество товара не превышало доступное
    const cart = JSON.parse(localStorage.getItem(`cart_${currentUser.username}`)) || [];
    const existingProductIndex = cart.findIndex(item => item.name === product.name);
    
    // Определяем количество товара, которое пользователь хочет добавить
    let quantityToAdd = 1;
    if (existingProductIndex !== -1) {
        quantityToAdd = cart[existingProductIndex].quantity + 1;
    }

    // Проверяем, что в корзине не больше товаров, чем доступно
    if (quantityToAdd > product.quantity) {
        alert(`Извините, в наличии только ${product.quantity} единиц товара.`);
        return; // Прерываем выполнение функции, если превышено количество
    }

    // Если товар еще не в корзине, добавляем его
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1; // Увеличиваем количество товара в корзине
    } else {
        cart.push({ ...product, quantity: 1 }); // Добавляем новый товар в корзину
    }

    // Сохраняем корзину в локальное хранилище с ключом по имени пользователя
    localStorage.setItem(`cart_${currentUser.username}`, JSON.stringify(cart));

    updateCartCount(); // Обновляем счетчик товаров
    if (modal) {
        modal.style.display = "none"; // Закрываем модальное окно
    }
}



// Удаление товара из корзины
function removeFromCart(productName) {
    if (!currentUser) return; // Проверка на авторизованного пользователя

    let cart = JSON.parse(localStorage.getItem(`cart_${currentUser.username}`)) || [];
    cart = cart.filter(item => item.name !== productName); // Убираем товар из корзины

    // Сохраняем обновленную корзину в локальное хранилище
    localStorage.setItem(`cart_${currentUser.username}`, JSON.stringify(cart));

    updateCart(); // Обновляем корзину
}

// Обновление отображения корзины
function updateCart() {
    if (!currentUser) return; // Проверка на авторизованного пользователя

    let cart = JSON.parse(localStorage.getItem(`cart_${currentUser.username}`)) || [];

    updateCartCount(); // Обновляем счетчик товаров на всех страницах
    renderCartItems(cart); // Отображаем товары в корзине
}

// Функция для обновления счетчика товаров в корзине
function updateCartCount() {
    if (cartCount && currentUser) {
        const cart = JSON.parse(localStorage.getItem(`cart_${currentUser.username}`)) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); // Суммируем количество всех товаров
        cartCount.textContent = totalItems; // Обновляем количество товаров в корзине
    }
}


// Отображение товаров в корзине
function renderCartItems(cart) {
    if (!cartItems || !totalPrice) return; // Проверка на наличие нужных элементов

    cartItems.innerHTML = ''; // Очищаем корзину

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Ваша корзина пуста.</p>';
        totalPrice.textContent = 0; // Если корзина пуста, итоговая сумма 0
    } else {
        let total = 0;
        cart.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML =
                `<p>${item.name} x ${item.quantity}</p>
                <p>Цена: ${item.price} руб.</p>
                <button class="remove-item-btn" onclick="removeFromCart('${item.name}')">Удалить</button>
            `;
            cartItems.appendChild(cartItemDiv);

            total += item.price * item.quantity; // Считаем итоговую цену
        });
        totalPrice.textContent = total; // Обновляем итоговую сумму
    }
}

// Регистрация
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const newUsername = document.getElementById('new-username').value;
        const newPassword = document.getElementById('new-password').value;

        if (users.find(user => user.username === newUsername)) {
            alert('Пользователь с таким именем уже существует!');
            return;
        }

        users.push({ username: newUsername, password: newPassword });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Регистрация прошла успешно!');
        location.href = 'auth.html';
    });
}

// Событие авторизации
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            alert('Вы успешно вошли в систему!');
            localStorage.setItem('currentUser', JSON.stringify(user)); // Сохраняем текущего пользователя
            location.href = 'index.html';
        } else {
            alert('Неверный логин или пароль');
        }
    });
}

// Событие выхода из аккаунта
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
        localStorage.removeItem('currentUser');
        alert('Вы вышли из аккаунта');
        location.href = 'auth.html';
    });
}

function updateHeader() {
    const authLink = document.getElementById('auth-link');
    const logoutBtn = document.getElementById('logout-btn');
    const username = currentUser ? currentUser.username : 'Гость'; // Получаем имя пользователя или 'Гость'

    if (authLink) {
        if (currentUser) {
            authLink.textContent = `Привет, ${username}`; // Отображаем имя пользователя
            authLink.href = 'auth.html'; // Ссылка на страницу входа
        } else {
            authLink.textContent = 'Войти'; // Если не авторизован, показываем "Войти"
            authLink.href = 'auth.html'; // Ссылка на страницу входа
        }
    }

    if (logoutBtn) {
        if (currentUser) {
            logoutBtn.style.display = 'block'; // Показываем кнопку выхода
            logoutBtn.addEventListener('click', function () {
                localStorage.removeItem('currentUser');
                alert('Вы вышли из аккаунта');
                location.href = 'auth.html';
            });
        } else {
            logoutBtn.style.display = 'none'; // Скрываем кнопку выхода, если не авторизован
        }
    }
}

// Проверка состояния авторизации при загрузке страницы
window.onload = function () {
    updateHeader();
    updateCartCount(); // Обновляем счетчик корзины
    if (currentUser) {
        updateCart();
    }
};



// Инициализация отображения товаров при загрузке страницы магазина
if (window.location.pathname.includes('shop.html')) {
    renderProducts();
}

// Инициализация отображения товаров в корзине при загрузке страницы корзины
if (window.location.pathname.includes('cart.html')) {
    if (currentUser) {
        renderCartItems(JSON.parse(localStorage.getItem(`cart_${currentUser.username}`)) || []); // Отображаем товары, если пользователь авторизован
    } else {
        cartItems.innerHTML = '<p>Пожалуйста, войдите в систему, чтобы увидеть корзину.</p>';
        totalPrice.textContent = 0;
    }
}
// Функция для отображения формы обратной связи, если пользователь авторизован
function showFeedbackForm() {
    const feedbackForm = document.getElementById('feedback-form');
    const feedbackWarning = document.getElementById('feedback-warning');

    if (currentUser) {
        feedbackForm.style.display = 'block';  // Показываем форму
        feedbackWarning.style.display = 'none';  // Скрываем предупреждение
    } else {
        feedbackForm.style.display = 'none';  // Скрываем форму
        feedbackWarning.style.display = 'block';  // Показываем предупреждение
    }
}

// Обработчик отправки формы обратной связи
const feedbackForm = document.getElementById('feedback-form');
if (feedbackForm) {
    feedbackForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const message = document.getElementById('feedback-message').value;
        
        // Обработка сообщения
        alert('Ваше сообщение отправлено: ' + message);
        // Здесь можно добавить логику для отправки данных на сервер или сохранения в локальное хранилище
    });
}

// Проверка состояния авторизации при загрузке страницы
window.onload = function () {
    updateHeader(); // Обновляем хедер
    updateCartCount(); // Обновляем счетчик корзины
    showFeedbackForm(); // Показываем форму обратной связи, если пользователь авторизован
};
