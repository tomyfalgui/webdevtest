import React from "react"
import { Switch, BrowserRouter as Router, Route, Link } from "react-router-dom"
import Home from "./components/Home"
import FoodForm from "./components/FoodForm"
import FoodEdit from "./components/FoodEdit"
import CategoryForm from "./components/CategoryForm"
import CategorySpecific from "./components/CategorySpecific"
import styled, { createGlobalStyle } from "styled-components"

const Navigation = styled.nav`
  display: flex;
  margin-bottom: 50px;

  a {
    color: black;
    text-decoration: none;
    margin-right: 8px;
  }
`

const GlobalStyles = createGlobalStyle`
  html {
    font-size: 100%;
    box-sizing: border-box;
  }

  *, *::before, *::after {
    box-sizing: inherit;
    margin: 0;
    padding: 0;
  }
`

function App() {
  return (
    <Router>
      <GlobalStyles />
      <Navigation>
        <Link to="/">Home</Link>
        <Link to="/food">Food</Link>
        <Link to="categories">Categories</Link>
      </Navigation>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/food" exact component={FoodForm} />
        <Route path="/food/edit/:id" component={FoodEdit} />
        <Route path="/categories" exact component={CategoryForm} />
        <Route path="/categories/:id" component={CategorySpecific} />
      </Switch>
    </Router>
  )
}

export default App
