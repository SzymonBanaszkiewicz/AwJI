let recipes = [];

let filters = {
    name: "",
    cuisine: "",
    difficulty: ""
};

fetch("https://dummyjson.com/recipes")
    .then(response => response.json())
    .then(data => {
        recipes = data.recipes;

        document.getElementById("apiData").textContent =
            JSON.stringify(recipes, null, 2);

        generateCuisineSelect(recipes);
        generateDifficultySelect(recipes);

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

const nameFilterInput = document.getElementById("nameFilter");

nameFilterInput.addEventListener("input", event => {
    filters.name = event.target.value.trim().toLowerCase();
    filterRecipes(filters);
});

const cuisineSelect = document.getElementById("cuisineSelect");

cuisineSelect.addEventListener("change", event => {
    filters.cuisine = event.target.value;
    filterRecipes(filters);
});

const difficultySelect = document.getElementById("difficultySelect");

difficultySelect.addEventListener("change", event => {
    filters.difficulty = event.target.value;
    filterRecipes(filters);
});

function filterRecipes(filters) {
    const filteredRecipes = recipes.filter(recipe => {
        const matchesName =
            recipe.name.toLowerCase().includes(filters.name);

        const matchesCuisine =
            filters.cuisine === "" ||
            recipe.cuisine === filters.cuisine;

        const matchesDifficulty =
            filters.difficulty === "" ||
            recipe.difficulty === filters.difficulty;

        return matchesName && matchesCuisine && matchesDifficulty;
    });

    renderRecipes(filteredRecipes);
}

const resetButton = document.getElementById("resetButton");

resetButton.addEventListener("click", event => {
    filters.name = ""
    filters.cuisine = ""
    filters.difficulty = ""

    nameFilterInput.value = ""
    cuisineSelect.value = ""
    difficultySelect.value = ""

    filterRecipes(filters)
});