import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  FormControl,
  Textarea,
  ButtonGroup,
  Button,
  useToast,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Avatar,
  Heading,
  Text,
  Image,
  Stack,
  StackDivider,
  IconButton,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import http from "../lib/http";

const Home = () => {
  const toast = useToast();
  const [body, setBody] = useState("");
  const [posts, setPosts] = useState([]);
  const [activePost, setActivePost] = useState();
  const [comment, setComment] = useState("");
  const isLoggedIn = useRef(JSON.parse(localStorage.getItem("user")));

  async function getPosts() {
    const res = await http.get("/posts", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setPosts(res.data.data);
  }

  useEffect(() => {
    getPosts();
    return;
  }, []);

  async function submit(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!body) {
      return;
    }

    try {
      const payload = {
        body,
        media: "",
      };

      const res = await http.post("/posts", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.status === 201) {
        toast({
          title: "New post created",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        getPosts();
      } else {
        toast({
          title: "Something went wrong",
          status: "danger",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function likePost(postId) {
    const body = {
      post_id: postId,
    };
    await http.post("/likes", body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    getPosts();
  }

  async function unlikePost(likeId) {
    await http.delete(`/likes/${likeId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    getPosts();
  }

  async function submitComment(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!comment) {
      return;
    }

    try {
      const body = {
        post_id: activePost,
        body: comment,
      };

      const res = await http.post("/comments", body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.status === 201) {
        getPosts();
        setActivePost();
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteComment(commentId) {
    const res = await http.delete(`/comments/${commentId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.status === 200) {
      getPosts();
    }
  }

  return (
    <>
      <div style={{ height: "calc(100vh - 64px)", overflow: "auto" }}>
        <Box
          display="flex"
          justifyContent="center"
          bg="#fff"
          maxW="500px"
          m="auto"
          mb="4"
          borderRadius="6px"
        >
          <form onSubmit={submit}>
            <FormControl>
              <Textarea
                placeholder="What's on your mind?"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                style={{
                  width: "500px",
                  height: "150px",
                }}
              ></Textarea>
            </FormControl>
            <FormControl>
              <ButtonGroup display="flex" justifyContent="flex-end" p=".3rem">
                <Button colorScheme="teal" type="submit">
                  Post
                </Button>
              </ButtonGroup>
            </FormControl>
          </form>
        </Box>
        <Flex flexDirection="column" alignItems="center">
          {posts.map((post, index) => {
            return (
              <Card key={index} w="500px" mb="4">
                <CardHeader>
                  <Flex spacing="4">
                    <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
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
                  <Text dangerouslySetInnerHTML={{ __html: post.body }}></Text>
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
                      {post.likes === 1 ? "person likes " : "people like "} this
                    </p>
                  </Box>
                )}
                <CardFooter
                  justify="space-between"
                  flexWrap="wrap"
                  sx={{
                    "& > button": {
                      minW: "136px",
                    },
                  }}
                >
                  {post.isLiked ? (
                    <Button
                      flex="1"
                      colorScheme="teal"
                      onClick={() => unlikePost(post.isLiked)}
                    >
                      Like
                    </Button>
                  ) : (
                    <Button
                      flex="1"
                      variant="ghost"
                      onClick={() => likePost(post.id)}
                    >
                      Like
                    </Button>
                  )}
                  <Button
                    flex="1"
                    variant="ghost"
                    onClick={() => setActivePost(post.id)}
                  >
                    Comment
                  </Button>
                </CardFooter>
                {post.id === activePost && (
                  <CardBody>
                    <form onSubmit={submitComment}>
                      <FormControl>
                        <Textarea
                          placeholder="Put your comment here..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          style={{
                            width: "460px",
                            height: "75px",
                          }}
                        ></Textarea>
                      </FormControl>
                      <FormControl>
                        <ButtonGroup
                          display="flex"
                          justifyContent="flex-end"
                          p=".3rem"
                        >
                          <Button colorScheme="teal" type="submit">
                            Post
                          </Button>
                        </ButtonGroup>
                      </FormControl>
                    </form>
                  </CardBody>
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
                            {comment.user.id === isLoggedIn.current.id && (
                              <IconButton
                                size="sm"
                                colorScheme="red"
                                icon={<CloseIcon />}
                                onClick={() => deleteComment(comment.id)}
                              />
                            )}
                          </Box>
                        );
                      })}
                    </Stack>
                  </CardBody>
                )}
              </Card>
            );
          })}
        </Flex>
      </div>
    </>
  );
};

export default Home;
