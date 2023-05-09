import React, { useEffect, useState, useRef } from "react";
import { Box, Avatar, IconButton, useToast } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { AddIcon } from "@chakra-ui/icons";
import http from "../lib/http";

const Search = () => {
  const { searchTerm } = useParams();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const loggedIn = useRef(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    async function search() {
      const res = await http.get(`/search?first_name=${searchTerm}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(res.data.data);
    }
    search();
    return;
  }, []);

  async function addUser(user) {
    const body = {
      user_to: user.id,
    };
    const res = await http.post("/friend-requests", body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.status === 201) {
      toast({
        title: "Friend request sent!",
        description: `Waiting for ${user.name} to accept`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Something went wrong...",
        description: "Please try again",
        status: "danger",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  return (
    <>
      {users.map((user, index) => {
        return (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bg="#fff"
            maxW="400px"
            mx="auto"
            mb="1rem"
            p="1rem"
            borderRadius="6px"
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={`${import.meta.env.VITE_API}/image/${
                  user.profile_picture
                }`}
                mr="1rem"
              />
              <div>
                <b>{user.name}</b>
              </div>
            </div>
            {loggedIn.current.id !== user.id && (
              <IconButton
                colorScheme="blue"
                aria-label="Search database"
                icon={<AddIcon />}
                onClick={() => addUser(user)}
              />
            )}
          </Box>
        );
      })}
    </>
  );
};

export default Search;
