import React, { useState, useEffect } from "react";
import axios from "axios";
import * as yup from "yup";

const formSchema = yup.object().shape({
    name: yup.string().required("Must have a name"),
    email: yup.string().email().required("Must have an email"),
    password: yup.string().required("Must have a password"),
    positions: yup.string(),
    terms: yup.boolean().oneOf([true], "Must agree to terms of service")
})

const Form = () => {

    const [buttonDisabled, setButtonDisabled] = useState(true);

    const [formState, setFormState] = useState({
        name: "",
        email: "",
        password: "",
        positions: "",
        terms: ""
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        positions: "",
        terms: ""
    });

    const [post, setPost] = useState([]);

    useEffect(() => {
        formSchema.isValid(formState).then(valid => {
          setButtonDisabled(!valid);
        });
    }, [formState]);

    const formSubmit = e => {
        e.preventDefault();
        axios
          .post("https://reqres.in/api/users", formState)
          .then(res => {
            setPost(res.data); // get just the form data from the REST api
            console.log("success", post);
            // reset form if successful
            setFormState({
              name: "",
              email: "",
              password: "",
              positions: "",
              terms: ""
            });
          })
          .catch(err => console.log(err.response));
    };

    const validateChange = e => {
        // Reach will allow us to "reach" into the schema and test only one part.
        yup
          .reach(formSchema, e.target.name)
          .validate(e.target.name === "terms" ? e.target.checked : e.target.value)
          .then(valid => {
            setErrors({
              ...errors,
              [e.target.name]: ""
            });
          })
          .catch(err => {
              console.log(err.errors)
            setErrors({
              ...errors,
              [e.target.name]: err.errors
            });
          });
    };

    const inputChange = e => {
        e.persist();
        const newFormData = {
          ...formState,
          [e.target.name]:
            e.target.type === "checkbox" ? e.target.checked : e.target.value
        };
    
        validateChange(e);
        setFormState(newFormData);
    };

    return (
        <form onSubmit={formSubmit}>
            <label htmlFor="name">Name
                <input 
                    name="name"
                    type="text"
                    value={formState.name}
                    onChange={inputChange}
                />
                {errors.name.length > 0 ? <p>{errors.name}</p> : null}
            </label>

            <br />

            <label htmlFor="email">Email
                <input 
                    name="email"
                    type="text"
                    value={formState.email}
                    onChange={inputChange}
                />
                {errors.email.length > 0 ? <p>{errors.email}</p> : null}
            </label>

            <br />

            <label htmlFor="password">Password
                <input 
                    name="password"
                    type="password"
                    value={formState.password}
                    onChange={inputChange}
                />
                {errors.password.length > 0 ? <p>{errors.password}</p> : null}
            </label>

            <br />

            <label htmlFor="positions">Role
                <select id="positions" name="positions" onChange={inputChange}>
                <option value="FrontEnd">FrontEnd</option>
                <option value="BackEnd">BackEnd</option>
                <option value="Team Lead">Team Lead</option>
                </select>
            </label>

            <br />

            <label htmlFor="terms">Terms
                <input 
                    name="terms"
                    type="checkbox"
                    checked={formState.terms}
                    onChange={inputChange}
                />
                {errors.terms.length > 0 ? <p>{errors.terms}</p> : null}
            </label>

            <pre>{JSON.stringify(post, null, 2)}</pre>

            <button disabled={buttonDisabled}>SUBMIT</button>
        </form>
    )
}

export default Form;