import { useEffect, useState } from "react";
import Recipes from "./Recipes";
import './Recipes.css'

export default function RecipesDetails({ setPage, productId }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      const response = await fetch(`https://dummyjson.com/recipes/${productId}`);
      const data = await response.json();
      setProduct(data);
    }

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (!product) {
    return;
  }

  return (
    <>
      <button className="BackBtn" onClick={() => setPage(<Recipes setPage={setPage} />)}>◀ Geri</button>
      <div className="recipesDetailsContainer">
        <div className="recipesDetails">
          <h1>{product.name} ⭐️{product.rating}</h1>
          <img src={product.image} alt="" />
        </div>
        <div className="productInfo">
        <div className="recipesPrepations">
        <div className="recipesIngredients">
          <h2>INGREDIENTS</h2> 
          <ul>
            {product.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div className="recipesInstructions">
          <h2>INSTRUCTIONS</h2> 
          <ol>
            {product.instructions.map((instructions, index) => (
              <li key={index}> {instructions} </li>
            ))}
          </ol>
        </div>
        </div>
        <div className="prepations">
          <h3>Prep Time Minutes: {product.prepTimeMinutes} ⏱️</h3>
          <h3>Cook Time Minutes: {product.cookTimeMinutes} ⏱️</h3>
          <h3>Servings: {product.servings} 🍽️</h3>
        </div>
        </div>
      </div>
    </>
  )
}