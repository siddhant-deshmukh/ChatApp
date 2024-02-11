import axios, { AxiosError } from "axios";
import { Button, Label, TextInput } from "flowbite-react";
import { useCallback, useContext, useState } from "react";
import AppContext from "../../AppContext";

export default function AuthComponents() {
  const { setUser } = useContext(AppContext)
  const [authType, setAuthType] = useState<"login" | "register">("register")
  const [formInputs, setFormInputs] = useState<{ name: string, email: string, password: string }>({
    name: "",
    email: "",
    password: ""
  })

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFormInputs((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value
      }
    })
  }, [setFormInputs])

  const handleSubmitForm = useCallback(() => {
    axios.post(`${import.meta.env.VITE_API_URL}/${authType}`, {
      ...formInputs,
    }, {
      withCredentials: true
    }).then(({ status, data }) => {
      console.log(status, data)
      if (data.user) {
        setUser(data.user)
      }
    }).catch((err: AxiosError) => {
      console.error("While", authType, err)
    })
  }, [authType, formInputs, setUser])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        // console.log("Submitted")
        handleSubmitForm()
      }}
      className="flex border p-5 rounded-xl shadow-lg w-full sm:w-[448px] flex-col gap-4">
      {
        authType === "register" &&
        <div>
          <div className="mb-2 block">
            <Label htmlFor="name1" value="Your name" />
          </div>
          <TextInput
            id="name1"
            type="name"
            name="name"
            minLength={3} maxLength={50}
            value={formInputs.name}
            onChange={handleInputChange}
            required />
        </div>
      }
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email1" value="Your email" />
        </div>
        <TextInput
          id="email1"
          type="email"
          name="email"
          placeholder="name@flowbite.com"
          maxLength={50}
          value={formInputs.email}
          onChange={handleInputChange}
          required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password1" value="Your password" />
        </div>
        <TextInput
          id="password1"
          type="password"
          name="password"
          minLength={5} maxLength={20}
          value={formInputs.password}
          onChange={handleInputChange}
          required />
      </div>

      <Button type="submit">
        {authType}
      </Button>

      <div className="pt-5 flex justify-center items-center space-x-3 text-sm">
        {
          authType === "login" &&
          <>
            <p>Don't have account. </p>
            <Button size={'xs'} outline onClick={() => { setAuthType("register") }}>Register</Button>
          </>
        }
        {
          authType === "register" &&
          <>
            <p>Don't have account. </p>
            <Button size={'xs'} outline onClick={() => { setAuthType("login") }}>Login</Button>
          </>
        }
      </div>
    </form>
  )
}
