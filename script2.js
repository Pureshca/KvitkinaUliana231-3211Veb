document.addEventListener('DOMContentLoaded', () => {
    displayOrders(); // Отображаем заказы при загрузке страницы
});

// Функция для отображения заказов
function displayOrders() {
    const ordersList = document.getElementById('orders-list');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    if (orders.length === 0) {
        ordersList.innerHTML = '<p>Нет заказов.</p>';
        return;
    }

    // Очистка списка перед добавлением новых заказов
    ordersList.innerHTML = '';

    // Проходим по каждому заказу и создаем элементы списка
    orders.forEach((order, index) => {
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('order-item');

        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleString();

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

        const deliveryTime = order.formData.delivery_time || 'Как можно скорее';


        const totalCostText = totalCost > 0 ? `${totalCost} ₽` : 'Не указана';

        orderDiv.innerHTML = `
            <h3>Заказ №${index + 1}</h3>
            <p>Дата: ${formattedDate}</p>
            <p>Состав: ${dishNames.length > 0 ? dishNames.join(', ') : 'Не указаны блюда'}</p>
            <p>Стоимость: ${totalCostText}</p>
            <p>Время доставки: ${deliveryTime}</p>
            <button class="details-btn" onclick="showOrderDetails(${index})">Подробнее</button>
            <button class="edit-btn" onclick="editOrder(${index})">Редактировать</button>
            <button class="delete-btn" onclick="confirmDeleteOrder(${index})">Удалить</button>
        `;

        ordersList.appendChild(orderDiv);
        console.log("Данные формы заказа:", totalCostText);
    });
}

function showOrderDetails(index) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders[index];
    
    const totalCostText = calculateTotalCost(order.dishes); // Добавьте расчет стоимости

    // Отладочное сообщение для проверки структуры данных
    console.log("Показать детали заказа:", order); 

    const modal = createModal('Детали заказа', generateOrderDetailsContent(order, totalCostText), [{ label: 'Ок', onClick: closeModal }]);
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

function generateOrderDetailsContent(order, totalCostText) {
    console.log("Данные формы заказа:", order.formData);
    console.log("Данные формы заказа:", totalCostText);

    return `
        <p>Полное имя: ${order.formData.name || 'Не указано'}</p>
        <p>Email: ${order.formData.email || 'Не указано'}</p>
        <p>Телефон: ${order.formData.phone || 'Не указано'}</p>
        <p>Адрес доставки: ${order.formData.address || 'Не указан'}</p>
        <p>Время доставки: ${order.formData.delivery_time || 'Как можно скорее'}</p>
        <p>Комментарий: ${order.formData.comments || 'Не указан'}</p>
        <p>Стоимость: ${totalCostText || 'Не указана'}</p>
    `;
}


// Функция для редактирования заказа
function editOrder(index) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders[index];
    const modal = createModal('Редактирование заказа', generateOrderEditForm(order), [
        { label: 'Сохранить', onClick: () => saveOrderChanges(index) },
        { label: 'Отмена', onClick: closeModal }
    ]);
    document.body.appendChild(modal);
}

function generateOrderEditForm(order) {
    return `
        <label>Полное имя</label><input type="text" id="name" value="${order.formData.name || ''}">
        <label>Email</label><input type="email" id="email" value="${order.formData.email || ''}">
        <label>Телефон</label><input type="text" id="phone" value="${order.formData.phone || ''}">
        <label>Адрес доставки</label><input type="text" id="delivery_address" value="${order.formData.address || ''}">
        <label>Время доставки</label><input type="text" id="delivery_time" value="${order.formData.delivery_time || ''}">
        <label>Комментарий</label><textarea id="comment">${order.formData.comments || ''}</textarea>
        
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
            name: document.getElementById('name').value,  // Исправлено имя поля
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('delivery_address').value, // Исправлено имя поля
            delivery_time: document.getElementById('delivery_time').value,
            comments: document.getElementById('comment').value, // Исправлено имя поля
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


// Функции для создания и закрытия модальных окон остаются без изменений



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
