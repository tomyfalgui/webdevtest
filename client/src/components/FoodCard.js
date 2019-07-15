import React from "react"
import styled from "styled-components"

const FoodContainer = styled.div`
  position: relative;
  background-color: #891e1d;
  min-height: 200px;
  padding-top: 30px;
  margin-bottom: 24px;
  margin-top: 20px;
  border-radius: 5px;
  padding: 16px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    max-width: 100%;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
  }

  h2 {
    color: white;
    margin-top: 10px;
    margin-bottom: 16px;
  }

  button {
    position: absolute;
    bottom: -10px;
    color: white;
    font-weight: bold;
    background-color: #ed2b32;
    border: 0;
    font-size: 16px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .category-container {
    align-self: flex-start;
    display: flex;
  }

  .category {
    background-color: #ed2b32;
    padding: 4px 8px;
    border-radius: 10px;
    margin-right: 4px;
  }

  .price {
    position: absolute;
    bottom: 12px;
  }

  .description {
    margin-bottom: 24px;
    max-width: 200px;
    word-break: break-all;
  }
`

function FoodCard(props) {
  return (
    <FoodContainer key={props._id}>
      <h2>{props.name}</h2>
      <img
        src={
          props.image ||
          "https://res.cloudinary.com/dkmvjckjd/image/upload/v1562694879/test/edbdad87-3a04-4c8b-bbd0-970788a76cbe.jpg"
        }
        alt=""
      />
      <p className="description">{props.description}</p>
      <div className="category-container">
        {props.categories.map((el, i) => {
          return (
            <span key={i} className="category">
              {el}
            </span>
          )
        })}
      </div>
      <span className="price">${props.price}</span>
      <button
        onClick={() =>
          props.addToOrder({ name: props.name, price: props.price })
        }
      >
        +
      </button>
    </FoodContainer>
  )
}

export default FoodCard
