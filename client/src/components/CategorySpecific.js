import React from "react"
import tomyFetch from "../axios.config"

export default function CategorySpecific(props) {
  const [category, setCategory] = React.useState(null)
  const [inputVal, setInputVal] = React.useState("")
  const [food, setFood] = React.useState([])
  const [editing, setEditing] = React.useState(false)

  async function fetchSpecificCategory(id) {
    const [category, food] = await Promise.all([
      tomyFetch.get(`/category/${id}`),
      tomyFetch.get("/food")
    ])

    try {
      setCategory(category.data)
      setInputVal(category.data.name)
      setFood(food.data)
    } catch (error) {
      props.history.push("/category")
    }
  }

  async function addToCategory(categoryId, foodId) {
    const a = await tomyFetch.patch(`/category/add/${categoryId}`, { foodId })
    fetchSpecificCategory(categoryId)
  }

  async function removeFromCategory(categoryId, foodId) {
    const a = await tomyFetch.patch(`/category/remove/${categoryId}`, {
      foodId
    })
    fetchSpecificCategory(categoryId)
  }

  async function handleCategoryNameChangeSubmit(e, categoryId) {
    e.preventDefault()

    await tomyFetch.patch(`/category/edit/${categoryId}`, {
      newName: inputVal
    })

    setEditing(false)
    fetchSpecificCategory(categoryId)
  }

  async function deleteCategory(categoryId) {
    await tomyFetch.delete(`/category/delete/${categoryId}`)
    props.history.push("/categories")
  }

  React.useEffect(() => {
    fetchSpecificCategory(props.match.params.id)
  }, [])

  if (category) {
    const IdList = food.map(el => el._id)
    const CategoryFoodIdList = category.foods.map(el => el._id)
    const notYetAdded = food.filter(el => {
      return !CategoryFoodIdList.includes(el._id)
    })
    const added = category.foods.filter(el => IdList.includes(el._id))

    return (
      <div>
        {editing ? (
          <form onSubmit={e => handleCategoryNameChangeSubmit(e, category._id)}>
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
            />
            <button type="submit">Submit Changes</button>
            <button type="button" onClick={() => setEditing(false)}>
              Cancel Editing
            </button>
          </form>
        ) : (
          <>
            <h1>{category.name}</h1>
            <button onClick={() => setEditing(true)}>Edit Name</button>
          </>
        )}
        <h2>Added Foods</h2>
        {added.map(el => (
          <div key={el._id}>
            <h1>{el.name}</h1>
            <button onClick={() => removeFromCategory(category._id, el._id)}>
              remove from categories
            </button>
          </div>
        ))}
        <h2>Not Added Foods</h2>
        {notYetAdded.map(el => (
          <div key={el._id}>
            <span>{el.name}</span>
            <button onClick={() => addToCategory(category._id, el._id)}>
              add to categories
            </button>
          </div>
        ))}
        <button onClick={() => deleteCategory(category._id)}>
          Delete Category
        </button>
      </div>
    )
  }
  return "Loading"
}
