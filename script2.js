document.addEventListener('DOMContentLoaded', () => {
    displayOrders(); // Отображаем заказы при загрузке страницы
});

// Функция для отображения заказов
function displayOrders() {
    const ordersList = document.getElementById('orders-list');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    if (orders.length === 0) {
        ordersList.innerHTML = '<tr><td colspan="6">Нет заказов.</td></tr>';
        return;
    }

    

    // Очистка списка перед добавлением новых заказов
    ordersList.innerHTML = '';

    // Добавление заголовка таблицы
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Номер</th>
        <th>Дата оформления</th>
        <th>Состав заказа</th>
        <th>Стоимость</th>
        <th>Время доставки</th>
        <th>Действия</th>
    `;
    ordersList.appendChild(headerRow);

    // Проходим по каждому заказу и создаем строки таблицы
    orders.forEach((order, index) => {
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('order-item');

        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleString();

        const deliveryTime = order.formData.delivery_time || 'Как можно скорее';
        const totalCostText = calculateTotalCost(order.dishes);

        // Формируем список названий блюд
        const dishes = order.dishes;
        const dishNames = [];
        let totalCost = 0;

        for (const dishType in dishes) {
            if (dishes[dishType] && dishes[dishType].name) {
                dishNames.push(dishes[dishType].name);
                totalCost += dishes[dishType].price || 0;
            } else if (dishes[dishType]) {
                dishNames.push(String(dishes[dishType]));
            }
        }

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${formattedDate}</td>
            <td>Состав: ${dishNames.length > 0 ? dishNames.join(', ') : 'Не указаны блюда'}</td>
            <td>${totalCostText}</td>
            <td>${deliveryTime}</td>
            <td>
                <button class="details-btn" onclick="showOrderDetails(${index})" title="Посмотреть">👁</button>
                <button class="edit-btn" onclick="editOrder(${index})" title="Редактировать">✏️</button>
                <button class="delete-btn" onclick="confirmDeleteOrder(${index})" title="Удалить">🗑️</button>
            </td>
        `;

        ordersList.appendChild(row);
    });
}

function showOrderDetails(index) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders[index];
    const orderDate = new Date(order.date);
    const formattedDate = orderDate.toLocaleString(); 
    const totalCostText = calculateTotalCost(order.dishes);

    const modal = createModal(
        'Детали заказа', 
        generateOrderDetailsContent(order, totalCostText, formattedDate),
        [{ label: 'Ок', onClick: closeModal }]
    );
    document.body.appendChild(modal);
}

function calculateTotalCost(dishes) {
    let totalCost = 0;
    for (const dishType in dishes) {
        if (dishes[dishType] && dishes[dishType].price) {
            totalCost += dishes[dishType].price;
        }
    }
    return totalCost > 0 ? `${totalCost} ₽` : 'Не указана';
}

function generateOrderDetailsContent(order, totalCostText, formattedDate) {
    const selectedDishes = order.dishes || {};
    const soupOrder = selectedDishes.soup ? `${selectedDishes.soup.name} ${selectedDishes.soup.price} ₽` : "Не выбрано";
    const mainOrder = selectedDishes.main ? `${selectedDishes.main.name} ${selectedDishes.main.price} ₽` : "Не выбрано";
    const dessertsOrder = selectedDishes.desserts ? `${selectedDishes.desserts.name} ${selectedDishes.desserts.price} ₽` : "Не выбрано";
    const salatOrder = selectedDishes.salat ? `${selectedDishes.salat.name} ${selectedDishes.salat.price} ₽` : "Не выбрано";
    const drinkOrder = selectedDishes.drink ? `${selectedDishes.drink.name} ${selectedDishes.drink.price} ₽` : "Не выбрано";

    return `
        <p>Время оформления: ${formattedDate || 'Не указано'}</p>
        <h3>Доставка</h3>
        <p>Полное имя: ${order.formData.name || 'Не указано'}</p>
        <p>Адрес доставки: ${order.formData.address || 'Не указан'}</p>
        <p>Время доставки: ${order.formData.delivery_time || 'Как можно скорее'}</p>
        <p>Email: ${order.formData.email || 'Не указано'}</p>
        <p>Телефон: ${order.formData.phone || 'Не указано'}</p>
        <h3>Комментарий</h3>
        <p>Комментарий: ${order.formData.comments || 'Не указан'}</p>
        <h3>Состав заказа</h3>
        <div id="general-status">
            <p><strong>Суп</strong></p>
            <p id="soup-order">${soupOrder}</p> 
            <p><strong>Главное блюдо</strong></p>
            <p id="main-order">${mainOrder}</p>
            <p><strong>Салаты и стартеры</strong></p>
            <p id="salat-order">${salatOrder}</p> 
            <p><strong>Десерты</strong></p>
            <p id="desserts-order">${dessertsOrder}</p> 
            <p><strong>Напиток</strong></p>
            <p id="drink-order">${drinkOrder}</p> 
        </div>
        <h3>Стоимость: ${totalCostText || 'Не указана'}</h3>
    `;
}



// Функция для редактирования заказа
function editOrder(index) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders[index];
    const formattedDate = order.date ? new Date(order.date).toLocaleString() : 'Не указано';
    const modal = createModal('Редактирование заказа', generateOrderEditForm(order, formattedDate), [
        { label: 'Сохранить', onClick: () => saveOrderChanges(index) },
        { label: 'Отмена', onClick: closeModal }
    ]);
    document.body.appendChild(modal);
}


function generateOrderEditForm(order, formattedDate) {
    return `
        <p>Время оформления: ${formattedDate || 'Не указано'}</p>
        <h3>Доставка</h3>
        <label>Полное имя</label><input type="text" id="name" value="${order.formData.name || ''}">
        <label>Адрес доставки</label><input type="text" id="delivery_address" value="${order.formData.address || ''}">
        <label>Время доставки</label><input type="text" id="delivery_time" value="${order.formData.delivery_time || 'Как можно скорее'}">
        <label>Телефон</label><input type="text" id="phone" value="${order.formData.phone || ''}">
        <label>Email</label><input type="email" id="email" value="${order.formData.email || ''}">
        <h3>Комментарий</h3><textarea id="comment">${order.formData.comments || ''}</textarea>
        
    `;
}

// Функция для сохранения изменений заказа
function saveOrderChanges(index) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders[index];

    // Получаем значения из полей редактирования
    const updatedOrder = {
        ...order,
        formData: {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('delivery_address').value,
            delivery_time: document.getElementById('delivery_time').value,
            comments: document.getElementById('comment').value,
        }
    };

    // Обновляем заказ в массиве
    orders[index] = updatedOrder;

    // Сохраняем изменения в localStorage
    localStorage.setItem('orders', JSON.stringify(orders));

    // Обновляем отображение заказов на странице
    displayOrders();

    // Закрываем модальное окно
    closeModal();

    // Оповещаем пользователя
    alert('Изменения сохранены');
}


function createModal(title, content, buttons) {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <h2>${title}</h2>
            <div class="modal-body">${content}</div>
            <div class="modal-footer"></div>
        </div>
    `;

    const footer = modal.querySelector('.modal-footer');

    buttons.forEach(button => {
        const btn = document.createElement('button');
        btn.textContent = button.label;
        btn.addEventListener('click', button.onClick);
        footer.appendChild(btn);
    });

    modal.querySelector('.close-btn').addEventListener('click', closeModal);

    document.body.appendChild(modal);

    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.position = 'fixed';
    modalContent.style.top = '50%';
    modalContent.style.left = '50%';
    modalContent.style.transform = 'translate(-50%, -50%)';
    modalContent.style.backgroundColor = '#fff'; // Устанавливаем белый фон
    modalContent.style.padding = '20px'; // Добавляем внутренний отступ
    modalContent.style.borderRadius = '8px'; // Закругляем углы

    return modal;
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

function confirmDeleteOrder(index) {
    const modal = createModal('Подтверждение удаления', '<p>Вы уверены, что хотите удалить заказ?</p>', [
        { label: 'Да', onClick: () => deleteOrder(index) },
        { label: 'Отмена', onClick: closeModal }
    ]);
    document.body.appendChild(modal);
}

function deleteOrder(index) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.splice(index, 1);
    localStorage.setItem('orders', JSON.stringify(orders));
    displayOrders();
    closeModal();
    alert('Заказ успешно удалён');
}
