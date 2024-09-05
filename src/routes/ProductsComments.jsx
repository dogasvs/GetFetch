import { useEffect, useState } from "react";
import Products from "./Products";
import './Products.css'

export default function CommentsDetail({ setPage, productId }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      const response = await fetch(`https://dummyjson.com/products/${productId}`);
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
      <button className="BackBtn" onClick={() => setPage(<Products setPage={setPage} />)}>◀ Geri</button>
    <div className="Product">
      <div className="ProductInfo">
        <h2>{product.title}</h2>
        <img src={product.thumbnail} alt={product.title} />
        <p>{product.description}</p>
      </div>
      <div className="ProductComments">
      <h3>Total Comments: 3</h3>
        {product.reviews.map((review, index) => (
            <div className="ProductCommentsItem" key={index}>
              <p><strong>{review.reviewerName}</strong></p>
              <p>{review.comment}</p>
            </div>
          ))}
      </div>
    </div>
    </>
  );
}