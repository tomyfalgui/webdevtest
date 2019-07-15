import React from "react"
import { Formik, Form, Field } from "formik"
import tomyFetch from "../axios.config"
import { Link } from "react-router-dom"

function AddFood(props) {
  const [food, setFood] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  async function deleteFood(id) {
    const response = await tomyFetch.delete("/food", {
      data: { id }
    })

    if (response) {
      props.history.push("/")
    }
  }

  React.useEffect(() => {
    ;(async function() {
      const newFood = await tomyFetch.get("/food")

      setFood(newFood.data)
    })()
  }, [])

  return (
    <>
      <div>
        <h1>My Form</h1>
        {loading ? "loading" : ""}
        <Formik
          initialValues={{ name: "", description: "", image: "", price: 0 }}
          onSubmit={async (values, actions) => {
            setLoading(true)
            const data = new FormData()
            data.append("name", values.name)
            data.append("description", values.description)
            data.append("price", values.price + "")
            data.append("image", values.image)
            const resp = await tomyFetch.post("/food", data)
            if (resp) {
              typeof window !== "undefined" &&
                localStorage.setItem("flash", `${resp.data.name} was created.`)
              setLoading(false)
            }

            actions.setSubmitting(false)
            props.history.push("/")
          }}
          render={props => (
            <Form>
              <Field
                type="text"
                name="name"
                placeholder="Name"
                required={true}
              />
              <Field
                name="description"
                component="textarea"
                placeholder="Description"
                required={true}
              />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={e => props.setFieldValue("image", e.target.files[0])}
              />
              <Field type="number" name="price" required={true} />
              <button type="submit">Submit</button>
            </Form>
          )}
        />
      </div>
      <div>
        <h2>Food List</h2>
        {food.map(el => {
          return (
            <div key={el._id}>
              <span>{el.name}</span>
              <span>{el.description}</span>
              <span>
                {el.image ? (
                  <img src={el.image} alt="" style={{ width: "50px" }} />
                ) : (
                  <img
                    src="https://res.cloudinary.com/dkmvjckjd/image/upload/v1562694879/test/edbdad87-3a04-4c8b-bbd0-970788a76cbe.jpg"
                    alt=""
                    style={{ width: "50px" }}
                  />
                )}
              </span>
              <span>{el.price}</span>
              <button onClick={() => deleteFood(el._id)}>Delete</button>
              <Link to={`/food/edit/${el._id}`}>Edit</Link>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default AddFood
