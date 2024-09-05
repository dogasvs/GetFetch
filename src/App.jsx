import { useEffect, useState } from 'react'
import './App.css'
import Posts from './routes/Posts'
import Recipes from './routes/Recipes'
import Products from './routes/Products'

function App() {
  const [page, setPage] = useState(null);

  useEffect(() => {
    setPage(<Products setPage={setPage} />); //sayfa ilk çalıştığında setPage değeri
  }, []);

  return (
    <div className="container">
      <div className="Navbar">
      <ul className='nav'>
        <li><a href="#" onClick={() => setPage(<Products setPage={setPage} />)}>Products</a></li>
        <li><a href="#" onClick={() => setPage(<Recipes setPage={setPage} />)}>Recipes</a></li>
        <li><a href="#" onClick={() => setPage(<Posts setPage={setPage} />)}>Posts</a></li>
      </ul>
      </div>
      <hr />
      {page}
    </div>
  )
}


export default App
