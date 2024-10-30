const soupsMenu = document.getElementById('soups-menu');
const mainMenu = document.getElementById('main-menu');
const salatMenu = document.getElementById('salat-menu');
const dessertsMenu = document.getElementById('desserts-menu');
const drinksMenu = document.getElementById('drinks-menu');


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
          } else if (dish.category === 'main') {
              selectedDishes.main = dish;
          } else if (dish.category === 'drink') {
              selectedDishes.drink = dish;
          } else if (dish.category === 'desserts') {
              selectedDishes.desserts = dish;
          } else if (dish.category === 'salat') {
              selectedDishes.salat = dish;}

          // Обновляем отображение заказа
          updateOrderDisplay();
      }

      function updateOrderDisplay() { 
        console.log(selectedDishes); // Логируем выбранные блюда
    
        const isAnyDishSelected = selectedDishes.soup || selectedDishes.main || selectedDishes.drink || selectedDishes.salat || selectedDishes.desserts; 
    
        // Логируем состояние выбранных блюд
        console.log("isAnyDishSelected:", isAnyDishSelected);
    
        const soupOrder = selectedDishes.soup ? `${selectedDishes.soup.name} ${selectedDishes.soup.price} ₽` : "Не выбрано"; 
        const mainOrder = selectedDishes.main ? `${selectedDishes.main.name} ${selectedDishes.main.price} ₽` : "Не выбрано"; 
        const dessertsOrder = selectedDishes.desserts ? `${selectedDishes.desserts.name} ${selectedDishes.desserts.price} ₽` : "Не выбрано"; 
        const salatOrder = selectedDishes.salat ? `${selectedDishes.salat.name} ${selectedDishes.salat.price} ₽` : "Не выбрано"; 
        const drinkOrder = selectedDishes.drink ? `${selectedDishes.drink.name} ${selectedDishes.drink.price} ₽` : "Не выбрано"; 
    
        // Обновление текста
        document.getElementById('soup-order').textContent = soupOrder; 
        document.getElementById('main-order').textContent = mainOrder; 
        document.getElementById('salat-order').textContent = salatOrder; 
        document.getElementById('desserts-order').textContent = dessertsOrder; 
        document.getElementById('drink-order').textContent = drinkOrder;
    
        // Общая стоимость
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
          } else if (dish.category === 'main') {
              mainMenu.appendChild(dishCard);
          } else if (dish.category === 'salat') {
              salatMenu.appendChild(dishCard);
          } else if (dish.category === 'desserts') {
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

            // Очистить отображение заказа
            updateOrderDisplay();

            // Сбросить форму
            document.querySelector('form').reset();
        }

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
                const dishKind = dish.dataset.dish; // Предполагается, что dish.dataset.dish содержит значение kind
        
                if (activeFilters[section].length === 0 || activeFilters[section].includes(dishKind)) {
                    dish.style.display = 'block';
                } else {
                    dish.style.display = 'none';
                }
            });
        }
        
        

        // Пример добавления блюда
        function createDishCard(dish) {
            const dishDiv = document.createElement('div');
            dishDiv.classList.add('menu-item');
            dishDiv.setAttribute('data-dish', dish.kind); // Пример, dish.kind - это значение kind

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
