const StarRating = ({ value }) => {
    const stars = Array.from({ length: 5 }, (_, i) => (
      <span key={i}>{i < value ? '★' : '☆'}</span>
    ));
    return <span className="stars fs-3">{stars}</span>;
  };
  
  export default StarRating;
  