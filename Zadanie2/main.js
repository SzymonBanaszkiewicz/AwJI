let recipes = [];
let favoriteIds = JSON.parse(localStorage.getItem("favorites")) || [];
let showFav = false;

let filters = {
    name: "",
    cuisine: "",
    difficulty: "",
    prepTime: Infinity
};

fetch("https://dummyjson.com/recipes")
    .then(response => response.json())
    .then(data => {
        recipes = data.recipes;

        document.getElementById("apiData").textContent =
            JSON.stringify(recipes, null, 2);

        generateCuisineSelect(recipes);
        generateDifficultySelect(recipes);
        generatePrepTimeSelect(recipes)

        renderRecipes(recipes);
    })
    .catch(error => {
        console.error("Error loading recipes:", error);
    });

function renderRecipes(recipesList) {
    const table = document.getElementById("recipesTable");
    table.innerHTML = "";

    recipesList.forEach(element => {
        const tr = document.createElement("tr");

        const tdName = document.createElement("td");
        tdName.textContent = element.name;
        tdName.style.cursor = "pointer";
        tdName.className = "text-primary text-decoration-underline";
        tdName.addEventListener("click", () => {
            showRecipeDetails(element);
        }); 
        tr.appendChild(tdName);

        const tdCuisine = document.createElement("td");
        tdCuisine.textContent = element.cuisine;
        tr.appendChild(tdCuisine);

        const tdDifficulty = document.createElement("td");
        tdDifficulty.textContent = element.difficulty;
        tr.appendChild(tdDifficulty);

        const tdPrepTime = document.createElement("td");
        tdPrepTime.textContent = element.prepTimeMinutes + " min";
        tr.appendChild(tdPrepTime);

        const tdRating = document.createElement("td");
        tdRating.textContent = element.rating;
        tr.appendChild(tdRating);

        const td = document.createElement("td");
        td.className = "text-center"; 
        const tdFav = document.createElement("i");
        tdFav.className = "fa-regular fa-star";
        if (favoriteIds.includes(element.id)) {
            tdFav.className = "fa-solid fa-star text-warning"; 
        } else {
            tdFav.className = "fa-regular fa-star";
        }        
        tdFav.dataset.recipeId = element.id;

        tdFav.addEventListener("click", (event) => {
            const clickedId = event.target.dataset.recipeId;
            toggleFavorite(clickedId);  
        })

        td.appendChild(tdFav);
        tr.appendChild(td);

        table.appendChild(tr);
    });

    let counter = document.getElementById("recipesCounter")
    counter.innerHTML = "Recipes matching: "+recipesList.length+"/"+recipes.length;
}

function generateCuisineSelect(recipesList) {
    const select = document.getElementById("cuisineSelect");

    const uniqueCuisines = [
        ...new Set(recipesList.map(recipe => recipe.cuisine))
    ];

    uniqueCuisines.sort().forEach(cuisine => {
        const option = document.createElement("option");

        option.value = cuisine;
        option.textContent = cuisine;

        select.appendChild(option);
    });
}

function generateDifficultySelect(recipesList) {
    const select = document.getElementById("difficultySelect");

    const uniqueDifficulties = [
        ...new Set(recipesList.map(recipe => recipe.difficulty))
    ];

    uniqueDifficulties.sort().forEach(difficulty => {
        const option = document.createElement("option");

        option.value = difficulty;
        option.textContent = difficulty;

        select.appendChild(option);
    });
}

function generatePrepTimeSelect(recipesList) {
    if (!recipesList || recipesList.length === 0) return;

    const prepTimes = recipesList.map(recipe => recipe.prepTimeMinutes);
    const minTime = Math.min(...prepTimes);
    const maxTime = Math.max(...prepTimes);

    const rangeInput = document.getElementById("prepTimeRange");

    rangeInput.min = minTime;
    rangeInput.max = maxTime;
    
    rangeInput.value = maxTime;
    filters.prepTime = maxTime;

    const minTimeSpan = document.getElementById("minTime");
    const maxTimeSpan = document.getElementById("maxTime");
    if (minTimeSpan) minTimeSpan.textContent = minTime + " min";
    if (maxTimeSpan) maxTimeSpan.textContent = maxTime + " min";
}

const nameFilterInput = document.getElementById("nameFilter");

nameFilterInput.addEventListener("input", event => {
    filters.name = event.target.value.trim().toLowerCase();
    filterRecipes(recipes, filters);
});

const cuisineSelect = document.getElementById("cuisineSelect");

cuisineSelect.addEventListener("change", event => {
    filters.cuisine = event.target.value;
    filterRecipes(recipes, filters);
});

const difficultySelect = document.getElementById("difficultySelect");

difficultySelect.addEventListener("change", event => {
    filters.difficulty = event.target.value;
    filterRecipes(recipes, filters);
});

function filterRecipes(recipes, filters) {
    const filteredRecipes = recipes.filter(recipe => {
        const matchesFav = !showFav || favoriteIds.includes(recipe.id);

        const matchesName = recipe.name.toLowerCase().includes(filters.name);

        const matchesCuisine =
            filters.cuisine === "" ||
            recipe.cuisine === filters.cuisine;

        const matchesDifficulty =
            filters.difficulty === "" ||
            recipe.difficulty === filters.difficulty;

        const matchesPrepTime = recipe.prepTimeMinutes <= filters.prepTime;

        return matchesFav && matchesName && matchesCuisine && matchesDifficulty && matchesPrepTime;
    });

    renderRecipes(filteredRecipes);
}

const resetButton = document.getElementById("resetButton");

resetButton.addEventListener("click", event => {
    filters.name = ""
    filters.cuisine = ""
    filters.difficulty = ""
    const maxVal = Number(prepTimeRange.max);
    filters.prepTime = maxVal;
    prepTimeRange.value = maxVal;
    showFav = false;

    nameFilterInput.value = ""
    cuisineSelect.value = ""
    difficultySelect.value = ""

    filterRecipes(recipes, filters)
});

const seeFavButton = document.getElementById("seeFavButton");

seeFavButton.addEventListener("click", event => {
    
    showFav = !showFav;
    filterRecipes(recipes, filters)
});

function toggleFavorite(id) {
    const numericId = Number(id);

    if (favoriteIds.includes(numericId)) {
        favoriteIds = favoriteIds.filter(favId => favId !== numericId);
    } else {
        favoriteIds.push(numericId);
    }

    localStorage.setItem("favorites", JSON.stringify(favoriteIds));
    filterRecipes(recipes, filters)
}

const prepTimeRange = document.getElementById("prepTimeRange");

prepTimeRange.addEventListener("input", event => {
    const val = Number(event.target.value);
    filters.prepTime = val; 

    filterRecipes(recipes, filters); 
});

function showRecipeDetails(recipe) {
    document.getElementById("recipeModalLabel").textContent = recipe.name;
    document.getElementById("modalCuisine").textContent = recipe.cuisine;
    document.getElementById("modalDifficulty").textContent = recipe.difficulty;
    document.getElementById("modalPrepTime").textContent = recipe.prepTimeMinutes + " min";
    
    const modalImg = document.getElementById("modalImage");
    if (recipe.image) {
        modalImg.src = recipe.image;
        modalImg.style.display = "block";
    } else {
        modalImg.style.display = "none";
    }

    const ingredientsList = document.getElementById("modalIngredients");
    ingredientsList.innerHTML = "";
    recipe.ingredients.forEach(ingredient => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = ingredient;
        ingredientsList.appendChild(li);
    });

    const instructionsList = document.getElementById("modalInstructions");
    instructionsList.innerHTML = "";
    recipe.instructions.forEach(instruction => {
        const li = document.createElement("li");
        li.className = "mb-2";
        li.textContent = instruction;
        instructionsList.appendChild(li);
    });

    const modalElement = document.getElementById("recipeModal");
    const recipeModal = new bootstrap.Modal(modalElement);
    recipeModal.show();
}