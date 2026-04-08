const RestaurantCard = ({ data }) => {
  return (
    <div className="restaurant-card">
      <img
        src={`http://localhost:5000/uploads/${data.image}`}
        alt={data.name}
      />

      <h3>{data.name}</h3>
      <p>{data.location}</p>

      <div className="info">
        <span>⭐ {data.rating}</span>
      </div>
    </div>
  );
};

export default RestaurantCard;