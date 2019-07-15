import React from "react"
import tomyFetch from "../axios.config"
import { Link } from "react-router-dom"

export default function CategoryForm() {
  const [name, setName] = React.useState("")
  const [categories, setCategories] = React.useState([])

  async function fetchCategories() {
    const { data } = await tomyFetch.get("/category")
    setCategories(data)
  }
  React.useEffect(() => {
    fetchCategories()
  }, [])

  const handleSubmit = async function(e) {
    e.preventDefault()
    if (!name) {
      return
    }

    await tomyFetch.post("/category", { name })
    fetchCategories()
    setName("")
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      {categories.map(el => {
        return (
          <div key={el._id}>
            <Link to={`/categories/${el._id}`}>{el.name}</Link>
          </div>
        )
      })}
    </div>
  )
}
