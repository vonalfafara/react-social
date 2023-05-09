import { useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import http from "../lib/http";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    email: [],
    password: [],
  });
  const [invalidCreds, setInvalidCreds] = useState("");

  async function login(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!email || !password) return;

    try {
      const body = {
        email,
        password,
      };
      const res = await http.post("/login", body);
      if (res.status === 200) {
        setInvalidCreds("");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
      }
    } catch (e) {
      setInvalidCreds(e.response.data.message);
    }
  }

  function checkEmail(value) {
    setEmail(value);
    if (!value) {
      let newError = { ...error };

      newError.email = ["Email is required"];
      setError(newError);
      return false;
    }
    return true;
  }

  function checkPassword(value) {
    setPassword(value);
    if (!value) {
      let newError = { ...error };

      newError.password = ["Password is required"];
      setError(newError);
      return false;
    }
    return true;
  }

  return (
    <Box
      bgImage="linear-gradient(to right top, #9c6bd1, #6879d5, #3081cc, #0084ba, #0084a3, #008da3, #0095a0, #1e9d9c, #2fb4b1, #3fcbc6, #4fe3db, #5ffbf1);"
      h="100%"
    >
      <Flex justify="center" align="center" h="100%">
        <Card w="500px">
          <CardHeader align="center">
            <Heading size="md">Welcome to The new era of Social Media</Heading>
          </CardHeader>
          <CardBody>
            <form onSubmit={login}>
              {invalidCreds && (
                <Alert status="error" mb="1rem">
                  <AlertIcon />
                  <AlertTitle>{invalidCreds}</AlertTitle>
                </Alert>
              )}
              <FormControl mb="1rem" isRequired isInvalid={error.email.length}>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => checkEmail(e.target.value)}
                />
                {error.email.map((err, index) => {
                  return <FormErrorMessage key={index}>{err}</FormErrorMessage>;
                })}
              </FormControl>
              <FormControl
                mb="1rem"
                isRequired
                isInvalid={error.password.length}
              >
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => checkPassword(e.target.value)}
                />
                {error.password.map((err, index) => {
                  return <FormErrorMessage key={index}>{err}</FormErrorMessage>;
                })}
              </FormControl>
              <FormControl>
                <ButtonGroup display="flex" justifyContent="flex-end">
                  <Button
                    colorScheme="teal"
                    variant="ghost"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </Button>
                  <Button colorScheme="teal" type="submit">
                    Login
                  </Button>
                </ButtonGroup>
              </FormControl>
            </form>
          </CardBody>
        </Card>
      </Flex>
    </Box>
  );
};

export default Login;
