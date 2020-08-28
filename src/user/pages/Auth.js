import React, {useState, useContext} from 'react';

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/ form-hook";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import './Auth.css';

const Auth = (props) => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const {isLoading, error, sendRequest, clearError} = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm({
    email: {
      value: '',
      isValid: false
    },
    password: {
      value: '',
      isValid: false
    }
  },false);

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest('http://localhost:5000/api/users/login',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {'Content-Type': 'application/json'}
        );

        auth.login(responseData.user.id);

      } catch (err) {

      }
    } else {
      try {
        const responseData = await sendRequest('http://localhost:5000/api/users/signup',
          'POST',
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {'Content-Type': 'application/json'}
        );

        auth.login(responseData.user.id);
      } catch (err) {
      }
    }

  };

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData({
        ...formState.inputs,
        name: undefined
      }, formState.inputs.email.isValid && formState.inputs.password.isValid)
    } else {
      setFormData({
        ...formState.inputs,
        name: {
          value: '',
          isValid: false
        }
      }, false)
    }

    setIsLoginMode(prevMode => !prevMode);
  };

  return <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      <Card className="authentication">
      {isLoading && <LoadingSpinner asOverlay />}
      <form onSubmit={authSubmitHandler}>
        <h2>Login required</h2>
        <hr/>
        {!isLoginMode && (
          <Input element="input"
                 id="name"
                 type="text"
                 label="Your Name"
                 validators={[VALIDATOR_REQUIRE()]}
                 errorText="Please enter a name"
                 onInput={inputHandler} />
        )}
        <Input element="input"
               id="email"
               type="email"
               label="E-mail"
               validators={[VALIDATOR_EMAIL()]}
               errorText="Please enter a valid email address."
               onInput={inputHandler} />
        <Input element="input"
               id="password"
               type="password"
               label="Password"
               validators={[VALIDATOR_MINLENGTH(6)]}
               errorText="Please enter a valid password. At least 6 characters."
               onInput={inputHandler} />
        <Button type="submit" disabled={!formState.isValid}>
          {isLoginMode ? 'LOGIN' : 'SIGNUP'}
        </Button>
      </form>
      <Button inverse onClick={switchModeHandler} >SWITCH TO  {isLoginMode ? 'SIGNUP' : 'LOGIN'}</Button>
    </Card>
  </React.Fragment>
};

export default Auth;
