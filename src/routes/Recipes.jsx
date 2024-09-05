import { useEffect, useState } from "react";
import './Recipes.css'
import RecipesDetails from "./RecipesDetails"

export default function Recipes({ setPage }) {
  const [recipes, setRecipes] = useState([]);
  const [limit, setLimit] = useState(30);
  const [total, setTotal] = useState(0);
  const [pageNumbers, setPageNumber] = useState(1);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterText, setFilterText] = useState('');

  async function getData() {
    const skip = (pageNumbers - 1) * limit;
    const fetchUrl = `https://dummyjson.com/recipes?delay=0&limit=${limit}&skip=${skip}`;

    const data = await fetch(fetchUrl).then(res => res.json());
    setRecipes([...data.recipes]);
    setFilteredProducts(data.recipes);
    setTotal(data.total);
  }

  useEffect(() => {
    getData();
  }, [pageNumbers]);

  useEffect(() => {
    const filtered = recipes.filter(x =>
      x.name.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [filterText, recipes]); 


  function changePage(pageNumber) {
    setPageNumber(pageNumber);
  }

  const pageCount = Math.ceil(total / limit);

  function handlePrevPage(e) {
    e.preventDefault();
    if ((pageNumbers - 1) > 0) {
      setPageNumber(pageNumbers - 1);
    }
  }

  function handleNextPage(e) {
    e.preventDefault();
    if ((pageNumbers + 1) <= pageCount) {
      setPageNumber(pageNumbers + 1);
    }
  }


  function handleRecipeClick(id) {
    if (selectedRecipe === id) {
      setSelectedRecipe(null);
    } else {
      setSelectedRecipe(id);
    }
  }

  function handleProductClick(productId) {
    setPage(<RecipesDetails productId={productId} setPage={setPage} />);
  }

  return (
    <>
    <SearchBar filterText={filterText} setFilterText={setFilterText} />
    <div className="recipesContainer">
      {filteredProducts.map(x => ( 
        <div className="recipesItem" key={x.id} onClick={() => handleRecipeClick(x.id)}>
          <img src={x.image} className={selectedRecipe === x.id ? "hidden" : ""} />
          {selectedRecipe === x.id && (
            <div className="recipeDetails">
              <h1>{x.name}</h1>
              <h3>Meal Type: {x.mealType} </h3>
              <h3>Servings: {x.servings} </h3>
              <h3>Cuisine: {x.cuisine} </h3>
              <h3> ⭐️ {x.rating} / 5 </h3>
              <a href="#" className='moreInfo' onClick={(e) => { e.preventDefault(); handleProductClick(x.id); }}>Devamı &gt;</a>
            </div>
          )}
        </div>
      ))}
    </div>

    {pageCount > 0 && (
      <ul className="pagination">
        <li><a href="#" onClick={handlePrevPage}>&lt;</a></li>
        {Array
          .from({ length: pageCount }, (v, i) => (i + 1))
          .map(x => (
            <li key={x}>
              <a
                href="#"
                className={pageNumbers === x ? 'activePage' : ''}
                onClick={e => {
                  e.preventDefault();
                  changePage(x);
                }}
              >
                {x}
              </a>
            </li>
          ))}
        <li><a href="#" onClick={handleNextPage}>&gt;</a></li>
      </ul>
    )}
  </>
  );

}

function SearchBar({ setFilterText, filterText }) {
  return (
    <div className="searchWrapper">
      <img src="/img/search.svg" alt="" />
      <input
        type="text"
        value={filterText}
        placeholder="Search..."
        onChange={(e) => setFilterText(e.target.value)}
      />
    </div>
  );
}