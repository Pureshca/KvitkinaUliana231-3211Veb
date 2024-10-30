// dishes.js
const dishes = [
    {
        keyword: 'sonze',
        name: 'Солнечная вспышка',
        price: 450,
        category: 'soup',
        kind: 'fish',
        count: '300 мл',
        image: 'soup1.jpg'
    },
    {
        keyword: 'mef',
        name: 'Межзвездный бульон',
        price: 480,
        category: 'soup',
        kind: 'meat',
        count: '350 мл',
        image: 'soup2.png'
    },
    {
        keyword: 'tuman',
        name: 'Туманность Ориона',
        price: 500,
        category: 'soup',
        kind: 'vegetarian',
        count: '400 мл',
        image: 'soup3.png'
    },
    {
        keyword: 'son',
        name: 'Звёздные специи',
        price: 450,
        category: 'soup',
        kind: 'fish',
        count: '300 мл',
        image: 'soup4.webp'
    },
    {
        keyword: 'me',
        name: 'Темная галактика',
        price: 480,
        category: 'soup',
        kind: 'meat',
        count: '350 мл',
        image: 'soup5.webp'
    },
    {
        keyword: 'tu',
        name: 'Зеленая галактика',
        price: 500,
        category: 'soup',
        kind: 'vegetarian',
        count: '400 мл',
        image: 'soup6.webp'
    },
    {
        keyword: 'dira',
        name: 'Черная дыра',
        price: 1200,
        category: 'main',
        kind: 'fish',
        count: '200 г',
        image: 'main1.png'
    },
    {
        keyword: 'burger',
        name: 'Космический бургер',
        price: 850,
        category: 'main',
        kind: 'meat',
        count: '300 г',
        image: 'main2.png'
    },
    {
        keyword: 'parfe',
        name: 'Галактическое парфе',
        price: 550,
        category: 'main',
        kind: 'vegetarian',
        count: '180 г',
        image: 'main3.png'
    },
    {
        keyword: 'di',
        name: 'Лунный лосось',
        price: 1200,
        category: 'main',
        kind: 'fish',
        count: '200 г',
        image: 'main4.webp'
    },
    {
        keyword: 'bur',
        name: 'Рагу из Мяса Дракона',
        price: 850,
        category: 'main',
        kind: 'meat',
        count: '300 г',
        image: 'main5.jpg'
    },
    {
        keyword: 'par',
        name: ' Эльфийская Запеканка',
        price: 550,
        category: 'main',
        kind: 'vegetarian',
        count: '180 г',
        image: 'main6.jpg'
    },
    {
        keyword: 'salat1',
        name: 'Рыба и звёзды',
        price: 1200,
        category: 'salat',
        kind: 'fish',
        count: '200 г',
        image: 'salat1.jpg'
    },
    {
        keyword: 'salat2',
        name: 'Драконий салат',
        price: 850,
        category: 'salat',
        kind: 'meat',
        count: '300 г',
        image: 'salat2.jpg'
    },
    {
        keyword: 'salat3',
        name: 'Эльфийский салат',
        price: 550,
        category: 'salat',
        kind: 'vegetarian',
        count: '180 г',
        image: 'salat3.jpg'
    },
    {
        keyword: 'salat4',
        name: 'Кускус с фруктами',
        price: 1200,
        category: 'salat',
        kind: 'vegetarian',
        count: '200 г',
        image: 'salat4.jpg'
    },
    {
        keyword: 'salat5',
        name: 'Радужный Салат из Бобовых',
        price: 850,
        category: 'salat',
        kind: 'vegetarian',
        count: '300 г',
        image: 'salat5.jpg'
    },
    {
        keyword: 'salat6',
        name: 'Астральный салат',
        price: 550,
        category: 'salat',
        kind: 'vegetarian',
        count: '180 г',
        image: 'salat6.jpg'
    },
    {
        keyword: 'desserts1',
        name: 'Звездные макаронсы',
        price: 1200,
        category: 'desserts',
        kind: 'small',
        count: '100 г',
        image: 'des1.jpg'
    },
    {
        keyword: 'desserts2',
        name: 'Галактические трюфели',
        price: 850,
        category: 'desserts',
        kind: 'small',
        count: '100 г',
        image: 'des2.jpg'
    },
    {
        keyword: 'desserts3',
        name: 'Космические бисквиты',
        price: 550,
        category: 'desserts',
        kind: 'small',
        count: '100 г',
        image: 'des3.jpg'
    },
    {
        keyword: 'desserts4',
        name: 'Космический торт',
        price: 1200,
        category: 'desserts',
        kind: 'medium',
        count: '300 г',
        image: 'des4.jpg'
    },
    {
        keyword: 'desserts5',
        name: 'Галактический пирог',
        price: 850,
        category: 'desserts',
        kind: 'medium',
        count: '300 г',
        image: 'des5.jpg'
    },
    {
        keyword: 'desserts6',
        name: 'Гиперссылка',
        price: 550,
        category: 'desserts',
        kind: 'large',
        count: '1000 г',
        image: 'des6.jpg'
    },
    {
        keyword: 'astral',
        name: 'Астральный эликсир',
        price: 650,
        category: 'drink',
        kind: 'hot',
        count: '500 мл',
        image: 'drink1.png'
    },
    {
        keyword: 'kometa',
        name: 'Кометный лимонад',
        price: 350,
        category: 'drink',
        kind: 'cold',
        count: '350 мл',
        image: 'drink2.png'
    },
    {
        keyword: 'vzriv',
        name: 'Солнечный взрыв',
        price: 400,
        category: 'drink',
        kind: 'hot',
        count: '180 мл',
        image: 'drink3.png'
    },
    {
        keyword: 'ast',
        name: 'Кофе Темная материя',
        price: 650,
        category: 'drink',
        kind: 'hot',
        count: '500 мл',
        image: 'drink4.jpg'
    },
    {
        keyword: 'kome',
        name: 'Лунное молоко',
        price: 350,
        category: 'drink',
        kind: 'cold',
        count: '350 мл',
        image: 'drink5.jpg'
    },
    {
        keyword: 'vzr',
        name: 'Астральный холод',
        price: 400,
        category: 'drink',
        kind: 'cold',
        count: '180 мл',
        image: 'drink6.jpg'
    }
];
