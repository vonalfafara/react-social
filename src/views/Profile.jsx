import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Box,
  Image,
  Text,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Stack,
  StackDivider,
  Avatar,
  Flex,
  CardFooter,
  Button,
} from "@chakra-ui/react";
import http from "../lib/http";

const Profile = () => {
  const user = useRef(JSON.parse(localStorage.getItem("user")));
  const [friends, setFriends] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getFriends() {
      const res = await http.get("/friends", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFriends(res.data.data);
    }

    async function getProfilePosts() {
      const res = await http.get("/profile-posts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(res.data.data);
      setPosts(res.data.data);
    }

    getFriends();
    getProfilePosts();
    return;
  }, []);

  return (
    <Container maxW="1200px">
      <Box bg="#fff" borderRadius="md" p="4" mb="4">
        <Image
          borderRadius="full"
          boxSize="200px"
          objectFit="cover"
          m="auto"
          src={`${import.meta.env.VITE_API}/image/${
            user.current.profile_picture
          }`}
        />
        <Heading textAlign="center">{`${user.current.first_name} ${user.current.last_name}`}</Heading>
        <Text textAlign="center">{user.current.email}</Text>
      </Box>
      <Box borderRadius="md" display="flex" alignItems="flex-start">
        <Card mr="4" w="400px">
          <CardHeader>
            <Heading size="md">Friends List</Heading>
          </CardHeader>
          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              {friends.map((friend, index) => {
                return (
                  <Box key={index} display="flex" alignItems="center">
                    <Avatar
                      size="sm"
                      mr="4"
                      src={`${import.meta.env.VITE_API}/image/${
                        friend.profile_picture
                      }`}
                    ></Avatar>
                    <Box mr="auto">
                      <Heading size="xs" textTransform="uppercase">
                        {friend.name}
                      </Heading>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </CardBody>
        </Card>
        <Box w="100%" h="500px" style={{ overflow: "auto" }}>
          <Box>
            <Stack divider={<StackDivider />} spacing="4">
              {posts.map((post, index) => {
                return (
                  <Card key={index}>
                    <CardHeader>
                      <Flex spacing="4">
                        <Flex
                          flex="1"
                          gap="4"
                          alignItems="center"
                          flexWrap="wrap"
                        >
                          <Avatar
                            name={post.user.name}
                            src={`${import.meta.env.VITE_API}/image/${
                              post.user.profile_picture
                            }`}
                          />

                          <Box>
                            <Heading size="sm">{post.user.name}</Heading>
                          </Box>
                        </Flex>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Text
                        dangerouslySetInnerHTML={{ __html: post.body }}
                      ></Text>
                    </CardBody>
                    {post.media && (
                      <Image
                        objectFit="cover"
                        src={`${import.meta.env.VITE_API}/image/${post.media}`}
                      />
                    )}
                    {post.likes > 0 && (
                      <Box p="5">
                        <p>
                          {post.likes}{" "}
                          {post.likes === 1 ? "person likes " : "people like "}{" "}
                          this
                        </p>
                      </Box>
                    )}
                    {post.comments.length > 0 && (
                      <CardBody>
                        <Text mb="4">Comments</Text>
                        <Stack divider={<StackDivider />} spacing="4">
                          {post.comments.map((comment, index) => {
                            return (
                              <Box key={index} display="flex">
                                <Avatar
                                  size="sm"
                                  mr="4"
                                  src={`${import.meta.env.VITE_API}/image/${
                                    comment.user.profile_picture
                                  }`}
                                ></Avatar>
                                <Box mr="auto">
                                  <Heading size="xs" textTransform="uppercase">
                                    {comment.user.name}
                                  </Heading>
                                  <Text pt="2" fontSize="sm">
                                    {comment.body}
                                  </Text>
                                </Box>
                              </Box>
                            );
                          })}
                        </Stack>
                      </CardBody>
                    )}
                  </Card>
                );
              })}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
