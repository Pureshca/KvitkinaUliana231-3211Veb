const menuItemsContainer = document.getElementById('menu-items');

document.addEventListener('DOMContentLoaded', () => {
    loadSelectedDishesFromStorage(); // Загружаем выбранные блюда из localStorage
    updateOrderButton();
});

function loadSelectedDishesFromStorage() {
    // Получаем данные из localStorage
    const storedDishes = JSON.parse(localStorage.getItem('selectedDishes')) || {};

    // Устанавливаем значения выбранных блюд
    selectedDishes.soup = storedDishes.soup || null;
    selectedDishes.main = storedDishes.main || null;
    selectedDishes.salat = storedDishes.salat || null;
    selectedDishes.desserts = storedDishes.desserts || null;
    selectedDishes.drink = storedDishes.drink || null;

    // Загружаем блюда с сервера для их отображения
    loadDishes().then(() => {
        // После загрузки блюд обновляем отображение
        updateOrderDisplay();
    });
}

// Функция для обновления состояния кнопки
function updateOrderButton() {
    const orderButton = document.getElementById("order-button");
    if (validateOrder1()) {
        orderButton.disabled = false; // Активировать кнопку
    } else {
        orderButton.disabled = true; // Деактивировать кнопку
    }
}

// Функция для загрузки блюд с использованием API
async function loadDishes() {
    try {
        const response = await fetch("http://lab7-api.std-900.ist.mospolytech.ru/api/dishes");
        if (!response.ok) {
            throw new Error(`Ошибка загрузки данных: ${response.statusText}`);
        }
        const dishes = await response.json();

        // Очистка контейнера перед добавлением новых блюд
        menuItemsContainer.innerHTML = '';

        // Загружаем блюда из localStorage и добавляем их в общий контейнер
        createDishCardFromStorage(selectedDishes.soup, 'soup');
        createDishCardFromStorage(selectedDishes.main, 'main-course');
        createDishCardFromStorage(selectedDishes.salat, 'salad');
        createDishCardFromStorage(selectedDishes.desserts, 'dessert');
        createDishCardFromStorage(selectedDishes.drink, 'drink');
    } catch (error) {
        console.error("Произошла ошибка при загрузке блюд:", error);
    }
}

function createDishCardFromStorage(dish, category) {
    if (dish) {
        const dishCard = createDishCard(dish);
        menuItemsContainer.appendChild(dishCard);
    }
}

// Вызов функции загрузки блюд при загрузке страницы
document.addEventListener("DOMContentLoaded", loadDishes);



      // Хранение выбранных блюд
      const selectedDishes = {
          soup: null,
          main: null,
          salat: null,
          desserts: null,
          drink: null
      };

      function createDishCard(dish) {
        const dishDiv = document.createElement('div');
        dishDiv.classList.add('menu-item');
        dishDiv.setAttribute('data-dish', dish.keyword);
    
        dishDiv.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}">
            <p class="name">${dish.name}</p>
            <p class="weight">${dish.count}</p>
            <p class="price">${dish.price} ₽</p>
            <button class="remove-button">Удалить</button>
        `;
    
        // Обработчик для удаления блюда
        dishDiv.querySelector('.remove-button').addEventListener('click', () => {
            removeDish(dish);
        });
    
        return dishDiv;
    }

    function removeDish(dish) {
        // Удаляем блюдо из соответствующей категории в selectedDishes
        if (dish.category === 'soup') {
            selectedDishes.soup = null;
        } else if (dish.category === 'main-course') {
            selectedDishes.main = null;
        } else if (dish.category === 'drink') {
            selectedDishes.drink = null;
        } else if (dish.category === 'dessert') {
            selectedDishes.desserts = null;
        } else if (dish.category === 'salad') {
            selectedDishes.salat = null;
        }
    
        // Обновляем localStorage
        localStorage.setItem('selectedDishes', JSON.stringify(selectedDishes));
    
        // Находим и удаляем карточку блюда из DOM
        const dishCard = document.querySelector(`[data-dish="${dish.keyword}"]`);
        if (dishCard) {
            dishCard.remove();
        }
    
        // Обновляем отображение заказа
        updateOrderDisplay();
        updateOrderButton();
    }
    

    function updateOrderDisplay() {
        console.log(selectedDishes); // Логируем выбранные блюда
    
        // Проверка, выбрано ли хотя бы одно блюдо
        const isAnyDishSelected = selectedDishes.soup || selectedDishes.main || selectedDishes.drink || selectedDishes.salat || selectedDishes.desserts;
    
        // Отображение заказа с обновленными текстами
        const soupOrder = selectedDishes.soup ? `${selectedDishes.soup.name} ${selectedDishes.soup.price} ₽` : "Не выбрано";
        const mainOrder = selectedDishes.main ? `${selectedDishes.main.name} ${selectedDishes.main.price} ₽` : "Не выбрано";
        const dessertsOrder = selectedDishes.desserts ? `${selectedDishes.desserts.name} ${selectedDishes.desserts.price} ₽` : "Не выбрано";
        const salatOrder = selectedDishes.salat ? `${selectedDishes.salat.name} ${selectedDishes.salat.price} ₽` : "Не выбрано";
        const drinkOrder = selectedDishes.drink ? `${selectedDishes.drink.name} ${selectedDishes.drink.price} ₽` : "Не выбрано";
    
        document.getElementById('soup-order').textContent = soupOrder;
        document.getElementById('main-order').textContent = mainOrder;
        document.getElementById('salat-order').textContent = salatOrder;
        document.getElementById('desserts-order').textContent = dessertsOrder;
        document.getElementById('drink-order').textContent = drinkOrder;
    
        // Пересчитываем общую стоимость
        const totalCost = (selectedDishes.soup ? selectedDishes.soup.price : 0) +
                          (selectedDishes.main ? selectedDishes.main.price : 0) +
                          (selectedDishes.desserts ? selectedDishes.desserts.price : 0) +
                          (selectedDishes.salat ? selectedDishes.salat.price : 0) +
                          (selectedDishes.drink ? selectedDishes.drink.price : 0);
        document.getElementById('total-cost').textContent = `${totalCost} ₽`;
    
        // Управление статусами
        const generalStatus = document.getElementById('general-status');
        const generalStatus2 = document.getElementById('general-status2');
        if (isAnyDishSelected) {
            generalStatus.style.display = 'block';
            generalStatus2.style.display = 'none';
        } else {
            generalStatus.style.display = 'none';
            generalStatus2.style.display = 'block';
        }
    }
    
    
    

      // Добавление блюд в соответствующие секции
      dishes.sort((a, b) => a.name.localeCompare(b.name)); // Сортировка блюд по имени

      dishes.forEach(dish => {
          const dishCard = createDishCard(dish);

          if (dish.category === 'soup') {
              soupsMenu.appendChild(dishCard);
          } else if (dish.category === 'main-course') {
              mainMenu.appendChild(dishCard);
          } else if (dish.category === 'salad') {
              salatMenu.appendChild(dishCard);
          } else if (dish.category === 'dessert') {
              dessertsMenu.appendChild(dishCard);
          } else if (dish.category === 'drink') {
              drinksMenu.appendChild(dishCard);
          }
      });

        document.getElementById('reset-button').addEventListener('click', resetOrder);

        function resetOrder() {
            // Сбросить выбранные блюда
            selectedDishes.soup = null;
            selectedDishes.main = null;
            selectedDishes.salat = null;
            selectedDishes.desserts = null;
            selectedDishes.drink = null;
        
            // Очистить localStorage
            localStorage.removeItem('selectedDishes');
        
            // Очистить отображение заказа
            updateOrderDisplay();
        
            // Сбросить форму
            document.querySelector('form').reset();
        }



// Доступные для заказа варианты ланча
const validCombos = [
    ['Суп', 'Главное блюдо', 'Салат', 'Напиток'],
    ['Суп', 'Главное блюдо', 'Напиток'],
    ['Суп', 'Салат', 'Напиток'],
    ['Главное блюдо', 'Салат', 'Напиток'],
    ['Главное блюдо', 'Напиток']
];

// Проверка на корректность выбранных блюд
function validateOrder() {
    // Сбор фактически выбранных пользователем блюд
    const selectedDishNames = [];
    
    if (selectedDishes.soup) selectedDishNames.push("Суп");
    if (selectedDishes.main) selectedDishNames.push("Главное блюдо");
    if (selectedDishes.salat) selectedDishNames.push("Салат");
    if (selectedDishes.desserts) selectedDishNames.push("Десерт");
    if (selectedDishes.drink) selectedDishNames.push("Напиток");

    // Проверка на наличие хотя бы одного блюда
    if (selectedDishNames.length === 0) {
        showNotification("Ничего не выбрано. Выберите блюда для заказа");
        return false;
    }

    const hasDrink = selectedDishNames.includes("Напиток");
    const hasSoup = selectedDishNames.includes("Суп");
    const hasMainDish = selectedDishNames.includes("Главное блюдо");
    const hasSalad = selectedDishNames.includes("Салат");

    // Проверки для корректного выбора
    if (!hasDrink) {
        showNotification("Выберите напиток");
    } else if (hasSoup && !(hasMainDish || hasSalad)) {
        showNotification("Выберите главное блюдо/салат");
    } else if (hasSalad && !(hasMainDish || hasSoup)) {
        showNotification("Выберите суп и/или главное блюдо");
    } else if (!hasMainDish && (hasDrink || selectedDishNames.includes("Десерт")) && !hasSoup) {
        showNotification("Выберите главное блюдо");
    } else {
        return true; // Позволяет отправку формы, если все проверки пройдены
    }

    return false; // Предотвращает отправку формы, если не все условия соблюдены
}
// Проверка, соответствует ли набор блюд одному из комбо
function isValidCombo(selectedDishes) {
    return validCombos.some(combo => combo.every(dish => selectedDishes.includes(dish)) && selectedDishes.length === combo.length);
}
function validateOrder1() {
    // Сбор фактически выбранных пользователем блюд
    const selectedDishNames = [];
    
    if (selectedDishes.soup) selectedDishNames.push("Суп");
    if (selectedDishes.main) selectedDishNames.push("Главное блюдо");
    if (selectedDishes.salat) selectedDishNames.push("Салат");
    if (selectedDishes.desserts) selectedDishNames.push("Десерт");
    if (selectedDishes.drink) selectedDishNames.push("Напиток");

    // Проверка на наличие хотя бы одного блюда
    if (selectedDishNames.length === 0) {
        
        return false;
    }

    const hasDrink = selectedDishNames.includes("Напиток");
    const hasSoup = selectedDishNames.includes("Суп");
    const hasMainDish = selectedDishNames.includes("Главное блюдо");
    const hasSalad = selectedDishNames.includes("Салат");

    // Проверки для корректного выбора
    if (!hasDrink) {
        
    } else if (hasSoup && !(hasMainDish || hasSalad)) {
        
    } else if (hasSalad && !(hasMainDish || hasSoup)) {
        
    } else if (!hasMainDish && (hasDrink || selectedDishNames.includes("Десерт")) && !hasSoup) {
        
    } else {
        return true; // Позволяет отправку формы, если все проверки пройдены
    }

    return false; // Предотвращает отправку формы, если не все условия соблюдены
}
// Показ уведомления
function showNotification(message) {
    document.getElementById("notification-text").textContent = message;
    document.getElementById("notification").style.display = "block";
}

// Закрытие уведомления
function closeNotification() {
    document.getElementById("notification").style.display = "none";
}
