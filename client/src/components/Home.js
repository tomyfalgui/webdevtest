import React from "react"
import FoodCard from "./FoodCard"
import styled from "styled-components"
import tomyFetch from "../axios.config"
import matchSorter from "match-sorter"

const Main = styled.main`
  padding: 16px;
  .input-box {
    margin-bottom: 16px;

    input {
      width: 100%;
      padding: 8px;
    }
  }
`
const Container = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  @media screen and (max-width: 850px) {
    grid-template-columns: 1fr;
  }

  aside {
    margin-top: 20px;

    .header {
      font-size: 1.5rem;
      margin-bottom: 24px;
      display: inline-block;
    }

    .grid-container {
      display: grid;
      grid-template-columns: 4fr 1.5fr 1.5fr 2fr;
      grid-row-gap: 8px;
    }
  }
`
const Food = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 250px));
  grid-gap: 16px;
`

const Cart = styled.div`
  display: grid;
  grid-template-columns: 4fr 1.5fr 1.5fr 2fr;
  grid-template-areas: "name . total .";
  margin-top: 16px;
  border-top: 1px dashed black;

  p:first-child {
    grid-area: name;
  }

  p:nth-child(2) {
    grid-area: total;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;

  button {
    color: white;
    width: 16px;
    height: 16px;
    font-size: 14px;
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
  }
  .add {
    background-color: #1f8019;
  }

  .subtract {
    background-color: #ca332b;
  }
  button:first-child {
    margin-right: 8px;
  }
`

function IndexPage(props) {
  const [flash, setFlash] = React.useState("")
  const [orders, setOrders] = React.useState({})
  const [food, setFood] = React.useState([])
  const [category, setCategory] = React.useState([])
  const [totalPrice, setTotalPrice] = React.useState(0)
  const [query, setQuery] = React.useState("")
  const [categoryFilter, setCategoryFiler] = React.useState("none")

  function addToOrder(foodObj) {
    const newOrders = { ...orders }

    if (newOrders[foodObj.name]) {
      newOrders[foodObj.name].count++
    } else {
      newOrders[foodObj.name] = {
        price: foodObj.price,
        count: 1
      }
    }

    setOrders(newOrders)
    calculatePrice(newOrders)
  }

  function subtractOrder(foodName) {
    const newOrders = { ...orders }

    if (newOrders[foodName] && newOrders[foodName].count > 1) {
      newOrders[foodName].count--
    } else if (newOrders[foodName] && newOrders[foodName].count === 1) {
      delete newOrders[foodName]
    }

    setOrders(newOrders)
    calculatePrice(newOrders)
  }

  function calculatePrice(obj) {
    let cumulativePrice = 0
    Object.keys(obj).map(el => {
      cumulativePrice += obj[el].count * obj[el].price
    })

    setTotalPrice(cumulativePrice)
  }

  React.useEffect(() => {
    const flashMessage =
      typeof window !== "undefined" && localStorage.getItem("flash")
    if (flashMessage) {
      setFlash(flashMessage)
      typeof window !== "undefined" && localStorage.removeItem("flash")
    }

    ;(async function() {
      const [food, category] = await Promise.all([
        tomyFetch.get("/food"),
        tomyFetch.get("/category")
      ])

      const toSet = [...food.data]

      food.data.forEach((el, i) => {
        const categories = []
        category.data.forEach(cat => {
          cat.foods.forEach(food => {
            if (food._id === el._id) {
              categories.push(cat.name)
            }
          })
        })
        toSet[i].categories = categories
      })

      setFood(food.data)
      setCategory(category.data)
    })()
  }, [])

  const filtered =
    categoryFilter !== "none"
      ? food.filter(el => el.categories.includes(categoryFilter))
      : food
  return (
    <Main>
      <div className="input-box">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <select
          name=""
          defaultValue="none"
          onChange={e => setCategoryFiler(e.target.value)}
        >
          <option value="none">Any Category</option>
          {category.map(el => {
            return <option value={el.name}>{el.name}</option>
          })}
        </select>
      </div>
      <Container>
        <div>
          {flash && flash}
          <Food>
            {matchSorter(filtered, query, { keys: ["name"] }).map(el => {
              return (
                <FoodCard
                  {...el}
                  key={el._id}
                  addToOrder={addToOrder}
                  categories={el.categories}
                />
              )
            })}
          </Food>
        </div>
        <aside>
          <span className="header">Your orders</span>
          <div className="grid-container">
            {Object.keys(orders).map(el => {
              return (
                <React.Fragment key={el}>
                  <span>{el}</span>
                  <span>{orders[el].count}</span>
                  <span>x{orders[el].price}</span>
                  <ButtonContainer>
                    <button
                      onClick={() =>
                        addToOrder({ name: el, price: orders[el].price })
                      }
                      className="add"
                    >
                      +
                    </button>
                    <button
                      onClick={() => subtractOrder(el)}
                      className="subtract"
                    >
                      -
                    </button>
                  </ButtonContainer>
                </React.Fragment>
              )
            })}
          </div>

          {totalPrice > 0 && (
            <Cart>
              <p>Total</p>
              <p>{totalPrice}</p>
            </Cart>
          )}
        </aside>
      </Container>
    </Main>
  )
}

export default IndexPage
