import React from "react"
import tomyFetch from "../axios.config"
import { Formik, Form, Field } from "formik"

export default function FoodEdit(props) {
  const [fetching, setFetching] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [food, setFood] = React.useState({})
  const [loading, setLoading] = React.useState(false)

  //
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [price, setPrice] = React.useState(0)
  const [placeholderImage, setPlaceholderImage] = React.useState("")
  const [image, setImage] = React.useState(null)
  // const []

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    const data = new FormData()
    data.append("name", name)
    data.append("description", description)
    data.append("price", price + "")
    data.append("image", image)

    const resp = await tomyFetch.patch(
      `/food/edit/${props.match.params.id}`,
      data
    )
    setLoading(false)
    typeof window !== "undefined" &&
      localStorage.setItem("flash", `${name} edited.`)
    props.history.push("/")
  }

  React.useEffect(() => {
    ;(async function() {
      try {
        const {
          data: { name, description, price, image }
        } = await tomyFetch.get(`/food/${props.match.params.id}`)
        setFetching(false)
        setName(name)
        setDescription(description)
        setPlaceholderImage(image)
        setPrice(price)
      } catch (error) {
        setError(true)
      }
    })()
  }, [])

  if (error) {
    return "faking error"
  }

  if (fetching) {
    return "fetching"
  }

  if (food) {
    return (
      <div>
        <h1>Hello</h1>
        {loading ? "loading" : ""}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <textarea
            name="description"
            id=""
            cols="30"
            rows="10"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          {placeholderImage ? (
            <div>
              <img src={placeholderImage} alt="" style={{ width: "50px" }} />
            </div>
          ) : (
            "No Image Found"
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            id="image-picker"
            style={{ visibility: "hidden", display: "none" }}
            onChange={e => setImage(e.target.files[0])}
          />
          <label htmlFor="image-picker">
            {image ? "Change Image" : "Add Image"}
          </label>
          <input
            type="number"
            name="price"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            Submit
          </button>
        </form>
      </div>
    )
  }
}

/*

        {food && (
          <Formik
            initialValues={food}
            onSubmit={async (values, actions) => {
              setLoading(true)
              const data = new FormData()
              data.append("name", values.name)
              data.append("description", values.description)
              data.append("price", values.price + "")
              data.append("image", values.image)
              const resp = await tomyFetch.patch("/food/edit" + food._id, data)
              if (resp) {
                typeof window !== "undefined" &&
                  localStorage.setItem("flash", `${resp.data.name} was edited.`)
                setLoading(false)
              }
              actions.setSubmitting(false)
            }}
            render={formikProps => {
              console.log(food)
              return (
                <Form>
                  <Field name="name" type="text" />
                  <Field name="description" component="textarea" />
                  {formikProps.values.image ? (
                    <div>
                      <img
                        src={`${formikProps.values.image}`}
                        alt=""
                        style={{ width: "50px" }}
                      />
                    </div>
                  ) : (
                    "No Image Found"
                  )}
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    id="image-picker"
                    style={{ visibility: "hidden", display: "none" }}
                    onChange={e =>
                      formikProps.setFieldValue("image", e.target.files[0])
                    }
                  />
                  <label htmlFor="image-picker">
                    {formikProps.values.image ? "Change Image" : "Add Image"}
                  </label>
                  <button type="submit">Submit</button>
                </Form>
              )
            }}
          />
        )}
*/
