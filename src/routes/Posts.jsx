import { useEffect, useRef, useState } from "react";
import './Posts.css'

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState(30);
  const [total, setTotal] = useState(0);
  const [pageNumbers, setPageNumber] = useState(1);
  const [comments, setComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);

  async function getData() {
    const skip = (pageNumbers - 1) * limit;
    const fetchUrl = `https://dummyjson.com/posts?delay=0&limit=${limit}&skip=${skip}`;

    const data = await fetch(fetchUrl).then(res => res.json());
    setPosts([...data.posts]);
    setTotal(data.total);
  }

  async function fetchComments(postId) {
    const commentsUrl = `https://dummyjson.com/posts/${postId}/comments`;
    const data = await fetch(commentsUrl).then(res => res.json());
    setComments(data.comments);
    setIsModalOpen(true);
    console.log('tıklanınca çalıştım');
  }

  useEffect(() => {
    getData();
  }, [pageNumbers]);

  useEffect(() => {
    const filtered = posts.filter(x =>
      x.title.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [filterText, posts]); 

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

  function handleCommentsClick(postId) {
    fetchComments(postId);
  }

  return (
    <>
     <SearchBar filterText={filterText} setFilterText={setFilterText} />
      <div className="PostsContainer">
        {(filterText ? filteredPosts : posts).map(x => (
          <div className="postItem" key={x.id}>
            <h4>{x.title}</h4>
            <p>{x.body}</p>
            <strong> 👍🏻 {x.reactions.likes} </strong>  <strong> 👎🏻 {x.reactions.dislikes} </strong>
            <p>👁️ {x.views} </p>
            <button onClick={() => handleCommentsClick(x.id)}>comments</button>
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
      {isModalOpen && <Modal comments={comments} setIsModalOpen={setIsModalOpen} />}
    </>
  )
}

function Modal({ comments, setIsModalOpen }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, []);

  function handleClose() {
    dialogRef.current.close();
    setIsModalOpen(false);
  }

  return (
    <dialog className="modal" ref={dialogRef}>
      <h3>Comments</h3>
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>
              {comment.body} - <strong>{comment.user.username}</strong> - <strong>{comment.user.fullName}</strong> <strong>❤️ {comment.likes} </strong>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments</p>
      )}
      <button onClick={handleClose}>Close</button>
    </dialog>
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
