import { useEffect, useRef, useState } from "react";
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
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import http from "../lib/http";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [image, setImage] = useState();
  const [error, setError] = useState({
    firstName: [],
    lastName: [],
    gender: [],
    birthDate: [],
    email: [],
    password: [],
    passwordConfirmation: [],
  });

  async function register(e) {
    e.preventDefault();
    e.stopPropagation();

    const check = checkFields();

    console.log(check);

    if (!check) return;

    try {
      let imageName = "";
      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        const res = await http.post("/upload", formData);

        imageName = res.data.image_name;
      }

      const body = {
        first_name: firstName,
        last_name: lastName,
        gender: gender,
        birthdate: birthDate,
        profile_picture: imageName,
        email,
        password,
        password_confirmation: passwordConfirmation,
      };
      const res = await http.post("/register", body);
      if (res.status === 201) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
      }
    } catch (e) {
      console.log(e);
    }
  }

  function checkFields() {
    let newError = { ...error };

    newError.firstName = !firstName ? ["First name is required"] : [];
    newError.lastName = !lastName ? ["Last name is required"] : [];
    newError.gender = !gender ? ["Gender is required"] : [];
    newError.birthDate = !birthDate ? ["Birth Date is required"] : [];
    newError.email = !email ? ["Email is required"] : [];
    newError.password = !password ? ["Password is required"] : [];
    newError.passwordConfirmation = !passwordConfirmation
      ? ["Password is required"]
      : [];

    if (password !== passwordConfirmation) {
      newError.password.push("Password is not equal");
      newError.passwordConfirmation.push("Password is not equal");
    }

    setError(newError);

    return (
      firstName &&
      lastName &&
      gender &&
      birthDate &&
      email &&
      password &&
      password === passwordConfirmation
    );
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
            <form onSubmit={register}>
              <FormControl
                mb="1rem"
                isRequired
                isInvalid={error.firstName.length}
              >
                <FormLabel>First Name</FormLabel>
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {error.firstName.map((err, index) => {
                  return <FormErrorMessage key={index}>{err}</FormErrorMessage>;
                })}
              </FormControl>
              <FormControl
                mb="1rem"
                isRequired
                isInvalid={error.lastName.length}
              >
                <FormLabel>Last Name</FormLabel>
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {error.lastName.map((err, index) => {
                  return <FormErrorMessage key={index}>{err}</FormErrorMessage>;
                })}
              </FormControl>
              <FormControl mb="1rem" isRequired isInvalid={error.gender.length}>
                <FormLabel>Gender</FormLabel>
                <RadioGroup value={gender} onChange={setGender}>
                  <Stack direction="row">
                    <Radio value="Boy">Boy</Radio>
                    <Radio value="Girl">Girl</Radio>
                    <Radio value="Other">Other</Radio>
                  </Stack>
                </RadioGroup>
                {error.gender.map((err, index) => {
                  return <FormErrorMessage key={index}>{err}</FormErrorMessage>;
                })}
              </FormControl>
              <FormControl
                mb="1rem"
                isRequired
                isInvalid={error.birthDate.length}
              >
                <FormLabel>Birth Date</FormLabel>
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
                {error.birthDate.map((err, index) => {
                  return <FormErrorMessage key={index}>{err}</FormErrorMessage>;
                })}
              </FormControl>
              <FormControl mb="1rem">
                <FormLabel>Profile Picture</FormLabel>
                <Input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </FormControl>
              <FormControl mb="1rem" isRequired isInvalid={error.email.length}>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error.password.map((err, index) => {
                  return <FormErrorMessage key={index}>{err}</FormErrorMessage>;
                })}
              </FormControl>
              <FormControl
                mb="1rem"
                isRequired
                isInvalid={error.password.length}
              >
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                />
                {error.password.map((err, index) => {
                  return <FormErrorMessage key={index}>{err}</FormErrorMessage>;
                })}
              </FormControl>
              <FormControl>
                <ButtonGroup display="flex" justifyContent="flex-end">
                  <Button colorScheme="teal" type="submit">
                    Register
                  </Button>
                  <Button
                    colorScheme="teal"
                    variant="ghost"
                    onClick={() => navigate("/login")}
                  >
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

export default Register;
