const soupsMenu = document.getElementById('soups-menu');
const mainMenu = document.getElementById('main-menu');
const salatMenu = document.getElementById('salat-menu');
const dessertsMenu = document.getElementById('desserts-menu');
const drinksMenu = document.getElementById('drinks-menu');

// Вызов функции загрузки блюд при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadSelectedDishesFromStorage(); // Загружаем выбранные блюда из localStorage
    updateOrderDisplay();
    updateOrderButton();
});

// Функция для загрузки блюд с использованием API
async function loadDishes() {
    try {
        const response = await fetch("http://lab7-api.std-900.ist.mospolytech.ru/api/dishes");
        if (!response.ok) {
            throw new Error(`Ошибка загрузки данных: ${response.statusText}`);
        }
        const dishes = await response.json();

        // Очистка меню перед добавлением новых блюд
        soupsMenu.innerHTML = '';
        mainMenu.innerHTML = '';
        salatMenu.innerHTML = '';
        dessertsMenu.innerHTML = '';
        drinksMenu.innerHTML = '';

        // Добавление блюд в соответствующие секции меню
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
    } catch (error) {
        console.error("Произошла ошибка при загрузке блюд:", error);
    }
}



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
              <button class="add-button">Добавить</button>
          `;

          // Добавляем обработчик события для кнопки "Добавить"
          dishDiv.querySelector('.add-button').addEventListener('click', () => {
              updateOrder(dish);
              
          });

          return dishDiv;
      }

      function updateOrder(dish) {
        // Обновляем выбранное блюдо в соответствующей категории
        if (dish.category === 'soup') {
            selectedDishes.soup = dish;
        } else if (dish.category === 'main-course') {
            selectedDishes.main = dish;
        } else if (dish.category === 'drink') {
            selectedDishes.drink = dish;
        } else if (dish.category === 'dessert') {
            selectedDishes.desserts = dish;
        } else if (dish.category === 'salad') {
            selectedDishes.salat = dish;
        }
    
        // Обновляем отображение заказа
        
        // Обновляем localStorage
        updateOrderDisplay();
        localStorage.setItem('selectedDishes', JSON.stringify(selectedDishes));
        updateOrderButton();
        updateOrderDisplay();
    }

    function updateOrderDisplay() {
        const currentCostElement = document.getElementById('current-cost');
        const proceedButton = document.getElementById('proceed-button');
        const orderPanel = document.getElementById('order-panel');
    
        // Рассчитываем текущую сумму
        const totalCost = (selectedDishes.soup ? selectedDishes.soup.price : 0) +
                          (selectedDishes.main ? selectedDishes.main.price : 0) +
                          (selectedDishes.salat ? selectedDishes.salat.price : 0) +
                          (selectedDishes.desserts ? selectedDishes.desserts.price : 0) +
                          (selectedDishes.drink ? selectedDishes.drink.price : 0);
    
        // Обновляем отображение суммы
        currentCostElement.textContent = `Сумма: ${totalCost} ₽`;
    
        // Управляем видимостью панели
        const hasSelection = Object.values(selectedDishes).some(Boolean);
        orderPanel.classList.toggle('hidden', !hasSelection);
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


        const filterButtons = document.querySelectorAll('.filter-button');
        const menus = {
            soups: document.getElementById('soups-menu'),
            main: document.getElementById('main-menu'),
            drinks: document.getElementById('drinks-menu'),
            salat: document.getElementById('salat-menu'),
            desserts: document.getElementById('desserts-menu')
        };

        let activeFilters = {
            soups: [],
            main: [],
            drinks: [],
            salat: [],
            desserts: []
        };

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const section = button.closest('section').id;
                const kind = button.dataset.kind;
        
                // Проверка, активна ли кнопка
                const isActive = button.classList.contains('active');
        
                // Сброс всех фильтров в данной секции
                const otherButtons = document.querySelectorAll(`#${section} .filter-button`);
                otherButtons.forEach(btn => {
                    btn.classList.remove('active');
                    // Удаляем неактивные фильтры
                    activeFilters[section] = activeFilters[section].filter(item => item !== btn.dataset.kind);
                });
        
                if (isActive) {
                    // Если фильтр уже активен, убираем его
                    activeFilters[section] = []; // Сбрасываем фильтры
                } else {
                    // Устанавливаем активный фильтр
                    button.classList.add('active');
                    activeFilters[section] = [kind]; // Сохраняем только текущий фильтр
                }
        
                filterDishes(section); // Фильтруем блюда в секции
            });
        });
        
        function filterDishes(section) {
            const currentMenu = menus[section];
            const dishes = Array.from(currentMenu.children); // Все блюда в секции
        
            dishes.forEach(dish => {
                const dishKind = dish.dataset.dish;
        
                // Если фильтров нет или текущий элемент соответствует активному фильтру
                if (activeFilters[section].length === 0 || activeFilters[section].includes(dishKind)) {
                    dish.classList.remove('hidden'); // Показать элемент, убрав класс 'hidden'
                } else {
                    dish.classList.add('hidden'); // Скрыть элемент, добавив класс 'hidden'
                }
            });
        }
        

        function createDishCard(dish) {
            const dishDiv = document.createElement('div');
            dishDiv.classList.add('menu-item');
            dishDiv.setAttribute('data-dish', dish.kind);

            dishDiv.innerHTML = `
                <img src="${dish.image}" alt="${dish.name}">
                <p class="name">${dish.name}</p>
                <p class="weight">${dish.count}</p>
                <p class="price">${dish.price} ₽</p>
                <button class="add-button">Добавить</button>
            `;

            // Добавляем обработчик события для кнопки "Добавить"
            dishDiv.querySelector('.add-button').addEventListener('click', () => {
                updateOrder(dish);
            });

            return dishDiv;
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

// Проверка, соответствует ли набор блюд одному из комбо
function isValidCombo(selectedDishes) {
    return validCombos.some(combo => combo.every(dish => selectedDishes.includes(dish)) && selectedDishes.length === combo.length);
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

