
const ReviewText = ({productId,userId,pname,mainimage,title,contents}) => {




    return(
        <div>
            <img src={mainimage}></img>
          <h1>상품이름:{pname}</h1>
          <h2>작성자:{userId}</h2>
          <h3>제목:{title}</h3>  
          <p>리뷰내용:{contents}</p>
        </div>
    )
}
export default ReviewText;