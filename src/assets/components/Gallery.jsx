import { useState } from "react";
import classes from "./Gallery.module.css";
import MenuItem from "./MenuItem";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import image1 from "../images/grilled_salmon.jpg";
import image2 from "../images/margherita.jpg";
import image3 from "../images/lemon_chicken.jpg";
import image4 from "../images/buffalo_wings.jpg";
import image5 from "../images/mixed_berry_juice.jpg";
import image6 from "../images/caprese_salad.jpg";
import image7 from "../images/herbal_tea.jpg";
import image8 from "../images/green_tea.jpg";

const foodData = {
    Burgers: [
        {
            "id": 2,
            "name": "Grilled Salmon with Lemon Dill Sauce",
            "image": image1,
            "description": "Experience the fresh, rich flavors of our Grilled Salmon with Lemon Dill Sauce. This dish features a perfectly grilled salmon fillet, seasoned with a blend of herbs and spices, and served with a zesty lemon dill sauce that complements the natural flavors of the fish. Accompanied by a side of roasted vegetables and quinoa, this meal is as healthy as it is delicious.",
            "ingredients": [{"name":"Salmon fillet"}, {"name":"Lemon"}, {"name":"Dill"}, {"name":"Olive oil"}, {"name":"Garlic"}, {"name":"Salt"}, {"name":"Pepper"}, {"name":"Quinoa"}, {"name":"Zucchini"}, {"name":"Bell peppers"}, {"name":"Red onions"}, {"name":"Asparagus"}],
            "tags": [{"name":"Healthy"}, {"name":"Dinner"}, {"name":"Seafood"}],
            "price": "$29.99",
            "category" : "food"
        },
        {
            "id": 3,
            "name": "Margherita Pizza",
            "image": image2,
            "description": "Our classic Margherita Pizza is a true Italian delight. Made with fresh, high-quality ingredients, this pizza features a crispy thin crust topped with a rich tomato sauce, slices of fresh mozzarella cheese, and fragrant basil leaves. Drizzled with extra virgin olive oil and baked to perfection, this pizza is a favorite among all ages.",
            "ingredients": [{"name":"Pizza dough"}, {"name":"Tomato sauce"}, {"name":"Mozzarella cheese"}, {"name":"Basil"}, {"name":"Olive oil"}, {"name":"Salt"}],
            "tags": [{"name":"Vegetarian"}, {"name":"Lunch"}, {"name":"Dinner"}, {"name":"Pizza"}],
            "price": "$15.99",
            "category" : "food"
        },
        {
            "id": 4,
            "name": "Caesar Salad with Grilled Chicken",
            "image": image3,
            "description": "Enjoy the fresh and crisp flavors of our Caesar Salad with Grilled Chicken. This classic salad features romaine lettuce, crunchy croutons, and a creamy Caesar dressing, topped with slices of tender grilled chicken breast and shaved Parmesan cheese. Perfect for a light lunch or as a side dish to any meal.",
            "ingredients": [{"name":"Romaine lettuce"}, {"name":"Grilled chicken breast"}, {"name":"Croutons"}, {"name":"Parmesan cheese"}, {"name":"Caesar dressing"}, {"name":"Anchovies"}, {"name":"Lemon juice"}, {"name":"Olive oil"}, {"name":"Garlic"}, {"name":"Dijon mustard"}, {"name":"Egg yolk"}, {"name":"Salt"}, {"name":"Pepper"}],
            "tags": [{"name":"Salad"}, {"name":"Lunch"}, {"name":"Healthy"}, {"name":"Chicken"}],
            "price": "$12.49",
            "category" : "food"
        },
        {
            "id": 5,
            "name": "Spaghetti Carbonara",
            "image": image4,
            "description": "Our Spaghetti Carbonara is a rich and creamy pasta dish that is sure to satisfy. Made with perfectly cooked spaghetti, crispy pancetta, and a creamy sauce made from eggs, Parmesan cheese, and black pepper, this dish is a true comfort food. Topped with a sprinkle of fresh parsley, it's perfect for dinner or a special occasion.",
            "ingredients": [{"name":"Spaghetti"}, {"name":"Pancetta"}, {"name":"Eggs"}, {"name":"Parmesan cheese"}, {"name":"Black pepper"}, {"name":"Parsley"}, {"name":"Salt"}],
            "tags": [{"name":"Pasta"}, {"name":"Dinner"}, {"name":"Comfort Food"}],
            "price": "$18.75",
            "category" : "food"
        }
    ],
    Pizza: [
        {
            "id": 6,
            "name": "Vegan Buddha Bowl",
            "image": "http://dummyimage.com/108x100.png/cc0000/ffffff",
            "description": "Our Vegan Buddha Bowl is a nourishing and colorful dish, packed with a variety of fresh and wholesome ingredients. This bowl features quinoa, roasted sweet potatoes, chickpeas, avocado, and a medley of fresh vegetables, all drizzled with a tangy tahini dressing. It's a perfect choice for a healthy and satisfying meal.",
            "ingredients": [{"name":"Quinoa"}, {"name":"Sweet potatoes"}, {"name":"Chickpeas"}, {"name":"Avocado"}, {"name":"Spinach"}, {"name":"Red cabbage"}, {"name":"Carrots"}, {"name":"Tahini"}, {"name":"Lemon juice"}, {"name":"Garlic"}, {"name":"Olive oil"}, {"name":"Salt"}, {"name":"Pepper"}],
            "tags": [{"name":"Vegan"}, {"name":"Gluten-Free"}, {"name":"Healthy"}, {"name":"Lunch"}],
            "price": "$13.50",
            "category" : "food"
        },
        {
            "id": 7,
            "name": "Classic Beef Burger with Fries",
            "image": "http://dummyimage.com/108x100.png/000000/ffffff",
            "description": "Sink your teeth into our Classic Beef Burger, featuring a juicy beef patty, melted cheddar cheese, crisp lettuce, ripe tomatoes, and tangy pickles, all sandwiched between a toasted brioche bun. Served with a side of golden, crispy fries, this burger is the ultimate comfort food.",
            "ingredients": [{"name":"Beef patty"}, {"name":"Cheddar cheese"}, {"name":"Lettuce"}, {"name":"Tomato"}, {"name":"Pickles"}, {"name":"Brioche bun"}, {"name":"Fries"}, {"name":"Ketchup"}, {"name":"Mustard"}, {"name":"Onions"}],
            "tags": [{"name":"Burger"}, {"name":"Dinner"}, {"name":"Comfort Food"}, {"name":"Fast Food"}],
            "price": "$11.99",
            "category" : "food"
        },
        {
            "id": 8,
            "name": "Tuna Poke Bowl",
            "image": "http://dummyimage.com/108x100.png/0033cc/ffffff",
            "description": "Enjoy the fresh and vibrant flavors of our Tuna Poke Bowl. This dish features sushi-grade tuna, marinated in a savory soy sauce and sesame dressing, served over a bed of sushi rice with avocado, cucumber, edamame, and seaweed salad. Garnished with sesame seeds and green onions, it's a healthy and delicious meal.",
            "ingredients": [{"name":"Tuna"}, {"name":"Soy sauce"}, {"name":"Sesame oil"}, {"name":"Sushi rice"}, {"name":"Avocado"}, {"name":"Cucumber"}, {"name":"Edamame"}, {"name":"Seaweed salad"}, {"name":"Sesame seeds"}, {"name":"Green onions"}],
            "tags": [{"name":"Poke Bowl"}, {"name":"Seafood"}, {"name":"Healthy"}, {"name":"Lunch"}],
            "price": "$17.25",
            "category" : "food"
        },
        {
            "id": 9,
            "name": "Eggplant Parmesan",
            "image": "http://dummyimage.com/108x100.png/660066/ffffff",
            "description": "Our Eggplant Parmesan is a delightful vegetarian dish, featuring layers of breaded and fried eggplant slices, rich marinara sauce, and melted mozzarella and Parmesan cheese. Baked to golden perfection, this dish is a hearty and satisfying option for dinner.",
            "ingredients": [{"name":"Eggplant"}, {"name":"Marinara sauce"}, {"name":"Mozzarella cheese"}, {"name":"Parmesan cheese"}, {"name":"Bread crumbs"}, {"name":"Olive oil"}, {"name":"Garlic"}, {"name":"Basil"}, {"name":"Salt"}, {"name":"Pepper"}],
            "tags": [{"name":"Vegetarian"}, {"name":"Italian"}, {"name":"Dinner"}, {"name":"Comfort Food"}],
            "price": "$14.99",
            "category" : "food"
        }
    ],
    Chicken: [
        {
            "id": 10,
            "name": "Chocolate Lava Cake",
            "image": "http://dummyimage.com/108x100.png/dd33dd/ffffff",
            "description": "Indulge in our rich and decadent Chocolate Lava Cake. This dessert features a warm, molten chocolate center that oozes out when you take a bite, surrounded by a moist and fluffy chocolate cake. Served with a scoop of vanilla ice cream, it's the perfect ending to any meal.",
            "ingredients": [{"name":"Dark chocolate"}, {"name":"Butter"}, {"name":"Sugar"}, {"name":"Eggs"}, {"name":"Flour"}, {"name":"Vanilla extract"}, {"name":"Salt"}, {"name":"Vanilla ice cream"}],
            "tags": [{"name":"Dessert"}, {"name":"Chocolate"}, {"name":"Cake"}, {"name":"Sweet"}],
            "price": "$8.50",
            "category" : "food"
        },
        {
            "id": 11,
            "name": "Shrimp Scampi",
            "image": "http://dummyimage.com/108x100.png/009900/ffffff",
            "description": "A delightful dish of succulent shrimp sautéed in a garlic butter sauce, served over a bed of linguine. The dish is garnished with fresh parsley and a squeeze of lemon for a burst of freshness. A perfect blend of flavors that brings a taste of the ocean to your plate.",
            "ingredients": [{"name": "Shrimp"}, {"name": "Garlic"}, {"name": "Butter"}, {"name": "Linguine"}, {"name": "Lemon"}, {"name": "Parsley"}, {"name": "White wine"}, {"name": "Salt"}, {"name": "Pepper"}],
            "tags": [{"name": "Seafood"}, {"name": "Dinner"}, {"name": "Pasta"}],
            "price": "$22.99",
            "category": "food"
        },
        {
            "id": 12,
            "name": "Mushroom Risotto",
            "image": "http://dummyimage.com/108x100.png/996633/ffffff",
            "description": "A creamy and comforting Mushroom Risotto made with Arborio rice, sautéed mushrooms, onions, garlic, and a touch of white wine. Finished with Parmesan cheese and a hint of truffle oil, this dish is perfect for mushroom lovers.",
            "ingredients": [{"name": "Arborio rice"}, {"name": "Mushrooms"}, {"name": "Onions"}, {"name": "Garlic"}, {"name": "White wine"}, {"name": "Parmesan cheese"}, {"name": "Truffle oil"}, {"name": "Salt"}, {"name": "Pepper"}],
            "tags": [{"name": "Vegetarian"}, {"name": "Dinner"}, {"name": "Italian"}],
            "price": "$19.50",
            "category": "food"
        },
        {
            "id": 13,
            "name": "Chicken Alfredo",
            "image": "http://dummyimage.com/108x100.png/cc6600/ffffff",
            "description": "A classic Italian-American dish featuring tender grilled chicken breast served over fettuccine pasta, tossed in a rich and creamy Alfredo sauce made with butter, cream, and Parmesan cheese.",
            "ingredients": [{"name": "Chicken breast"}, {"name": "Fettuccine"}, {"name": "Butter"}, {"name": "Cream"}, {"name": "Parmesan cheese"}, {"name": "Garlic"}, {"name": "Salt"}, {"name": "Pepper"}],
            "tags": [{"name": "Pasta"}, {"name": "Chicken"}, {"name": "Dinner"}, {"name": "Comfort Food"}],
            "price": "$17.99",
            "category": "food"
        }
    ],
    Salad: [
        {
            "id": 14,
            "name": "BBQ Ribs",
            "image": "http://dummyimage.com/108x100.png/ff3300/ffffff",
            "description": "Tender, fall-off-the-bone BBQ Ribs, slow-cooked and smothered in our signature barbecue sauce. Served with a side of coleslaw and baked beans, this dish is a must-have for any barbecue lover.",
            "ingredients": [{"name": "Pork ribs"}, {"name": "Barbecue sauce"}, {"name": "Coleslaw"}, {"name": "Baked beans"}, {"name": "Brown sugar"}, {"name": "Paprika"}, {"name": "Garlic powder"}, {"name": "Onion powder"}, {"name": "Salt"}, {"name": "Pepper"}],
            "tags": [{"name": "BBQ"}, {"name": "Dinner"}, {"name": "Comfort Food"}, {"name": "Pork"}],
            "price": "$24.99",
            "category": "food"
        },
        {
            "id": 15,
            "name": "Greek Salad",
            "image": "http://dummyimage.com/108x100.png/336699/ffffff",
            "description": "A refreshing Greek Salad featuring crisp cucumbers, ripe tomatoes, Kalamata olives, red onions, and crumbled feta cheese, all tossed in a tangy lemon-oregano dressing.",
            "ingredients": [{"name": "Cucumbers"}, {"name": "Tomatoes"}, {"name": "Kalamata olives"}, {"name": "Red onions"}, {"name": "Feta cheese"}, {"name": "Olive oil"}, {"name": "Lemon juice"}, {"name": "Oregano"}, {"name": "Salt"}, {"name": "Pepper"}],
            "tags": [{"name": "Salad"}, {"name": "Vegetarian"}, {"name": "Healthy"}, {"name": "Lunch"}],
            "price": "$11.50",
            "category": "food"
        },
        {
            "id": 16,
            "name": "Buffalo Wings",
            "image": "http://dummyimage.com/108x100.png/ff6600/ffffff",
            "description": "Crispy Buffalo Wings tossed in a spicy and tangy buffalo sauce, served with celery sticks and blue cheese dressing. Perfect for sharing as an appetizer or enjoying as a main dish.",
            "ingredients": [{"name": "Chicken wings"}, {"name": "Buffalo sauce"}, {"name": "Butter"}, {"name": "Vinegar"}, {"name": "Garlic powder"}, {"name": "Salt"}, {"name": "Pepper"}, {"name": "Celery"}, {"name": "Blue cheese dressing"}],
            "tags": [{"name": "Appetizer"}, {"name": "Chicken"}, {"name": "Spicy"}, {"name": "Snack"}],
            "price": "$13.99",
            "category": "food"
        },
        {
            "id": 17,
            "name": "Penne Arrabbiata",
            "image": "http://dummyimage.com/108x100.png/cc0000/ffffff",
            "description": "A spicy and flavorful pasta dish made with penne, tossed in a robust tomato sauce infused with garlic, chili flakes, and olive oil. Finished with a sprinkle of fresh parsley and Parmesan cheese.",
            "ingredients": [{"name": "Penne"}, {"name": "Tomato sauce"}, {"name": "Garlic"}, {"name": "Chili flakes"}, {"name": "Olive oil"}, {"name": "Parmesan cheese"}, {"name": "Parsley"}, {"name": "Salt"}, {"name": "Pepper"}],
            "tags": [{"name": "Pasta"}, {"name": "Vegetarian"}, {"name": "Spicy"}, {"name": "Italian"}],
            "price": "$14.99",
            "category": "food"
        }
    ],
    Steaks: [
        {
            "id": 18,
            "name": "Tacos Al Pastor",
            "image": "http://dummyimage.com/108x100.png/ffcc00/ffffff",
            "description": "Authentic Tacos Al Pastor made with marinated pork, grilled to perfection, and served on warm corn tortillas. Topped with diced onions, fresh cilantro, and a squeeze of lime, these tacos are a flavorful and satisfying meal.",
            "ingredients": [{"name": "Pork"}, {"name": "Corn tortillas"}, {"name": "Onions"}, {"name": "Cilantro"}, {"name": "Lime"}, {"name": "Pineapple"}, {"name": "Chili powder"}, {"name": "Cumin"}, {"name": "Garlic"}, {"name": "Salt"}, {"name": "Pepper"}],
            "tags": [{"name": "Tacos"}, {"name": "Mexican"}, {"name": "Dinner"}, {"name": "Street Food"}],
            "price": "$12.99",
            "category": "food"
        },
        {
            "id": 19,
            "name": "Sushi Platter",
            "image": "http://dummyimage.com/108x100.png/3399ff/ffffff",
            "description": "A delightful assortment of fresh sushi, including nigiri, sashimi, and various rolls. Served with pickled ginger, wasabi, and soy sauce, this platter is perfect for sharing.",
            "ingredients": [{"name": "Sushi rice"}, {"name": "Nori"}, {"name": "Tuna"}, {"name": "Salmon"}, {"name": "Avocado"}, {"name": "Cucumber"}, {"name": "Soy sauce"}, {"name": "Wasabi"}, {"name": "Pickled ginger"}],
            "tags": [{"name": "Sushi"}, {"name": "Seafood"}, {"name": "Japanese"}, {"name": "Lunch"}],
            "price": "$28.99",
            "category": "food"
        },
        {
            "id": 20,
            "name": "Lamb Gyro",
            "image": "http://dummyimage.com/108x100.png/cc3300/ffffff",
            "description": "A traditional Greek Lamb Gyro served on warm pita bread, topped with fresh tomatoes, onions, and tzatziki sauce. This dish is a delicious and satisfying option for lunch or dinner.",
            "ingredients": [{"name": "Lamb"}, {"name": "Pita bread"}, {"name": "Tomatoes"}, {"name": "Onions"}, {"name": "Tzatziki sauce"}, {"name": "Garlic"}, {"name": "Cucumber"}, {"name": "Yogurt"}, {"name": "Olive oil"}, {"name": "Salt"}, {"name": "Pepper"}],
            "tags": [{"name": "Greek"}, {"name": "Lunch"}, {"name": "Dinner"}, {"name": "Street Food"}],
            "price": "$14.75",
            "category": "food"
        },
        {
            "id": 21,
            "name": "Vegetable Stir-Fry",
            "image": "http://dummyimage.com/108x100.png/009966/ffffff",
            "description": "A vibrant and healthy Vegetable Stir-Fry featuring a mix of broccoli, bell peppers, carrots, and snap peas, all sautéed in a savory soy-ginger sauce. Served over steamed jasmine rice.",
            "ingredients": [{"name": "Broccoli"}, {"name": "Bell peppers"}, {"name": "Carrots"}, {"name": "Snap peas"}, {"name": "Soy sauce"}, {"name": "Ginger"}, {"name": "Garlic"}, {"name": "Jasmine rice"}, {"name": "Sesame oil"}, {"name": "Salt"}, {"name": "Pepper"}],
            "tags": [{"name": "Vegetarian"}, {"name": "Vegan"}, {"name": "Healthy"}, {"name": "Dinner"}],
            "price": "$11.99",
            "category": "food"
        }
    ],
    Seafood: [
        {
            "id": 22,
            "name": "Cheeseburger",
            "image": "http://dummyimage.com/108x100.png/ff9933/ffffff",
            "description": "A classic Cheeseburger featuring a juicy beef patty topped with melted cheddar cheese, lettuce, tomato, onions, and pickles, all sandwiched between a toasted sesame seed bun. Served with a side of fries.",
            "ingredients": [{"name": "Beef patty"}, {"name": "Cheddar cheese"}, {"name": "Lettuce"}, {"name": "Tomato"}, {"name": "Onions"}, {"name": "Pickles"}, {"name": "Sesame seed bun"}, {"name": "Fries"}, {"name": "Ketchup"}, {"name": "Mustard"}],
            "tags": [{"name": "Burger"}, {"name": "Lunch"}, {"name": "Dinner"}, {"name": "Fast Food"}],
            "price": "$10.99",
            "category": "food"
        },
        {
            "id": 23,
            "name": "French Onion Soup",
            "image": "http://dummyimage.com/108x100.png/996600/ffffff",
            "description": "A rich and hearty French Onion Soup made with caramelized onions, beef broth, and a splash of sherry. Topped with a slice of toasted baguette and melted Gruyère cheese, this soup is the perfect comfort food.",
            "ingredients": [{"name": "Onions"}, {"name": "Beef broth"}, {"name": "Sherry"}, {"name": "Baguette"}, {"name": "Gruyère cheese"}, {"name": "Butter"}, {"name": "Thyme"}, {"name": "Bay leaves"}, {"name": "Salt"}, {"name": "Pepper"}],
            "tags": [{"name": "Soup"}, {"name": "Comfort Food"}, {"name": "Dinner"}, {"name": "French"}],
            "price": "$9.50",
            "category": "food"
        },
        {
            "id": 24,
            "name": "Falafel Wrap",
            "image": "http://dummyimage.com/108x100.png/339933/ffffff",
            "description": "A delicious and satisfying Falafel Wrap made with crispy falafel balls, fresh lettuce, tomatoes, cucumbers, and a tangy tahini sauce, all wrapped in a warm pita.",
            "ingredients": [{"name": "Falafel"}, {"name": "Pita bread"}, {"name": "Lettuce"}, {"name": "Tomatoes"}, {"name": "Cucumbers"}, {"name": "Tahini sauce"}, {"name": "Garlic"}, {"name": "Lemon juice"}, {"name": "Olive oil"}, {"name": "Salt"}, {"name": "Pepper"}],
            "tags": [{"name": "Vegetarian"}, {"name": "Lunch"}, {"name": "Middle Eastern"}],
            "price": "$8.99",
            "category": "food"
        },
        {
            "id": 25,
            "name": "Pad Thai",
            "image": "http://dummyimage.com/108x100.png/ff0066/ffffff",
            "description": "A popular Thai dish featuring stir-fried rice noodles, shrimp, tofu, eggs, and a tangy tamarind sauce. Garnished with crushed peanuts, bean sprouts, and a wedge of lime, this dish is bursting with flavor.",
            "ingredients": [{"name": "Rice noodles"}, {"name": "Shrimp"}, {"name": "Tofu"}, {"name": "Eggs"}, {"name": "Tamarind sauce"}, {"name": "Peanuts"}, {"name": "Bean sprouts"}, {"name": "Lime"}, {"name": "Garlic"}, {"name": "Chili flakes"}, {"name": "Sugar"}, {"name": "Fish sauce"}],
            "tags": [{"name": "Thai"}, {"name": "Noodles"}, {"name": "Dinner"}, {"name": "Asian"}],
            "price": "$15.99",
            "category": "food"
        }
    ],
};


const drinkData = {
    Coffee: [
        {
            "id": 51,
            "name": "Strawberry Sizzle",
            "image": image5,
            "description": "A decadent treat with layers of whipped cream and chocolate shavings.",
            "ingredients": [{"name":"Pineapple juice"}, {"name":"Lemonade"}, {"name":"Simple syrup"}, {"name":"Mint leaves"}],
            "tags": [{"name":"Non-Alcoholic"}, {"name":"Juice"}, {"name":"Tea"}],
            "price": "$22.67",
            "category" : "drink"
        },
        {
            "id": 52,
            "name": "Mojito",
            "image": image6,
            "description": "A refreshing cocktail made with rum, lime juice, fresh mint, sugar, and soda water.",
            "ingredients": [{"name":"White rum"}, {"name":"Lime juice"}, {"name":"Mint leaves"}, {"name":"Sugar"}, {"name":"Soda water"}],
            "tags": [{"name":"Alcoholic"}, {"name":"Cocktail"}],
            "price": "$15.50",
            "category" : "drink"
        },
        {
            "id": 53,
            "name": "Mango Smoothie",
            "image": image7,
            "description": "A creamy and tropical smoothie made with fresh mango, yogurt, and a touch of honey.",
            "ingredients": [{"name":"Mango"}, {"name":"Yogurt"}, {"name":"Honey"}, {"name":"Ice"}],
            "tags": [{"name":"Non-Alcoholic"}, {"name":"Smoothie"}, {"name":"Healthy"}],
            "price": "$8.99",
            "category" : "drink"
        },
        {
            "id": 54,
            "name": "Espresso Martini",
            "image": image8,
            "description": "A sophisticated cocktail made with vodka, espresso, coffee liqueur, and a hint of vanilla.",
            "ingredients": [{"name":"Vodka"}, {"name":"Espresso"}, {"name":"Coffee liqueur"}, {"name":"Vanilla syrup"}],
            "tags": [{"name":"Alcoholic"}, {"name":"Cocktail"}, {"name":"Coffee"}],
            "price": "$18.75",
            "category" : "drink"
        }
    ],
    Tea: [
        {
            "id": 55,
            "name": "Green Tea Lemonade",
            "image": "http://dummyimage.com/115x100.png/99cc33/ffffff",
            "description": "A refreshing and zesty blend of green tea and lemonade, served over ice.",
            "ingredients": [{"name":"Green tea"}, {"name":"Lemonade"}, {"name":"Honey"}, {"name":"Ice"}],
            "tags": [{"name":"Non-Alcoholic"}, {"name":"Tea"}, {"name":"Juice"}],
            "price": "$5.99",
            "category" : "drink"
        },
        {
            "id": 56,
            "name": "Pina Colada",
            "image": "http://dummyimage.com/115x100.png/ff6699/ffffff",
            "description": "A tropical cocktail made with rum, coconut cream, and pineapple juice, blended with ice.",
            "ingredients": [{"name":"White rum"}, {"name":"Coconut cream"}, {"name":"Pineapple juice"}, {"name":"Ice"}],
            "tags": [{"name":"Alcoholic"}, {"name":"Cocktail"}],
            "price": "$14.50",
            "category" : "drink"
        },
        {
            "id": 57,
            "name": "Iced Caramel Macchiato",
            "image": "http://dummyimage.com/115x100.png/996633/ffffff",
            "description": "A cold and creamy coffee drink made with espresso, milk, and caramel syrup, served over ice.",
            "ingredients": [{"name":"Espresso"}, {"name":"Milk"}, {"name":"Caramel syrup"}, {"name":"Ice"}],
            "tags": [{"name":"Non-Alcoholic"}, {"name":"Coffee"}],
            "price": "$4.99",
            "category" : "drink"
        },
        {
            "id": 58,
            "name": "Blueberry Lemonade",
            "image": "http://dummyimage.com/115x100.png/336699/ffffff",
            "description": "A refreshing lemonade with a twist of blueberries and mint, perfect for a hot day.",
            "ingredients": [{"name":"Blueberries"}, {"name":"Lemon juice"}, {"name":"Sugar"}, {"name":"Mint leaves"}, {"name":"Water"}],
            "tags": [{"name":"Non-Alcoholic"}, {"name":"Juice"}],
            "price": "$6.25",
            "category" : "drink"
        }
    ],
    Juices: [
        {
            "id": 59,
            "name": "Negroni",
            "image": "http://dummyimage.com/115x100.png/cc0000/ffffff",
            "description": "A classic Italian cocktail made with gin, vermouth, and Campari, garnished with an orange peel.",
            "ingredients": [{"name":"Gin"}, {"name":"Vermouth"}, {"name":"Campari"}, {"name":"Orange peel"}],
            "tags": [{"name":"Alcoholic"}, {"name":"Cocktail"}],
            "price": "$16.00",
            "category" : "drink"
        },
        {
            "id": 60,
            "name": "Matcha Latte",
            "image": "http://dummyimage.com/115x100.png/66cc66/ffffff",
            "description": "A creamy and energizing drink made with matcha green tea, milk, and a touch of honey.",
            "ingredients": [{"name":"Matcha powder"}, {"name":"Milk"}, {"name":"Honey"}, {"name":"Ice"}],
            "tags": [{"name":"Non-Alcoholic"}, {"name":"Tea"}, {"name":"Healthy"}],
            "price": "$7.99",
            "category" : "drink"
        },
        {
            "id": 61,
            "name": "Sangria",
            "image": "http://dummyimage.com/115x100.png/cc3300/ffffff",
            "description": "A fruity and refreshing Spanish drink made with red wine, chopped fruit, and a splash of brandy.",
            "ingredients": [{"name":"Red wine"}, {"name":"Brandy"}, {"name":"Orange juice"}, {"name":"Chopped fruit"}, {"name":"Sugar"}],
            "tags": [{"name":"Alcoholic"}, {"name":"Wine"}, {"name":"Cocktail"}],
            "price": "$12.50",
            "category" : "drink"
        },
        {
            "id": 62,
            "name": "Virgin Mojito",
            "image": "http://dummyimage.com/115x100.png/66cccc/ffffff",
            "description": "A non-alcoholic version of the classic mojito, made with lime juice, mint, and soda water.",
            "ingredients": [{"name":"Lime juice"}, {"name":"Mint leaves"}, {"name":"Sugar"}, {"name":"Soda water"}],
            "tags": [{"name":"Non-Alcoholic"}, {"name":"Mocktail"}, {"name":"Juice"}],
            "price": "$5.75",
            "category" : "drink"
        }
    ],
    Soda: [
        {
            "id": 63,
            "name": "Chai Latte",
            "image": "http://dummyimage.com/115x100.png/cc9966/ffffff",
            "description": "A warm and comforting drink made with black tea, spices, milk, and a touch of sweetness.",
            "ingredients": [{"name":"Black tea"}, {"name":"Milk"}, {"name":"Cinnamon"}, {"name":"Cardamom"}, {"name":"Ginger"}, {"name":"Sugar"}],
            "tags": [{"name":"Non-Alcoholic"}, {"name":"Tea"}, {"name":"Spiced"}],
            "price": "$6.50",
            "category" : "drink"
        },
        {
            "id": 64,
            "name": "Margarita",
            "image": "http://dummyimage.com/115x100.png/ff3333/ffffff",
            "description": "A classic Mexican cocktail made with tequila, lime juice, and triple sec, served with a salted rim.",
            "ingredients": [{"name":"Tequila"}, {"name":"Lime juice"}, {"name":"Triple sec"}, {"name":"Salt"}],
            "tags": [{"name":"Alcoholic"}, {"name":"Cocktail"}],
            "price": "$13.50",
            "category" : "drink"
        },
        {
            "id": 65,
            "name": "Hot Chocolate",
            "image": "http://dummyimage.com/115x100.png/663300/ffffff",
            "description": "A rich and creamy hot chocolate made with dark chocolate, milk, and a touch of vanilla, topped with whipped cream.",
            "ingredients": [{"name":"Dark chocolate"}, {"name":"Milk"}, {"name":"Vanilla extract"}, {"name":"Whipped cream"}],
            "tags": [{"name":"Non-Alcoholic"}, {"name":"Hot Drink"}, {"name":"Sweet"}],
            "price": "$4.75",
            "category" : "drink"
        },
        {
            "id": 66,
            "name": "Ginger Beer",
            "image": "http://dummyimage.com/115x100.png/ff9966/ffffff",
            "description": "A spicy and refreshing non-alcoholic drink made with ginger, lemon, and sugar, served over ice.",
            "ingredients": [{"name":"Ginger"}, {"name":"Lemon juice"}, {"name":"Sugar"}, {"name":"Water"}, {"name":"Ice"}],
            "tags": [{"name":"Non-Alcoholic"}, {"name":"Soda"}, {"name":"Spicy"}],
            "price": "$3.99",
            "category" : "drink"
        }
    ],
    Wine: [
        {
            "id": 67,
            "name": "Old Fashioned",
            "image": "http://dummyimage.com/115x100.png/cc6600/ffffff",
            "description": "A timeless cocktail made with bourbon, sugar, bitters, and a twist of orange peel.",
            "ingredients": [{"name":"Bourbon"}, {"name":"Sugar"}, {"name":"Bitters"}, {"name":"Orange peel"}],
            "tags": [{"name":"Alcoholic"}, {"name":"Cocktail"}],
            "price": "$14.00",
            "category" : "drink"
        },
        {
            "id": 68,
            "name": "Lemon Iced Tea",
            "image": "http://dummyimage.com/115x100.png/99ccff/ffffff",
            "description": "A refreshing iced tea with a twist of lemon, sweetened to perfection and served over ice.",
            "ingredients": [{"name":"Black tea"}, {"name":"Lemon juice"}, {"name":"Sugar"}, {"name":"Ice"}],
            "tags": [{"name":"Non-Alcoholic"}, {"name":"Tea"}],
            "price": "$3.50",
            "category" : "drink"
        },
        {
            "id": 69,
            "name": "Piña Colada",
            "image": "http://dummyimage.com/115x100.png/ffcc66/ffffff",
            "description": "A tropical cocktail made with rum, coconut cream, and pineapple juice, blended to perfection.",
            "ingredients": [{"name":"Rum"}, {"name":"Coconut cream"}, {"name":"Pineapple juice"}, {"name":"Ice"}],
            "tags": [{"name":"Alcoholic"}, {"name":"Cocktail"}, {"name":"Tropical"}],
            "price": "$13.99",
            "category" : "drink"
        },
        {
            "id": 70,
            "name": "Rose Lemonade",
            "image": "http://dummyimage.com/115x100.png/ff6699/ffffff",
            "description": "A fragrant and refreshing drink made with rose water, lemon juice, and a hint of sweetness, served over ice.",
            "ingredients": [{"name":"Rose water"}, {"name":"Lemon juice"}, {"name":"Sugar"}, {"name":"Water"}, {"name":"Ice"}],
            "tags": [{"name":"Non-Alcoholic"}, {"name":"Juice"}, {"name":"Floral"}],
            "price": "$4.99",
            "category" : "drink"
        }
    ],
    Beer: [
        {
            "id": 71,
            "name": "Blackberry Mojito",
            "image": "http://dummyimage.com/115x100.png/660066/ffffff",
            "description": "A refreshing twist on the classic mojito, made with muddled blackberries, mint, lime, and rum.",
            "ingredients": [{"name":"Blackberries"}, {"name":"Mint leaves"}, {"name":"Lime juice"}, {"name":"White rum"}, {"name":"Sugar"}, {"name":"Soda water"}],
            "tags": [{"name":"Alcoholic"}, {"name":"Cocktail"}, {"name":"Fruity"}],
            "price": "$12.00",
            "category" : "drink"
        },
        {
            "id": 72,
            "name": "Lavender Lemonade",
            "image": "http://dummyimage.com/115x100.png/cc99ff/ffffff",
            "description": "A calming and aromatic lemonade infused with lavender and fresh lemon juice.",
            "ingredients": [{"name":"Lemon juice"}, {"name":"Lavender syrup"}, {"name":"Sugar"}, {"name":"Water"}, {"name":"Ice"}],
            "tags": [{"name":"Non-Alcoholic"}, {"name":"Juice"}, {"name":"Floral"}],
            "price": "$5.50",
            "category" : "drink"
        },
        {
            "id": 73,
            "name": "Cucumber Cooler",
            "image": "http://dummyimage.com/115x100.png/99cc99/ffffff",
            "description": "A refreshing non-alcoholic drink made with fresh cucumber slices, mint, lime, and soda water.",
            "ingredients": [{"name":"Cucumber"}, {"name":"Mint leaves"}, {"name":"Lime juice"}, {"name":"Soda water"}, {"name":"Ice"}],
            "tags": [{"name":"Non-Alcoholic"}, {"name":"Mocktail"}, {"name":"Fresh"}],
            "price": "$4.75",
            "category" : "drink"
        },
        {
            "id": 74,
            "name": "Café Mocha",
            "image": "http://dummyimage.com/115x100.png/663300/ffffff",
            "description": "A delicious coffee drink made with espresso, steamed milk, and chocolate syrup, topped with whipped cream.",
            "ingredients": [{"name":"Espresso"}, {"name":"Milk"}, {"name":"Chocolate syrup"}, {"name":"Whipped cream"}],
            "tags": [{"name":"Non-Alcoholic"}, {"name":"Coffee"}, {"name":"Sweet"}],
            "price": "$5.25",
            "category" : "drink"
        }
    ],
};


function FoodGallery({ type }) {
    const [activeCategory, setActiveCategory] = useState(type === "food" ? "Burgers" : "Coffee");
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const categories = type === "food" ? Object.keys(foodData) : Object.keys(drinkData);
    const data = type === "food" ? foodData : drinkData;

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedItem(null);
    };

    return (
        <section className={classes.gallerySection} id={ type == "food" ? "foodMenuShowcase" : "drinkMenuShowcase" }>
            <p className={classes.hint}>{type === "food" ? "OUR SPECIAL MENU" : null}</p>
            <p className={classes.header}>{type === "food" ? "POPULAR DISHES" : "POPULAR DRINKS"}</p>
            <ul className={classes.selectorContainer}>
                {categories.map((category) => (
                    <li
                        key={category}
                        className={`${classes.typeSelectors} ${activeCategory === category ? classes.active : ""}`}
                        onClick={() => setActiveCategory(category)}
                    >
                        {category}
                    </li>
                ))}
            </ul>
            <div className={classes.menuItemsContainer}>
                {data[activeCategory].map((item) => (
                    <MenuItem key={item.id} item={item} onClick={() => handleItemClick(item)} real={false} />
                ))}
            </div>
            { type === "drink" ? <Link to="/menu"><div className={classes.goToMenuBtn}>Go To The Full Menu</div></Link> : null }
                  {/* Render Modal */}
            {isModalVisible && (
                <Modal selectedItem={selectedItem} onCloseModal={closeModal} />
            )}
        </section>
    );
}

export default FoodGallery;
