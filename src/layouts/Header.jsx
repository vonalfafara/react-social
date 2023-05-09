import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  Input,
  IconButton,
  Container,
  Avatar,
  Menu,
  MenuButton,
  MenuGroup,
  MenuList,
  MenuItem,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import http from "../lib/http";

const Header = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [selectedFr, setSelectedFr] = useState();
  const [fr, setFr] = useState([]);
  const user = useRef(JSON.parse(localStorage.getItem("user")));

  async function submit(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!searchTerm) {
      return;
    }
    navigate(`/search/${searchTerm}`);
    navigate(0);
  }

  async function getFrs() {
    const res = await http.get("/friend-requests", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setFr(res.data.data);
  }

  function openModal(fr) {
    setModalTitle(fr.user);
    setSelectedFr(fr);
    onOpen();
  }

  async function logout() {
    await http.post(
      "/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    localStorage.clear();
    navigate("/login");
  }

  async function respond(response) {
    const body = {
      response: response,
    };
    const res = await http.put(`/friend-requests/${selectedFr.id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    onClose();
    if (res.status === 200) {
      if (response) {
        toast({
          title: "Friend request accepted",
          description: "You are now friends!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Friend request denied",
          description: "Boohoo no frens",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
      getFrs();
    }
  }

  useEffect(() => {
    getFrs();
    return;
  }, []);

  return (
    <Box bg="#fffcfc" py={2} px="7rem" mb="50px">
      <Container maxW="1200px">
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex">
            <IconButton
              icon={<CalendarIcon />}
              onClick={() => navigate("/")}
              mr="4"
            />
            <form onSubmit={submit} style={{ width: "300px" }}>
              <FormControl>
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                ></Input>
              </FormControl>
            </form>
          </Box>
          <Menu>
            <MenuButton>
              <Avatar
                src={`${import.meta.env.VITE_API}/image/${
                  user.current.profile_picture
                }`}
                size="md"
              />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
              <MenuItem onClick={logout}>Logout</MenuItem>
              <MenuGroup title="Friend Requests">
                {fr.map((fr, index) => {
                  return (
                    <MenuItem
                      key={index}
                      minH="40px"
                      onClick={() => openModal(fr)}
                    >
                      <Image
                        boxSize="2rem"
                        borderRadius="full"
                        src={`${import.meta.env.VITE_API}/image/${
                          fr.profile_picture
                        }`}
                        mr="12px"
                      />
                      <span>{fr.user}</span>
                    </MenuItem>
                  );
                })}
              </MenuGroup>
            </MenuList>
          </Menu>
        </Box>
      </Container>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Do you want to accept this friend request?</ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="red" mr={3} onClick={() => respond(false)}>
              Deny
            </Button>
            <Button colorScheme="teal" onClick={() => respond(true)}>
              Accept
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Header;
