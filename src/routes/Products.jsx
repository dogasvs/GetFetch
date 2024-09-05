import { useEffect, useState } from 'react'
import ProductsComments from "./ProductsComments"
import './Products.css'

function Products({ setPage }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [limit, setLimit] = useState(30);
  const [total, setTotal] = useState(0);
  const [pageNumbers, setPageNumber] = useState(1);
  const [filterText, setFilterText] = useState('');

  async function getData() {
    const skip = (pageNumbers - 1) * limit;
    const fetchUrl = `https://dummyjson.com/products?delay=0&limit=${limit}&skip=${skip}`;
    const data = await fetch(fetchUrl).then(res => res.json());
    setProducts(data.products);
    setFilteredProducts(data.products);
    setTotal(data.total);
  }

  useEffect(() => {
    getData();
  }, [pageNumbers]);

  useEffect(() => {
    const filtered = products.filter(x =>
      x.title.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [filterText, products]); 

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

  function handleProductClick(productId) {
    setPage(<ProductsComments productId={productId} setPage={setPage} />);
  }

  return (
    <>
      <SearchBar filterText={filterText} setFilterText={setFilterText} />
      <div className="ProductContainer">
        {filteredProducts.map(x => <div className="productItem" key={x.id}>
          <h4>{x.title}</h4>
          <img src={x.thumbnail} />
          <a href="#" className='moreInfo' onClick={(e) => { e.preventDefault(); handleProductClick(x.id); }}>Daha fazlası</a>
        </div>)}
      </div>

      {pageCount > 0 &&
        <ul className="pagination">
          <li><a href="#" onClick={handlePrevPage}>&lt;</a></li>
          {Array.from({ length: pageCount }, (v, i) => (i + 1))
            .map(x => <li key={x}><a href="#" className={pageNumbers === x ? 'activePage' : ''} onClick={e => { e.preventDefault(); changePage(x); }}>{x}</a></li>)
          }
          <li><a href="#" onClick={handleNextPage}>&gt;</a></li>
        </ul>
      }
    </>
  )
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

export default Products
